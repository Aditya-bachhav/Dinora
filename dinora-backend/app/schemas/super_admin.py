from __future__ import annotations

from pydantic import BaseModel, EmailStr


class SuperAdminLogin(BaseModel):
    email: EmailStr
    password: str


class RestaurantStatusUpdate(BaseModel):
    """Suspend or reinstate a restaurant. Deliberately the ONLY thing a
    super admin can change about a tenant restaurant — see routes/super_admin.py
    for why editing a tenant's own business data (name, crew size, menu...)
    is intentionally out of scope for this layer."""

    is_active: bool
