"""Add restaurant business profile fields (crew size, type, seating).

Real SaaS onboarding needs more than just a restaurant name — the owner
should tell us the size of their crew, what kind of restaurant this is,
and roughly how many guests they seat, so both the owner and the platform
have an accurate picture from day one. Collected as a dedicated onboarding
step — see routes/restaurant.py PUT /api/restaurant/profile and
dinora-frontend/src/pages/admin/Onboarding.jsx.

All three columns are nullable: existing restaurants created before this
migration, and any admin who skips the step, simply have them unset.

Revision ID: 0008_restaurant_business_profile
Revises: 0007_restaurant_payment_credentials
Create Date: 2026-09-14
"""
from alembic import op
import sqlalchemy as sa

revision = "0008_restaurant_business_profile"
down_revision = "0007_restaurant_payment_credentials"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("restaurants") as batch_op:
        batch_op.add_column(sa.Column("restaurant_type", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("crew_size", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("seating_capacity", sa.Integer(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("restaurants") as batch_op:
        batch_op.drop_column("seating_capacity")
        batch_op.drop_column("crew_size")
        batch_op.drop_column("restaurant_type")
