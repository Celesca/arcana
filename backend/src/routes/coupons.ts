import type { FastifyInstance } from "fastify";

type CouponRow = { code: string; discount: number; active: boolean };

export function couponRoutes(app: FastifyInstance) {
  app.get("/coupons", { preHandler: [app.authenticate, app.requireAdmin] }, async () => {
    const result = await app.pg.query<CouponRow>("SELECT code, discount, active FROM coupons ORDER BY created_at DESC");
    return { coupons: result.rows, count: result.rows.length };
  });

  app.get("/coupons/:code", async (request, reply) => {
    const { code } = request.params as { code: string };
    const result = await app.pg.query<CouponRow>("SELECT code, discount, active FROM coupons WHERE code = $1", [code.toUpperCase()]);
    const coupon = result.rows[0];
    if (!coupon || !coupon.active) {
      return reply.code(404).send({ error: "invalid_coupon", message: "คูปองไม่ถูกต้องหรือหมดอายุแล้ว" });
    }
    return coupon;
  });

  app.post("/coupons", { preHandler: [app.authenticate, app.requireAdmin] }, async (request, reply) => {
    const body = (request.body || {}) as Partial<CouponRow>;
    const code = String(body.code || "").trim().toUpperCase();
    const discount = Number(body.discount);
    if (!code || !Number.isFinite(discount) || discount < 1 || discount > 100) {
      return reply.code(400).send({ error: "invalid_input", message: "ระบุรหัสคูปองและส่วนลด 1–100%" });
    }
    const existing = await app.pg.query("SELECT code FROM coupons WHERE code = $1", [code]);
    if (existing.rows.length > 0) {
      return reply.code(409).send({ error: "duplicate", message: "รหัสคูปองนี้มีอยู่แล้ว" });
    }
    const result = await app.pg.query<CouponRow>(
      "INSERT INTO coupons (code, discount, active) VALUES ($1,$2,$3) RETURNING code, discount, active",
      [code, discount, (body.active ?? true)],
    );
    return reply.code(201).send(result.rows[0]);
  });

  app.patch("/coupons/:code", { preHandler: [app.authenticate, app.requireAdmin] }, async (request, reply) => {
    const { code } = request.params as { code: string };
    const body = (request.body || {}) as Partial<CouponRow>;
    const result = await app.pg.query<CouponRow>(
      `UPDATE coupons SET discount = COALESCE($1, discount), active = COALESCE($2, active) WHERE code = $3 RETURNING code, discount, active`,
      [body.discount ?? null, body.active ?? null, code.toUpperCase()],
    );
    if (!result.rows[0]) return reply.code(404).send({ error: "not_found", message: "ไม่พบคูปอง" });
    return result.rows[0];
  });
}