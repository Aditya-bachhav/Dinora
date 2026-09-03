from __future__ import annotations

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Table(Base):
    __tablename__ = "tables"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, nullable=False)
    token = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, default="available")
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)

    restaurant = relationship("Restaurant", back_populates="tables")
    sessions = relationship("DiningSession", back_populates="table")
    orders = relationship("Order", back_populates="table")
