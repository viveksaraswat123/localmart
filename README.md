# 🛍️ LocalMart — A Local Marketplace Platform

LocalMart is a FastAPI-based web application that bridges the gap between **local shopkeepers and customers**.  
It enables sellers to list products and services online, while customers can easily browse, order items, and even hire local professionals (like plumbers, electricians, or carpenters).

---

## 🚀 Features

### 🧑‍🤝‍🧑 Users
- **Customer Registration & Login**
- **Seller/Vendor Registration & Login**

### 🛒 Products
- Add, edit, and delete products
- View available stock and expiry dates
- Product recommendations based on season/festival
- Billing system with credit/debit management

### 🧰 Services
- Book local professionals (electricians, plumbers, carpenters, etc.)
- Search services by type and location

### 🚚 Delivery
- Order delivery tracking and scheduling

---

## 🏗️ Tech Stack

| Component | Technology |
|------------|-------------|
| Backend Framework | **FastAPI** |
| Database | **SQLite / SQLAlchemy ORM** |
| Frontend | **HTML, CSS, JS, Jinja2 Templates** |
| API Schema | **Pydantic Models** |
| Deployment Ready | ✅ Render / Railway / Heroku compatible |

---

## 📂 Project Structure

LocalMart/
│
├── main.py # Entry point (FastAPI app)
├── crud.py # Database operations
├── models.py # SQLAlchemy models (DB structure)
├── schemas.py # Pydantic schemas (data validation)
├── database.py # Database connection setup
│
├── templates/ # HTML templates (Frontend UI)
│ ├── index.html
│ ├── products.html
│ ├── services.html
│ └── ...
│
├── static/ # CSS, JS, images
│ ├── style.css
│ └── script.js
│
└── README.md # Project documentation


### Future Enhancements

- Add authentication with JWT

- Add search and filter functionality for products

- Integrate online payment gateway

- Use PostgreSQL for production database

- Deploy on Render or Railway
 

### Current Update 

- ADDED JWT AND LOGIN 
- CREATED CONTACT AND ABOUTUS PAGE