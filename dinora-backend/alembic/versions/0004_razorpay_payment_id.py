"""Add payments.provider_payment_id; switch defaults to razorpay/inr.

Backs the real Razorpay integration (app/services/payment_gateway.py).
Razorpay's flow has two IDs per payment: an order_id (created before
checkout opens, already stored in provider_reference) and a payment_id
(only known after the user completes payment in the Checkout popup) —
this migration adds a column for the latter.

Revision ID: 0004_razorpay_payment_id
Revises: 0003_add_payments
Create Date: 2026-08-30
"""
from alembic import op
import sqlalchemy as sa

revision = "0004_razorpay_payment_id"
down_revision = "0003_add_payments"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("payments") as batch_op:
        batch_op.add_column(sa.Column("provider_payment_id", sa.String(), nullable=True))
        # Existing default was "manual"/"usd" from the mock-gateway era —
        # flip the column defaults forward. Existing rows (if any, from
        # local/dev testing) are left as-is; this only changes what NEW
        # rows default to. batch_alter_table makes this portable to SQLite
        # (used for local/dev testing) as well as Postgres.
        batch_op.alter_column("provider", server_default="razorpay")
        batch_op.alter_column("currency", server_default="inr")


def downgrade() -> None:
    with op.batch_alter_table("payments") as batch_op:
        batch_op.alter_column("currency", server_default="usd")
        batch_op.alter_column("provider", server_default="manual")
        batch_op.drop_column("provider_payment_id")
