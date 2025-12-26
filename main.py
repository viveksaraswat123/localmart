from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    Request,
    UploadFile,
    File,
    Form,
    status,
)
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from datetime import datetime, timedelta, date
from typing import Optional, List
import os
from database import Base, engine, get_db
import models
import schemas
import hashlib
import hmac
import base64
import os

DISABLE_DB = os.getenv("DISABLE_DB", "false").lower() == "true"





#APP & BASIC CONFIG

app = FastAPI(title="LocalMart API")

Base.metadata.create_all(bind=engine)

# Static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
templates = Jinja2Templates(directory="templates")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AUTH / JWT CONFIG
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-later")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


SECRET_HASH_KEY = b"LOCALMART_SECRET"

def hash_password(password: str) -> str:
    return base64.b64encode(
        hmac.new(SECRET_HASH_KEY, password.encode(), hashlib.sha256).digest()
    ).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hmac.compare_digest(hash_password(plain_password), hashed_password)






def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user_id = int(user_id)
    except:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise credentials_exception
    return user


def role_required(allowed_roles: list[str]):
    """
    Dependency to enforce role-based access.
    Usage: current_user = Depends(role_required(["seller", "admin"]))
    """

    def wrapper(current_user: models.User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: insufficient permissions",
            )
        return current_user

    return wrapper

#FRONTEND ROUTES
@app.get("/", response_class=HTMLResponse)
def homepage(request: Request):
    return templates.TemplateResponse("homepage.html", {"request": request})



@app.get("/products_page", response_class=HTMLResponse)
def products_page(request: Request):
    return templates.TemplateResponse("products.html", {"request": request})


@app.get("/about_us", response_class=HTMLResponse)
def about_us_page(request: Request):
    return templates.TemplateResponse("about_us.html", {"request": request})


@app.get("/contact", response_class=HTMLResponse)
def contact_page(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})


# ADMIN TEMPLATE ROUTES
@app.get("/admin/dashboard", response_class=HTMLResponse)
def admin_dashboard_page(request: Request):
    return templates.TemplateResponse("admin_dashboard.html", {"request": request})

@app.get("/admin/users", response_class=HTMLResponse)
def admin_users_page(request: Request):
    # You should create 'admin_users.html' in templates/
    return templates.TemplateResponse("admin_users.html", {"request": request})

@app.get("/admin/sellers", response_class=HTMLResponse)
def admin_sellers_page(request: Request):
    return templates.TemplateResponse("admin_sellers.html", {"request": request})

@app.get("/admin/products", response_class=HTMLResponse)
def admin_products_page(request: Request):
    return templates.TemplateResponse("admin_products.html", {"request": request})

@app.get("/admin/orders", response_class=HTMLResponse)
def admin_orders_page(request: Request):
    return templates.TemplateResponse("admin_orders.html", {"request": request})

@app.get("/admin/services", response_class=HTMLResponse)
def admin_services_page(request: Request):
    return templates.TemplateResponse("admin_services.html", {"request": request})


@app.get("/add-product", response_class=HTMLResponse)
def add_product_page(request: Request):
    return templates.TemplateResponse("add_product.html", {"request": request})


@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/register", response_class=HTMLResponse)
def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})


@app.get("/profile", response_class=HTMLResponse)
def profile_page(request: Request):
    return templates.TemplateResponse("profile.html", {"request": request})


@app.get("/services", response_class=HTMLResponse)
def services_page(request: Request):
    return templates.TemplateResponse("services.html", {"request": request})


@app.get("/professional_services", response_class=HTMLResponse)
def professional_services_page(request: Request):
    return templates.TemplateResponse("professional_services.html", {"request": request})


@app.get("/edit_products", response_class=HTMLResponse)
def edit_products_page(request: Request):
    return templates.TemplateResponse("edit_product.html", {"request": request})

#seller dashboard
@app.get("/seller/dashboard", response_class=HTMLResponse)
def seller_dashboard_page(request: Request):
    return templates.TemplateResponse("seller_dashboard.html", {"request": request})


