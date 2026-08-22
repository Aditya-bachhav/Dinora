from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu import MenuItem
from app.models.table import Table
from app.models.session import DiningSession
from app.websocket.manager import manager
import json
from datetime import datetime

router = APIRouter(tags=["orders"])

ACTIVE = {"pending", "preparing", "ready", "served"}


def _advance_orders(db: Session) -> list[Order]:
    now = datetime.utcnow()
    milestones = [(5, "pending"), (13, "preparing"), (21, "ready"), (27, "served"), (32, "paid"), (10**9, "completed")]
    changed = []
    for order in db.query(Order).filter(Order.status.notin_(["completed", "cancelled"])).all():
        created = order.created_at or now
        elapsed = max(0, (now - created).total_seconds())
        target = "pending"
        for seconds, status in milestones:
            if elapsed < seconds:
                target = status
                break
        if target != order.status:
            order.status = target
            changed.append(order)
    if changed:
        db.commit()
    return changed


def serialize_item(item: OrderItem) -> dict:
    return {"id": item.id, "menu_item_id": item.menu_item_id, "name": item.name, "quantity": item.quantity, "unit_price": item.unit_price, "line_total": item.line_total}


def serialize(o: Order, db: Session) -> dict:
    table = db.query(Table).filter(Table.id == o.table_id).first()
    items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
    return {
        "id": o.id,
        "table_id": o.table_id,
        "table_number": table.number if table else None,
        "session_id": o.session_id,
        "status": o.status,
        "total_amount": o.total_amount,
        "created_at": o.created_at.isoformat() if o.created_at else None,
        "items": [serialize_item(i) for i in items],
    }


async def broadcast_order(db: Session, event_type: str, order: Order):
    await manager.broadcast(json.dumps({"type": event_type, "order": serialize(order, db)}))


@router.post("")
async def create_order(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    table_id = int(payload.get("table_id") or 0)
    session_id = str(payload.get("session_id") or "")
    items = payload.get("items") or []
    table = db.query(Table).filter(Table.id == table_id).first()
    session = db.query(DiningSession).filter(DiningSession.id == session_id, DiningSession.table_id == table_id, DiningSession.status == "active").first()
    if not table or not session:
        raise HTTPException(status_code=400, detail="A valid active table session is required")
    if not items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    order = Order(table_id=table_id, session_id=session_id, status="pending", total_amount=0, created_at=datetime.utcnow())
    db.add(order); db.flush()
    total = 0.0
    for row in items:
        item_id = int(row.get("menu_item_id") or row.get("id") or 0)
        qty = max(1, int(row.get("quantity") or row.get("qty") or 1))
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_id, MenuItem.available == True).first()
        if not menu_item:
            raise HTTPException(status_code=400, detail=f"Menu item {item_id} is not available")
        line = float(menu_item.price) * qty
        total += line
        db.add(OrderItem(order_id=order.id, menu_item_id=menu_item.id, name=menu_item.name, quantity=qty, unit_price=menu_item.price, line_total=line))
    order.total_amount = round(total)
    db.commit(); db.refresh(order)
    await broadcast_order(db, "order_created", order)
    return serialize(order, db)


@router.get("")
async def list_orders(db: Session = Depends(get_db)):
    changed = _advance_orders(db)
    for order in changed:
        await broadcast_order(db, "order_updated", order)
    return [serialize(o, db) for o in db.query(Order).order_by(Order.id.desc()).all()]


@router.patch("/{order_id}")
async def update_order(order_id: int, request: Request, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order: raise HTTPException(status_code=404, detail="Order not found")
    payload = await request.json(); status = str(payload.get("status") or "").strip().lower()
    allowed = {"pending", "preparing", "ready", "served", "paid", "completed", "cancelled"}
    if status not in allowed: raise HTTPException(status_code=400, detail="Invalid order status")
    # Kept for exceptional/manual correction, but the normal workflow is automatic.
    order.status = status; db.commit(); db.refresh(order)
    await broadcast_order(db, "order_updated", order)
    return serialize(order, db)


@router.get("/session/{session_id}")
def list_orders_for_session(session_id: str, db: Session = Depends(get_db)):
    _advance_orders(db)
    return [serialize(o, db) for o in db.query(Order).filter(Order.session_id == session_id).order_by(Order.id.desc()).all()]


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    _advance_orders(db)
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order: raise HTTPException(status_code=404, detail="Order not found")
    return serialize(order, db)
