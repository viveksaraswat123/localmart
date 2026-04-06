"""fix schema issues

Revision ID: 6d053a538b7b
Revises: 
Create Date: 2026-04-06 14:11:35.407705

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6d053a538b7b'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── customer_profiles ────────────────────────────────────────────────────
    op.drop_column('customer_profiles', 'name')

    # ── orders ───────────────────────────────────────────────────────────────
    # shipping_address: existing rows get an empty string as a safe default,
    # then the column is tightened to NOT NULL.
    op.add_column('orders', sa.Column('shipping_address', sa.String(length=300), nullable=True))
    op.execute("UPDATE orders SET shipping_address = '' WHERE shipping_address IS NULL")
    op.alter_column('orders', 'shipping_address', nullable=False)

    op.add_column('orders', sa.Column(
        'updated_at', sa.DateTime(timezone=True),
        server_default=sa.text('now()'), nullable=False,
    ))

    # Float → Numeric requires an explicit CAST on PostgreSQL
    op.alter_column('orders', 'total_price',
        existing_type=sa.DOUBLE_PRECISION(precision=53),
        type_=sa.Numeric(precision=10, scale=2),
        existing_nullable=False,
        postgresql_using='total_price::numeric',
    )

    # ── products ─────────────────────────────────────────────────────────────
    op.add_column('products', sa.Column(
        'updated_at', sa.DateTime(timezone=True),
        server_default=sa.text('now()'), nullable=False,
    ))

    op.alter_column('products', 'price',
        existing_type=sa.DOUBLE_PRECISION(precision=53),
        type_=sa.Numeric(precision=10, scale=2),
        existing_nullable=False,
        postgresql_using='price::numeric',
    )

    # ── services ─────────────────────────────────────────────────────────────
    op.add_column('services', sa.Column(
        'created_at', sa.DateTime(timezone=True),
        server_default=sa.text('now()'), nullable=False,
    ))
    op.add_column('services', sa.Column(
        'updated_at', sa.DateTime(timezone=True),
        server_default=sa.text('now()'), nullable=False,
    ))

    # seller_id: add nullable first, backfill existing rows, then enforce NOT NULL
    op.add_column('services', sa.Column('seller_id', sa.Integer(), nullable=True))
    op.execute("""
        UPDATE services
        SET seller_id = (
            SELECT id FROM users WHERE role = 'seller' LIMIT 1
        )
        WHERE seller_id IS NULL
    """)
    op.alter_column('services', 'seller_id', nullable=False)
    op.create_foreign_key(
        'fk_services_seller_id', 'services', 'users',
        ['seller_id'], ['id'], ondelete='CASCADE',
    )

    op.alter_column('services', 'cost',
        existing_type=sa.DOUBLE_PRECISION(precision=53),
        type_=sa.Numeric(precision=10, scale=2),
        existing_nullable=False,
        postgresql_using='cost::numeric',
    )

    # ── users ─────────────────────────────────────────────────────────────────
    # hashed_password: add nullable, copy existing password values, enforce NOT NULL, drop old column
    op.add_column('users', sa.Column('hashed_password', sa.String(length=255), nullable=True))
    op.execute("UPDATE users SET hashed_password = password")
    op.alter_column('users', 'hashed_password', nullable=False)
    op.drop_column('users', 'password')

    op.add_column('users', sa.Column(
        'updated_at', sa.DateTime(timezone=True),
        server_default=sa.text('now()'), nullable=False,
    ))


def downgrade() -> None:
    # ── users ─────────────────────────────────────────────────────────────────
    op.add_column('users', sa.Column('password', sa.VARCHAR(length=255), nullable=True))
    op.execute("UPDATE users SET password = hashed_password")
    op.alter_column('users', 'password', nullable=False)
    op.drop_column('users', 'hashed_password')
    op.drop_column('users', 'updated_at')

    # ── services ─────────────────────────────────────────────────────────────
    op.drop_constraint('fk_services_seller_id', 'services', type_='foreignkey')
    op.drop_column('services', 'seller_id')
    op.alter_column('services', 'cost',
        existing_type=sa.Numeric(precision=10, scale=2),
        type_=sa.DOUBLE_PRECISION(precision=53),
        existing_nullable=False,
        postgresql_using='cost::double precision',
    )
    op.drop_column('services', 'updated_at')
    op.drop_column('services', 'created_at')

    # ── products ─────────────────────────────────────────────────────────────
    op.alter_column('products', 'price',
        existing_type=sa.Numeric(precision=10, scale=2),
        type_=sa.DOUBLE_PRECISION(precision=53),
        existing_nullable=False,
        postgresql_using='price::double precision',
    )
    op.drop_column('products', 'updated_at')

    # ── orders ───────────────────────────────────────────────────────────────
    op.alter_column('orders', 'total_price',
        existing_type=sa.Numeric(precision=10, scale=2),
        type_=sa.DOUBLE_PRECISION(precision=53),
        existing_nullable=False,
        postgresql_using='total_price::double precision',
    )
    op.drop_column('orders', 'updated_at')
    op.drop_column('orders', 'shipping_address')

    # ── customer_profiles ────────────────────────────────────────────────────
    op.add_column('customer_profiles', sa.Column(
        'name', sa.VARCHAR(length=120), nullable=True,
    ))
    op.execute("UPDATE customer_profiles cp SET name = (SELECT name FROM users WHERE id = cp.user_id)")
    op.alter_column('customer_profiles', 'name', nullable=False)