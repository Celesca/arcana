# Arcana — Books & Tarot

A mystical bookshop web app: a Next.js storefront (Thai, UTF-8) plus a
Fastify + PostgreSQL API. Customers browse tarot decks and esoteric books,
and admins manage products, articles, and coupons.

```
┌──────────────┐      HTTP /api/*      ┌──────────────┐     SQL     ┌──────────────┐
│  frontend    │ ─────────────────────►│   backend    │ ──────────► │  PostgreSQL  │
│  Next.js 15  │                       │  Fastify 5   │             │   16         │
│  port 3000   │ ◄─────────────────────│  port 4000   │ ◄────────── │              │
└──────────────┘         JSON           └──────────────┘             └──────────────┘
```

## Features

- **Storefront** (`/`): hero carousel, categories, "just arrived" products.
- **Catalog** (`/products`): filter by category, full-text search.
- **Product detail** (`/products/[id]`): gallery, quantity, add to cart,
  related products, coupon highlight.
- **Articles** (`/articles`): journal list (SEO-oriented content).
- **Cart & orders** (`/cart`): quantity management, mock checkout, order history
  with status (`รอชำระเงิน`, `กำลังตรวจสอบ`, `ชำระเงินแล้ว`).
- **Admin** (`/admin`): stats + management of products, articles, coupons.
- **Chat widget**: support chat (guest or logged in).
- **Auth**: register/login, stateless JWT, admin-protected routes.

> Note: the frontend currently runs a client-side demo store (localStorage,
> key `arcana-demo-store`) seeded from `frontend/lib/catalog.ts`. The backend
> API is ready and is the source of truth for production; wiring the frontend
> to it is documented below under "Wiring the frontend to the API".

## Tech stack

| Layer     | Tools                                                        |
|-----------|--------------------------------------------------------------|
| Frontend  | Next.js 15 (App Router), React 19, TypeScript                |
| Backend   | Fastify 5, TypeScript, `@fastify/postgres`, `@fastify/jwt`, `bcryptjs` |
| Database  | PostgreSQL 16                                                |
| Deploy    | Docker Compose (one VPS), Alpine images, multi-stage builds  |

## Run the full stack with Docker (recommended for a VM/VPS)

Prerequisites: Docker + Docker Compose.

```sh
docker compose up --build -d
```

- Frontend: http://localhost:3000
- API:      http://localhost:4000
- Health:   http://localhost:4000/api/health

Stop / view logs:

```sh
docker compose down        # keep the database volume
docker compose logs -f api
```

Data persists in a named volume (`pgdata`). To reset:

```sh
docker compose down -v
docker compose up --build -d
```

### Environment variables (docker-compose)

| Variable                      | Default            | Meaning                            |
|-------------------------------|--------------------|------------------------------------|
| `POSTGRES_USER` / `_PASSWORD` / `_DB` | `arcana`    | Database credentials               |
| `DATABASE_URL`                | `postgres://arcana:arcana@db:5432/arcana` | API → DB connection |
| `JWT_SECRET`                  | `change-me-in-production` | Signing secret (set it!)    |
| `CORS_ORIGIN`                 | `*`                | Comma-separated allowed origins    |
| `SEED_ADMIN_EMAIL` / `_PASSWORD` | `admin@arcana.local` / `arcana123` | Seed admin account |

## Run locally (dev)

### 1. Frontend

```sh
cd frontend
npm install
npm run dev      # http://localhost:3000
```

### 2. Backend + PostgreSQL

Local Postgres or the DB service from compose:

```sh
cd backend
cp .env.example .env       # edit DATABASE_URL to point at your Postgres
npm install
npm run dev                # http://localhost:4000
```

On every start the API runs idempotent migrations + seed (tables, 8 products,
3 articles, coupon `MOON10`, and the admin account). No manual DB step.

Default seed admin: `admin@arcana.local` / `arcana123`.

## API reference

Base URL: `http://localhost:4000/api`

### Health

| Method | Path            | Auth  | Description        |
|--------|-----------------|-------|--------------------|
| GET    | `/health`       | —     | `{ status: "ok" }` |

### Auth

| Method | Path         | Auth | Description                          |
|--------|--------------|------|--------------------------------------|
| POST   | `/auth/register` | — | `{ name, email, password }` → token |
| POST   | `/auth/login`| —     | `{ email, password }` → token         |
| GET    | `/auth/me`   | ✔     | Current user profile                  |

