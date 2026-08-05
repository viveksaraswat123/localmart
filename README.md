# LocalMart

A neighbourhood marketplace API - shopkeepers list products and services, customers order directly, no commission-taking middleman platform in between.

**Live:** https://localmart-at7a.onrender.com 
**Docs:** https://localmart-at7a.onrender.com/docs

---

## What it does

- Customers browse products and local services (plumbers, electricians, etc.) and place orders
- Sellers get a dashboard to list products, manage stock, and track incoming orders
- Admins have a full panel over users, sellers, products, orders, and services
- Product images go through Cloudinary instead of being stored on the server
- Role is set at signup and drives everything downstream - registering as a `seller` auto-creates a seller profile row, `customer` gets a customer profile, both tied 1:1 to the user via SQLAlchemy relationships with cascade delete

---

## The MCP layer

`mcp/` wraps the core API as a small set of tools an AI agent can call directly - `list_products`, `check_stock`, `expiring_products`, `create_order`, `my_orders` - instead of the agent having to know REST conventions or auth headers by hand. It's a thin FastAPI app that proxies to the main API (see `mcp/tools.py`), which made it easy to bolt on without touching the core marketplace logic. Right now it's mostly a way to explore how an agent would actually operate a store — check stock, act on expiring inventory, place an order — through tool calls instead of a UI.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Backend | FastAPI + SQLAlchemy | typed models, async-ready, good OpenAPI docs for free |
| DB | PostgreSQL (Supabase) | free managed Postgres, no server to babysit |
| Auth | JWT + OAuth2PasswordBearer | role (`customer` / `seller` / `admin`) baked into the token |
| Images | Cloudinary | didn't want to manage file storage/CDN myself |
| Frontend | Jinja2 templates + vanilla JS | server-rendered, no build step |
| Deployment | Render (API) + Vercel (static frontend) | both have workable free tiers |
| Migrations | Alembic | schema changes tracked instead of `create_all()` drift |

---

## Project structure

```
localmart/
├── main.py            # routes
├── models.py           # SQLAlchemy models (User, Product, Order, Service, profiles)
├── schemas.py          # Pydantic request/response schemas
├── database.py         # engine + session
├── alembic/             # migrations
├── mcp/
│   ├── mcp_server.py    # MCP FastAPI app, tool registry
│   ├── tools.py         # tool implementations (proxy calls to main API)
│   └── config.py
├── templates/            # Jinja2 pages (homepage, dashboards, auth)
├── static/
├── uploads/
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
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

API at `http://localhost:8000`, interactive docs at `/docs`.

### Environment variables

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/localmart
SECRET_KEY=your-secret-key
SECRET_HASH_KEY=your-hash-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## API overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/products/` | Public |
| POST / PUT / DELETE | `/products/` | Seller, Admin |
| GET | `/services/` | Public |
| POST / PUT / DELETE | `/services/` | Admin |
| POST | `/orders/` | Customer |
| GET | `/orders/my` | Customer |
| GET | `/orders/seller/my` | Seller |
| GET | `/orders/` | Admin |

Full schema and try-it-out console at `/docs`.

---

## Deployment notes

Running split: API on Render, Postgres on Supabase. A couple of things that weren't obvious the first time:

- Render needs `sslmode=require` on the Supabase connection string or the engine refuses to connect
- `ALLOWED_ORIGINS` has to explicitly list every frontend origin (Vercel preview URLs included) — wildcard CORS doesn't play well with credentialed requests here
- Product images are uploaded straight to Cloudinary from the request handler, so `uploads/` is only used as a local dev fallback, not in production

---

## Known limitations

- No payment integration yet - orders are recorded, not paid for
- No test suite
- MCP tools call the REST API over HTTP rather than hitting the DB directly, so they inherit the same auth/rate limits as a normal client - fine for now, adds latency if this grows

---

## Author

**Vivek Saraswat**
[LinkedIn](https://www.linkedin.com/in/saraswat-vivek) · [GitHub](https://github.com/viveksaraswat123)
