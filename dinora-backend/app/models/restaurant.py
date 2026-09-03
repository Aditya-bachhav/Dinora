from __future__ import annotations

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)

    admins = relationship("AdminUser", back_populates="restaurant")
    tables = relationship("Table", back_populates="restaurant")
    categories = relationship("Category", back_populates="restaurant")
    menu_items = relationship("MenuItem", back_populates="restaurant")
