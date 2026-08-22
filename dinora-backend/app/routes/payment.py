from uuid import uuid4

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.order import Order

router = APIRouter(tags=["payment"])


@router.post("/checkout")
async def create_payment(request: Request, db: Session = Depends(get_db)) -> dict[str, object]:
    payload = await request.json() if request.headers.get("content-type", "").startswith("application/json") else {}
    order_id = payload.get("order_id")
    payment_id = f"pay-{uuid4().hex[:8]}"

    if order_id and str(order_id).isdigit():
        order = db.query(Order).filter(Order.id == int(order_id)).first()
        if order is not None:
            order.status = "paid"
            db.commit()

    return {"status": "initiated", "payment_id": payment_id, "order_id": order_id}
