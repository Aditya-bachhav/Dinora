from __future__ import annotations

from pydantic import BaseModel, Field, field_validator

VALID_RESTAURANT_TYPES = {
    "cafe",
    "quick_service",
    "casual_dining",
    "fine_dining",
    "cloud_kitchen",
    "bar_pub",
    "bakery",
    "other",
}


class RestaurantProfileUpdate(BaseModel):
    """
    Business-details onboarding step: who the owner is running this
    restaurant with and what kind of place it is. crew_size is the one
    required field (see Restaurant.has_business_profile) — the rest help
    the owner see an accurate picture but aren't load-bearing for anything.
    """

    crew_size: int = Field(gt=0, le=1000)
    restaurant_type: str | None = None
    seating_capacity: int | None = Field(default=None, gt=0, le=5000)

    @field_validator("restaurant_type")
    @classmethod
    def _validate_type(cls, value: str | None) -> str | None:
        if value is None or value == "":
            return None
        if value not in VALID_RESTAURANT_TYPES:
            raise ValueError(f"restaurant_type must be one of {sorted(VALID_RESTAURANT_TYPES)}")
        return value
