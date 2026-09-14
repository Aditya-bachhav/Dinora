from __future__ import annotations

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str
    slug: str | None = None


class MenuItemCreate(BaseModel):
    name: str
    category_id: int
    slug: str | None = None
    description: str | None = None
    price: float = Field(ge=0, default=0)
    image_url: str | None = None
    available: bool = True


class MenuItemUpdate(BaseModel):
    """All fields optional — only supplied fields are changed."""
    name: str | None = None
    description: str | None = None
    price: float | None = Field(default=None, ge=0)
    available: bool | None = None
    category_id: int | None = None
    image_url: str | None = None
