from __future__ import annotations

import asyncio
import logging

from app.core.database import SessionLocal
from app.models.table import Table
from app.services import order_service

logger = logging.getLogger(__name__)


async def order_automation_loop() -> None:
    """
    Background task: advance active orders through kitchen milestones and
    emit real-time WebSocket events.

    This is the ONLY place that mutates order.status automatically.
    HTTP GET handlers never touch order state.

    Calls into services.order_service — a peer service module — rather than
    reaching into routes.orders' internals. Routes and background tasks are
    both callers of the service layer; neither depends on the other.
    """
    while True:
        db = None
        try:
            if SessionLocal is not None:
                db = SessionLocal()
                changed = order_service.advance_orders(db)
                for order in changed:
                    table = db.query(Table).filter(Table.id == order.table_id).first()
                    if table is not None:
                        await order_service.broadcast_order(
                            db, "order_updated", order, table.restaurant_id
                        )
        except Exception as exc:
            # Log but never crash the loop — one bad cycle must not kill the worker
            logger.warning("order_automation_loop error: %s", exc)
        finally:
            if db is not None:
                try:
                    db.close()
                except Exception:
                    pass
        await asyncio.sleep(2)
