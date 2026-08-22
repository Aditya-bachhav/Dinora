from pydantic import BaseModel


class MenuItemCreate(BaseModel):
    name: str
    price: float
    restaurant_id: int


class MenuItemResponse(MenuItemCreate):
    id: int
