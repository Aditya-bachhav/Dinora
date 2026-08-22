from pydantic import BaseModel


class TableCreate(BaseModel):
    number: int
    status: str = "available"
    restaurant_id: int


class TableResponse(TableCreate):
    id: int
