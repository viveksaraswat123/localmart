from sqlalchemy.orm import Session
import models, schemas

# USER CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()



#CUSTOMER PROFILE CRUD
def get_customer_profile(db: Session, user_id: int):
    return db.query(models.CustomerProfile).filter(models.CustomerProfile.user_id == user_id).first()


def update_customer_profile(db: Session, user_id: int, profile_in: schemas.CustomerProfileCreate):
    profile = get_customer_profile(db, user_id)

    if not profile:
        profile = models.CustomerProfile(
            user_id=user_id,
            address=profile_in.address
        )
        db.add(profile)
    else:
        profile.address = profile_in.address

    db.commit()
    db.refresh(profile)
    return profile


#seller crud
def get_seller_profile(db: Session, user_id: int):
    return db.query(models.SellerProfile).filter(models.SellerProfile.user_id == user_id).first()


def update_seller_profile(db: Session, user_id: int, profile_in: schemas.SellerProfileCreate):
    profile = get_seller_profile(db, user_id)

    if not profile:
        profile = models.SellerProfile(
            user_id=user_id,
            shop_name=profile_in.shop_name
        )
        db.add(profile)
    else:
        profile.shop_name = profile_in.shop_name

    db.commit()
    db.refresh(profile)
    return profile

#product crud
def create_product(db: Session, product: models.Product):
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_products(db: Session):
    return db.query(models.Product).all()


def get_product_by_id(db: Session, id: int):
    return db.query(models.Product).filter(models.Product.id == id).first()


def get_products_by_seller(db: Session, seller_id: int):
    return db.query(models.Product).filter(models.Product.seller_id == seller_id).all()


def update_product(db: Session, db_product: models.Product, update_data: schemas.ProductUpdate):
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product: models.Product):
    db.delete(product)
    db.commit()


#SERVICE CRUD
def create_service(db: Session, service_in: schemas.ServiceCreate):
    service = models.Service(
        type=service_in.type,
        name=service_in.name,
        cost=service_in.cost,
        location=service_in.location
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def get_services(db: Session):
    return db.query(models.Service).all()


def get_service_by_id(db: Session, id: int):
    return db.query(models.Service).filter(models.Service.id == id).first()


def update_service(db: Session, db_service: models.Service, update: schemas.ServiceUpdate):
    for key, value in update.dict(exclude_unset=True).items():
        setattr(db_service, key, value)

    db.commit()
    db.refresh(db_service)
    return db_service


def delete_service(db: Session, service: models.Service):
    db.delete(service)
    db.commit()



#ORDER CRUD
def create_order(db: Session, order: models.Order):
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def get_orders(db: Session):
    return db.query(models.Order).all()


def get_orders_by_user(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.user_id == user_id).all()


def get_orders_by_seller(db: Session, seller_id: int):
    return (
        db.query(models.Order)
        .join(models.Product, models.Order.product_id == models.Product.id)
        .filter(models.Product.seller_id == seller_id)
        .all()
    )


def update_order(db: Session, db_order: models.Order, update: schemas.OrderUpdate):
    for key, value in update.dict(exclude_unset=True).items():
        setattr(db_order, key, value)

    db.commit()
    db.refresh(db_order)
    return db_order


def delete_order(db: Session, db_order: models.Order):
    db.delete(db_order)
    db.commit()
