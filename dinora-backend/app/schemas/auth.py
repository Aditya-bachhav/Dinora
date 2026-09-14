from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class AdminRegister(BaseModel):
    """
    restaurant_name is optional and NOT sent by the current frontend's
    register form (see AdminRegister.jsx). When omitted, the new admin is
    attached to the sole existing restaurant — see routes/auth.py. Supplying
    it creates a brand-new restaurant for this admin, which is how a real
    multi-tenant onboarding flow would use this same endpoint later.
    """
    name: str
    email: EmailStr
    password: str = Field(min_length=8)
    restaurant_name: str | None = None


class AdminLogin(BaseModel):
    email: EmailStr
    password: str
