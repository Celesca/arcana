"use client";

import { useState } from "react";
import { useShop } from "../app/providers";
import { Icon } from "./icon";

export function ChatWidget() {
  const { chat, isLoggedIn, login, sendChat } = useShop(); const [open, setOpen] = useState(false); const [expanded, setExpanded] = useState(false); const [text, setText] = useState("");
  const submit = (event: React.FormEvent) => { event.preventDefault(); sendChat(text); setText(""); };
  return <div className="chat-widget">
    {open && expanded && <button className="chat-backdrop" aria-label="ย่อหน้าต่างแชท" onClick={() => setExpanded(false)} />}
    {open && <div className={`chat-panel ${expanded ? "expanded" : ""}`} role="dialog" aria-label="แชทกับ ARCANA"><div className="chat-panel-head"><span><i>✦</i> ARCANA Support<small>พร้อมช่วยคุณเลือกสิ่งที่ใช่</small></span><div><button className="chat-expand" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? "ย่อหน้าต่างแชท" : "ขยายหน้าต่างแชท"}>{expanded ? "↙" : "↗"}</button><button onClick={() => { setOpen(false); setExpanded(false); }} aria-label="ปิดแชท">×</button></div></div>
      {!isLoggedIn && <div className="guest-warning"><b>แชทในฐานะแขก</b><p>ข้อความอาจหายเมื่อเปลี่ยนอุปกรณ์ เราแนะนำให้เข้าสู่ระบบก่อนแชท</p><button onClick={login}>เข้าสู่ระบบด้วย Google</button></div>}
      <div className="chat-messages">{chat.map((message, index) => <div className={`chat-bubble ${message.by}`} key={`${message.text}-${index}`}>{message.text}</div>)}</div>
      <form className="chat-form" onSubmit={submit}><input value={text} onChange={(event) => setText(event.target.value)} placeholder="พิมพ์ข้อความ..." /><button aria-label="ส่งข้อความ"><Icon name="arrow" /></button></form>
    </div>}
    <button className="chat-button" onClick={() => { setOpen((value) => !value); if (open) setExpanded(false); }} aria-expanded={open} aria-label="เปิดแชท"><Icon name="chat" /><span>แชทกับเรา</span></button>
  </div>;
}
