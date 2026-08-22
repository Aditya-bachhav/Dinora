from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.restaurant import Restaurant

router = APIRouter(tags=["restaurant"])


@router.get("")
def get_restaurant(db: Session = Depends(get_db)) -> dict[str, object]:
    restaurant = db.query(Restaurant).first()
    if restaurant is None:
        return {"name": "Dinora", "location": None}

    return {"id": restaurant.id, "name": restaurant.name, "location": restaurant.location}
