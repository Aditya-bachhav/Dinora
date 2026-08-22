from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.category import Category
from app.models.admin import AdminUser
from app.routes.auth import current_admin

router = APIRouter(tags=["categories"])


@router.get("")
def list_categories(db: Session = Depends(get_db)) -> list[dict[str, object]]:
    categories = db.query(Category).order_by(Category.name.asc()).all()
    return [
        {"id": category.id, "slug": category.slug, "name": category.name, "restaurant_id": category.restaurant_id}
        for category in categories
    ]


@router.post("")
async def create_category(request: Request, db: Session = Depends(get_db), user: AdminUser = Depends(current_admin)) -> dict[str, object]:
    payload = await request.json()
    slug = (payload.get("slug") or payload.get("name") or "").strip().lower().replace(" ", "-")
    name = (payload.get("name") or "").strip()
    restaurant_id = int(payload.get("restaurant_id") or 1)
    if not slug or not name:
        raise HTTPException(status_code=400, detail="slug and name are required")

    category = Category(slug=slug, name=name, restaurant_id=restaurant_id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return {"id": category.id, "slug": category.slug, "name": category.name, "restaurant_id": category.restaurant_id}
