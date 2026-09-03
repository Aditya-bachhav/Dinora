from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.admin import AdminUser
from app.routes.auth import current_admin
from app.schemas.payment import PaymentInit, PaymentVerify
from app.services import payment_service

router = APIRouter(tags=["payment"])


# --- Guest: step 1 — create/reuse a Razorpay order for this order ---
@router.post("/{order_id}/pay/init")
async def init_payment(order_id: int, body: PaymentInit, db: Session = Depends(get_db)) -> dict:
    """
    Starts a Razorpay payment for one of the guest's own orders.
    - session_id must match the order's session — same ownership model as
      every other guest order endpoint.
    - Amount is always the order's own server-computed total_amount; there
      is no amount field on this request at all.
    - Idempotent: calling this again before paying reuses the same
      Razorpay order instead of creating a new one.
    - Returns everything the frontend needs to open Razorpay Checkout:
      razorpay_key_id (public), razorpay_order_id, amount_subunits, currency.
    - 503 if RAZORPAY_KEY_ID/SECRET aren't configured on this server yet.
    """
    return await payment_service.init_payment_for_guest(db, order_id, body.session_id)


# --- Guest: step 2 — verify the signature Razorpay Checkout returned ---
@router.post("/{order_id}/pay/verify")
async def verify_payment(order_id: int, body: PaymentVerify, db: Session = Depends(get_db)) -> dict:
    """
    Confirms a Razorpay payment actually happened, by verifying the HMAC
    signature Razorpay Checkout returned to the client. The order is only
    marked "paid" if this signature genuinely validates — nothing about a
    successful-looking client callback is trusted on its own.
    """
    payment = await payment_service.verify_payment_for_guest(
        db,
        order_id,
        body.session_id,
        razorpay_order_id=body.razorpay_order_id,
        razorpay_payment_id=body.razorpay_payment_id,
        razorpay_signature=body.razorpay_signature,
    )
    return payment_service.serialize_payment(payment)


# --- Guest: check payment status for one of their own orders ---
@router.get("/{order_id}/pay")
def get_payment_status(order_id: int, session_id: str, db: Session = Depends(get_db)) -> dict:
    payment = payment_service.get_payment_status_for_guest(db, order_id, session_id)
    if payment is None:
        return {"status": "unpaid"}
    return payment_service.serialize_payment(payment)


# --- Admin: record payment taken at the counter (cash/card, outside Razorpay) ---
@router.post("/{order_id}/admin-pay")
async def admin_pay_for_order(
    order_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict:
    """
    Admin-recorded payment for money collected outside the app (cash, or a
    card tapped on the restaurant's own POS) — scoped to the admin's own
    restaurant exactly like every other admin order endpoint. This never
    touches Razorpay; there's nothing to charge, the money already changed
    hands at the counter.
    """
    payment = await payment_service.admin_mark_paid(db, order_id, admin.restaurant_id)
    return payment_service.serialize_payment(payment)
