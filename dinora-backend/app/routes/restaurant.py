from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.admin import AdminUser
from app.models.restaurant import Restaurant
from app.routes.auth import current_admin
from app.schemas.payment import PaymentSettingsUpdate
from app.schemas.restaurant import RestaurantProfileUpdate
from app.services.restaurant_service import resolve_guest_restaurant_id

router = APIRouter(tags=["restaurant"])


@router.get("")
def get_restaurant(restaurant_id: int | None = None, db: Session = Depends(get_db)) -> dict[str, object]:
    """
    Guest-facing, table-less restaurant lookup (e.g. app landing page before
    a QR scan). Prefer routes/tables.py's GET /{table_token}, which derives
    the restaurant from the scanned table and is correct even once multiple
    restaurants exist. This endpoint is single-tenant-safe the same way
    /api/menu is — see services/restaurant_service.py.
    """
    rid = resolve_guest_restaurant_id(db, restaurant_id)
    restaurant = db.query(Restaurant).filter(Restaurant.id == rid).first()
    return {"id": restaurant.id, "name": restaurant.name, "location": restaurant.location}


# ---------------------------------------------------------------------------
# Admin: business profile (crew size, restaurant type, seating capacity) —
# real onboarding detail so the owner (and the platform) has an accurate
# picture of the restaurant, not just a name.
# ---------------------------------------------------------------------------

@router.get("/profile")
def get_restaurant_profile(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict:
    """MY restaurant's business profile, plus whether it's been filled in
    yet (crew_size is the required field — see Restaurant.has_business_profile)."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == admin.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return {
        "name": restaurant.name,
        "restaurant_type": restaurant.restaurant_type,
        "crew_size": restaurant.crew_size,
        "seating_capacity": restaurant.seating_capacity,
        "profile_complete": restaurant.has_business_profile,
    }


@router.put("/profile")
def set_restaurant_profile(
    body: RestaurantProfileUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict:
    """Admin fills in MY restaurant's business profile — crew size,
    restaurant type, seating capacity. Called from the onboarding wizard,
    but also safe to call again later from Settings to update it."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == admin.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    restaurant.crew_size = body.crew_size
    restaurant.restaurant_type = body.restaurant_type
    restaurant.seating_capacity = body.seating_capacity
    db.commit()

    return {
        "name": restaurant.name,
        "restaurant_type": restaurant.restaurant_type,
        "crew_size": restaurant.crew_size,
        "seating_capacity": restaurant.seating_capacity,
        "profile_complete": restaurant.has_business_profile,
    }


# ---------------------------------------------------------------------------
# Admin: this restaurant's own Razorpay credentials (SaaS multi-tenancy —
# see app/services/payment_gateway.py for how these get resolved and used).
# ---------------------------------------------------------------------------

@router.get("/payment-settings")
def get_payment_settings(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict:
    """
    Whether THIS admin's restaurant has its own Razorpay credentials
    configured, and if so, the key_id (the PUBLIC half — safe to show back;
    the key_secret is never returned once set, only confirmed as present).
    """
    restaurant = db.query(Restaurant).filter(Restaurant.id == admin.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return {
        "configured": restaurant.has_own_payment_credentials,
        "razorpay_key_id": restaurant.razorpay_key_id if restaurant.has_own_payment_credentials else None,
    }


@router.put("/payment-settings")
def set_payment_settings(
    body: PaymentSettingsUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict:
    """
    Admin configures THIS restaurant's own Razorpay account, so this
    restaurant's payments settle to their own bank account instead of a
    shared platform account. key_secret is encrypted before it ever
    touches the database — see core/encryption.py — and is never returned
    in any response after being set, including this one.
    """
    key_id = body.razorpay_key_id.strip()
    key_secret = body.razorpay_key_secret.strip()
    if not key_id or not key_secret:
        raise HTTPException(status_code=400, detail="Both razorpay_key_id and razorpay_key_secret are required")

    restaurant = db.query(Restaurant).filter(Restaurant.id == admin.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    restaurant.razorpay_key_id = key_id
    restaurant.set_razorpay_key_secret(key_secret)
    db.commit()

    return {"configured": True, "razorpay_key_id": key_id}


@router.delete("/payment-settings")
def clear_payment_settings(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(current_admin),
) -> dict:
    """
    Remove this restaurant's own credentials, reverting to the
    platform-level fallback (if one is configured) or a clear 503 on the
    next payment attempt if neither is set.
    """
    restaurant = db.query(Restaurant).filter(Restaurant.id == admin.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    restaurant.razorpay_key_id = None
    restaurant.razorpay_key_secret_encrypted = None
    db.commit()

    return {"configured": False, "razorpay_key_id": None}
