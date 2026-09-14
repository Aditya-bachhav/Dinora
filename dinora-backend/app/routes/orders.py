from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.admin import AdminUser
from app.routes.auth import current_admin
from app.schemas.order import OrderCreate, OrderStatusUpdate
from app.services import order_service

router = APIRouter(tags=["orders"])


# ---------------------------------------------------------------------------
# Routes — ORDER MATTERS in FastAPI: specific paths before parameterised ones
# ---------------------------------------------------------------------------

# --- Admin: list all orders for the admin's OWN restaurant ---
@router.get("")
def list_orders(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> list[dict]:
    """Admin: orders for this admin's restaurant only, newest first."""
    orders = order_service.list_orders_for_restaurant(db, admin.restaurant_id)
    return [order_service.serialize_order(o, db) for o in orders]


# --- Guest: place an order ---
@router.post("")
async def create_order(body: OrderCreate, db: Session = Depends(get_db)) -> dict:
    """
    Create an order.
    - Requires a valid active session_id; client never sends table_id or restaurant_id.
    - Server derives table_id and restaurant_id from the session.
    - Validates every item: exists, available, belongs to the same restaurant.
    """
    items_payload = [item.model_dump() for item in body.items]
    order = await order_service.create_order(db, body.session_id, items_payload)
    return order_service.serialize_order(order, db)


# --- Guest: list orders for a session (MUST be before /{order_id}) ---
@router.get("/session/{session_id}")
def list_orders_for_session(session_id: str, db: Session = Depends(get_db)) -> list[dict]:
    """
    Initial fetch for the Orders page.
    One GET → then client connects via WebSocket for live updates.
    """
    orders = order_service.list_orders_for_session(db, session_id)
    return [order_service.serialize_order(o, db) for o in orders]


# --- Guest/Admin: single order detail ---
@router.get("/{order_id}")
def get_order(order_id: int, session_id: str | None = None, db: Session = Depends(get_db)) -> dict:
    """
    Fetch one order. If session_id supplied, validates ownership (guest isolation).
    """
    order = order_service.get_order_for_guest(db, order_id, session_id)
    return order_service.serialize_order(order, db)


# --- Admin: manual status override, scoped to the admin's own restaurant ---
@router.patch("/{order_id}")
async def update_order(
    order_id: int,
    body: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict:
    """Admin: manual status correction. Normal workflow is fully automatic."""
    order = await order_service.update_order_status(db, order_id, admin.restaurant_id, body.status)
    return order_service.serialize_order(order, db)
