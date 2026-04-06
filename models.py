from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    ForeignKey,
    Date,
    DateTime,
    CheckConstraint,
    func,
    event,
)
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("role IN ('customer', 'seller', 'admin')", name="ck_user_role"),
    )

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(120), nullable=False)
    email      = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)   
    role       = Column(String(20),  nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # relationships
    customer_profile = relationship(
        "CustomerProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    seller_profile = relationship(
        "SellerProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    orders   = relationship("Order",   back_populates="user")
    products = relationship("Product", back_populates="seller")
    services = relationship("Service", back_populates="seller")


class CustomerProfile(Base):
    __tablename__ = "customer_profiles"

    id      = Column(Integer, primary_key=True, index=True)
    address = Column(String(300), nullable=False, default="")

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    user    = relationship("User", back_populates="customer_profile")

class SellerProfile(Base):
    __tablename__ = "seller_profiles"

    id        = Column(Integer, primary_key=True, index=True)
    shop_name = Column(String(150), nullable=False, default="")
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    user    = relationship("User", back_populates="seller_profile")


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price >= 0",    name="ck_product_price"),
        CheckConstraint("quantity >= 0", name="ck_product_qty"),
    )

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(200), nullable=False)
    description = Column(String(1000), nullable=False)
    price       = Column(Numeric(10, 2), nullable=False)   
    quantity    = Column(Integer, nullable=False)
    category    = Column(String(50), nullable=False, index=True)
    expiry_date = Column(Date, nullable=True)
    image_url   = Column(String(500), nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at  = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    seller    = relationship("User", back_populates="products")
    orders    = relationship("Order", back_populates="product")


class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("quantity > 0",  name="ck_order_qty"),
        CheckConstraint("total_price >= 0", name="ck_order_total_price"),
        CheckConstraint(
            "status IN ('pending', 'processing', 'delivered', 'cancelled')",
            name="ck_order_status",
        ),
    )

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer, ForeignKey("users.id",    ondelete="CASCADE"), nullable=False)
    product_id      = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity        = Column(Integer, nullable=False)
    total_price     = Column(Numeric(10, 2), nullable=False)   
    shipping_address = Column(String(300), nullable=False)     
    status          = Column(String(20), nullable=False, default="pending")
    created_at      = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at      = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user    = relationship("User",    back_populates="orders")
    product = relationship("Product", back_populates="orders")


class Service(Base):
    __tablename__ = "services"
    __table_args__ = (
        CheckConstraint("cost >= 0", name="ck_service_cost"),
    )
    
    id       = Column(Integer, primary_key=True, index=True)
    type     = Column(String(50),  nullable=False)
    name     = Column(String(150), nullable=False)
    cost     = Column(Numeric(10, 2), nullable=False)           
    location = Column(String(200), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)  # FIX: connected to seller
    seller    = relationship("User", back_populates="services")