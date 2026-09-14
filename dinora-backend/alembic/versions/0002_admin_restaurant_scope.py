"""Add restaurant_id to admin_users.

Every admin now belongs to exactly one restaurant, which is what makes
admin-facing queries (orders, tables, menu writes) scoped to "my restaurant"
instead of the previous global/unscoped behaviour. See app/models/admin.py
and app/services/*.

Revision ID: 0002_admin_restaurant_scope
Revises: 0001_initial
Create Date: 2026-08-29
"""
from alembic import op
import sqlalchemy as sa

revision = "0002_admin_restaurant_scope"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Add the column nullable first so this works against a database that
    #    already has admin_users rows (a fresh DB has none, but production
    #    might not be fresh). batch_alter_table makes this portable to
    #    SQLite too (used for local/dev testing), which cannot ALTER a
    #    table to add a column with an inline FK constraint directly — on
    #    Postgres (the app's required runtime, see core/config.py) this
    #    runs as a normal ADD COLUMN either way.
    with op.batch_alter_table("admin_users") as batch_op:
        batch_op.add_column(sa.Column("restaurant_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_admin_users_restaurant_id", "restaurants", ["restaurant_id"], ["id"]
        )

    # 2. Backfill: attach every existing admin to the first restaurant row.
    #    This mirrors the app's pre-fix behaviour, where every admin
    #    effectively operated against "the first restaurant" anyway (see
    #    the old get_restaurant() / list_orders() implementations) — so
    #    this backfill does not change what data those admins could already
    #    see, it just makes that scope explicit and enforced going forward.
    connection = op.get_bind()
    first_restaurant_id = connection.execute(
        sa.text("SELECT id FROM restaurants ORDER BY id ASC LIMIT 1")
    ).scalar()
    if first_restaurant_id is not None:
        connection.execute(
            sa.text("UPDATE admin_users SET restaurant_id = :rid WHERE restaurant_id IS NULL"),
            {"rid": first_restaurant_id},
        )

    # 3. Now that every row has a value (or the table was empty), enforce
    #    NOT NULL going forward.
    with op.batch_alter_table("admin_users") as batch_op:
        batch_op.alter_column("restaurant_id", nullable=False)


def downgrade() -> None:
    with op.batch_alter_table("admin_users") as batch_op:
        batch_op.drop_constraint("fk_admin_users_restaurant_id", type_="foreignkey")
        batch_op.drop_column("restaurant_id")
