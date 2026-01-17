# LocalMart - A Smart Local Marketplace Platform

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


## 📂 Project Structure
```
LocalMart/
├── app/
│ ├── main.py
│ ├── core/
│ │ ├── config.py
│ │ └── security.py
│ │
│ ├── database/
│ │ ├── session.py
│ │ └── base.py
│ │
│ ├── models/
│ │ ├── user.py
│ │ ├── product.py
│ │ └── service.py
│ │
│ ├── schemas/
│ │ ├── user.py
│ │ ├── product.py
│ │ └── service.py
│ │
│ ├── crud/
│ │ ├── user.py
│ │ ├── product.py
│ │ └── service.py
│ │
│ ├── api/
│ │ └── v1/
│ │ ├── auth.py
│ │ ├── users.py
│ │ ├── products.py
│ │ └── services.py
│ │
│ ├── templates/
│ │ ├── index.html
│ │ ├── products.html
│ │ ├── services.html
│ │ ├── about.html
│ │ └── contact.html
│ │
│ └── static/
│ ├── css/
│ ├── js/
│ └── images/
│
├── tests/
├── requirements.txt
├── .env
└── README.md
```

---

## 🔐 Authentication
- JWT-based authentication implemented  
- Secure login & protected routes  
- Role-based authorization implemented  

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
## Why LocalMart?

- Helps local shops and service providers go online easily  
- Simple, fast, and secure platform built with FastAPI  
- JWT-based authentication for safe user access  
- Clean and modular code structure for easy maintenance  
- Supports products, services, and delivery in one system  
- Suitable for real-world use as well as learning projects  
- Easy to scale and deploy for future growth  


---

⭐ *If you find this project useful, consider giving it a star on GitHub!*
