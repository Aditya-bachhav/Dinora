from __future__ import annotations

from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    session_id = Column(String, ForeignKey("sessions.id"), nullable=False)
    status = Column(String, default="pending", nullable=False)
    # Float, matching OrderItem.line_total — was Integer, which silently
    # truncated fractional currency totals (e.g. 12.99 -> 12).
    total_amount = Column(Float, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    table = relationship("Table", back_populates="orders")
    session = relationship("DiningSession", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")
