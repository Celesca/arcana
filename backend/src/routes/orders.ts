import type { FastifyInstance } from "fastify";

const VALID_STATUSES = new Set(["รอชำระเงิน", "กำลังตรวจสอบ", "ชำระเงินแล้ว"]);

type OrderRow = {
  id: string; user_id: number | null; items: { productId: string; title: string; price: number; quantity: number }[];
  total: number; status: string; created_at: Date;
};

function orderFromRow(row: OrderRow) {
  return {
    id: row.id, items: row.items, total: row.total, status: row.status,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : "",
  };
}

type OrderItemInput = { productId: string; quantity: number };

export function orderRoutes(app: FastifyInstance) {
  app.post("/orders", { preHandler: [app.authenticate] }, async (request, reply) => {
    const body = (request.body || {}) as { items?: OrderItemInput[] };
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return reply.code(400).send({ error: "items_required", message: "กรุณาระบุสินค้าในคำสั่งซื้อ" });
    }
    const client = await app.pg.connect();
    try {
      await client.query("BEGIN");
      const items: { productId: string; title: string; price: number; quantity: number }[] = [];
      let total = 0;
      for (const input of body.items) {
        const productId = String(input.productId || "");
        const quantity = Math.max(1, Math.floor(Number(input.quantity) || 1));
        const result = await client.query(
          "SELECT id, title, price, sale_price, stock FROM products WHERE id = $1 FOR UPDATE",
          [productId],
        );
        const product = result.rows[0];
        if (!product) {
          await client.query("ROLLBACK");
          return reply.code(400).send({ error: "product_not_found", message: `ไม่พบสินค้า: ${productId}` });
        }
        if (product.stock < quantity) {
          await client.query("ROLLBACK");
          return reply.code(409).send({ error: "out_of_stock", message: `สินค้า "${product.title}" มีสต็อกไม่พอ` });
        }
        const price = product.sale_price ?? product.price;
        total += price * quantity;
        items.push({ productId: product.id, title: product.title, price, quantity });
        await client.query("UPDATE products SET stock = stock - $1, updated_at = now() WHERE id = $2", [quantity, product.id]);
      }
      const id = `AR-${String(Date.now()).slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
      const created = await client.query<OrderRow>(
        "INSERT INTO orders (id, user_id, items, total, status) VALUES ($1,$2,$3,$4,'รอชำระเงิน') RETURNING id, user_id, items, total, status, created_at",
        [id, request.user!.id, JSON.stringify(items), total],
      );
      await client.query("COMMIT");
      return reply.code(201).send(orderFromRow(created.rows[0]));
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.get("/orders", { preHandler: [app.authenticate] }, async (request, reply) => {
    if (!request.user) return reply.code(401).send({ error: "unauthorized" });
    const result = request.user.role === "admin"
      ? await app.pg.query<OrderRow>("SELECT * FROM orders ORDER BY created_at DESC")
      : await app.pg.query<OrderRow>("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [request.user.id]);
    return { orders: result.rows.map(orderFromRow), count: result.rows.length };
  });

  app.get("/orders/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = await app.pg.query<OrderRow>("SELECT * FROM orders WHERE id = $1", [id]);
    const order = result.rows[0];
    if (!order) return reply.code(404).send({ error: "not_found", message: "ไม่พบคำสั่งซื้อ" });
    if (request.user!.role !== "admin" && order.user_id !== request.user!.id) {
      return reply.code(403).send({ error: "forbidden" });
    }
    return orderFromRow(order);
  });

  app.patch("/orders/:id/status", { preHandler: [app.authenticate, app.requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = (request.body || {}) as { status?: string };
    if (!body.status || !VALID_STATUSES.has(body.status)) {
      return reply.code(400).send({ error: "invalid_status", message: "สถานะไม่ถูกต้อง" });
    }
    const result = await app.pg.query<OrderRow>(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, user_id, items, total, status, created_at",
      [body.status, id],
    );
    if (!result.rows[0]) return reply.code(404).send({ error: "not_found", message: "ไม่พบคำสั่งซื้อ" });
    return orderFromRow(result.rows[0]);
  });
}