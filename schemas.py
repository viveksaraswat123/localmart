from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

# CUSTOMERS 
class CustomerBase(BaseModel):
    name: str
    email: str
    address: str

class CustomerCreate(CustomerBase):
    pass

# For partial updates — all optional fields
class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class Customer(CustomerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# SELLERS 
class SellerBase(BaseModel):
    name: str
    shop_name: str
    email: str

class SellerCreate(SellerBase):
    pass

class SellerUpdate(BaseModel):
    name: Optional[str] = None
    shop_name: Optional[str] = None
    email: Optional[str] = None

class Seller(SellerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ----------------- PRODUCTS -----------------
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    quantity: int
    expiry_date: Optional[date] = None
    image_url: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    quantity: int
    expiry_date: Optional[date] = None
    seller_id: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    expiry_date: Optional[date] = None
    image_url: Optional[str] = None

class Product(ProductBase):
    id: int
    seller: Optional[Seller] = None
    model_config = ConfigDict(from_attributes=True)

# ----------------- SERVICES -----------------
class ServiceBase(BaseModel):
    type: str
    name: str
    cost: float
    location: str

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    cost: Optional[float] = None
    location: Optional[str] = None

class Service(ServiceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ----------------- ORDERS -----------------
class OrderBase(BaseModel):
    customer_id: int
    product_id: int
    quantity: int

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    quantity: Optional[int] = None
    status: Optional[str] = None

class Order(OrderBase):
    id: int
    total_price: float
    status: str
    model_config = ConfigDict(from_attributes=True)
