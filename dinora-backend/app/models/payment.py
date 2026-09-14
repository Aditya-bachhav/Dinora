from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Payment(Base):
    """
    One row per payment attempt against an order, tracking Razorpay's
    two-phase order/payment handshake (see services/payment_service.py and
    services/payment_gateway.py for the full flow).

    Why a separate table instead of just an `orders.paid_amount` column:
    - Idempotency: creating a payment for an order that already has a
      pending/succeeded payment returns the existing row instead of
      creating a second Razorpay order.
    - Auditability: a failed or retried payment doesn't overwrite history —
      you can see every attempt, not just the last one.
    - amount is captured at creation time from the order's own
      total_amount, computed server-side. The client never supplies it.
    """
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="inr")
    provider = Column(String, nullable=False, default="razorpay")
    # Razorpay's own order_id (created server-side before checkout opens)
    provider_reference = Column(String, nullable=True)
    # Razorpay's own payment_id (only known after the user completes payment
    # in the Checkout popup and it's been signature-verified server-side)
    provider_payment_id = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")  # pending | succeeded | failed
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    confirmed_at = Column(DateTime, nullable=True)

    order = relationship("Order", back_populates="payments")
