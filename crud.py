from sqlalchemy.orm import Session
from fastapi import HTTPException
import models
import schemas

#user crud
def get_user_by_email(db: Session, email: str) -> models.User | None:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> models.User | None:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

#customer crud
def get_customer_profile(db: Session, user_id: int) -> models.CustomerProfile | None:
    return (
        db.query(models.CustomerProfile)
        .filter(models.CustomerProfile.user_id == user_id)
        .first()
    )

def update_customer_profile(
    db: Session,
    user_id: int,
    profile_in: schemas.CustomerProfileCreate,
) -> models.CustomerProfile:
    profile = get_customer_profile(db, user_id)

    if not profile:
        profile = models.CustomerProfile(
            user_id=user_id,
            name=profile_in.name,
            address=profile_in.address,
        )
        db.add(profile)
    else:
        profile.name    = profile_in.name
        profile.address = profile_in.address

    db.commit()
    db.refresh(profile)
    return profile

#seller crud
def get_seller_profile(db: Session, user_id: int) -> models.SellerProfile | None:
    return (
        db.query(models.SellerProfile)
        .filter(models.SellerProfile.user_id == user_id)
        .first()
    )

def update_seller_profile(
    db: Session,
    user_id: int,
    profile_in: schemas.SellerProfileCreate,
) -> models.SellerProfile:
    profile = get_seller_profile(db, user_id)

    if not profile:
        profile = models.SellerProfile(
            user_id=user_id,
            shop_name=profile_in.shop_name,
        )
        db.add(profile)
    else:
        profile.shop_name = profile_in.shop_name

    db.commit()
    db.refresh(profile)
    return profile

#products crud
def create_product(db: Session, product: models.Product) -> models.Product:
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: str | None = None,
) -> list[models.Product]:
    q = db.query(models.Product)
    if category:
        q = q.filter(models.Product.category.ilike(f"%{category}%"))
    return q.order_by(models.Product.id.desc()).offset(skip).limit(limit).all()


def get_product_by_id(db: Session, product_id: int) -> models.Product:
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def get_products_by_seller(
    db: Session,
    seller_id: int,
    skip: int = 0,
    limit: int = 100,
) -> list[models.Product]:
    return (
        db.query(models.Product)
        .filter(models.Product.seller_id == seller_id)
        .order_by(models.Product.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_product(
    db: Session,
    db_product: models.Product,
    update: schemas.ProductUpdate,
) -> models.Product:
    for key, value in update.dict(exclude_unset=True).items():
        setattr(db_product, key, value)

    if (
        db_product.category
        and "grocery" in db_product.category.lower()
        and not db_product.expiry_date
    ):
        raise HTTPException(
            status_code=400,
            detail="Expiry date is required for Grocery items",
        )

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product: models.Product) -> None:
    db.delete(product)
    db.commit()

#services crud
def create_service(db: Session, service_in: schemas.ServiceCreate) -> models.Service:
    service = models.Service(
        type=service_in.type,
        name=service_in.name,
        cost=service_in.cost,
        location=service_in.location,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service

def get_services(db: Session, skip: int = 0, limit: int = 100) -> list[models.Service]:
    return db.query(models.Service).offset(skip).limit(limit).all()


def get_service_by_id(db: Session, service_id: int) -> models.Service:
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

def update_service(
    db: Session,
    db_service: models.Service,
    update: schemas.ServiceUpdate,
) -> models.Service:
    for key, value in update.dict(exclude_unset=True).items():
        setattr(db_service, key, value)

    db.commit()
    db.refresh(db_service)
    return db_service

def delete_service(db: Session, service: models.Service) -> None:
    db.delete(service)
    db.commit()

#orders
def create_order(db: Session, order: models.Order) -> models.Order:
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def get_orders(db: Session, skip: int = 0, limit: int = 100) -> list[models.Order]:
    return (
        db.query(models.Order)
        .order_by(models.Order.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_order_by_id(db: Session, order_id: int) -> models.Order:
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def get_orders_by_user(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
) -> list[models.Order]:
    return (
        db.query(models.Order)
        .filter(models.Order.user_id == user_id)
        .order_by(models.Order.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_orders_by_seller(
    db: Session,
    seller_id: int,
    skip: int = 0,
    limit: int = 100,
) -> list[models.Order]:
    return (
        db.query(models.Order)
        .join(models.Product, models.Order.product_id == models.Product.id)
        .filter(models.Product.seller_id == seller_id)
        .order_by(models.Order.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_order(
    db: Session,
    db_order: models.Order,
    update: schemas.OrderUpdate,
) -> models.Order:
    for key, value in update.dict(exclude_unset=True).items():
        setattr(db_order, key, value)

    db.commit()
    db.refresh(db_order)
    return db_order


def delete_order(db: Session, db_order: models.Order) -> None:
    db.delete(db_order)
    db.commit()