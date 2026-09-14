"""Add per-restaurant Razorpay payment credentials.

Part of the SaaS multi-tenancy work: previously RAZORPAY_KEY_ID/SECRET
were global environment variables, meaning every restaurant's payments
flowed through one shared Razorpay account (the platform operator's own),
making the platform operator the merchant of record for money that isn't
theirs. This lets each restaurant configure its own Razorpay account so
payments settle directly to them.

razorpay_key_secret is stored ENCRYPTED (see app/core/encryption.py) —
never in plaintext, even though this is "our own" database. See
models/restaurant.py for the get/set helper methods.

Revision ID: 0007_restaurant_payment_credentials
Revises: 0006_scope_slugs_to_restaurant
Create Date: 2026-09-03
"""
from alembic import op
import sqlalchemy as sa

revision = "0007_restaurant_payment_credentials"
down_revision = "0006_scope_slugs_to_restaurant"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("restaurants") as batch_op:
        batch_op.add_column(sa.Column("razorpay_key_id", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("razorpay_key_secret_encrypted", sa.String(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("restaurants") as batch_op:
        batch_op.drop_column("razorpay_key_secret_encrypted")
        batch_op.drop_column("razorpay_key_id")