# AUTH / USER APIs
@app.post("/auth/register", response_model=schemas.User, tags=["Auth"])
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Checks if email already exists
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user_in.password)

    user = models.User(
        name=user_in.name,
        email=user_in.email,
        password=hashed_password,
        role=user_in.role.lower(),  
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create default profile
    if user.role == "customer":
        customer_profile = models.CustomerProfile(
            name=user_in.name,  # REQUIRED FIELD
            address="",         
            user_id=user.id
        )
        db.add(customer_profile)

    elif user.role == "seller":
        seller_profile = models.SellerProfile(
            shop_name="",   # default
            user_id=user.id
        )
        db.add(seller_profile)

    db.commit()
    return user



@app.post("/auth/login", tags=["Auth"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm uses `username` field for email/username
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):

        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(
    data={"sub": str(user.id), "role": user.role},
    expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
)
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=schemas.User, tags=["Users"])
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user


#FOR role='customer'

@app.get(
    "/customer/profile",
    response_model=schemas.CustomerProfile,
    tags=["Customer"],
)
def get_customer_profile(
    current_user: models.User = Depends(role_required(["customer"])),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(models.CustomerProfile)
        .filter(models.CustomerProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(404, "Customer profile not found")
    return profile


@app.put(
    "/customer/profile",
    response_model=schemas.CustomerProfile,
    tags=["Customer"],
)
def update_customer_profile(
    profile_in: schemas.CustomerProfileCreate,
    current_user: models.User = Depends(role_required(["customer"])),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(models.CustomerProfile)
        .filter(models.CustomerProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        profile = models.CustomerProfile(
            user_id=current_user.id,
            address=profile_in.address,
        )
        db.add(profile)
    else:
        profile.address = profile_in.address

    db.commit()
    db.refresh(profile)
    return profile


# FOR role='seller' 

@app.get(
    "/seller/profile",
    response_model=schemas.SellerProfile,
    tags=["Seller"],
)
def get_seller_profile(
    current_user: models.User = Depends(role_required(["seller"])),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(models.SellerProfile)
        .filter(models.SellerProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(404, "Seller profile not found")
    return profile


@app.put(
    "/seller/profile",
    response_model=schemas.SellerProfile,
    tags=["Seller"],
)
def update_seller_profile(
    profile_in: schemas.SellerProfileCreate,
    current_user: models.User = Depends(role_required(["seller"])),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(models.SellerProfile)
        .filter(models.SellerProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        profile = models.SellerProfile(
            user_id=current_user.id,
            shop_name=profile_in.shop_name,
        )
        db.add(profile)
    else:
        profile.shop_name = profile_in.shop_name

    db.commit()
    db.refresh(profile)
    return profile

# PRODUCT APIs
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/products/", response_model=List[schemas.Product], tags=["Products"])
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    category: str = Form(...), 
    expiry_date: Optional[date] = Form(None),
    image: List[UploadFile] = File(...),
    current_user: models.User = Depends(role_required(["seller", "admin"])),
    db: Session = Depends(get_db),
):
    if len(image) < 3:
        raise HTTPException(400, "Minimum 3 images required")

    # Save first image as thumbnail
    thumb = image[0]
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if thumb.content_type not in allowed_types:
        raise HTTPException(400, "Only JPG/PNG/WebP allowed")

    filename = f"{int(datetime.utcnow().timestamp())}_{thumb.filename}"
    path = os.path.join(UPLOAD_DIR, filename)

    with open(path, "wb") as f:
        f.write(await thumb.read())

    image_url = f"/uploads/{filename}"

    # Expiry required only if Grocery
    if "grocery" in category.lower() and not expiry_date:
        raise HTTPException(400, "Expiry date required for Grocery items")

    product = models.Product(
        name=name,
        description=description,
        price=price,
        quantity=quantity,
        category=category,
        expiry_date=expiry_date,
        image_url=image_url,
        seller_id=current_user.id,
    )

    db.add(product)
    db.commit()
    db.refresh(product)
    return [product]


@app.get("/products/", response_model=List[schemas.Product], tags=["Products"])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.get("/products/{id}", response_model=schemas.Product, tags=["Products"])
def get_product(id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    return product


@app.get("/products/mine", response_model=List[schemas.Product], tags=["Products"])
def get_my_products(
    current_user: models.User = Depends(role_required(["seller", "admin"])),
    db: Session = Depends(get_db),
):
    return db.query(models.Product).filter(models.Product.seller_id == current_user.id).all()


@app.put("/products/{id}", response_model=schemas.Product, tags=["Products"])
def update_product(
    id: int,
    product_in: schemas.ProductUpdate,
    current_user: models.User = Depends(role_required(["seller", "admin"])),
    db: Session = Depends(get_db),
):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(404, "Product not found")

    if current_user.role != "admin" and product.seller_id != current_user.id:
        raise HTTPException(403, "Not authorized to edit this product")

    if product_in.name is not None:
        product.name = product_in.name
    if product_in.description is not None:
        product.description = product_in.description
    if product_in.price is not None:
        product.price = product_in.price
    if product_in.quantity is not None:
        product.quantity = product_in.quantity

    # NEW: category update
    if product_in.category is not None:
        product.category = product_in.category

    # NEW: expiry update
    if product_in.expiry_date is not None:
        product.expiry_date = product_in.expiry_date

    # If category is Grocery, expiry must exist
    if "grocery" in product.category.lower() and not product.expiry_date:
        raise HTTPException(400, "Grocery items must have expiry date")

    db.commit()
    db.refresh(product)
    return product


@app.delete("/products/{id}", tags=["Products"])
def delete_product(
    id: int,
    current_user: models.User = Depends(role_required(["seller", "admin"])),
    db: Session = Depends(get_db),
):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(404, "Product not found")

    if current_user.role != "admin" and product.seller_id != current_user.id:
        raise HTTPException(403, "Not authorized to delete this product")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}


@app.post("/services/", response_model=schemas.Service, tags=["Services"])
def create_service(
    service_in: schemas.ServiceCreate,
    current_user: models.User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
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


@app.get("/services/", response_model=List[schemas.Service], tags=["Services"])
def list_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()


@app.get("/services/{id}", response_model=schemas.Service, tags=["Services"])
def get_service(id: int, db: Session = Depends(get_db)):
    service = db.query(models.Service).filter(models.Service.id == id).first()
    if not service:
        raise HTTPException(404, "Service not found")
    return service


@app.put("/services/{id}", response_model=schemas.Service, tags=["Services"])
def update_service(
    id: int,
    service_in: schemas.ServiceUpdate,
    current_user: models.User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    service = db.query(models.Service).filter(models.Service.id == id).first()
    if not service:
        raise HTTPException(404, "Service not found")

    if service_in.type is not None:
        service.type = service_in.type
    if service_in.name is not None:
        service.name = service_in.name
    if service_in.cost is not None:
        service.cost = service_in.cost
    if service_in.location is not None:
        service.location = service_in.location

    db.commit()
    db.refresh(service)
    return service


@app.delete("/services/{id}", tags=["Services"])
def delete_service(
    id: int,
    current_user: models.User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    service = db.query(models.Service).filter(models.Service.id == id).first()
    if not service:
        raise HTTPException(404, "Service not found")
    db.delete(service)
    db.commit()
    return {"message": "Service deleted successfully"}


@app.post("/orders/", response_model=schemas.Order, tags=["Orders"])
def create_order(
    order_in: schemas.OrderCreate,
    current_user: models.User = Depends(role_required(["customer"])),
    db: Session = Depends(get_db),
):
    product = (
        db.query(models.Product)
        .filter(models.Product.id == order_in.product_id)
        .first()
    )
    if not product:
        raise HTTPException(404, "Product not found")

    if order_in.quantity <= 0:
        raise HTTPException(400, "Quantity must be positive")

    if order_in.quantity > product.quantity:
        raise HTTPException(400, "Not enough stock available")

    total_price = product.price * order_in.quantity

    order = models.Order(
        user_id=current_user.id,
        product_id=product.id,
        quantity=order_in.quantity,
        total_price=total_price,
        status="pending",
    )

    # Deduct stock
    product.quantity -= order_in.quantity

    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@app.get("/orders/my", response_model=List[schemas.Order], tags=["Orders"])
def get_my_orders(
    current_user: models.User = Depends(role_required(["customer", "admin"])),
    db: Session = Depends(get_db),
):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).all()


@app.get("/orders/seller/my", response_model=List[schemas.Order], tags=["Orders"])
def get_orders_for_my_products(
    current_user: models.User = Depends(role_required(["seller", "admin"])),
    db: Session = Depends(get_db),
):
    # Orders for products owned by this seller
    orders = (
        db.query(models.Order)
        .join(models.Product, models.Order.product_id == models.Product.id)
        .filter(models.Product.seller_id == current_user.id)
        .all()
    )
    return orders


@app.get("/orders/", response_model=List[schemas.Order], tags=["Orders"])
def list_all_orders(
    current_user: models.User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    return db.query(models.Order).all()


@app.put("/orders/{id}", response_model=schemas.Order, tags=["Orders"])
def update_order_status(
    id: int,
    order_update: schemas.OrderUpdate,
    current_user: models.User = Depends(role_required(["seller", "admin"])),
    db: Session = Depends(get_db),
):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(404, "Order not found")

    # Seller can only modify orders of his own products OR admin
    product = db.query(models.Product).filter(models.Product.id == order.product_id).first()
    if current_user.role != "admin" and product.seller_id != current_user.id:
        raise HTTPException(403, "You cannot modify this order")

    if order_update.status is not None:
        order.status = order_update.status
    if order_update.quantity is not None:
        order.quantity = order_update.quantity

    db.commit()
    db.refresh(order)
    return order


@app.delete("/orders/{id}", tags=["Orders"])
def delete_order(
    id: int,
    current_user: models.User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}
