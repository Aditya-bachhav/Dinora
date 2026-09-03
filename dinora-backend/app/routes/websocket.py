from __future__ import annotations

import jwt
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.admin import AdminUser
from app.models.session import DiningSession
from app.routes.auth import TOKEN_ALGORITHM
from app.websocket.manager import manager

router = APIRouter(tags=["websocket"])


def _authenticate_admin_token(token: str) -> int | None:
    """
    Decode the admin JWT and return the admin's restaurant_id, or None if
    the token is missing/invalid/expired. Browsers cannot set an
    Authorization header on a WebSocket handshake, so the admin token is
    passed as a query parameter here instead — the same trust level as the
    Bearer header used by current_admin() on HTTP routes, just carried
    differently because the transport doesn't support custom headers.
    """
    if not token:
        return None

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[TOKEN_ALGORITHM])
        user_id = int(payload.get("sub"))
    except (jwt.PyJWTError, TypeError, ValueError):
        return None

    if SessionLocal is None:
        return None
    db = SessionLocal()
    try:
        user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
        return user.restaurant_id if user else None
    finally:
        db.close()


@router.websocket("/ws/counter")
async def counter_websocket(ws: WebSocket):
    """
    Admin counter: receives order events for the connecting admin's OWN
    restaurant only. Requires a valid admin JWT as ?token=... — previously
    this socket accepted any connection with no authentication at all and
    broadcast every restaurant's order stream to it.
    """
    token = ws.query_params.get("token", "").strip()
    restaurant_id = _authenticate_admin_token(token)
    if restaurant_id is None:
        await ws.close(code=1008, reason="admin authentication required")
        return

    room = f"counter:{restaurant_id}"
    await manager.connect(ws, room)
    try:
        while True:
            # Keep alive — server pushes; client sends nothing meaningful
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws, room)
    except Exception:
        manager.disconnect(ws, room)


@router.websocket("/ws/table")
async def table_websocket(ws: WebSocket):
    """
    Guest order tracking: scoped exclusively to a single session.
    Requires a valid active session_id query param.
    Closes with 1008 (Policy Violation) if session is missing or inactive.
    """
    session_id = ws.query_params.get("session_id", "").strip()

    if not session_id or SessionLocal is None:
        await ws.close(code=1008, reason="session_id required")
        return

    db = SessionLocal()
    try:
        session = (
            db.query(DiningSession)
            .filter(DiningSession.id == session_id, DiningSession.status == "active")
            .first()
        )
    finally:
        db.close()

    if not session:
        await ws.close(code=1008, reason="invalid or inactive session")
        return

    room = f"table:{session_id}"
    await manager.connect(ws, room)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws, room)
    except Exception:
        manager.disconnect(ws, room)
