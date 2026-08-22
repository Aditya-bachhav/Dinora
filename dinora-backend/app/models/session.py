from __future__ import annotations

from sqlalchemy import Column, ForeignKey, Integer, String

from app.core.database import Base


class DiningSession(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    status = Column(String, default="active")