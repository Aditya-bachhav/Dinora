from __future__ import annotations

from pydantic import BaseModel, Field


class TableCreate(BaseModel):
    """
    restaurant_id is intentionally absent: table creation is always scoped
    to the authenticated admin's own restaurant (see routes/tables.py).
    """
    number: int = Field(gt=0)
