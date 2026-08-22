from pydantic import BaseModel


class OrderCreate(BaseModel):
    table_id: int
    status: str = "pending"
    total_amount: int = 0


class OrderResponse(OrderCreate):
    id: int
