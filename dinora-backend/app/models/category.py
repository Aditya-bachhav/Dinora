from __future__ import annotations

from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"
    __table_args__ = (
        # Slugs only need to be unique WITHIN a restaurant, not across the
        # whole platform — a global unique constraint meant Restaurant B
        # could never create a "Desserts" category once Restaurant A had
        # one. See migration 0006.
        UniqueConstraint("restaurant_id", "slug", name="uq_categories_restaurant_id_slug"),
    )

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)

    restaurant = relationship("Restaurant", back_populates="categories")
    menu_items = relationship("MenuItem", back_populates="category")