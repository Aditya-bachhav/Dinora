"""Scope category/menu-item slug uniqueness to restaurant_id.

Found during audit: categories.slug and menu_items.slug were globally
unique across the entire platform, not per-restaurant. This meant once
Restaurant A created a "Desserts" category, Restaurant B could never
create their own "Desserts" category.

Approach:
- Rebuild categories with a restaurant-scoped unique constraint.
- Rebuild menu_items with a restaurant-scoped unique constraint.
- Temporarily remove PostgreSQL foreign keys that would otherwise keep
  the old tables alive while they are being replaced.
- Recreate those foreign keys against the new tables.

Revision ID: 0006_scope_slugs_to_restaurant
Revises: 0005_unique_table_number
Create Date: 2026-09-03
"""

from alembic import op
import sqlalchemy as sa


revision = "0006_scope_slugs_to_restaurant"
down_revision = "0005_unique_table_number"
branch_labels = None
depends_on = None


def upgrade() -> None:
    _rebuild_categories(
        unique_columns=["restaurant_id", "slug"],
        constraint_name="uq_categories_restaurant_id_slug",
    )

    _rebuild_menu_items(
        unique_columns=["restaurant_id", "slug"],
        constraint_name="uq_menu_items_restaurant_id_slug",
    )


def downgrade() -> None:
    _rebuild_menu_items(
        unique_columns=["slug"],
        constraint_name="uq_menu_items_slug",
    )

    _rebuild_categories(
        unique_columns=["slug"],
        constraint_name="uq_categories_slug",
    )


def _drop_postgres_fk(
    table_name: str,
    constraint_name: str,
) -> None:
    """Drop a PostgreSQL FK temporarily during table rebuilding."""
    conn = op.get_bind()

    if conn.dialect.name == "postgresql":
        conn.exec_driver_sql(
            f'ALTER TABLE "{table_name}" '
            f'DROP CONSTRAINT IF EXISTS "{constraint_name}"'
        )


def _recreate_postgres_fk(
    table_name: str,
    constraint_name: str,
    local_columns: list[str],
    remote_table: str,
    remote_columns: list[str],
) -> None:
    """Recreate a PostgreSQL FK after the replacement table exists."""
    conn = op.get_bind()

    if conn.dialect.name == "postgresql":
        op.create_foreign_key(
            constraint_name,
            source_table=table_name,
            referent_table=remote_table,
            local_cols=local_columns,
            remote_cols=remote_columns,
        )


def _rebuild_categories(
    *,
    unique_columns: list[str],
    constraint_name: str,
) -> None:
    conn = op.get_bind()

    # PostgreSQL automatically changes the existing
    # menu_items.category_id FK to point to categories_old when
    # categories is renamed. Remove it first so categories_old
    # can safely be dropped.
    _drop_postgres_fk(
        table_name="menu_items",
        constraint_name="menu_items_category_id_fkey",
    )

    op.rename_table("categories", "categories_old")

    conn.exec_driver_sql(
        "DROP INDEX IF EXISTS ix_categories_id"
    )
    conn.exec_driver_sql(
        "DROP INDEX IF EXISTS ix_categories_slug"
    )

    op.create_table(
        "categories",
        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
        ),
        sa.Column(
            "slug",
            sa.String(),
            nullable=False,
        ),
        sa.Column(
            "name",
            sa.String(),
            nullable=False,
        ),
        sa.Column(
            "restaurant_id",
            sa.Integer(),
            sa.ForeignKey("restaurants.id"),
            nullable=False,
        ),
        sa.UniqueConstraint(
            *unique_columns,
            name=constraint_name,
        ),
    )

    op.create_index(
        "ix_categories_id",
        "categories",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_categories_slug",
        "categories",
        ["slug"],
        unique=False,
    )

    conn.exec_driver_sql(
        "INSERT INTO categories "
        "(id, slug, name, restaurant_id) "
        "SELECT id, slug, name, restaurant_id "
        "FROM categories_old"
    )

    op.drop_table("categories_old")


def _rebuild_menu_items(
    *,
    unique_columns: list[str],
    constraint_name: str,
) -> None:
    conn = op.get_bind()

    # PostgreSQL changes order_items.menu_item_id to reference
    # menu_items_old when menu_items is renamed. That dependency
    # prevents menu_items_old from being dropped.
    _drop_postgres_fk(
        table_name="order_items",
        constraint_name="order_items_menu_item_id_fkey",
    )

    # Also remove the category FK from menu_items. This was already
    # removed during category rebuilding for the normal upgrade path,
    # but IF EXISTS keeps this safe for downgrade/rebuild scenarios.
    _drop_postgres_fk(
        table_name="menu_items",
        constraint_name="menu_items_category_id_fkey",
    )

    op.rename_table("menu_items", "menu_items_old")

    conn.exec_driver_sql(
        "DROP INDEX IF EXISTS ix_menu_items_id"
    )
    conn.exec_driver_sql(
        "DROP INDEX IF EXISTS ix_menu_items_slug"
    )

    op.create_table(
        "menu_items",
        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
        ),
        sa.Column(
            "slug",
            sa.String(),
            nullable=False,
        ),
        sa.Column(
            "name",
            sa.String(),
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.String(),
            nullable=True,
        ),
        sa.Column(
            "price",
            sa.Float(),
            nullable=False,
        ),
        sa.Column(
            "image_url",
            sa.String(),
            nullable=True,
        ),
        sa.Column(
            "available",
            sa.Boolean(),
            nullable=True,
        ),
        sa.Column(
            "restaurant_id",
            sa.Integer(),
            sa.ForeignKey("restaurants.id"),
            nullable=False,
        ),
        sa.Column(
            "category_id",
            sa.Integer(),
            sa.ForeignKey("categories.id"),
            nullable=False,
        ),
        sa.UniqueConstraint(
            *unique_columns,
            name=constraint_name,
        ),
    )

    op.create_index(
        "ix_menu_items_id",
        "menu_items",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_menu_items_slug",
        "menu_items",
        ["slug"],
        unique=False,
    )

    conn.exec_driver_sql(
        "INSERT INTO menu_items "
        "(id, slug, name, description, price, image_url, "
        "available, restaurant_id, category_id) "
        "SELECT id, slug, name, description, price, image_url, "
        "available, restaurant_id, category_id "
        "FROM menu_items_old"
    )

    op.drop_table("menu_items_old")

    # Recreate order_items -> menu_items FK, now pointing to
    # the new menu_items table.
    _recreate_postgres_fk(
        table_name="order_items",
        constraint_name="order_items_menu_item_id_fkey",
        local_columns=["menu_item_id"],
        remote_table="menu_items",
        remote_columns=["id"],
    )

    