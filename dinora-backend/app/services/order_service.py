"""
Order business logic.

Everything that mutates or reasons about order state lives here, not in
routes/orders.py. Order status is staff-driven only, via
update_order_status() — called from routes/orders.py's PATCH
/api/orders/{id}. See services/order_automation.py for why there is no
background timer any more.

Restaurant scoping: every admin-facing read/write takes a restaurant_id
(derived from the authenticated admin, never from client input) and filters
through Table, since Order does not carry restaurant_id directly.
"""
from __future__ import annotations

import json
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.menu import MenuItem
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.session import DiningSession
from app.models.table import Table
from app.websocket.manager import manager

ALLOWED_STATUSES = {"pending", "preparing", "ready", "served", "paid", "completed", "cancelled"}


# ---------------------------------------------------------------------------
# Serialization
# ---------------------------------------------------------------------------

def _serialize_item(item: OrderItem) -> dict:
    return {
        "id": item.id,
        "menu_item_id": item.menu_item_id,
        "name": item.name,
        "quantity": item.quantity,
        "unit_price": item.unit_price,
        "line_total": item.line_total,
    }


def serialize_order(order: Order, db: Session) -> dict:
    table = order.table or db.query(Table).filter(Table.id == order.table_id).first()
    items = order.items or db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return {
        "id": order.id,
        "session_id": order.session_id,
        "table_number": table.number if table else None,
        "status": order.status,
        "total_amount": order.total_amount,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "items": [_serialize_item(i) for i in items],
    }


# ---------------------------------------------------------------------------
# Broadcasting — the only place that talks to the WebSocket manager for orders
# ---------------------------------------------------------------------------

async def broadcast_order(db: Session, event_type: str, order: Order, restaurant_id: int) -> None:
    """
    Emit an order event to the guest's own table room and to that
    restaurant's admin counter room. Counter rooms are per-restaurant so an
    admin never sees another restaurant's live order stream.
    """
    message = json.dumps({"type": event_type, "order": serialize_order(order, db)})
    await manager.broadcast(
        message,
        [f"counter:{restaurant_id}", f"table:{order.session_id}"],
    )


# ---------------------------------------------------------------------------
# Guest-facing: create an order, list a session's orders, fetch one order
# ---------------------------------------------------------------------------

async def create_order(db: Session, session_id: str, items_payload: list[dict]) -> Order:
    """
    Create an order for an active dining session.
    Client supplies only session_id + items; table/restaurant are derived
    server-side and every item is re-priced from the database, never trusted
    from the client payload.
    """
    session_id = (session_id or "").strip()
    if not session_id:
        raise HTTPException(status_code=400, detail="An active table session is required")

    session = (
        db.query(DiningSession)
        .filter(DiningSession.id == session_id, DiningSession.status == "active")
        .first()
    )
    if not session:
        raise HTTPException(status_code=400, detail="Table session is invalid or has been closed")

    table = db.query(Table).filter(Table.id == session.table_id).first()
    if not table:
        raise HTTPException(status_code=400, detail="Table for this session no longer exists")

    if not items_payload:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    order = Order(
        table_id=table.id,
        session_id=session.id,
        status="pending",
        total_amount=0,
        created_at=datetime.utcnow(),
    )
    db.add(order)
    db.flush()

    total = 0.0
    for row in items_payload:
        item_id = int(row.get("menu_item_id") or row.get("id") or 0)
        qty = max(1, int(row.get("quantity") or row.get("qty") or 1))

        menu_item = (
            db.query(MenuItem)
            .filter(
                MenuItem.id == item_id,
                MenuItem.available == True,  # noqa: E712
                MenuItem.restaurant_id == table.restaurant_id,
            )
            .first()
        )
        if not menu_item:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Menu item {item_id} is not available or does not belong to this restaurant",
            )

        line = float(menu_item.price) * qty
        total += line
        db.add(
            OrderItem(
                order_id=order.id,
                menu_item_id=menu_item.id,
                name=menu_item.name,
                quantity=qty,
                unit_price=menu_item.price,
                line_total=line,
            )
        )

    order.total_amount = round(total, 2)
    db.commit()
    db.refresh(order)

    await broadcast_order(db, "order_created", order, table.restaurant_id)
    return order


def list_orders_for_session(db: Session, session_id: str) -> list[Order]:
    session = db.query(DiningSession).filter(DiningSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return (
        db.query(Order)
        .filter(Order.session_id == session_id)
        .order_by(Order.id.desc())
        .all()
    )


def get_order_for_guest(db: Session, order_id: int, session_id: str | None) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if session_id and order.session_id != session_id:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# ---------------------------------------------------------------------------
# Admin-facing: restaurant-scoped listing and status override
# ---------------------------------------------------------------------------

def list_orders_for_restaurant(db: Session, restaurant_id: int) -> list[Order]:
    """Admin: all orders for THIS admin's restaurant only, newest first."""
    return (
        db.query(Order)
        .options(joinedload(Order.table), selectinload(Order.items))
        .join(Table, Order.table_id == Table.id)
        .filter(Table.restaurant_id == restaurant_id)
        .order_by(Order.id.desc())
        .all()
    )


def get_order_for_admin(db: Session, order_id: int, restaurant_id: int) -> Order:
    order = (
        db.query(Order)
        .join(Table, Order.table_id == Table.id)
        .filter(Order.id == order_id, Table.restaurant_id == restaurant_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


async def update_order_status(db: Session, order_id: int, restaurant_id: int, status: str) -> Order:
    """Admin: manual status correction, scoped to the admin's own restaurant."""
    status = (status or "").strip().lower()
    if status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {', '.join(sorted(ALLOWED_STATUSES))}",
        )

    order = get_order_for_admin(db, order_id, restaurant_id)
    order.status = status
    db.commit()
    db.refresh(order)
    await broadcast_order(db, "order_updated", order, restaurant_id)
    return order
