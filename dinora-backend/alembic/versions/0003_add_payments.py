"""Add payments table.

Backs the rebuilt payment flow (app/services/payment_service.py,
app/routes/payment.py). One row per payment attempt against an order —
see app/models/payment.py for why this is a table and not a single
orders.paid_amount column.

Revision ID: 0003_add_payments
Revises: 0002_admin_restaurant_scope
Create Date: 2026-08-29
"""
from alembic import op
import sqlalchemy as sa

revision = "0003_add_payments"
down_revision = "0002_admin_restaurant_scope"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id"), nullable=False, index=True),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("currency", sa.String(), nullable=False, server_default="usd"),
        sa.Column("provider", sa.String(), nullable=False, server_default="manual"),
        sa.Column("provider_reference", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("confirmed_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("payments")
