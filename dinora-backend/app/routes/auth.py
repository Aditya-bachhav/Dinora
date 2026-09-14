from __future__ import annotations

from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import SlidingWindowRateLimiter
from app.core.security import hash_password, verify_password
from app.models.admin import AdminUser
from app.models.restaurant import Restaurant
from app.schemas.auth import AdminLogin, AdminRegister

router = APIRouter(tags=["auth"])

TOKEN_ALGORITHM = "HS256"
TOKEN_TTL_HOURS = 12

# Keyed by email, not IP: the goal is "this one admin account can't be
# brute-forced," which holds even if an attacker spreads guesses across
# many source IPs. 10 failed attempts per 5 minutes is generous for a
# legitimate admin who mistyped their password a few times, while making
# a real brute-force attempt (thousands of guesses) impractically slow.
_login_limiter = SlidingWindowRateLimiter(max_attempts=10, window_seconds=300)


def _issue_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(hours=TOKEN_TTL_HOURS)
    return jwt.encode(
        {"sub": str(user_id), "exp": expires_at},
        settings.SECRET_KEY,
        algorithm=TOKEN_ALGORITHM,
    )


def current_admin(request: Request, db: Session = Depends(get_db)) -> AdminUser:
    auth_header = request.headers.get("Authorization", "")
    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Admin login required")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[TOKEN_ALGORITHM])
        user_id = int(payload.get("sub"))
    except (jwt.PyJWTError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired admin session") from None

    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Admin account not found")
    return user


def _resolve_registration_restaurant(db: Session, restaurant_name: str | None) -> Restaurant:
    """
    - restaurant_name given -> create a new restaurant for this admin.
    - restaurant_name omitted -> attach to the sole existing restaurant
      (matches the current single-tenant frontend, which never sends this
      field). If zero or more than one restaurant exists with nothing
      specified, registration fails loudly rather than guessing.
    """
    if restaurant_name:
        restaurant = Restaurant(name=restaurant_name.strip())
        db.add(restaurant)
        db.flush()
        return restaurant

    restaurants = db.query(Restaurant).order_by(Restaurant.id.asc()).limit(2).all()
    if len(restaurants) == 1:
        return restaurants[0]
    if not restaurants:
        raise HTTPException(
            status_code=400,
            detail="No restaurant exists yet — register with restaurant_name to create the first one",
        )
    raise HTTPException(
        status_code=400,
        detail="Multiple restaurants exist — registration requires an explicit restaurant_name",
    )


@router.post("/register")
async def register(body: AdminRegister, db: Session = Depends(get_db)):
    email = body.email.lower()

    if db.query(AdminUser).filter(AdminUser.email == email).first():
        raise HTTPException(status_code=409, detail="An admin account with this email already exists")

    restaurant = _resolve_registration_restaurant(db, body.restaurant_name)

    user = AdminUser(
        name=body.name.strip(),
        email=email,
        password_hash=hash_password(body.password),
        restaurant_id=restaurant.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "token": _issue_token(user.id),
        "user": {"id": user.id, "name": user.name, "email": user.email, "restaurant_id": user.restaurant_id},
    }


@router.post("/login")
async def login(body: AdminLogin, db: Session = Depends(get_db)):
    email = body.email.lower()

    allowed, retry_after = _login_limiter.check(email)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Too many login attempts. Try again in {int(retry_after) + 1} seconds.",
            headers={"Retry-After": str(int(retry_after) + 1)},
        )

    user = db.query(AdminUser).filter(AdminUser.email == email).first()

    if user is None or not verify_password(body.password, user.password_hash):
        # Only failures count against the limit — a correct password never
        # gets blocked by someone else's earlier bad guesses at this email.
        _login_limiter.record(email)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    _login_limiter.reset(email)

    return {
        "token": _issue_token(user.id),
        "user": {"id": user.id, "name": user.name, "email": user.email, "restaurant_id": user.restaurant_id},
    }


@router.get("/me")
def me(user: AdminUser = Depends(current_admin)):
    return {"id": user.id, "name": user.name, "email": user.email, "restaurant_id": user.restaurant_id}
