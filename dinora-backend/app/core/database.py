from __future__ import annotations
from typing import Iterator
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

engine = None
SessionLocal = None
Base = declarative_base()

def configure_engine(database_url: str) -> None:
    global engine, SessionLocal
    kwargs = {"future": True}
    if database_url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}
    engine = create_engine(database_url, **kwargs)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

configure_engine(settings.DATABASE_URL)

def get_db() -> Iterator[object]:
    assert SessionLocal is not None
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db() -> None:
    global engine, SessionLocal
    from app.models.admin import AdminUser
    from app.models.category import Category
    from app.models.menu import MenuItem
    from app.models.order import Order
    from app.models.order_item import OrderItem
    from app.models.restaurant import Restaurant
    from app.models.session import DiningSession
    from app.models.table import Table
    try:
        assert engine is not None
        Base.metadata.create_all(bind=engine)
    except OperationalError:
        configure_engine(settings.DATABASE_URL)
        assert engine is not None
        Base.metadata.create_all(bind=engine)

    assert SessionLocal is not None
    db = SessionLocal()
    try:
        # Upgrade the existing SQLite DB without destroying user data.
        if engine.url.drivername == "sqlite":
            menu_cols = {r[1] for r in db.execute(text("PRAGMA table_info(menu_items)"))}
            if "image_url" not in menu_cols:
                db.execute(text("ALTER TABLE menu_items ADD COLUMN image_url TEXT"))
            order_cols = {r[1] for r in db.execute(text("PRAGMA table_info(orders)"))}
            if "created_at" not in order_cols:
                db.execute(text("ALTER TABLE orders ADD COLUMN created_at DATETIME"))
                db.execute(text("UPDATE orders SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"))
            db.commit()

        restaurant = db.query(Restaurant).filter(Restaurant.name == "Dinora Demo Restaurant").first()
        if restaurant is None:
            restaurant = Restaurant(name="Dinora Demo Restaurant", location="Mumbai")
            db.add(restaurant); db.flush()

        category_map = {}
        for slug, name in [("starters", "Starters"), ("main-course", "Main Course"), ("desserts", "Desserts")]:
            c = db.query(Category).filter(Category.slug == slug).first()
            if c is None:
                c = Category(slug=slug, name=name, restaurant_id=restaurant.id)
                db.add(c); db.flush()
            category_map[slug] = c

        # Tables are created explicitly by the admin. Phase 1 does not seed fake tables.

        seed_items = [
            ("classic-burger", "Classic Burger", "Beef patty with lettuce, tomato, and house sauce.", 12.99, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80", "main-course"),
            ("butter-paneer", "Butter Paneer", "Rich paneer curry served with soft naan.", 14.50, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80", "main-course"),
            ("veg-pizza", "Veg Pizza", "Veggie pizza with fresh vegetables and cheese.", 11.25, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80", "starters"),
            ("gulab-jamun", "Gulab Jamun", "Warm syrup-soaked dumplings served as a classic Indian dessert.", 5.50, "https://images.unsplash.com/photo-1606313564200-e75d5e30476a?auto=format&fit=crop&w=900&q=80", "desserts"),
        ]
        for slug, name, description, price, image_url, category_slug in seed_items:
            i = db.query(MenuItem).filter(MenuItem.slug == slug).first()
            if i is None:
                db.add(MenuItem(slug=slug, name=name, description=description, price=price, image_url=image_url, available=True, restaurant_id=restaurant.id, category_id=category_map[category_slug].id))
            elif not i.image_url:
                i.image_url = image_url

        db.commit()
    finally:
        db.close()
