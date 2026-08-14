"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShop } from "../app/providers";
import { Icon } from "./icon";

export function SiteHeader() {
  const router = useRouter(); const { cart, isLoggedIn, login, logout } = useShop(); const [search, setSearch] = useState(""); const [loginOpen, setLoginOpen] = useState(false);
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const submit = (event: React.FormEvent) => { event.preventDefault(); router.push(`/products?q=${encodeURIComponent(search)}`); };
  return <>
    <div className="announcement">✦ ส่งฟรีเมื่อสั่งซื้อครบ ฿1,200 <span>•</span> สมาชิกใหม่รับส่วนลด 10%</div>
    <header className="header"><div className="utility"><span>THE MYSTIC&apos;S LIBRARY</span><div><Link href="/articles">บทความและแรงบันดาลใจ</Link>{isLoggedIn ? <button className="login" onClick={logout}><Icon name="user" /> ออกจากระบบ</button> : <button className="login" onClick={() => setLoginOpen(true)}><Icon name="user" /> เข้าสู่ระบบ</button>}</div></div>
      <nav className="nav" aria-label="เมนูหลัก"><button className="mobile-menu" aria-label="เปิดเมนู"><Icon name="menu" /></button><Link className="brand" href="/" aria-label="ARCANA home"><span className="brand-mark">A</span><span>ARCANA<small>BOOKS & TAROT</small></span></Link>
        <form className="search" onSubmit={submit}><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาหนังสือ, สำรับไพ่, ผู้เขียน..." /><kbd>⌘ K</kbd></form>
        <div className="nav-actions"><Link href="/products">สินค้าทั้งหมด</Link><Link href="/articles">บทความ</Link><Link className="cart" href="/cart" aria-label="ตะกร้าสินค้า"><Icon name="cart" />{count > 0 && <b>{count}</b>}</Link></div>
      </nav>
    </header>
    {loginOpen && <div className="modal-backdrop" role="presentation" onClick={() => setLoginOpen(false)}><section className="login-modal" role="dialog" aria-modal="true" aria-label="เข้าสู่ระบบ" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setLoginOpen(false)}>×</button><span className="modal-mark">A</span><h2>ยินดีต้อนรับกลับมา</h2><p>เข้าสู่ระบบเพื่อบันทึกตะกร้า ติดตามคำสั่งซื้อ และเก็บประวัติการแชตของคุณ</p><button className="google-button" onClick={() => { login(); setLoginOpen(false); }}><span className="google-g">G</span> ดำเนินการต่อด้วย Google</button><small>ต้นแบบนี้เป็นการจำลองการเข้าสู่ระบบเท่านั้น</small></section></div>}
  </>;
}
