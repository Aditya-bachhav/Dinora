from __future__ import annotations

from pydantic import BaseModel


class PaymentInit(BaseModel):
    """
    Step 1 of the Razorpay flow. Deliberately contains NO amount field.
    The amount charged is always Order.total_amount, computed server-side
    when the order was placed — a client can never influence what it gets
    charged for its own order. session_id proves guest ownership of the
    order, the same pattern used by every other guest-facing order endpoint.
    """
    session_id: str


class PaymentVerify(BaseModel):
    """
    Step 2: what Razorpay Checkout hands back to the client on success.
    The server treats none of this as trusted until verify_payment_signature
    confirms the HMAC — see services/payment_gateway.py.
    """
    session_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
