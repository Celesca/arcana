import type { FastifyInstance } from "fastify";

export function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    const db = await app.pg.query("SELECT 1 AS healthy");
    return { status: "ok", database: db.rows[0].healthy === 1 ? "ok" : "error", timestamp: new Date().toISOString() };
  });
}