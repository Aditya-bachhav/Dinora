"""Add Super Admin layer: super_admin_users table, restaurants.is_active/created_at.

Introduces the platform level of Dinora's three-tier hierarchy — Super
Admin (Dinora, this migration) sits above Owner (AdminUser, existing) and
Staff (not yet modeled — see notes in routes/super_admin.py). Super admins
are a wholly separate table from AdminUser so a restaurant owner has no
path, even in principle, to becoming one.

restaurants.is_active is the platform's suspend/reinstate switch — see
Restaurant model docstring and routes/auth.py's login check.
restaurants.created_at lets the Super Admin dashboard show when a tenant
joined the platform.

Revision ID: 0009_super_admin_layer
Revises: 0008_restaurant_business_profile
Create Date: 2026-09-14
"""
from alembic import op
import sqlalchemy as sa

revision = "0009_super_admin_layer"
down_revision = "0008_restaurant_business_profile"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "super_admin_users",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    with op.batch_alter_table("restaurants") as batch_op:
        batch_op.add_column(
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true")
        )
        batch_op.add_column(
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now())
        )


def downgrade() -> None:
    with op.batch_alter_table("restaurants") as batch_op:
        batch_op.drop_column("created_at")
        batch_op.drop_column("is_active")

    op.drop_table("super_admin_users")
