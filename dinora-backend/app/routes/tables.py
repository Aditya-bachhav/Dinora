from __future__ import annotations

from io import BytesIO

import qrcode
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.admin import AdminUser
from app.models.restaurant import Restaurant
from app.models.session import DiningSession
from app.routes.auth import current_admin
from app.schemas.table import TableCreate
from app.services import table_service

router = APIRouter(tags=["tables"])


# --- admin routes — scoped to the admin's own restaurant ---

@router.get("")
def list_tables(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> list[dict]:
    """Admin: list tables for THIS admin's restaurant only."""
    tables = table_service.list_tables_for_restaurant(db, admin.restaurant_id)
    restaurant = db.query(Restaurant).filter(Restaurant.id == admin.restaurant_id).first()
    return [table_service.serialize_table(t, restaurant) for t in tables]


@router.post("")
async def create_table(
    body: TableCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict:
    """Admin: create a table for THIS admin's restaurant. Token is server-generated."""
    table = table_service.create_table(db, admin.restaurant_id, body.number)
    restaurant = db.query(Restaurant).filter(Restaurant.id == admin.restaurant_id).first()
    return table_service.serialize_table(table, restaurant)


# --- guest routes (token-gated, no auth) ---

@router.get("/{table_token}")
def get_table(table_token: str, db: Session = Depends(get_db)) -> dict:
    """
    Guest: resolve a table by its QR token.
    Returns restaurant + table metadata only.
    Never returns table_id or restaurant_id as usable credentials
    (session creation is the next step and derives everything server-side).
    """
    table = table_service.get_table_by_token(db, table_token)
    restaurant = db.query(Restaurant).filter(Restaurant.id == table.restaurant_id).first()
    return {
        "table": {
            "number": table.number,
            "token": table.token,
            "status": table.status,
        },
        "restaurant": (
            {"name": restaurant.name, "location": restaurant.location}
            if restaurant else None
        ),
    }


@router.post("/{table_token}/sessions")
def start_table_session(table_token: str, db: Session = Depends(get_db)) -> dict:
    """
    Guest: start or resume exactly one active DiningSession for this table.
    table_id and restaurant_id are derived server-side — client only knows the token.
    This is idempotent: scanning the same QR again returns the same active session.
    """
    table = table_service.get_table_by_token(db, table_token)

    session = (
        db.query(DiningSession)
        .filter(DiningSession.table_id == table.id, DiningSession.status == "active")
        .first()
    )
    if session is None:
        import secrets

        session = DiningSession(
            id=f"ds_{secrets.token_urlsafe(32)}",
            table_id=table.id,
            status="active",
        )
        db.add(session)
        db.commit()
        db.refresh(session)

    return {
        "session_id": session.id,
        "table_number": table.number,
        "table_token": table.token,
        "status": session.status,
    }


# --- QR image endpoint (admin only, own restaurant's tables only) ---

@router.get("/{table_token}/qr")
def table_qr(
    table_token: str,
    guest_url: str = "",
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
):
    """Admin: generate a QR code image for one of THIS admin's own tables."""
    table = table_service.get_table_by_token(db, table_token)
    if table.restaurant_id != admin.restaurant_id:
        raise HTTPException(status_code=404, detail="Table not found")

    base = guest_url.strip().rstrip("/")
    if not base:
        raise HTTPException(status_code=400, detail="guest_url is required")
    target = f"{base}/t/{table.token}"
    image = qrcode.make(target)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="image/png",
        headers={"Content-Disposition": f'inline; filename="dinora-table-{table.number}-qr.png"'},
    )
