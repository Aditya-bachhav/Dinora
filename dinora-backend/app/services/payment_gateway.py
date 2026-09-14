"""
Payment gateway abstraction — Razorpay implementation, per-restaurant.

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

MULTI-TENANCY: every call takes a `restaurant` and resolves ITS OWN
Razorpay credentials (restaurant.razorpay_key_id +
restaurant.get_razorpay_key_secret()) rather than one global platform
account — so each restaurant's payments settle to their own bank account,
not the platform operator's. If a restaurant hasn't configured its own
credentials yet, this falls back to the platform-level
RAZORPAY_KEY_ID/SECRET env vars, so a single-tenant deployment (or a
restaurant mid-onboarding) still works without per-tenant setup.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

from app.core.config import settings


class GatewayNotConfigured(Exception):
    """Raised when a payment is attempted but no Razorpay credentials are
    available for this restaurant AND no platform-level fallback is set."""


@dataclass
class ResolvedCredentials:
    key_id: str
    key_secret: str
    # Whether these came from the restaurant's own account or the
    # platform-level fallback — surfaced so callers/logs can tell the two
    # apart without re-deriving it.
    is_platform_fallback: bool


@dataclass
class GatewayOrder:
    provider_order_id: str
    key_id: str
    amount_subunits: int
    currency: str


def resolve_credentials(restaurant) -> ResolvedCredentials:
    """
    Resolve which Razorpay credentials to use for this restaurant:
    the restaurant's own if configured, otherwise the platform-level
    fallback env vars. Raises GatewayNotConfigured if neither is available.
    """
    if restaurant is not None and restaurant.has_own_payment_credentials:
        return ResolvedCredentials(
            key_id=restaurant.razorpay_key_id,
            key_secret=restaurant.get_razorpay_key_secret(),
            is_platform_fallback=False,
        )

    if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
        return ResolvedCredentials(
            key_id=settings.RAZORPAY_KEY_ID,
            key_secret=settings.RAZORPAY_KEY_SECRET,
            is_platform_fallback=True,
        )

    raise GatewayNotConfigured(
        "No Razorpay credentials are configured for this restaurant, and no "
        "platform-level fallback (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) is set "
        "in the environment either. Payments cannot be processed until one of "
        "the two is configured."
    )


class PaymentGateway(ABC):
    @abstractmethod
    def create_order(self, *, restaurant, amount: float, currency: str, receipt: str) -> GatewayOrder:
        """Create a provider-side order for `amount` (major units, e.g. rupees)
        using THIS restaurant's own credentials (or the platform fallback).
        Must never trust a client-supplied amount — callers pass a
        server-computed value only (see payment_service.py)."""
        raise NotImplementedError

    @abstractmethod
    def verify_payment_signature(
        self, *, restaurant, provider_order_id: str, provider_payment_id: str, signature: str
    ) -> bool:
        """Return True only if the signature genuinely proves Razorpay processed
        this payment_id against this order_id, verified against THIS
        restaurant's own key secret. Never guess or skip this check."""
        raise NotImplementedError


class RazorpayGateway(PaymentGateway):
    def _client_for(self, restaurant):
        creds = resolve_credentials(restaurant)
        import razorpay  # imported lazily so the package is optional until actually used

        return razorpay.Client(auth=(creds.key_id, creds.key_secret)), creds

    def create_order(self, *, restaurant, amount: float, currency: str, receipt: str) -> GatewayOrder:
        client, creds = self._client_for(restaurant)

        # Razorpay wants an integer amount in the smallest currency subunit
        # (paise for INR: ₹1 = 100 paise). round() then int() avoids float
        # artifacts like 4.999999999 -> 499 instead of 500.
        amount_subunits = int(round(amount * 100))

        order = client.order.create(
            data={
                "amount": amount_subunits,
                "currency": currency.upper(),
                "receipt": receipt,
                "payment_capture": 1,  # auto-capture on successful payment
            }
        )
        return GatewayOrder(
            provider_order_id=order["id"],
            key_id=creds.key_id,
            amount_subunits=amount_subunits,
            currency=currency.upper(),
        )

    def verify_payment_signature(
        self, *, restaurant, provider_order_id: str, provider_payment_id: str, signature: str
    ) -> bool:
        import razorpay

        client, _creds = self._client_for(restaurant)
        try:
            client.utility.verify_payment_signature(
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
