from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.admin import AdminUser
from app.models.order import Order
from app.models.table import Table
from app.routes.auth import current_admin

router = APIRouter(tags=["counter"])


@router.get("")
def read_counter(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict[str, object]:
    """Admin: order-status totals for THIS admin's restaurant only."""
    totals = dict(
        db.query(Order.status, func.count(Order.id))
        .join(Table, Order.table_id == Table.id)
        .filter(Table.restaurant_id == admin.restaurant_id)
        .group_by(Order.status)
        .all()
    )
    return {"message": "Counter endpoint ready", "totals": totals}

# The previous POST "" handler was an unauthenticated no-op stub (returned a
# static message, touched no state, was never called by the frontend) and
# has been removed rather than secured.
