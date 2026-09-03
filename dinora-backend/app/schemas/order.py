from __future__ import annotations

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(ge=1, default=1)


class OrderCreate(BaseModel):
    """
    Client-supplied order payload. Deliberately does NOT include table_id,
    restaurant_id, status, or total_amount — all of those are derived
    server-side from session_id (see services/order_service.create_order)
    or computed from database prices. A client cannot set its own total.
    """
    session_id: str
    items: list[OrderItemCreate]


class OrderStatusUpdate(BaseModel):
    status: str
