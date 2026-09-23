from __future__ import annotations

from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.encryption import decrypt_secret, encrypt_secret


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Platform-level kill switch, set only via the Super Admin API
    # (routes/super_admin.py PATCH /api/super-admin/restaurants/{id}).
    # When False: owner/staff login is blocked (see routes/auth.py) and the
    # restaurant is treated as offline. Restaurant rows themselves are
    # never deleted — this is the platform's suspend/reinstate control.
    is_active = Column(Boolean, nullable=False, default=True, server_default="true")

    # Business profile — collected during onboarding so the owner (and the
    # platform) has a real picture of the restaurant, not just its name.
    # All nullable: existing restaurants created before this field existed,
    # and anyone who skips this onboarding step, simply have it unset.
    restaurant_type = Column(String, nullable=True)  # e.g. "cafe", "fine_dining"
    crew_size = Column(Integer, nullable=True)  # total staff, owner included
    seating_capacity = Column(Integer, nullable=True)  # approx guest seats

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

    @property
    def has_business_profile(self) -> bool:
        """True once the owner has come through the business-details
        onboarding step at least once (crew_size is the required field
        there; type and seating are optional)."""
        return self.crew_size is not None
