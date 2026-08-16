import type { FastifyInstance } from "fastify";

type ArticleRow = {
  slug: string; category: string; date: string | null; title: string; excerpt: string;
  symbol: string; color: string; status: string; body: string | null;
};

function articleFromRow(row: ArticleRow) {
  return {
    slug: row.slug, category: row.category, date: row.date || "", title: row.title,
    excerpt: row.excerpt, symbol: row.symbol, color: row.color,
    status: row.status || "เผยแพร่", body: row.body,
  };
}

export function articleRoutes(app: FastifyInstance) {
  app.get("/articles", async () => {
    const result = await app.pg.query<ArticleRow>("SELECT * FROM articles ORDER BY created_at DESC");
    return { articles: result.rows.map(articleFromRow), count: result.rows.length };
  });

  app.get("/articles/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const result = await app.pg.query<ArticleRow>("SELECT * FROM articles WHERE slug = $1", [slug]);
    if (!result.rows[0]) return reply.code(404).send({ error: "not_found", message: "ไม่พบบทความ" });
    return articleFromRow(result.rows[0]);
  });

  app.post("/articles", { preHandler: [app.authenticate, app.requireAdmin] }, async (request, reply) => {
    const body = (request.body || {}) as Partial<ArticleRow>;
    if (!body.slug || !body.title || !body.excerpt) {
      return reply.code(400).send({ error: "invalid_input", message: "ต้องระบุ slug, title และ excerpt" });
    }
    const result = await app.pg.query<ArticleRow>(
      `INSERT INTO articles (slug, category, date, title, excerpt, symbol, color, status, body)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [body.slug, body.category || "บทความ", body.date || null, body.title, body.excerpt, body.symbol || "✦", body.color || "violet", body.status || "ฉบับร่าง", body.body || null],
    );
    return reply.code(201).send(articleFromRow(result.rows[0]));
  });

  app.put("/articles/:slug", { preHandler: [app.authenticate, app.requireAdmin] }, async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const existing = await app.pg.query("SELECT slug FROM articles WHERE slug = $1", [slug]);
    if (!existing.rows[0]) return reply.code(404).send({ error: "not_found", message: "ไม่พบบทความ" });
    const body = (request.body || {}) as Partial<ArticleRow>;
    const result = await app.pg.query<ArticleRow>(
      `UPDATE articles SET title=$1, category=$2, date=$3, excerpt=$4, symbol=$5, color=$6, status=$7, body=$8, updated_at=now() WHERE slug=$9 RETURNING *`,
      [body.title, body.category || null, body.date || null, body.excerpt || null, body.symbol, body.color, body.status, body.body || null, slug],
    );
    return articleFromRow(result.rows[0]);
  });

  app.delete("/articles/:slug", { preHandler: [app.authenticate, app.requireAdmin] }, async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const result = await app.pg.query("DELETE FROM articles WHERE slug = $1", [slug]);
    if (result.rowCount === 0) return reply.code(404).send({ error: "not_found", message: "ไม่พบบทความ" });
    return reply.code(204).send();
  });
}