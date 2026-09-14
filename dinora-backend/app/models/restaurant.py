from __future__ import annotations

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.encryption import decrypt_secret, encrypt_secret


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)

    # Per-restaurant Razorpay credentials — set via
    # PATCH /api/restaurant/payment-settings (admin, own restaurant only).
    # razorpay_key_id is the PUBLIC half of the credential pair (safe to
    # send to the frontend to open Checkout — Razorpay's own docs put it
    # directly in client-side JS) and is stored as plaintext.
    # razorpay_key_secret_encrypted is the PRIVATE half and is NEVER stored
    # in plaintext — see core/encryption.py. Both are nullable: a
    # restaurant that hasn't configured its own credentials falls back to
    # the platform-level RAZORPAY_KEY_ID/SECRET env vars (see
    # services/payment_gateway.py) so this is backward compatible with a
    # single-tenant deployment that never touches this feature at all.
    razorpay_key_id = Column(String, nullable=True)
    razorpay_key_secret_encrypted = Column(String, nullable=True)

    admins = relationship("AdminUser", back_populates="restaurant")
    tables = relationship("Table", back_populates="restaurant")
    categories = relationship("Category", back_populates="restaurant")
    menu_items = relationship("MenuItem", back_populates="restaurant")

    def set_razorpay_key_secret(self, plaintext_secret: str) -> None:
        self.razorpay_key_secret_encrypted = encrypt_secret(plaintext_secret)

    def get_razorpay_key_secret(self) -> str | None:
        if not self.razorpay_key_secret_encrypted:
            return None
        return decrypt_secret(self.razorpay_key_secret_encrypted)

    @property
    def has_own_payment_credentials(self) -> bool:
        return bool(self.razorpay_key_id and self.razorpay_key_secret_encrypted)
