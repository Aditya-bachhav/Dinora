from __future__ import annotations

from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class Table(Base):
    __tablename__ = "tables"
    __table_args__ = (
        # Belt-and-suspenders with the check in table_service.create_table:
        # the app-level check alone is racy (two near-simultaneous requests
        # can both pass it), this constraint is what actually prevents the
        # duplicate at the database level. See migration 0005.
        UniqueConstraint("restaurant_id", "number", name="uq_tables_restaurant_id_number"),
    )

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, nullable=False)
    token = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, default="available")
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)

    restaurant = relationship("Restaurant", back_populates="tables")
    sessions = relationship("DiningSession", back_populates="table")
    orders = relationship("Order", back_populates="table")
