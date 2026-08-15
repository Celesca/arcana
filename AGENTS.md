# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## Project overview

ARCANA — Books & Tarot is a mystical bookshop web app (Next.js + React) with a
Fastify + PostgreSQL API. The storefront and admin dashboard are in Thai
(UTF-8). The frontend currently runs fully client-side (mock state in
localStorage); the backend API is the source of truth for production data.

## Repository layout

```
.
├── frontend/             # Next.js 15 app (App Router)
│   ├── app/              # routes: /, /products, /products/[id], /articles, /cart, /admin
│   ├── components/       # header, chat widget, product cards, article list
│   └── lib/catalog.ts    # types + seed data (Product, Article, formatPrice)
├── backend/              # Fastify 5 + PostgreSQL API (TypeScript)
│   ├── src/server.ts     # app bootstrap
│   ├── src/routes/       # auth, products, articles, coupons, orders, chat, health
│   ├── src/db/           # schema DDL, migrations, seed data
│   └── Dockerfile        # production image
└── docker-compose.yml    # full stack for a VPS: db + api + frontend
```

## Commands

Frontend:

```sh
cd frontend
npm run dev     # http://localhost:3000
npm run build
npm run start
```

Backend (needs a running Postgres — either local or `docker compose`):

```sh
cd backend
cp .env.example .env        # adjust DATABASE_URL
npm run dev                 # tsx watch, http://localhost:4000
npm run build               # tsc -> dist/
npm run start               # node dist/server.js
```

Schema is auto-migrated and seeded on API startup (idempotent), no manual step.

Full stack on Docker (VPS):

```sh
docker compose up --build -d
```

## Frontend data layer (important)

All store state lives in `frontend/app/providers.tsx` (`ShopProvider`):
`cart`, `orders`, `isLoggedIn`, `chat`, `products`, `articles`, `coupons`.
It is hydrates from `frontend/lib/catalog.ts` and persists to
localStorage key `arcana-demo-store`. The API is not yet wired into the
frontend — `lib/catalog.ts` remains the seed/demo source. When wiring the API,
prefer `fetch` to `/api/...` endpoints documented in `README.md` and keep the
localStorage fallback for offline/demo mode.

## Backend conventions

- Fastify v5 in `backend/src`. CommonJS + TypeScript, build with `tsc`.
- Routes are registered under `/api` prefix. Each resource has its own route
  module in `src/routes/`.
- DB access via `@fastify/postgres` (`app.pg.query` / `app.pg.connect`).
- Auth: password hashed with `bcryptjs`, stateless JWT via `@fastify/jwt`.
  `app.authenticate` and `app.requireAdmin` pre-handlers protect routes.
- Seed admin account defaults to `admin@arcana.local` / `arcana123`
  (override via env `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).
- DB columns are `snake_case`; API responses are `camelCase`.

## Code style

- No comments unless asked; follow existing file conventions.
- UI text and user-facing strings are Thai; keep them in UTF-8.
- Colors/typography tokens live in `frontend/app/globals.css` (`--purple`,
  `--gold`, `--ink`, ...). Purples `#47215f`/`#42205f`, gold `#d9b56f`.
- Component files are often single long lines (compressed JSX); preserve that
  style when editing JSX.

## Types shared with the frontend

Derived from `frontend/lib/catalog.ts`:

- `Product`: `id, title, author, price, category, color, symbol, badge?,
  description, stock, salePrice?, images?, coupon?`
- `Article`: `slug, category, date, title, excerpt, symbol, color,
  status? ("เผยแพร่" | "ฉบับร่าง")`
- `Coupon`: `code, discount, active`
- `Order`: `id, items: CartItem[], total, status, createdAt`
- Product categories: `ไพ่ทาโรต์ | โหราศาสตร์ | จิตวิญญาณ | พิธีกรรม`
- Product colors: `violet | plum | blue | wine | forest | ink`
- Order statuses: `รอชำระเงิน | กำลังตรวจสอบ | ชำระเงินแล้ว`