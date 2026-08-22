from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from io import BytesIO
from urllib.parse import urljoin
import qrcode
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.restaurant import Restaurant
from app.models.session import DiningSession
from app.models.table import Table
from app.models.admin import AdminUser
from app.routes.auth import current_admin

router = APIRouter(tags=["tables"])


def serialize_table(table: Table, session: DiningSession | None = None, restaurant: Restaurant | None = None) -> dict[str, object]:
    return {
        "id": table.id,
        "number": table.number,
        "token": table.token,
        "status": table.status,
        "restaurant_id": table.restaurant_id,
        "restaurant": {"id": restaurant.id, "name": restaurant.name, "location": restaurant.location} if restaurant else None,
        "session": {"id": session.id, "status": session.status} if session else None,
    }


@router.get("")
def list_tables(db: Session = Depends(get_db)) -> list[dict[str, object]]:
    tables = db.query(Table).order_by(Table.number.asc()).all()
    restaurants = {restaurant.id: restaurant for restaurant in db.query(Restaurant).all()}
    sessions = {session.table_id: session for session in db.query(DiningSession).all()}
    return [serialize_table(table, sessions.get(table.id), restaurants.get(table.restaurant_id)) for table in tables]


@router.get("/{table_token}")
def get_table(table_token: str, db: Session = Depends(get_db)) -> dict[str, object]:
    table = db.query(Table).filter(Table.token == table_token).first()
    if table is None:
        raise HTTPException(status_code=404, detail="Table not found")

    restaurant = db.query(Restaurant).filter(Restaurant.id == table.restaurant_id).first()
    session = db.query(DiningSession).filter(DiningSession.table_id == table.id, DiningSession.status == "active").first()
    return {
        "restaurant": {"id": restaurant.id, "name": restaurant.name, "location": restaurant.location} if restaurant else None,
        "table": {"id": table.id, "number": table.number, "token": table.token, "status": table.status},
        "session": {"id": session.id, "status": session.status} if session else None,
    }


@router.get("/{table_token}/session")
def get_table_session(table_token: str, db: Session = Depends(get_db)) -> dict[str, object]:
    table = db.query(Table).filter(Table.token == table_token).first()
    if table is None:
        raise HTTPException(status_code=404, detail="Table not found")

    session = db.query(DiningSession).filter(DiningSession.table_id == table.id, DiningSession.status == "active").first()
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    return {"table_token": table_token, "session_id": session.id, "status": session.status}


@router.get("/{table_token}/qr")
def table_qr(table_token: str, guest_url: str = "", db: Session = Depends(get_db)):
    table = db.query(Table).filter(Table.token == table_token).first()
    if table is None:
        raise HTTPException(status_code=404, detail="Table not found")
    base = guest_url.strip().rstrip("/")
    if not base:
        raise HTTPException(status_code=400, detail="guest_url is required")
    target = f"{base}/t/{table.token}"
    image = qrcode.make(target)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png", headers={"Content-Disposition": f'inline; filename="dinora-table-{table.number}-qr.png"'})


@router.post("")
async def create_table(request: Request, db: Session = Depends(get_db), user: AdminUser = Depends(current_admin)) -> dict[str, object]:
    payload = await request.json()
    number = int(payload.get("number") or 0)
    token = (payload.get("token") or "").strip().lower().replace(" ", "-")
    restaurant_id = int(payload.get("restaurant_id") or 1)
    if number <= 0 or not token:
        raise HTTPException(status_code=400, detail="number and token are required")
    if db.query(Table).filter(Table.number == number).first():
        raise HTTPException(status_code=409, detail="A table with this number already exists")
    if db.query(Table).filter(Table.token == token).first():
        raise HTTPException(status_code=409, detail="A table with this token already exists")

    # Make sure the referenced restaurant actually exists.
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if restaurant is None:
        restaurant = db.query(Restaurant).order_by(Restaurant.id.asc()).first()
    if restaurant is None:
        raise HTTPException(status_code=400, detail="No restaurant exists yet")

    table = Table(number=number, token=token, status="available", restaurant_id=restaurant.id)
    db.add(table)
    # Flush first so SQLite/Postgres allocates table.id before creating the FK row.
    db.flush()
    session_id = f"table-{number}-{table.id}-session"
    db.add(DiningSession(id=session_id, table_id=table.id, status="active"))
    db.commit()
    db.refresh(table)
    return {"id": table.id, "number": table.number, "token": table.token, "status": table.status, "restaurant_id": restaurant.id, "session_id": session_id}
