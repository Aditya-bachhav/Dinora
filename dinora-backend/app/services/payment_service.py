"""
Payment business logic — Razorpay init/verify flow, per-restaurant credentials.

Fixes, relative to the original /api/payment/checkout that was removed
during the security audit:
  1. Auth: guest callers must own the order (via session_id); admin callers
     must own the order's restaurant. No anonymous access.
  2. Amount: always taken from Order.total_amount (server-computed at order
     creation), never accepted from the client, at EITHER step (init or
     verify) — verify only checks a signature, it has no amount field at all.
  3. Idempotency: calling init twice for the same order returns the same
     Razorpay order rather than creating a second one; calling verify twice
     for an already-succeeded payment is a no-op, made race-safe via an
     atomic conditional UPDATE (see _verify_and_confirm).
  4. Order.status only becomes "paid" after the Razorpay signature is
     verified server-side — never as a side effect of an unrelated status
     PATCH, and never just because the client claims success.
  5. Multi-tenant: every payment resolves and uses THAT ORDER'S OWN
     restaurant's Razorpay credentials (see payment_gateway.resolve_credentials)
     so payments settle to the correct restaurant's bank account, not a
     single shared platform account.
"""
from __future__ import annotations

from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.payment import Payment
from app.models.restaurant import Restaurant
from app.models.table import Table
from app.services import order_service
from app.services.payment_gateway import GatewayNotConfigured, gateway


def serialize_payment(payment: Payment) -> dict:
    return {
        "id": payment.id,
        "order_id": payment.order_id,
        "amount": payment.amount,
        "currency": payment.currency,
        "provider": payment.provider,
        "status": payment.status,
        "created_at": payment.created_at.isoformat() if payment.created_at else None,
        "confirmed_at": payment.confirmed_at.isoformat() if payment.confirmed_at else None,
    }


def _get_order_or_404(db: Session, order_id: int) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def _assert_guest_owns_order(order: Order, session_id: str) -> None:
    if order.session_id != session_id:
        raise HTTPException(status_code=404, detail="Order not found")


def _assert_admin_owns_order(db: Session, order: Order, restaurant_id: int) -> None:
    table = db.query(Table).filter(Table.id == order.table_id).first()
    if not table or table.restaurant_id != restaurant_id:
        raise HTTPException(status_code=404, detail="Order not found")


