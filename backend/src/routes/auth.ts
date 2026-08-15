import { compare, hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { AuthUser } from "../types";

type RegisterBody = { name: string; email: string; password: string };
type LoginBody = { email: string; password: string };

export function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (request, reply) => {
    const body = (request.body || {}) as Partial<RegisterBody>;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
      return reply.code(400).send({ error: "invalid_input", message: "กรุณากรอกข้อมูลให้ครบ: ชื่อ, อีเมล และรหัสผ่าน 6 ตัวขึ้นไป" });
    }
    const existing = await app.pg.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return reply.code(409).send({ error: "email_taken", message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }
    const passwordHash = await hash(password, 10);
    const created = await app.pg.query<AuthUser>(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,'customer') RETURNING id, name, email, role`,
      [name, email, passwordHash],
    );
    const user = created.rows[0];
    const token = app.jwt.sign(user);
    return { token, user };
  });

  app.post("/auth/login", async (request, reply) => {
    const body = (request.body || {}) as Partial<LoginBody>;
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    if (!email || !password) {
      return reply.code(400).send({ error: "missing_credentials", message: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }
    const result = await app.pg.query<{ id: number; name: string; email: string; role: string; password_hash: string }>(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
      [email],
    );
    const row = result.rows[0];
    if (!row || !(await compare(password, row.password_hash))) {
      return reply.code(401).send({ error: "invalid_credentials", message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }
    const user: AuthUser = { id: row.id, name: row.name, email: row.email, role: row.role as AuthUser["role"] };
    const token = app.jwt.sign(user);
    return { token, user };
  });

  app.get("/auth/me", { preHandler: [app.authenticate] }, async (request) => ({
    user: request.user,
  }));
}