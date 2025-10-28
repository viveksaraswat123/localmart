from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    address = Column(String, nullable=False)
    orders = relationship("Order", back_populates="customer")

class Seller(Base):
    __tablename__ = "sellers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    shop_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    products = relationship("Product", back_populates="seller")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    expiry_date = Column(Date, nullable=True)
    image_url = Column(String, nullable=True)  
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)

    seller = relationship("Seller", back_populates="products")
    orders = relationship("Order", back_populates="product")


class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    cost = Column(Float, nullable=False)
    location = Column(String, nullable=False)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending", nullable=False)
    customer = relationship("Customer", back_populates="orders")
    product = relationship("Product", back_populates="orders")


