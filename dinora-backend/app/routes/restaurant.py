from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.restaurant import Restaurant
from app.services.restaurant_service import resolve_guest_restaurant_id

router = APIRouter(tags=["restaurant"])


@router.get("")
def get_restaurant(restaurant_id: int | None = None, db: Session = Depends(get_db)) -> dict[str, object]:
    """
    Guest-facing, table-less restaurant lookup (e.g. app landing page before
    a QR scan). Prefer routes/tables.py's GET /{table_token}, which derives
    the restaurant from the scanned table and is correct even once multiple
    restaurants exist. This endpoint is single-tenant-safe the same way
    /api/menu is — see services/restaurant_service.py.
    """
    rid = resolve_guest_restaurant_id(db, restaurant_id)
    restaurant = db.query(Restaurant).filter(Restaurant.id == rid).first()
    return {"id": restaurant.id, "name": restaurant.name, "location": restaurant.location}
