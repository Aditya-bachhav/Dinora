from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.category import Category
from app.models.menu import MenuItem
from app.models.admin import AdminUser
from app.routes.auth import current_admin

router = APIRouter(tags=["menu"])

def serialize_category(category: Category, items=None):
    return {"id": category.id, "slug": category.slug, "name": category.name, "restaurant_id": category.restaurant_id, "items": [serialize_item(i, category) for i in (items or [])]}

def serialize_item(item: MenuItem, category=None):
    return {"id": item.id, "slug": item.slug, "name": item.name, "description": item.description, "price": item.price, "image_url": item.image_url, "available": item.available, "restaurant_id": item.restaurant_id, "category_id": item.category_id, "category": category.name if category else None}

@router.get("")
def list_menu(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.id.asc()).all()
    items = db.query(MenuItem).order_by(MenuItem.id.desc()).all()
    by_cat = {}
    for item in items: by_cat.setdefault(item.category_id, []).append(item)
    return {"categories": [serialize_category(c, by_cat.get(c.id, [])) for c in categories], "items": [serialize_item(i, db.query(Category).filter(Category.id == i.category_id).first()) for i in items]}

@router.get("/categories")
def list_menu_categories(db: Session = Depends(get_db)):
    return [serialize_category(c) for c in db.query(Category).order_by(Category.id.asc()).all()]

@router.post("/categories")
async def create_menu_category(request: Request, db: Session = Depends(get_db), user: AdminUser = Depends(current_admin)):
    p = await request.json(); name = (p.get("name") or "").strip(); slug = (p.get("slug") or name).strip().lower().replace(" ", "-")
    if not name: raise HTTPException(400, "Category name is required")
    category = Category(slug=slug, name=name, restaurant_id=int(p.get("restaurant_id") or 1)); db.add(category); db.commit(); db.refresh(category)
    return serialize_category(category)

@router.get("/categories/{category_slug}")
def get_menu_category(category_slug: str, db: Session = Depends(get_db)):
    c = db.query(Category).filter(Category.slug == category_slug).first()
    if not c: raise HTTPException(404, "Category not found")
    return serialize_category(c, db.query(MenuItem).filter(MenuItem.category_id == c.id).order_by(MenuItem.id.desc()).all())

@router.get("/items/{item_slug}")
def get_menu_item(item_slug: str, db: Session = Depends(get_db)):
    i = db.query(MenuItem).filter(MenuItem.slug == item_slug).first()
    if not i: raise HTTPException(404, "Menu item not found")
    return serialize_item(i, db.query(Category).filter(Category.id == i.category_id).first())

@router.post("/items")
async def create_menu_item(request: Request, db: Session = Depends(get_db), user: AdminUser = Depends(current_admin)):
    p = await request.json(); name=(p.get("name") or "").strip(); slug=(p.get("slug") or name).strip().lower().replace(" ", "-"); category_id=int(p.get("category_id") or 0)
    if not name or not category_id: raise HTTPException(400, "Name and category are required")
    category=db.query(Category).filter(Category.id==category_id).first()
    if not category: raise HTTPException(404, "Category not found")
    i=MenuItem(slug=slug,name=name,description=(p.get("description") or "").strip() or None,price=float(p.get("price") or 0),image_url=(p.get("image_url") or "").strip() or None,available=bool(p.get("available",True)),restaurant_id=int(p.get("restaurant_id") or 1),category_id=category_id)
    db.add(i); db.commit(); db.refresh(i); return serialize_item(i,category)

@router.patch("/items/{item_id}")
async def update_menu_item(item_id:int, request:Request, db:Session=Depends(get_db), user:AdminUser=Depends(current_admin)):
    i=db.query(MenuItem).filter(MenuItem.id==item_id).first()
    if not i: raise HTTPException(404,"Menu item not found")
    p=await request.json()
    for f in ("name","description","price","available","category_id","image_url"):
        if f in p: setattr(i,f,p[f])
    db.commit(); db.refresh(i); return serialize_item(i,db.query(Category).filter(Category.id==i.category_id).first())

@router.delete("/items/{item_id}")
def delete_menu_item(item_id:int, db:Session=Depends(get_db), user:AdminUser=Depends(current_admin)):
    i=db.query(MenuItem).filter(MenuItem.id==item_id).first()
    if not i: raise HTTPException(404,"Menu item not found")
    db.delete(i); db.commit(); return {"deleted":item_id}
