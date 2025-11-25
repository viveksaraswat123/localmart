from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str
    role: str  # "customer" / "seller" / "admin"

class User(UserBase):
    id: int
    role: str
    model_config = ConfigDict(from_attributes=True)


class CustomerProfileBase(BaseModel):
    name: str
    address: str

class CustomerProfileCreate(CustomerProfileBase):
    pass

class CustomerProfile(CustomerProfileBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)




class SellerProfileBase(BaseModel):
    shop_name: str

class SellerProfileCreate(SellerProfileBase):
    pass

class SellerProfile(SellerProfileBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)



#product
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    quantity: int
    expiry_date: Optional[date] = None
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    """
    seller_id NOT taken from request body.
    It will come from JWT (current_user.id).
    """
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    expiry_date: Optional[date] = None
    image_url: Optional[str] = None


class Product(ProductBase):
    id: int
    seller_id: int
    model_config = ConfigDict(from_attributes=True)


class OrderBase(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(OrderBase):
    
    pass

class OrderUpdate(BaseModel):
    quantity: Optional[int] = None
    status: Optional[str] = None

class Order(OrderBase):
    id: int
    user_id: int
    total_price: float
    status: str
    model_config = ConfigDict(from_attributes=True)

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
