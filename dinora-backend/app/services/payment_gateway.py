"""
Payment gateway abstraction — Razorpay implementation.

Razorpay does NOT support a simple "server charges a card" call like a
saved-card-on-file flow. It's a two-phase handshake:

  1. Server creates a Razorpay Order (amount, currency) -> gets an order_id.
  2. Client opens Razorpay Checkout with that order_id -> user pays via
     UPI/GPay/card/etc inside Razorpay's own UI -> Checkout returns
     {razorpay_payment_id, razorpay_order_id, razorpay_signature} to the
     client.
  3. Client sends those three values back to the server.
  4. Server verifies the HMAC-SHA256 signature using the key secret. Only
     if it verifies does the payment count as real — the signature is the
     only proof the server has that Razorpay (and not an attacker replaying
     a fake payload) actually processed this payment.

This shapes services/payment_service.py into two steps (init + verify)
instead of one — see that file. Nothing here trusts a client-supplied
amount at any point: init always reads Order.total_amount, and verify only
checks a signature, never accepts or changes an amount.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

from app.core.config import settings


class GatewayNotConfigured(Exception):
    """Raised when a payment is attempted but RAZORPAY_KEY_ID/SECRET aren't set."""


@dataclass
class GatewayOrder:
    provider_order_id: str
    key_id: str
    amount_subunits: int
    currency: str


class PaymentGateway(ABC):
    @abstractmethod
    def create_order(self, *, amount: float, currency: str, receipt: str) -> GatewayOrder:
        """Create a provider-side order for `amount` (major units, e.g. rupees).
        Must never trust a client-supplied amount — callers pass a
        server-computed value only (see payment_service.py)."""
        raise NotImplementedError

    @abstractmethod
    def verify_payment_signature(
        self, *, provider_order_id: str, provider_payment_id: str, signature: str
    ) -> bool:
        """Return True only if the signature genuinely proves Razorpay processed
        this payment_id against this order_id. Never guess or skip this check."""
        raise NotImplementedError


class RazorpayGateway(PaymentGateway):
    def __init__(self) -> None:
        self._client = None  # lazily constructed — see _client property

    @property
    def client(self):
        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            raise GatewayNotConfigured(
                "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set in the environment. "
                "Payments cannot be processed until a Razorpay account is configured."
            )
        if self._client is None:
            import razorpay  # imported lazily so the package is optional until actually used

            self._client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        return self._client

    def create_order(self, *, amount: float, currency: str, receipt: str) -> GatewayOrder:
        # Razorpay wants an integer amount in the smallest currency subunit
        # (paise for INR: ₹1 = 100 paise). round() then int() avoids float
        # artifacts like 4.999999999 -> 499 instead of 500.
        amount_subunits = int(round(amount * 100))

        order = self.client.order.create(
            data={
                "amount": amount_subunits,
                "currency": currency.upper(),
                "receipt": receipt,
                "payment_capture": 1,  # auto-capture on successful payment
            }
        )
        return GatewayOrder(
            provider_order_id=order["id"],
            key_id=settings.RAZORPAY_KEY_ID,
            amount_subunits=amount_subunits,
            currency=currency.upper(),
        )

    def verify_payment_signature(
        self, *, provider_order_id: str, provider_payment_id: str, signature: str
    ) -> bool:
        import razorpay

        try:
            self.client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": provider_order_id,
                    "razorpay_payment_id": provider_payment_id,
                    "razorpay_signature": signature,
                }
            )
            return True
        except razorpay.errors.SignatureVerificationError:
            return False


# Single instance used throughout the app.
gateway: PaymentGateway = RazorpayGateway()