Send the token as `Authorization: Bearer <token>`.

### Products

| Method | Path                    | Auth         | Description                |
|--------|-------------------------|--------------|----------------------------|
| GET    | `/products`             | —            | List; `?category=` `?q=`    |
| GET    | `/products/:id`         | —            | Single product              |
| POST   | `/products`             | admin        | Create product              |
| PUT    | `/products/:id`         | admin        | Update product              |
| DELETE | `/products/:id`         | admin        | Delete product              |

### Articles

| Method | Path              | Auth         | Description         |
|--------|-------------------|--------------|---------------------|
| GET    | `/articles`       | —            | List articles       |
| GET    | `/articles/:slug` | —            | Single article      |
| POST   | `/articles`       | admin        | Create article      |
| PUT    | `/articles/:slug` | admin        | Update article      |
| DELETE | `/articles/:slug` | admin        | Delete article      |

### Coupons

| Method | Path           | Auth  | Description                  |
|--------|----------------|-------|------------------------------|
| GET    | `/coupons`     | admin | List all coupons             |
| GET    | `/coupons/:code` | —   | Validate a coupon code       |
| POST   | `/coupons`     | admin | Create coupon                |

### Orders

| Method | Path                | Auth | Description                              |
|--------|---------------------|------|------------------------------------------|
| POST   | `/orders`           | ✔    | `{ items: [{ productId, quantity }] }` → order |
| GET    | `/orders`           | ✔    | Current user's orders                    |
| GET    | `/orders/:id`       | ✔    | Order detail (own or admin)              |
| PATCH  | `/orders/:id/status`| admin | `{ status }` update                      |

Placing an order checks stock, decrements it, and computes the total
server-side (sale price is used when present).

### Chat

| Method | Path                  | Auth | Description                          |
|--------|-----------------------|------|--------------------------------------|
| GET    | `/chat/messages`      | ✔    | Message history (auto-generated bot replies) |
| POST   | `/chat/messages`      | —    | `{ text }` → message + bot reply     |

## Project structure

```
├── frontend/            # Next.js 15 (App Router)
│   ├── app/             # pages: home, catalog, detail, articles, cart, admin
│   ├── components/      # header, chat widget, cards
│   └── lib/catalog.ts   # types + demo seed data
├── backend/
│   ├── src/server.ts    # Fastify bootstrap (CORS, JWT, pg, routes)
│   ├── src/routes/      # auth, products, articles, coupons, orders, chat, health
│   ├── src/db/          # schema DDL + idempotent seed (runs on startup)
│   └── Dockerfile
└── docker-compose.yml   # db + api + frontend for one VPS
```

## Database schema

- `users` — `id, name, email, password_hash, role (customer|admin), created_at`
- `products` — `id, title, author, price, sale_price, category, color, symbol,
  badge, description, stock, images text[], coupon_code, created_at, updated_at`
- `articles` — `slug, category, date, title, excerpt, symbol, color, status, body`
- `coupons` — `code, discount, active, created_at`
- `orders` — `id, user_id, items jsonb, total, status, created_at`
- `chat_messages` — `id, user_id, by, text, created_at`

## Wiring the frontend to the API (guide)

`frontend/app/providers.tsx` currently hydrates from `lib/catalog.ts` and
localStorage. To move to live data:

1. Fetch `GET /api/products` and `GET /api/articles` in `ShopProvider` and
   merge over the seed (keep `initialProducts` as fallback).
2. Replace the mock `login()` with `POST /api/auth/login` and store the token;
   send it as `Authorization: Bearer <token>`.
3. Replace `checkout()` with `POST /api/orders`, then refresh
   `GET /api/orders`.
4. Admin actions map to the admin-guarded endpoints above.

## Deployment to a VPS

1. Point DNS `A` records at your VM; open ports 3000 and 4000 (or put an nginx
   reverse proxy in front).
2. `git clone` the repo on the server.
3. Set `JWT_SECRET` (and `CORS_ORIGIN`) in the environment or an `.env` file
   next to `docker-compose.yml`.
4. `docker compose up --build -d`.
5. Optional: add a `frontend`/`api` service (nginx) in front for one domain on
   port 80/443.