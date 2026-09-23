from __future__ import annotations

from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import SlidingWindowRateLimiter
from app.core.security import verify_password
from app.models.admin import AdminUser
from app.models.restaurant import Restaurant
from app.models.super_admin import SuperAdminUser
from app.models.table import Table
from app.schemas.super_admin import RestaurantStatusUpdate, SuperAdminLogin

router = APIRouter(tags=["super-admin"])

TOKEN_ALGORITHM = "HS256"
TOKEN_TTL_HOURS = 12
TOKEN_TYPE = "super_admin"  # distinguishes this JWT from a restaurant AdminUser token

# Same brute-force protection as the restaurant admin login — see
# routes/auth.py for the reasoning (keyed by email, not IP).
_login_limiter = SlidingWindowRateLimiter(max_attempts=10, window_seconds=300)


def _issue_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(hours=TOKEN_TTL_HOURS)
    return jwt.encode(
        {"sub": str(user_id), "typ": TOKEN_TYPE, "exp": expires_at},
        settings.SECRET_KEY,
        algorithm=TOKEN_ALGORITHM,
    )


def current_super_admin(request: Request, db: Session = Depends(get_db)) -> SuperAdminUser:
    """
    Deliberately separate from routes/auth.py's current_admin dependency.
    A restaurant AdminUser's bearer token is REJECTED here even though it's
    signed with the same key, because it has no "typ": "super_admin" claim
    (and a super admin token is equally rejected by current_admin, for the
    same reason) — the two roles cannot masquerade as each other by reusing
    a token from one login on the other's endpoints.
    """
    auth_header = request.headers.get("Authorization", "")
    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Super admin login required")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[TOKEN_ALGORITHM])
        if payload.get("typ") != TOKEN_TYPE:
            raise HTTPException(status_code=401, detail="Invalid or expired super admin session")
        user_id = int(payload.get("sub"))
    except (jwt.PyJWTError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired super admin session") from None

    user = db.query(SuperAdminUser).filter(SuperAdminUser.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Super admin account not found")
    return user


@router.post("/login")
async def login(body: SuperAdminLogin, db: Session = Depends(get_db)):
    email = body.email.lower()

    allowed, retry_after = _login_limiter.check(email)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Too many login attempts. Try again in {int(retry_after) + 1} seconds.",
            headers={"Retry-After": str(int(retry_after) + 1)},
        )

    user = db.query(SuperAdminUser).filter(SuperAdminUser.email == email).first()

    if user is None or not verify_password(body.password, user.password_hash):
        _login_limiter.record(email)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    _login_limiter.reset(email)

    return {
        "token": _issue_token(user.id),
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@router.get("/me")
def me(user: SuperAdminUser = Depends(current_super_admin)):
    return {"id": user.id, "name": user.name, "email": user.email}


# ---------------------------------------------------------------------------
# Platform view of every tenant restaurant. Owner corresponds to the first
# AdminUser created for a restaurant (see routes/auth.py's registration
# flow) — Dinora doesn't yet model distinct Owner vs Staff roles within a
# restaurant (every AdminUser on a restaurant is currently a peer "admin"),
# so "owner" here is a display convenience, not a stored permission level.
# Adding that distinction is real future work, not something to fake here.
# ---------------------------------------------------------------------------

@router.get("/restaurants")
def list_restaurants(db: Session = Depends(get_db), _: SuperAdminUser = Depends(current_super_admin)) -> list[dict]:
    restaurants = db.query(Restaurant).order_by(Restaurant.id.asc()).all()
    result = []
    for r in restaurants:
        admins = db.query(AdminUser).filter(AdminUser.restaurant_id == r.id).order_by(AdminUser.id.asc()).all()
        table_count = db.query(func.count(Table.id)).filter(Table.restaurant_id == r.id).scalar() or 0
        owner = admins[0] if admins else None
        result.append(
            {
                "id": r.id,
                "name": r.name,
                "location": r.location,
                "is_active": r.is_active,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "restaurant_type": r.restaurant_type,
                "crew_size": r.crew_size,
                "seating_capacity": r.seating_capacity,
                "payment_configured": r.has_own_payment_credentials,
                "table_count": table_count,
                "staff_count": len(admins),
                "owner": {"name": owner.name, "email": owner.email} if owner else None,
            }
        )
    return result


@router.get("/restaurants/{restaurant_id}")
def get_restaurant_detail(
    restaurant_id: int,
    db: Session = Depends(get_db),
    _: SuperAdminUser = Depends(current_super_admin),
) -> dict:
    r = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    admins = db.query(AdminUser).filter(AdminUser.restaurant_id == r.id).order_by(AdminUser.id.asc()).all()
    table_count = db.query(func.count(Table.id)).filter(Table.restaurant_id == r.id).scalar() or 0

    return {
        "id": r.id,
        "name": r.name,
        "location": r.location,
        "is_active": r.is_active,
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "restaurant_type": r.restaurant_type,
        "crew_size": r.crew_size,
        "seating_capacity": r.seating_capacity,
        "payment_configured": r.has_own_payment_credentials,
        "table_count": table_count,
        "admins": [{"id": a.id, "name": a.name, "email": a.email} for a in admins],
    }


@router.patch("/restaurants/{restaurant_id}")
def set_restaurant_status(
    restaurant_id: int,
    body: RestaurantStatusUpdate,
    db: Session = Depends(get_db),
    _: SuperAdminUser = Depends(current_super_admin),
) -> dict:
    """Suspend or reinstate a tenant. Suspending blocks owner/staff login
    on this restaurant (see routes/auth.py) — it does not delete or touch
    any of the restaurant's own data."""
    r = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    r.is_active = body.is_active
    db.commit()

    return {"id": r.id, "is_active": r.is_active}
