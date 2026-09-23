"""
Restaurant resolution for guest-facing routes that have no table or session
context (e.g. GET /api/menu, which today's frontend calls with no
identifying parameter at all).

Why this exists: most reads *do* have a trust anchor — a table token, a
session_id — and should always resolve restaurant_id from that anchor (see
routes/tables.py, routes/sessions.py). This helper is ONLY for the small
number of endpoints that currently have no such anchor. It intentionally
refuses to guess once more than one restaurant exists, rather than silently
mixing data the way the previous implementation did.
"""
from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.restaurant import Restaurant
from app.models.session import DiningSession
from app.models.table import Table


def resolve_guest_restaurant_id(db: Session, explicit_restaurant_id: int | None) -> int:
    if explicit_restaurant_id is not None:
        if not db.query(Restaurant).filter(Restaurant.id == explicit_restaurant_id).first():
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return explicit_restaurant_id

    restaurants = db.query(Restaurant).order_by(Restaurant.id.asc()).limit(2).all()
    if not restaurants:
        raise HTTPException(status_code=404, detail="No restaurant has been configured yet")
    if len(restaurants) > 1:
        raise HTTPException(
            status_code=400,
            detail=(
                "Multiple restaurants exist — this endpoint requires an explicit "
                "?restaurant_id= now that the deployment is multi-restaurant"
            ),
        )
    return restaurants[0].id


def resolve_session_restaurant_id(db: Session, session_id: str) -> int:
    session = (
        db.query(DiningSession)
        .filter(DiningSession.id == session_id, DiningSession.status == "active")
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    table = db.query(Table).filter(Table.id == session.table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    return table.restaurant_id
