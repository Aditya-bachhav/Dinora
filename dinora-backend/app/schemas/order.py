from __future__ import annotations

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    menu_item_id: int
    # Upper bound exists specifically to prevent a guest from submitting an
    # absurd quantity (e.g. 999999999) that produces a nonsensical total
    # and pollutes the kitchen/admin view. 500 of a single item is already
    # generous for any real dine-in order.
    quantity: int = Field(ge=1, le=500, default=1)


class OrderCreate(BaseModel):
    """
    Client-supplied order payload. Deliberately does NOT include table_id,
    restaurant_id, status, or total_amount — all of those are derived
    server-side from session_id (see services/order_service.create_order)
    or computed from database prices. A client cannot set its own total.
    """
    session_id: str
    # Upper bound prevents a single request from carrying an unbounded
    # number of line items (each one is a DB lookup + insert).
    items: list[OrderItemCreate] = Field(min_length=1, max_length=100)


class OrderStatusUpdate(BaseModel):
    status: str
