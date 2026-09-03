from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.admin import AdminUser
from app.routes.auth import current_admin
from app.schemas.menu import CategoryCreate
from app.services import menu_service
from app.services.restaurant_service import resolve_guest_restaurant_id

router = APIRouter(tags=["categories"])

# NOTE: this router duplicates GET/POST /api/menu/categories in
# routes/menu.py. Both are kept (the frontend/README reference both paths)
# but both now call the same menu_service functions, so they can no longer
# drift into different behaviour the way the two independent
# implementations previously could.


@router.get("")
def list_categories(restaurant_id: int | None = None, db: Session = Depends(get_db)) -> list[dict]:
    rid = resolve_guest_restaurant_id(db, restaurant_id)
    categories = menu_service.list_categories_for_restaurant(db, rid)
    return [
        {"id": c.id, "slug": c.slug, "name": c.name, "restaurant_id": c.restaurant_id}
        for c in categories
    ]


@router.post("")
async def create_category(
    body: CategoryCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict:
    category = menu_service.create_category(db, admin.restaurant_id, name=body.name, slug=body.slug)
    return {"id": category.id, "slug": category.slug, "name": category.name, "restaurant_id": category.restaurant_id}
