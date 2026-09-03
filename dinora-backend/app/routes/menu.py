from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.admin import AdminUser
from app.models.category import Category
from app.models.menu import MenuItem
from app.routes.auth import current_admin
from app.schemas.menu import CategoryCreate, MenuItemCreate, MenuItemUpdate
from app.services import menu_service
from app.services.restaurant_service import resolve_guest_restaurant_id

router = APIRouter(tags=["menu"])


# ---------------------------------------------------------------------------
# Guest-facing reads.
#
# The current frontend calls these with no table/session context, so a
# single-restaurant deployment is resolved automatically (see
# resolve_guest_restaurant_id). Passing ?restaurant_id=<id> explicitly is
# supported for a future multi-restaurant frontend and always wins.
# ---------------------------------------------------------------------------

@router.get("")
def list_menu(restaurant_id: int | None = None, db: Session = Depends(get_db)):
    rid = resolve_guest_restaurant_id(db, restaurant_id)
    return menu_service.get_menu_for_restaurant(db, rid)


@router.get("/categories")
def list_menu_categories(restaurant_id: int | None = None, db: Session = Depends(get_db)):
    rid = resolve_guest_restaurant_id(db, restaurant_id)
    categories = menu_service.list_categories_for_restaurant(db, rid)
    return [menu_service.serialize_category(c) for c in categories]


@router.get("/categories/{category_slug}")
def get_menu_category(category_slug: str, db: Session = Depends(get_db)):
    category = menu_service.get_category_by_slug(db, category_slug)
    items = (
        db.query(MenuItem)
        .filter(MenuItem.category_id == category.id)
        .order_by(MenuItem.id.desc())
        .all()
    )
    return menu_service.serialize_category(category, items)


@router.get("/items/{item_slug}")
def get_menu_item(item_slug: str, db: Session = Depends(get_db)):
    item = menu_service.get_item_by_slug(db, item_slug)
    category = db.query(Category).filter(Category.id == item.category_id).first()
    return menu_service.serialize_item(item, category)


# ---------------------------------------------------------------------------
# Admin-facing writes — always scoped to the authenticated admin's OWN
# restaurant. restaurant_id is never accepted from the client payload.
# ---------------------------------------------------------------------------

@router.post("/categories")
async def create_menu_category(
    body: CategoryCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
):
    category = menu_service.create_category(db, admin.restaurant_id, name=body.name, slug=body.slug)
    return menu_service.serialize_category(category)


@router.post("/items")
async def create_menu_item(
    body: MenuItemCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
):
    item = menu_service.create_menu_item(
        db,
        admin.restaurant_id,
        name=body.name,
        category_id=body.category_id,
        slug=body.slug,
        description=body.description,
        price=body.price,
        image_url=body.image_url,
        available=body.available,
    )
    category = db.query(Category).filter(Category.id == item.category_id).first()
    return menu_service.serialize_item(item, category)


@router.patch("/items/{item_id}")
async def update_menu_item(
    item_id: int,
    body: MenuItemUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
):
    changes = body.model_dump(exclude_unset=True)
    item = menu_service.update_menu_item(db, item_id, admin.restaurant_id, changes)
    category = db.query(Category).filter(Category.id == item.category_id).first()
    return menu_service.serialize_item(item, category)


@router.delete("/items/{item_id}")
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
):
    deleted_id = menu_service.delete_menu_item(db, item_id, admin.restaurant_id)
    return {"deleted": deleted_id}
