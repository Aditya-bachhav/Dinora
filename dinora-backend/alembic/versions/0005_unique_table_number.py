"""Add unique constraint on tables(restaurant_id, number).

Found during audit: create_table() checked for a duplicate table number
before inserting, but with no matching DB constraint, two near-simultaneous
requests to create "Table 5" for the same restaurant could both pass the
check and both insert — a classic check-then-insert race. This migration
closes the gap at the database level, which is the only place a race like
this can actually be prevented.

Revision ID: 0005_unique_table_number
Revises: 0004_razorpay_payment_id
Create Date: 2026-09-03
"""
from alembic import op

revision = "0005_unique_table_number"
down_revision = "0004_razorpay_payment_id"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # batch_alter_table for SQLite portability (used for local/dev testing),
    # same pattern as migrations 0002 and 0004.
    with op.batch_alter_table("tables") as batch_op:
        batch_op.create_unique_constraint(
            "uq_tables_restaurant_id_number", ["restaurant_id", "number"]
        )


def downgrade() -> None:
    with op.batch_alter_table("tables") as batch_op:
        batch_op.drop_constraint("uq_tables_restaurant_id_number", type_="unique")
