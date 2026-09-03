from __future__ import annotations
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

Base = declarative_base()
engine = None
SessionLocal = None


def configure_engine(database_url: str) -> None:
    global engine, SessionLocal
    kwargs = {"future": True, "pool_pre_ping": True}
    if database_url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}
    engine = create_engine(database_url, **kwargs)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


configure_engine(settings.DATABASE_URL)


def get_db() -> Iterator[object]:
    if SessionLocal is None:
        raise RuntimeError("Database engine is not configured")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
