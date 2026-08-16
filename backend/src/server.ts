import "dotenv/config";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastifyPostgres from "@fastify/postgres";
import { migrate } from "./db/migrate";
import { authRoutes } from "./routes/auth";
import { productRoutes } from "./routes/products";
import { articleRoutes } from "./routes/articles";
import { couponRoutes } from "./routes/coupons";
import { orderRoutes } from "./routes/orders";
import { chatRoutes } from "./routes/chat";
import { healthRoutes } from "./routes/health";
import type { AuthUser } from "./types";

const app = Fastify({ logger: true });

async function main() {
  const origins = process.env.CORS_ORIGIN || "*";
  await app.register(cors, { origin: origins === "*" ? true : origins.split(",") });
  await app.register(jwt, { secret: process.env.JWT_SECRET || "dev-secret-change-me" });
  await app.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL || "postgres://arcana:arcana@localhost:5432/arcana",
  });

  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await request.jwtVerify<AuthUser>();
      request.user = user;
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }
  });

  app.decorate("authenticateOptional", async (request: FastifyRequest) => {
    try {
      request.user = await request.jwtVerify<AuthUser>();
    } catch {
      void request.user;
    }
  });

  app.decorate("requireAdmin", async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || request.user.role !== "admin") {
      return reply.code(403).send({ error: "forbidden" });
    }
  });

  app.get("/", async () => ({
    name: "ARCANA Books & Tarot API",
    version: "0.1.0",
    endpoints: ["/api/health", "/api/auth/*", "/api/products", "/api/articles", "/api/coupons", "/api/orders", "/api/chat/*"],
  }));

  await app.register(async (api) => {
    api.register(healthRoutes);
    api.register(authRoutes);
    api.register(productRoutes);
    api.register(articleRoutes);
    api.register(couponRoutes);
    api.register(orderRoutes);
    api.register(chatRoutes);
  }, { prefix: "/api" });

  const port = Number(process.env.PORT || 4000);
  const host = process.env.HOST || "0.0.0.0";

  await migrate(app);
  app.log.info("Schema migrated and seed data ready: 8 products, 3 articles, 1 coupon, admin account");

  await app.listen({ port, host });
}

main().catch((error: unknown) => {
  app.log.error(error);
  process.exit(1);
});