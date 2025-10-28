from sqlalchemy.orm import Session
from models import Customer, Seller, Product, Service, Order
import models, schemas
from schemas import CustomerCreate, CustomerUpdate, SellerCreate, SellerUpdate, ProductCreate, ProductUpdate, ServiceCreate, ServiceUpdate, OrderCreate, OrderUpdate

# ----------------- CUSTOMERS -----------------
def create_customer(db: Session, customer: CustomerCreate):
    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_customers(db: Session):
    return db.query(Customer).all()

def get_customer_by_id(db: Session, id: int):
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise ValueError("Customer not found")
    return customer

def update_customer(db: Session, id: int, customer: CustomerUpdate):
    db_customer = db.query(Customer).filter(Customer.id == id).first()
    if not db_customer:
        raise ValueError("Customer not found")
    for key, value in customer.dict(exclude_unset=True).items():
        setattr(db_customer, key, value)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, id: int):
    db_customer = db.query(Customer).filter(Customer.id == id).first()
    if not db_customer:
        raise ValueError("Customer not found")
    db.delete(db_customer)
    db.commit()

# ----------------- SELLERS -----------------
def create_seller(db: Session, seller: SellerCreate):
    db_seller = Seller(**seller.dict())
    db.add(db_seller)
    db.commit()
    db.refresh(db_seller)
    return db_seller

def get_sellers(db: Session):
    return db.query(Seller).all()

def get_seller_by_id(db: Session, id: int):
    seller = db.query(Seller).filter(Seller.id == id).first()
    if not seller:
        raise ValueError("Seller not found")
    return seller

def update_seller(db: Session, id: int, seller: SellerUpdate):
    db_seller = db.query(Seller).filter(Seller.id == id).first()
    if not db_seller:
        raise ValueError("Seller not found")
    for key, value in seller.dict(exclude_unset=True).items():
        setattr(db_seller, key, value)
    db.commit()
    db.refresh(db_seller)
    return db_seller

def delete_seller(db: Session, id: int):
    db_seller = db.query(Seller).filter(Seller.id == id).first()
    if not db_seller:
        raise ValueError("Seller not found")
    db.delete(db_seller)
    db.commit()

# ----------------- PRODUCTS -----------------
def create_product(db: Session, product: ProductCreate):
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity,
        expiry_date=product.expiry_date,
        seller_id=product.seller_id,
        image_url=None
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session):
    return db.query(Product).all()

def get_product_by_id(db: Session, id: int):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise ValueError("Product not found")
    return product

def get_products_by_seller(db: Session, seller_id: int):
    return db.query(Product).filter(Product.seller_id == seller_id).all()

def update_product(db: Session, id: int, product: ProductUpdate):
    db_product = db.query(Product).filter(Product.id == id).first()
    if not db_product:
        raise ValueError("Product not found")
    for key, value in product.dict(exclude_unset=True).items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, id: int):
    db_product = db.query(Product).filter(Product.id == id).first()
    if not db_product:
        raise ValueError("Product not found")
    db.delete(db_product)
    db.commit()

# ----------------- SERVICES -----------------
def create_service(db: Session, service: ServiceCreate):
    db_service = Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def get_services(db: Session):
    return db.query(Service).all()

def get_service_by_id(db: Session, id: int):
    service = db.query(Service).filter(Service.id == id).first()
    if not service:
        raise ValueError("Service not found")
    return service

def update_service(db: Session, id: int, service: ServiceUpdate):
    db_service = db.query(Service).filter(Service.id == id).first()
    if not db_service:
        raise ValueError("Service not found")
    for key, value in service.dict(exclude_unset=True).items():
        setattr(db_service, key, value)
    db.commit()
    db.refresh(db_service)
    return db_service

def delete_service(db: Session, id: int):
    db_service = db.query(Service).filter(Service.id == id).first()
    if not db_service:
        raise ValueError("Service not found")
    db.delete(db_service)
    db.commit()

# ----------------- ORDERS -----------------
def create_order(db: Session, order: OrderCreate):
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product or product.quantity < order.quantity:
        raise ValueError("Product not available or insufficient stock")
    total_price = product.price * order.quantity
    db_order = Order(**order.dict(), total_price=total_price)
    db.add(db_order)
    product.quantity -= order.quantity  # update stock
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session):
    return db.query(Order).all()

def get_orders_by_customer(db: Session, customer_id: int):
    return db.query(Order).filter(Order.customer_id == customer_id).all()

def get_orders_by_seller(db: Session, seller_id: int):
    return (
        db.query(Order)
        .join(Product)
        .filter(Product.seller_id == seller_id)
        .all()
    )

def update_order(db: Session, id: int, order: OrderUpdate):
    db_order = db.query(Order).filter(Order.id == id).first()
    if not db_order:
        raise ValueError("Order not found")
    for key, value in order.dict(exclude_unset=True).items():
        setattr(db_order, key, value)
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, id: int):
    db_order = db.query(Order).filter(Order.id == id).first()
    if not db_order:
        raise ValueError("Order not found")
    db.delete(db_order)
    db.commit()
