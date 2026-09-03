"""
Table business logic.

Guest-facing lookups are by opaque token only (never numeric id — see
_get_table_by_token). Admin-facing list/create are scoped to the
authenticated admin's own restaurant_id.
"""
from __future__ import annotations

import secrets

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.restaurant import Restaurant
from app.models.table import Table


def serialize_table(table: Table, restaurant: Restaurant | None = None) -> dict:
    return {
        "id": table.id,
        "number": table.number,
        "token": table.token,
        "status": table.status,
        "restaurant_id": table.restaurant_id,
        "restaurant": (
            {"id": restaurant.id, "name": restaurant.name, "location": restaurant.location}
            if restaurant else None
        ),
    }


def get_table_by_token(db: Session, token: str) -> Table:
    """Fetch a table exclusively by its opaque token. Never by numeric ID."""
    table = db.query(Table).filter(Table.token == token).first()
    if table is None:
        raise HTTPException(status_code=404, detail="Table not found")
    return table


def list_tables_for_restaurant(db: Session, restaurant_id: int) -> list[Table]:
    return (
        db.query(Table)
        .filter(Table.restaurant_id == restaurant_id)
        .order_by(Table.number.asc())
        .all()
    )


def create_table(db: Session, restaurant_id: int, number: int) -> Table:
    number = int(number or 0)
    if number <= 0:
        raise HTTPException(status_code=400, detail="A valid table number is required")

    if db.query(Table).filter(Table.number == number, Table.restaurant_id == restaurant_id).first():
        raise HTTPException(status_code=409, detail="A table with this number already exists")

    # Cryptographically random token — never derived from table_id or number
    token = f"tbl_{secrets.token_urlsafe(32)}"
    table = Table(number=number, token=token, status="available", restaurant_id=restaurant_id)
    db.add(table)
    db.commit()
    db.refresh(table)
    return table
