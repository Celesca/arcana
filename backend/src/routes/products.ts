import type { FastifyInstance } from "fastify";

export const PRODUCT_CATEGORIES = ["ไพ่ทาโรต์", "โหราศาสตร์", "จิตวิญญาณ", "พิธีกรรม"];
export const PRODUCT_COLORS = ["violet", "plum", "blue", "wine", "forest", "ink"];

export const VALID_CATEGORY = new Set(PRODUCT_CATEGORIES);
export const VALID_COLOR = new Set(PRODUCT_COLORS);

type ProductRow = {
  id: string; title: string; author: string; price: number; sale_price: number | null;
  category: string; color: string; symbol: string; badge: string | null;
  description: string; stock: number; images: string[]; coupon_code: string | null;
};

type ProductDto = {
  id: string; title: string; author: string; price: number; salePrice: number | null;
  category: string; color: string; symbol: string; badge: string | null;
  description: string; stock: number; images: string[]; coupon: string | null;
};

export function productFromRow(row: ProductRow): ProductDto {
  return {
    id: row.id, title: row.title, author: row.author, price: row.price,
    salePrice: row.sale_price, category: row.category, color: row.color,
    symbol: row.symbol, badge: row.badge, description: row.description,
    stock: row.stock, images: row.images || [], coupon: row.coupon_code,
  };
}

export function productToDb(body: Partial<ProductDto>) {
  return [
    body.id || null,
    body.title || null,
    body.author || null,
    body.price ?? null,
    body.salePrice ?? null,
    body.category || null,
    body.color || "violet",
    body.symbol || "☾",
    body.badge ?? null,
    body.description || null,
    body.stock ?? null,
    body.images || [],
    body.coupon ?? null,
  ];
}

export function validateProduct(body: Partial<ProductDto>): string | null {
  if (!body.id || !String(body.id).trim()) return "id_required";
  if (!body.title || !String(body.title).trim()) return "title_required";
  if (!body.author || !String(body.author).trim()) return "author_required";
  if (typeof body.price !== "number" || body.price < 0) return "price_invalid";
  if (!body.category || !VALID_CATEGORY.has(body.category)) return "category_invalid";
  if (body.color && !VALID_COLOR.has(body.color)) return "color_invalid";
  if (typeof body.stock !== "number" || body.stock < 0) return "stock_invalid";
  if (!body.description || !String(body.description).trim()) return "description_required";
  return null;
}

export function productRoutes(app: FastifyInstance) {
  app.get("/products", async (request) => {
    const { category, q } = request.query as { category?: string; q?: string };
    const where: string[] = [];
    const params: string[] = [];
    if (category && category !== "ทั้งหมด") {
      params.push(category);
      where.push(`category = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      where.push(`(title ILIKE $${params.length} OR author ILIKE $${params.length} OR category ILIKE $${params.length})`);
    }
    const sql = `SELECT * FROM products ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC`;
    const result = await app.pg.query<ProductRow>(sql, params);
    return { products: result.rows.map(productFromRow), count: result.rows.length };
  });

  app.get("/products/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = await app.pg.query<ProductRow>("SELECT * FROM products WHERE id = $1", [id]);
    if (!result.rows[0]) return reply.code(404).send({ error: "not_found", message: "ไม่พบสินค้า" });
    return productFromRow(result.rows[0]);
  });

  app.post("/products", { preHandler: [app.authenticate, app.requireAdmin] }, async (request, reply) => {
    const body = (request.body || {}) as Partial<ProductDto>;
    const invalid = validateProduct(body);
    if (invalid) return reply.code(400).send({ error: invalid });
    const existing = await app.pg.query("SELECT id FROM products WHERE id = $1", [body.id]);
    if (existing.rows.length > 0) {
      return reply.code(409).send({ error: "duplicate", message: "มีสินค้าที่มี id นี้อยู่แล้ว" });
    }
    const [id, title, author, price, salePrice, category, color, symbol, badge, description, stock, images, coupon] = productToDb(body);
    const result = await app.pg.query<ProductRow>(
      `INSERT INTO products (id, title, author, price, sale_price, category, color, symbol, badge, description, stock, images, coupon_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [id, title, author, price, salePrice, category, color, symbol, badge, description, stock, images, coupon],
    );
    return reply.code(201).send(productFromRow(result.rows[0]));
  });

  app.put("/products/:id", { preHandler: [app.authenticate, app.requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await app.pg.query<ProductRow>("SELECT * FROM products WHERE id = $1", [id]);
    if (!existing.rows[0]) return reply.code(404).send({ error: "not_found", message: "ไม่พบสินค้า" });
    const body = (request.body || {}) as Partial<ProductDto>;
    const defined = Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined)) as Partial<ProductDto>;
    const merged: ProductDto = { ...productFromRow(existing.rows[0]), ...defined, id };
    const invalid = validateProduct(merged);
    if (invalid) return reply.code(400).send({ error: invalid });
    const [title, author, price, salePrice, category, color, symbol, badge, description, stock, images, coupon] = [
      merged.title, merged.author, merged.price, merged.salePrice, merged.category, merged.color,
      merged.symbol, merged.badge, merged.description, merged.stock, merged.images, merged.coupon,
    ];
    const result = await app.pg.query<ProductRow>(
      `UPDATE products SET title=$1, author=$2, price=$3, sale_price=$4, category=$5, color=$6, symbol=$7, badge=$8, description=$9, stock=$10, images=$11, coupon_code=$12, updated_at=now() WHERE id=$13 RETURNING *`,
      [title, author, price, salePrice, category, color, symbol, badge, description, stock, images, coupon, id],
    );
    return productFromRow(result.rows[0]);
  });

  app.delete("/products/:id", { preHandler: [app.authenticate, app.requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = await app.pg.query("DELETE FROM products WHERE id = $1", [id]);
    if (result.rowCount === 0) return reply.code(404).send({ error: "not_found", message: "ไม่พบสินค้า" });
    return reply.code(204).send();
  });
}