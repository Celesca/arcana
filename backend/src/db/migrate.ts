import type { FastifyInstance } from "fastify";
import { SCHEMA_SQL } from "./schema";
import { SEED_ARTICLES, SEED_COUPONS, SEED_PRODUCTS, seedAdmin } from "./seed-data";

async function seed(app: FastifyInstance) {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@arcana.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "arcana123";
  const { email, passwordHash } = await seedAdmin(adminEmail, adminPassword);
  await app.pg.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO NOTHING`,
    ["ARCANA Admin", email, passwordHash],
  );

  for (const product of SEED_PRODUCTS) {
    await app.pg.query(
      `INSERT INTO products (id, title, author, price, sale_price, category, color, symbol, badge, description, stock, images, coupon_code)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO NOTHING`,
      [product.id, product.title, product.author, product.price, product.salePrice, product.category, product.color, product.symbol, product.badge, product.description, product.stock, product.images, product.coupon],
    );
  }

  for (const article of SEED_ARTICLES) {
    await app.pg.query(
      `INSERT INTO articles (slug, category, date, title, excerpt, symbol, color, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (slug) DO NOTHING`,
      [article.slug, article.category, article.date, article.title, article.excerpt, article.symbol, article.color, article.status],
    );
  }

  for (const coupon of SEED_COUPONS) {
    await app.pg.query(
      `INSERT INTO coupons (code, discount, active) VALUES ($1, $2, $3)
       ON CONFLICT (code) DO NOTHING`,
      [coupon.code, coupon.discount, coupon.active],
    );
  }
}

export async function migrate(app: FastifyInstance) {
  await app.pg.query(SCHEMA_SQL);
  await seed(app);
}