def _restaurant_for_order(db: Session, order: Order) -> Restaurant:
    """Every payment is processed under the restaurant that owns the
    order's table — this is what makes credential resolution per-tenant
    rather than global. Raises 404 in the (should-never-happen) case of an
    order whose table or restaurant has gone missing, rather than silently
    falling through to platform-fallback credentials for an orphaned order."""
    table = db.query(Table).filter(Table.id == order.table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Order's table not found")
    restaurant = db.query(Restaurant).filter(Restaurant.id == table.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Order's restaurant not found")
    return restaurant


# ---------------------------------------------------------------------------
# Step 1: init — create (or reuse) a Razorpay order for this Dinora order
# ---------------------------------------------------------------------------

async def init_payment_for_guest(db: Session, order_id: int, session_id: str) -> dict:
    order = _get_order_or_404(db, order_id)
    _assert_guest_owns_order(order, session_id)
    restaurant = _restaurant_for_order(db, order)
    return await _init_or_reuse(db, order, restaurant)


async def _init_or_reuse(db: Session, order: Order, restaurant: Restaurant) -> dict:
    if order.status == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot pay for a cancelled order")
    if order.status == "paid":
        raise HTTPException(status_code=400, detail="This order is already paid")

    # Idempotency: if a Razorpay order was already created for this Dinora
    # order and hasn't succeeded yet, reuse it instead of creating a new
    # one — a guest reopening the Pay sheet (e.g. after backgrounding the
    # app) resumes the same checkout rather than generating a fresh one
    # every time.
    existing = (
        db.query(Payment)
        .filter(Payment.order_id == order.id, Payment.status.in_(["pending", "succeeded"]))
        .order_by(Payment.id.desc())
        .first()
    )
    if existing and existing.status == "succeeded":
        raise HTTPException(status_code=400, detail="This order is already paid")
    if existing and existing.provider_reference:
        try:
            key_id = _current_key_id(restaurant)
        except GatewayNotConfigured as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        return {
            "payment_id": existing.id,
            "razorpay_order_id": existing.provider_reference,
            "razorpay_key_id": key_id,
            "amount_subunits": int(round(existing.amount * 100)),
            "currency": existing.currency.upper(),
        }

    try:
        gw_order = gateway.create_order(
            restaurant=restaurant,
            amount=order.total_amount,
            currency="inr",
            receipt=f"dinora_order_{order.id}",
        )
    except GatewayNotConfigured as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    payment = existing or Payment(order_id=order.id, amount=order.total_amount, currency="inr", provider="razorpay")
    payment.provider_reference = gw_order.provider_order_id
    payment.status = "pending"
    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "payment_id": payment.id,
        "razorpay_order_id": gw_order.provider_order_id,
        "razorpay_key_id": gw_order.key_id,
        "amount_subunits": gw_order.amount_subunits,
        "currency": gw_order.currency,
    }


def _current_key_id(restaurant: Restaurant) -> str:
    """The publishable key_id the frontend needs to open Checkout. Safe to
    expose to the client — it's the public half of the credential pair,
    the same value Razorpay's own docs put directly in frontend JS."""
    from app.services.payment_gateway import resolve_credentials

    return resolve_credentials(restaurant).key_id


# ---------------------------------------------------------------------------
# Step 2: verify — confirm the Razorpay signature, then mark paid
# ---------------------------------------------------------------------------

async def verify_payment_for_guest(
    db: Session,
    order_id: int,
    session_id: str,
    *,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> Payment:
    order = _get_order_or_404(db, order_id)
    _assert_guest_owns_order(order, session_id)
    restaurant = _restaurant_for_order(db, order)
    return await _verify_and_confirm(
        db, order, restaurant, razorpay_order_id, razorpay_payment_id, razorpay_signature
    )


async def _verify_and_confirm(
    db: Session,
    order: Order,
    restaurant: Restaurant,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> Payment:
    payment = (
        db.query(Payment)
        .filter(Payment.order_id == order.id, Payment.provider_reference == razorpay_order_id)
        .order_by(Payment.id.desc())
        .first()
    )
    if not payment:
        # No matching payment we initiated — never trust a signature for a
        # Razorpay order this server didn't create for this Dinora order.
        raise HTTPException(status_code=404, detail="No matching payment found for this order")

    if payment.status == "succeeded":
        # Idempotent: verifying twice (e.g. a retried request) just returns
        # the already-confirmed payment rather than re-processing.
        return payment

    verified = gateway.verify_payment_signature(
        restaurant=restaurant,
        provider_order_id=razorpay_order_id,
        provider_payment_id=razorpay_payment_id,
        signature=razorpay_signature,
    )

    if not verified:
        payment.status = "failed"
        db.commit()
        raise HTTPException(status_code=400, detail="Payment could not be verified")

    # Atomic conditional update: this UPDATE only touches the row if it is
    # STILL not "succeeded" at the moment the database executes it, closing
    # the gap between the read above and this write. Without the WHERE
    # clause, two near-simultaneous verify calls (e.g. a client retry after
    # a slow response) could each pass the in-Python check above and both
    # proceed to mark the order paid and broadcast a duplicate event.
    updated_rows = (
        db.query(Payment)
        .filter(Payment.id == payment.id, Payment.status != "succeeded")
        .update(
            {
                "status": "succeeded",
                "provider_payment_id": razorpay_payment_id,
                "confirmed_at": datetime.utcnow(),
            },
            synchronize_session=False,
        )
    )
    db.commit()
    db.refresh(payment)

    if updated_rows == 0:
        # Another concurrent request won the race and already confirmed
        # this payment — nothing more to do, return the current state.
        return payment

    if order.status != "paid":
        order.status = "paid"
        db.commit()
        db.refresh(order)
        table = db.query(Table).filter(Table.id == order.table_id).first()
        if table:
            await order_service.broadcast_order(db, "order_updated", order, table.restaurant_id)

    return payment


# ---------------------------------------------------------------------------
# Admin: record a payment taken outside the app (cash/card at the counter)
# ---------------------------------------------------------------------------

async def admin_mark_paid(db: Session, order_id: int, restaurant_id: int) -> Payment:
    """
    Admin manually records payment for an order — e.g. a guest paid cash or
    tapped a card on the restaurant's own POS terminal, outside Razorpay
    entirely. This does NOT go through Razorpay at all (there's no card to
    charge — the money already changed hands at the counter); it just
    records the fact and marks the order paid, scoped to the admin's own
    restaurant like every other admin order endpoint.
    """
    order = _get_order_or_404(db, order_id)
    _assert_admin_owns_order(db, order, restaurant_id)

    if order.status == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot mark a cancelled order as paid")

    existing = (
        db.query(Payment)
        .filter(Payment.order_id == order.id, Payment.status == "succeeded")
        .order_by(Payment.id.desc())
        .first()
    )
    if existing:
        return existing

    payment = Payment(
        order_id=order.id,
        amount=order.total_amount,
        currency="inr",
        provider="counter",  # distinguishes "admin recorded it manually" from a real Razorpay payment
        status="succeeded",
        confirmed_at=datetime.utcnow(),
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    if order.status != "paid":
        order.status = "paid"
        db.commit()
        db.refresh(order)
        table = db.query(Table).filter(Table.id == order.table_id).first()
        if table:
            await order_service.broadcast_order(db, "order_updated", order, table.restaurant_id)

    return payment


# ---------------------------------------------------------------------------
# Status check
# ---------------------------------------------------------------------------

def get_payment_status_for_guest(db: Session, order_id: int, session_id: str) -> Payment | None:
    order = _get_order_or_404(db, order_id)
    _assert_guest_owns_order(order, session_id)
    return (
        db.query(Payment)
        .filter(Payment.order_id == order.id)
        .order_by(Payment.id.desc())
        .first()
    )
