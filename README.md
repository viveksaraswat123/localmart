# LocalMart

A neighbourhood marketplace built with FastAPI. Connects local shopkeepers, service providers, and customers — no middlemen, no big platforms.

---

## What it does

Customers can browse products, place orders, and book local professionals like plumbers and electricians. Sellers get their own dashboard to manage listings and track orders. Admins oversee everything from a single panel.

---

## Stack

- **Backend** - FastAPI, SQLAlchemy, PostgreSQL
- **Auth** - JWT with role-based access (customer / seller / admin)
- **Frontend** - HTML, CSS, Vanilla JS, Jinja2 templates
- **Infra** - Docker, Docker Compose, deployable on Railway / Render

---

## Project structure

```
localmart/
├── main.py
├── models.py
├── schemas.py
├── database.py
├── templates/
│   ├── homepage.html
│   ├── products.html
│   ├── services.html
│   ├── login.html
│   ├── register.html
│   ├── admin_dashboard.html
│   └── seller_dashboard.html
├── static/
├── uploads/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env
```

---

## Running locally

**Without Docker:**
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

**With Docker:**
```bash
docker compose up --build
```

The API will be at `http://localhost:8000` and the interactive docs at `http://localhost:8000/docs`.

---

## Environment variables

Create a `.env` file in the root:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/localmart
SECRET_KEY=your-secret-key
SECRET_HASH_KEY=your-hash-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:3000
```

---

## API overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/products/` | Public |
| POST | `/products/` | Seller, Admin |
| PUT | `/products/{id}` | Seller, Admin |
| DELETE | `/products/{id}` | Seller, Admin |
| GET | `/orders/` | Admin |
| POST | `/orders/` | Customer |
| PUT | `/orders/{id}` | Seller, Admin |
| GET | `/services/` | Public |
| POST | `/services/` | Admin |

---

## Roles

- **Customer** — browse products, place orders, manage profile
- **Seller** — add and manage their own products, view orders
- **Admin** — full access to users, sellers, products, orders, services

---

## Deployment

Deployed on Railway with a managed PostgreSQL instance. Frontend on Vercel.

To deploy your own copy:
1. Push to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Add a PostgreSQL plugin
4. Set the environment variables from the table above
5. Railway picks up the `Dockerfile` and builds automatically

