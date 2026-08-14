"use client";

import { useState } from "react";
import { useShop } from "../app/providers";
import { Icon } from "./icon";

export function ChatWidget() {
  const { chat, isLoggedIn, login, sendChat } = useShop(); const [open, setOpen] = useState(false); const [text, setText] = useState("");
  const submit = (event: React.FormEvent) => { event.preventDefault(); sendChat(text); setText(""); };
  return <div className="chat-widget">
    {open && <div className="chat-panel" role="dialog" aria-label="แชตกับ ARCANA"><div className="chat-panel-head"><span><i>✦</i> ARCANA Support</span><button onClick={() => setOpen(false)} aria-label="ปิดแชต">×</button></div>
      {!isLoggedIn && <div className="guest-warning"><b>แชตในฐานะแขก</b><p>ข้อความอาจหายเมื่อเปลี่ยนอุปกรณ์ เราแนะนำให้เข้าสู่ระบบก่อนแชต</p><button onClick={login}>เข้าสู่ระบบด้วย Google</button></div>}
      <div className="chat-messages">{chat.map((message, index) => <div className={`chat-bubble ${message.by}`} key={`${message.text}-${index}`}>{message.text}</div>)}</div>
      <form className="chat-form" onSubmit={submit}><input value={text} onChange={(event) => setText(event.target.value)} placeholder="พิมพ์ข้อความ..." /><button aria-label="ส่งข้อความ"><Icon name="arrow" /></button></form>
    </div>}
    <button className="chat-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="เปิดแชต"><Icon name="chat" /><span>แชตกับเรา</span></button>
  </div>;
}
