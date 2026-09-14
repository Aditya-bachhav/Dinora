from __future__ import annotations

from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class MenuItem(Base):
    __tablename__ = "menu_items"
    __table_args__ = (
        # Same reasoning as Category — slugs only need to be unique WITHIN
        # a restaurant. See migration 0006.
        UniqueConstraint("restaurant_id", "slug", name="uq_menu_items_restaurant_id_slug"),
    )

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    available = Column(Boolean, default=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    restaurant = relationship("Restaurant", back_populates="menu_items")
    category = relationship("Category", back_populates="menu_items")
