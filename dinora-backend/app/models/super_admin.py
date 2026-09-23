from __future__ import annotations

from sqlalchemy import Column, DateTime, Integer, String, func

from app.core.database import Base


class SuperAdminUser(Base):
    """
    Dinora's own platform operators — NOT restaurant owners or staff.

    This is a deliberately separate table (not a "role" flag on AdminUser)
    so a super admin account can never be created, elevated, or logged into
    through any restaurant-facing endpoint. See routes/super_admin.py: the
    JWTs issued here carry a distinct "typ": "super_admin" claim so an
    AdminUser bearer token is never accepted on a /api/super-admin/* route
    and vice versa, even though both currently share the same signing key.

    Not exposed to restaurant owners in any UI or API response — restaurant
    admins have no way to discover this table exists.
    """

    __tablename__ = "super_admin_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
