from __future__ import annotations

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class DiningSession(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    status = Column(String, default="active")

    table = relationship("Table", back_populates="sessions")
    orders = relationship("Order", back_populates="session")