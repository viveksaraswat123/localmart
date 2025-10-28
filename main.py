from fastapi import FastAPI, Depends, HTTPException, Request, UploadFile, File, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
import os

import crud, schemas
from database import Base, engine, get_db

app = FastAPI(title="LocalMart API")

# Create database tables
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

# ----------------- FRONTEND ROUTES -----------------
@app.get("/")
def root():
    return {"message": "Welcome to LocalMart API!"}

@app.get("/homepage", response_class=HTMLResponse)
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
def homepage(request: Request):
    return templates.TemplateResponse("profile.html", {"request": request})

@app.get("/services", response_class=HTMLResponse)
def homepage(request: Request):
    return templates.TemplateResponse("services.html", {"request": request})

@app.get("/professional_services", response_class=HTMLResponse)
def homepage(request: Request):
    return templates.TemplateResponse("professional_services.html", {"request": request})

# ----------------- CUSTOMER APIs -----------------
@app.post("/customers/", response_model=schemas.Customer, tags=["Customers"])
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)

@app.get("/customers/", response_model=list[schemas.Customer], tags=["Customers"])
def list_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)

@app.get("/customers/{id}", response_model=schemas.Customer, tags=["Customers"])
def get_customer(id: int, db: Session = Depends(get_db)):
    return crud.get_customer_by_id(db, id)

@app.put("/customers/{id}", response_model=schemas.Customer, tags=["Customers"])
def update_customer(id: int, customer: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    return crud.update_customer(db, id, customer)

@app.delete("/customers/{id}", tags=["Customers"])
def delete_customer(id: int, db: Session = Depends(get_db)):
    crud.delete_customer(db, id)
    return {"message": "Customer deleted successfully"}

# ----------------- SELLER APIs -----------------
@app.post("/sellers/", response_model=schemas.Seller, tags=["Sellers"])
def create_seller(seller: schemas.SellerCreate, db: Session = Depends(get_db)):
    return crud.create_seller(db, seller)

@app.get("/sellers/", response_model=list[schemas.Seller], tags=["Sellers"])
def list_sellers(db: Session = Depends(get_db)):
    return crud.get_sellers(db)

@app.get("/sellers/{id}", response_model=schemas.Seller, tags=["Sellers"])
def get_seller(id: int, db: Session = Depends(get_db)):
    return crud.get_seller_by_id(db, id)

@app.put("/sellers/{id}", response_model=schemas.Seller, tags=["Sellers"])
def update_seller(id: int, seller: schemas.SellerUpdate, db: Session = Depends(get_db)):
    return crud.update_seller(db, id, seller)

@app.delete("/sellers/{id}", tags=["Sellers"])
def delete_seller(id: int, db: Session = Depends(get_db)):
    crud.delete_seller(db, id)
    return {"message": "Seller deleted successfully"}

# ----------------- PRODUCT APIs -----------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/products/", response_model=schemas.Product, tags=["Products"])
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    expiry_date: date = Form(None),
    seller_id: int = Form(...),
    image: UploadFile = File(...)
):
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if image.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, and WEBP allowed")

    # Save uploaded image
    image_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(image_path, "wb") as buffer:
        buffer.write(await image.read())
    image_url = f"/uploads/{image.filename}"

    db = next(get_db())
    product_data = schemas.ProductCreate(
        name=name,
        description=description,
        price=price,
        quantity=quantity,
        expiry_date=expiry_date,
        seller_id=seller_id,
    )
    new_product = crud.create_product(db, product_data)

    if hasattr(new_product, "image_url"):
        new_product.image_url = image_url
        db.commit()
        db.refresh(new_product)
    return new_product

@app.get("/products/", response_model=list[schemas.Product], tags=["Products"])
def list_products(db: Session = Depends(get_db)):
    return crud.get_products(db)

@app.get("/products/{id}", response_model=schemas.Product, tags=["Products"])
def get_product(id: int, db: Session = Depends(get_db)):
    return crud.get_product_by_id(db, id)

@app.get("/products/seller/{seller_id}", response_model=list[schemas.Product], tags=["Products"])
def get_products_by_seller(seller_id: int, db: Session = Depends(get_db)):
    return crud.get_products_by_seller(db, seller_id)

@app.put("/products/{id}", response_model=schemas.Product, tags=["Products"])
def update_product(id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    return crud.update_product(db, id, product)

@app.delete("/products/{id}", tags=["Products"])
def delete_product(id: int, db: Session = Depends(get_db)):
    crud.delete_product(db, id)
    return {"message": "Product deleted successfully"}

# ----------------- SERVICE APIs -----------------
@app.post("/services/", response_model=schemas.Service, tags=["Services"])
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.create_service(db, service)

@app.get("/services/", response_model=list[schemas.Service], tags=["Services"])
def list_services(db: Session = Depends(get_db)):
    return crud.get_services(db)

@app.get("/services/{id}", response_model=schemas.Service, tags=["Services"])
def get_service(id: int, db: Session = Depends(get_db)):
    return crud.get_service_by_id(db, id)

@app.put("/services/{id}", response_model=schemas.Service, tags=["Services"])
def update_service(id: int, service: schemas.ServiceUpdate, db: Session = Depends(get_db)):
    return crud.update_service(db, id, service)

@app.delete("/services/{id}", tags=["Services"])
def delete_service(id: int, db: Session = Depends(get_db)):
    crud.delete_service(db, id)
    return {"message": "Service deleted successfully"}

# ----------------- ORDER APIs -----------------
@app.post("/orders/", response_model=schemas.Order, tags=["Orders"])
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_order(db, order)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/orders/", response_model=list[schemas.Order], tags=["Orders"])
def list_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)

@app.get("/orders/customer/{id}", response_model=list[schemas.Order], tags=["Orders"])
def get_orders_by_customer(id: int, db: Session = Depends(get_db)):
    return crud.get_orders_by_customer(db, id)

@app.get("/orders/seller/{id}", response_model=list[schemas.Order], tags=["Orders"])
def get_orders_by_seller(id: int, db: Session = Depends(get_db)):
    return crud.get_orders_by_seller(db, id)

@app.put("/orders/{id}", response_model=schemas.Order, tags=["Orders"])
def update_order(id: int, order: schemas.OrderUpdate, db: Session = Depends(get_db)):
    return crud.update_order(db, id, order)

@app.delete("/orders/{id}", tags=["Orders"])
def delete_order(id: int, db: Session = Depends(get_db)):
    crud.delete_order(db, id)
    return {"message": "Order deleted successfully"}
