# 🛍️ LocalMart — A Smart Local Marketplace Platform

**LocalMart** is a FastAPI-based local marketplace web application designed to digitally connect **local shopkeepers, service providers, and customers** on a single platform.  
It empowers small businesses to go online while enabling customers to easily browse products, place orders, and book nearby professionals such as plumbers, electricians, and carpenters.

> 🎯 **Objective:** Strengthen the local economy by providing a simple, scalable, and secure digital marketplace for local vendors and customers.

---

## 🚀 Features

### 🧑‍🤝‍🧑 User Management
- Customer Registration & Login  
- Seller / Vendor Registration & Login  
- Secure authentication using **JWT**  
- Role-based access (Customer & Seller)

---

### 🛒 Product Management
- Add, update, and delete products  
- View available stock in real time  
- Track product expiry dates  
- Product recommendations based on **season, time, and festivals**  
- Integrated billing system with credit/debit management  

---

### 🧰 Service Management
- Book local professionals (electricians, plumbers, carpenters, etc.)  
- Search services by **type and location**  
- Easy booking and scheduling interface  

---

### 🚚 Delivery Management
- Order placement and delivery scheduling  
- Delivery tracking for customers  
- Flexible delivery options based on requirements  

---

### 📄 Static Pages
- **About Us** page explaining platform vision  
- **Contact Us** page for user support and queries  

---

## 🏗️ Tech Stack

| Component | Technology |
|---------|------------|
| Backend Framework | **FastAPI** |
| Database | **SQLite (Development)** / SQLAlchemy ORM |
| Authentication | **JWT (JSON Web Tokens)** |
| Frontend | **HTML, CSS, JavaScript, Jinja2 Templates** |
| API Schema & Validation | **Pydantic** |
| Deployment Ready | ✅ Render / Railway / Heroku compatible |

---

## 📂 Project Structure

LocalMart/
│
├── main.py # FastAPI application entry point
├── database.py # Database connection & session management
├── models.py # SQLAlchemy ORM models
├── schemas.py # Pydantic schemas (request/response validation)
├── crud.py # Database CRUD operations
│
├── templates/ # Frontend HTML templates
│ ├── index.html
│ ├── products.html
│ ├── services.html
│ ├── about.html
│ ├── contact.html
│ └── ...
│
├── static/ # Static assets
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ └── script.js
│ └── images/
│
└── README.md # Project documentation


---

## 🔐 Authentication
- JWT-based authentication implemented  
- Secure login & protected routes  
- Ready for role-based authorization expansion  

---

## 📈 Future Enhancements
- Advanced product search and filtering  
- Online payment gateway integration  
- Migration to **PostgreSQL** for production  
- Admin dashboard for monitoring users, orders, and services  
- Notification system (Email / SMS)  
- Cloud deployment with CI/CD pipeline  

---

## 🆕 Current Updates
- ✅ JWT-based authentication added  
- ✅ Login & registration implemented  
- ✅ About Us and Contact Us pages created  
- ✅ Improved project structure and documentation  

---

## 💡 Why LocalMart?
- Built with **FastAPI** for high performance  
- Clean, modular, and scalable architecture  
- Suitable for academic projects, startups, and real-world deployment  
- Ideal for learning **backend development, APIs, authentication, and ORM design**

---

⭐ *If you find this project useful, consider giving it a star on GitHub!*
