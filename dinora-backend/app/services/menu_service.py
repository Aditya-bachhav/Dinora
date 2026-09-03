"""
Menu and category business logic.

Every write here takes restaurant_id from the authenticated admin
(never from the client payload) so one admin can never create or see
another restaurant's categories or menu items.
"""
from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.menu import MenuItem


# ---------------------------------------------------------------------------
# Serialization
# ---------------------------------------------------------------------------

def serialize_category(category: Category, items: list[MenuItem] | None = None) -> dict:
    return {
        "id": category.id,
        "slug": category.slug,
        "name": category.name,
        "restaurant_id": category.restaurant_id,
        "items": [serialize_item(i, category) for i in (items or [])],
    }


def serialize_item(item: MenuItem, category: Category | None = None) -> dict:
    return {
        "id": item.id,
        "slug": item.slug,
        "name": item.name,
        "description": item.description,
        "price": item.price,
        "image_url": item.image_url,
        "available": item.available,
        "restaurant_id": item.restaurant_id,
        "category_id": item.category_id,
        "category": category.name if category else None,
    }


# ---------------------------------------------------------------------------
# Guest-facing reads — public, but a specific restaurant_id is always
# required so browsing one restaurant's QR menu never leaks another's.
# ---------------------------------------------------------------------------

def get_menu_for_restaurant(db: Session, restaurant_id: int) -> dict:
    categories = (
        db.query(Category)
        .filter(Category.restaurant_id == restaurant_id)
        .order_by(Category.id.asc())
        .all()
    )
    items = (
        db.query(MenuItem)
        .filter(MenuItem.restaurant_id == restaurant_id)
        .order_by(MenuItem.id.desc())
        .all()
    )
    by_cat: dict[int, list[MenuItem]] = {}
    for item in items:
        by_cat.setdefault(item.category_id, []).append(item)
    cat_by_id = {c.id: c for c in categories}
    return {
        "categories": [serialize_category(c, by_cat.get(c.id, [])) for c in categories],
        "items": [serialize_item(i, cat_by_id.get(i.category_id)) for i in items],
    }


def list_categories_for_restaurant(db: Session, restaurant_id: int) -> list[Category]:
    return (
        db.query(Category)
        .filter(Category.restaurant_id == restaurant_id)
        .order_by(Category.id.asc())
        .all()
    )


def get_category_by_slug(db: Session, category_slug: str, restaurant_id: int | None = None) -> Category:
    query = db.query(Category).filter(Category.slug == category_slug)
    if restaurant_id is not None:
        query = query.filter(Category.restaurant_id == restaurant_id)
    category = query.first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


def get_item_by_slug(db: Session, item_slug: str, restaurant_id: int | None = None) -> MenuItem:
    query = db.query(MenuItem).filter(MenuItem.slug == item_slug)
    if restaurant_id is not None:
        query = query.filter(MenuItem.restaurant_id == restaurant_id)
    item = query.first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


# ---------------------------------------------------------------------------
# Admin-facing writes — restaurant_id is always the authenticated admin's own
# ---------------------------------------------------------------------------

def create_category(db: Session, restaurant_id: int, name: str, slug: str | None = None) -> Category:
    name = (name or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Category name is required")
    slug = (slug or name).strip().lower().replace(" ", "-")

    if db.query(Category).filter(Category.slug == slug).first():
        raise HTTPException(status_code=409, detail="A category with this slug already exists")

    category = Category(slug=slug, name=name, restaurant_id=restaurant_id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def create_menu_item(
    db: Session,
    restaurant_id: int,
    *,
    name: str,
    category_id: int,
    slug: str | None = None,
    description: str | None = None,
    price: float = 0,
    image_url: str | None = None,
    available: bool = True,
) -> MenuItem:
    name = (name or "").strip()
    if not name or not category_id:
        raise HTTPException(status_code=400, detail="Name and category are required")

    category = (
        db.query(Category)
        .filter(Category.id == category_id, Category.restaurant_id == restaurant_id)
        .first()
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found for this restaurant")

    slug = (slug or name).strip().lower().replace(" ", "-")
    if db.query(MenuItem).filter(MenuItem.slug == slug).first():
        raise HTTPException(status_code=409, detail="A menu item with this slug already exists")

    item = MenuItem(
        slug=slug,
        name=name,
        description=(description or "").strip() or None,
        price=float(price or 0),
        image_url=(image_url or "").strip() or None,
        available=bool(available),
        restaurant_id=restaurant_id,
        category_id=category_id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


_UPDATABLE_ITEM_FIELDS = ("name", "description", "price", "available", "category_id", "image_url")


def update_menu_item(db: Session, item_id: int, restaurant_id: int, changes: dict) -> MenuItem:
    item = (
        db.query(MenuItem)
        .filter(MenuItem.id == item_id, MenuItem.restaurant_id == restaurant_id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    if "category_id" in changes:
        new_category_id = int(changes["category_id"])
        category = (
            db.query(Category)
            .filter(Category.id == new_category_id, Category.restaurant_id == restaurant_id)
            .first()
        )
        if not category:
            raise HTTPException(status_code=404, detail="Category not found for this restaurant")

    for field in _UPDATABLE_ITEM_FIELDS:
        if field in changes:
            setattr(item, field, changes[field])

    db.commit()
    db.refresh(item)
    return item


def delete_menu_item(db: Session, item_id: int, restaurant_id: int) -> int:
    item = (
        db.query(MenuItem)
        .filter(MenuItem.id == item_id, MenuItem.restaurant_id == restaurant_id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    db.delete(item)
    db.commit()
    return item_id
