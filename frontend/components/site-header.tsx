"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShop } from "../app/providers";
import { Icon } from "./icon";

export function SiteHeader() {
  const router = useRouter(); const { cart, isLoggedIn, login, logout } = useShop(); const [search, setSearch] = useState(""); const [loginOpen, setLoginOpen] = useState(false); const [authMode, setAuthMode] = useState<"login" | "register">("login"); const [mobileOpen, setMobileOpen] = useState(false);
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const submit = (event: React.FormEvent) => { event.preventDefault(); setMobileOpen(false); router.push(`/products?q=${encodeURIComponent(search)}`); };
  const openLogin = (mode: "login" | "register" = "login") => { setMobileOpen(false); setAuthMode(mode); setLoginOpen(true); };
  const completeLogin = () => { login(); setLoginOpen(false); };
  return <>
    <div className="announcement">✦ ส่งฟรีเมื่อสั่งซื้อครบ ฿1,200 <span>•</span> สมาชิกใหม่รับส่วนลด 10%</div>
    <header className="header">
      <nav className="nav" aria-label="เมนูหลัก"><button className={`mobile-menu ${mobileOpen ? "open" : ""}`} aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <span>×</span> : <Icon name="menu" />}</button><Link className="brand" href="/" aria-label="ARCANA home" onClick={() => setMobileOpen(false)}><span className="brand-mark">A</span><span>ARCANA<small>BOOKS & TAROT</small></span></Link>
        <form className="search" onSubmit={submit}><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาหนังสือ, สำรับไพ่, ผู้เขียน..." /><kbd>⌘ K</kbd></form>
        <div className="nav-actions"><Link href="/products">สินค้าทั้งหมด</Link><Link href="/articles">บทความ</Link><Link href="/admin">แดชบอร์ด</Link>{isLoggedIn ? <button className="nav-login logged-in" onClick={logout}><Icon name="user" /><span>ออกจากระบบ</span></button> : <button className="nav-login" onClick={() => openLogin()}><Icon name="user" /><span>เข้าสู่ระบบ</span></button>}<Link className="cart" href="/cart" aria-label="ตะกร้าสินค้า"><Icon name="cart" />{count > 0 && <b>{count}</b>}</Link></div>
      </nav>
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <form className="mobile-search" onSubmit={submit}><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาหนังสือและสำรับไพ่..." /><button>ค้นหา</button></form>
        <div className="mobile-links"><Link href="/products" onClick={() => setMobileOpen(false)}><span>สินค้าทั้งหมด</span><b>→</b></Link><Link href="/articles" onClick={() => setMobileOpen(false)}><span>บทความ</span><b>→</b></Link><Link href="/admin" onClick={() => setMobileOpen(false)}><span>แดชบอร์ดผู้ดูแล</span><b>→</b></Link><Link href="/cart" onClick={() => setMobileOpen(false)}><span>ตะกร้าสินค้า</span><em>{count} รายการ</em></Link></div>
        {isLoggedIn ? <button className="mobile-login secondary" onClick={() => { logout(); setMobileOpen(false); }}><Icon name="user" /> ออกจากระบบ</button> : <button className="mobile-login" onClick={() => openLogin()}><Icon name="user" /> เข้าสู่ระบบ</button>}
      </div>
    </header>
    {loginOpen && <div className="modal-backdrop auth-backdrop" role="presentation" onClick={() => setLoginOpen(false)}><section className="login-modal auth-modal" role="dialog" aria-modal="true" aria-label={authMode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setLoginOpen(false)}>×</button><span className="modal-mark">A</span><h2>{authMode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี ARCANA"}</h2><p>{authMode === "login" ? "กลับมาสู่พื้นที่ของคุณและติดตามทุกคำสั่งซื้อ" : "สมัครเพื่อบันทึกตะกร้า ประวัติคำสั่งซื้อ และบทสนทนา"}</p>
      <form className="auth-form" onSubmit={(event) => { event.preventDefault(); completeLogin(); }}>{authMode === "register" && <label>ชื่อที่แสดง<input required placeholder="ชื่อของคุณ" /></label>}<label>อีเมล หรือ เบอร์โทรศัพท์<input required type="text" placeholder="อีเมลหรือเบอร์ที่ลงทะเบียนไว้" /></label><label>รหัสผ่าน<input required type="password" minLength={6} placeholder="อย่างน้อย 6 ตัวอักษร" /></label>{authMode === "login" && <button type="button" className="forgot">ลืมรหัสผ่าน</button>}<button className="auth-submit">{authMode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี"}</button></form>
      <div className="social-divider"><span>หรือดำเนินการต่อด้วย</span></div><div className="social-buttons"><button onClick={completeLogin} aria-label="เข้าสู่ระบบด้วย Google"><span className="google-g">G</span> Google</button><button onClick={completeLogin} aria-label="เข้าสู่ระบบด้วย Facebook"><span className="facebook-f">f</span> Facebook</button></div>
      <button className="switch-auth" onClick={() => setAuthMode((mode) => mode === "login" ? "register" : "login")}>{authMode === "login" ? "ยังไม่มีบัญชี? สมัครสมาชิก" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}</button><small>ต้นแบบนี้เป็นการจำลองระบบบัญชีเท่านั้น</small></section></div>}
  </>;
}
