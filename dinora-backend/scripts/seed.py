from __future__ import annotations

import os

from app.core.database import SessionLocal
from app.models.admin import AdminUser
from app.models.category import Category
from app.models.menu import MenuItem
from app.models.restaurant import Restaurant
from app.core.security import hash_password

DEMO_ADMIN_EMAIL = os.getenv("DINORA_SEED_ADMIN_EMAIL", "admin@dinora.demo")
DEMO_ADMIN_PASSWORD = os.getenv("DINORA_SEED_ADMIN_PASSWORD", "dinora-demo-admin-123")


def seed() -> None:
    if SessionLocal is None:
        raise RuntimeError("Database is not configured")
    db = SessionLocal()
    try:
        restaurant = db.query(Restaurant).filter(Restaurant.name == "Dinora Demo Restaurant").first()
        if restaurant is None:
            restaurant = Restaurant(name="Dinora Demo Restaurant", location="Mumbai")
            db.add(restaurant)
            db.flush()

        category_map: dict[str, Category] = {}
        for slug, name in [("starters", "Starters"), ("main-course", "Main Course"), ("desserts", "Desserts")]:
            category = db.query(Category).filter(Category.slug == slug, Category.restaurant_id == restaurant.id).first()
            if category is None:
                category = Category(slug=slug, name=name, restaurant_id=restaurant.id)
                db.add(category)
                db.flush()
            category_map[slug] = category

        seed_items = [
            ("classic-burger", "Classic Burger", "Beef patty with lettuce, tomato, and house sauce.", 12.99, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80", "main-course"),
            ("butter-paneer", "Butter Paneer", "Rich paneer curry served with soft naan.", 14.50, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80", "main-course"),
            ("veg-pizza", "Veg Pizza", "Veggie pizza with fresh vegetables and cheese.", 11.25, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80", "starters"),
            ("gulab-jamun", "Gulab Jamun", "Warm syrup-soaked dumplings served as a classic Indian dessert.", 5.50, "https://images.unsplash.com/photo-1606313564200-e75d5e30476a?auto=format&fit=crop&w=900&q=80", "desserts"),
        ]
        for slug, name, description, price, image_url, category_slug in seed_items:
            item = db.query(MenuItem).filter(MenuItem.slug == slug, MenuItem.restaurant_id == restaurant.id).first()
            if item is None:
                db.add(MenuItem(slug=slug, name=name, description=description, price=price, image_url=image_url, available=True, restaurant_id=restaurant.id, category_id=category_map[category_slug].id))
            elif not item.image_url:
                item.image_url = image_url

        # Demo admin, scoped to the seeded restaurant. Credentials come from
        # DINORA_SEED_ADMIN_EMAIL / DINORA_SEED_ADMIN_PASSWORD if set,
        # otherwise the printed defaults below — change the password after
        # first login in anything beyond a local demo.
        admin = db.query(AdminUser).filter(AdminUser.email == DEMO_ADMIN_EMAIL).first()
        if admin is None:
            admin = AdminUser(
                name="Dinora Demo Admin",
                email=DEMO_ADMIN_EMAIL,
                password_hash=hash_password(DEMO_ADMIN_PASSWORD),
                restaurant_id=restaurant.id,
            )
            db.add(admin)

        db.commit()
        print(f"Seeded restaurant '{restaurant.name}' (id={restaurant.id}).")
        print(f"Demo admin login -> email: {DEMO_ADMIN_EMAIL}  password: {DEMO_ADMIN_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
