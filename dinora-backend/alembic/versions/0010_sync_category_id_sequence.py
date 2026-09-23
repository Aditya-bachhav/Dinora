"""Synchronize the categories primary-key sequence with existing rows.

Revision ID: 0010_sync_category_id_sequence
Revises: 0009_super_admin_layer
Create Date: 2026-09-16
"""
from alembic import op

revision = "0010_sync_category_id_sequence"
down_revision = "0009_super_admin_layer"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Seed scripts and table rebuilds can insert explicit category IDs without
    # advancing PostgreSQL's sequence. Set the next generated ID above the
    # current maximum so normal category creation remains reliable.
    op.execute(
        """
        SELECT setval(
            pg_get_serial_sequence('categories', 'id'),
            COALESCE(MAX(id), 0) + 1,
            false
        )
        FROM categories
        """
    )


def downgrade() -> None:
    pass
