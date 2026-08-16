import type { FastifyInstance } from "fastify";

type ChatRow = { id: number; user_id: number | null; by: string; text: string; created_at: Date };

function chatFromRow(row: ChatRow) {
  return { id: row.id, by: row.by, text: row.text, createdAt: new Date(row.created_at).toISOString() };
}

function botReply(text: string): string {
  const message = text.toLowerCase();
  if (/(แนะนำ|เลือก|เริ่ม)/.test(message)) return "แนะนำให้เริ่มจาก \"The Moonlit Tarot\" เลยค่า เหมาะทั้งมือใหม่และนักอ่านไพ่ ✨";
  if (/(ส่ง|จัดส่ง)/.test(message)) return "สั่งซื้อครบ ฿1,200 จัดส่งฟรีทั่วประเทศนะคะ 🚚";
  if (/(ราคา|ลด|คูปอง)/.test(message)) return "มีคูปอง MOON10 ลด 10% ใช้ได้ทันทีค่ะ 🌙";
  if (/(คืน|เปลี่ยน|รับประกัน)/.test(message)) return "เปลี่ยนสินค้าได้ภายใน 7 วันหลังได้รับของค่ะ ♻️";
  if (/(ชำระ|จ่าย)/.test(message)) return "รับชำระผ่าน QR Code (จำลอง) และจะแจ้งสถานะเมื่อตรวจสอบแล้วค่ะ";
  return "ขอบคุณที่แชทกับ ARCANA นะคะ มีอะไรให้ช่วยเพิ่มเติมไหม ☾";
}

export function chatRoutes(app: FastifyInstance) {
  app.get("/chat/messages", { preHandler: [app.authenticate] }, async (request, reply) => {
    if (!request.user) return reply.code(401).send({ error: "unauthorized" });
    const result = await app.pg.query<ChatRow>(
      "SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC",
      [request.user.id],
    );
    return { messages: result.rows.map(chatFromRow), count: result.rows.length };
  });

  app.post("/chat/messages", { preHandler: [app.authenticateOptional] }, async (request, reply) => {
    const body = (request.body || {}) as { text?: string };
    const text = String(body.text || "").trim();
    if (!text) return reply.code(400).send({ error: "text_required" });

    const by = "guest";
    const userMessage = await app.pg.query<ChatRow>(
      "INSERT INTO chat_messages (user_id, by, text) VALUES ($1, $2, $3) RETURNING *",
      [request.user?.id ?? null, by, text],
    );
    const botMessage = await app.pg.query<ChatRow>(
      "INSERT INTO chat_messages (user_id, by, text) VALUES ($1, 'support', $2) RETURNING *",
      [request.user?.id ?? null, botReply(text)],
    );
    return reply.code(201).send({ user: chatFromRow(userMessage.rows[0]), bot: chatFromRow(botMessage.rows[0]) });
  });
}