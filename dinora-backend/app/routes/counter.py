from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.order import Order

router = APIRouter(tags=["counter"])


@router.get("")
def read_counter(db: Session = Depends(get_db)) -> dict[str, object]:
    totals = dict(
        db.query(Order.status, func.count(Order.id)).group_by(Order.status).all()
    )
    return {"message": "Counter endpoint ready", "totals": totals}


@router.post("")
def update_counter() -> dict[str, str]:
    return {"message": "Counter updated"}
