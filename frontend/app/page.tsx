"use client";

import { useState } from "react";

const categories = [
  { icon: "☽", title: "ไพ่ทาโรต์", text: "สำรับไพ่สำหรับทุกเส้นทาง" },
  { icon: "✦", title: "โหราศาสตร์", text: "อ่านแผนที่แห่งดวงดาว" },
  { icon: "♆", title: "จิตวิญญาณ", text: "หนังสือเพื่อค้นพบตัวตน" },
  { icon: "☿", title: "การพยากรณ์", text: "ศาสตร์เร้นลับและสัญลักษณ์" },
  { icon: "☾", title: "พิธีกรรม", text: "เติมพลังให้ทุกวันของคุณ" },
];

const books = [
  { title: "The Moonlit Tarot", author: "A. Morningstar", price: "฿890", color: "violet", symbol: "☾" },
  { title: "The Art of Reading Cards", author: "Maeve Blackwood", price: "฿645", color: "plum", symbol: "✧" },
  { title: "Cosmic Cycles", author: "Luna Ardent", price: "฿720", color: "blue", symbol: "♆" },
  { title: "Rituals for the Soul", author: "S. Vanora", price: "฿590", color: "wine", symbol: "☿" },
];

function Icon({ name }: { name: "search" | "cart" | "user" | "menu" | "arrow" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    cart: <><path d="M3 4h2l2.5 11h10L20 7H6" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    arrow: <path d="m9 18 6-6-6-6" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const slides = [
    { eyebrow: "THE ARCANA COLLECTION", title: "The wisdom you seek\nis already within.", detail: "สำรวจไพ่ทาโรต์ หนังสือ และเครื่องมือสำหรับ\nการเดินทางอันลึกซึ้งของคุณ", cta: "เลือกสำรับไพ่ของคุณ", card: "THE\nHIGH\nPRIESTESS", number: "II" },
    { eyebrow: "NEW MOON EDIT", title: "A quiet ritual\nfor new beginnings.", detail: "หนังสือและสำรับไพ่คัดสรร เพื่อช่วงเวลาที่คุณ\nอยากฟังเสียงจากภายในอีกครั้ง", cta: "ค้นพบคอลเลกชัน", card: "THE\nMOON", number: "XVIII" },
    { eyebrow: "FOR CURIOUS SOULS", title: "Read the signs.\nTrust your path.", detail: "เริ่มเรียนรู้ศาสตร์ไพ่ทาโรต์ผ่านหนังสือที่เข้าใจง่าย\nและสำรับไพ่ที่งดงาม", cta: "เริ่มต้นที่นี่", card: "THE\nSTAR", number: "XVII" },
  ];
  const current = slides[slide];

  function nextSlide() { setSlide((value) => (value + 1) % slides.length); }

  return (
    <main>
      <div className="announcement">✦ ส่งฟรีเมื่อสั่งซื้อครบ ฿1,200 <span>•</span> สมาชิกใหม่รับส่วนลด 10%</div>
      <header className="header">
        <div className="utility"><span>THE MYSTIC&apos;S LIBRARY</span><div><a href="#about">เรื่องราวของเรา</a><button className="login"><Icon name="user" /> เข้าสู่ระบบ</button></div></div>
        <nav className="nav" aria-label="เมนูหลัก">
          <button className="mobile-menu" aria-label="เปิดเมนู"><Icon name="menu" /></button>
          <a className="brand" href="#top" aria-label="ARCANA home"><span className="brand-mark">A</span><span>ARCANA<small>BOOKS & TAROT</small></span></a>
          <div className="search"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาหนังสือ, สำรับไพ่, ผู้เขียน..." /><kbd>⌘ K</kbd></div>
          <div className="nav-actions"><a href="#categories">หมวดหมู่</a><a href="#new">มาใหม่</a><button className="cart" aria-label="ตะกร้าสินค้า"><Icon name="cart" />{cartCount > 0 && <b>{cartCount}</b>}</button></div>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-stars" aria-hidden="true">✦　·　✧　·　⋆　·　✦</div>
        <div className="hero-copy">
          <p className="eyebrow">{current.eyebrow}</p>
          <h1>{current.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="hero-detail">{current.detail.split("\n").map((line) => <span key={line}>{line}</span>)}</p>
          <a className="primary-button" href="#new">{current.cta}<Icon name="arrow" /></a>
        </div>
        <div className="card-orbit" aria-label={current.card.replaceAll("\n", " ")}>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="tarot-card"><span className="card-number">{current.number}</span><div className="card-sun">☾</div><strong>{current.card.split("\n").map((line) => <span key={line}>{line}</span>)}</strong><i>ARCANA</i><span className="card-number bottom">{current.number}</span></div>
        </div>
        <button className="hero-arrow hero-prev" onClick={() => setSlide((slide + slides.length - 1) % slides.length)} aria-label="สไลด์ก่อนหน้า">‹</button>
        <button className="hero-arrow hero-next" onClick={nextSlide} aria-label="สไลด์ถัดไป">›</button>
        <div className="hero-dots">{slides.map((_, index) => <button key={index} onClick={() => setSlide(index)} aria-label={`เลือกสไลด์ ${index + 1}`} className={index === slide ? "active" : ""} />)}</div>
      </section>

      <section className="categories section" id="categories">
        <div className="section-heading"><div><p className="eyebrow">FIND YOUR PATH</p><h2>เลือกตามสิ่งที่ใจเรียกร้อง</h2></div><a href="#all">ดูทุกหมวดหมู่ <Icon name="arrow" /></a></div>
        <div className="category-grid">{categories.map((category) => <a href="#all" className="category" key={category.title}><span className="category-icon">{category.icon}</span><span><b>{category.title}</b><small>{category.text}</small></span><Icon name="arrow" /></a>)}</div>
      </section>

      <section className="books-section section" id="new">
        <div className="section-heading"><div><p className="eyebrow">JUST ARRIVED</p><h2>มาใหม่ในห้องสมุด</h2></div><a href="#all">เลือกชมทั้งหมด <Icon name="arrow" /></a></div>
        <div className="book-grid">{books.map((book) => <article className="book" key={book.title}><div className={`book-cover ${book.color}`}><span className="cover-sigil">{book.symbol}</span><span className="cover-line" /><h3>{book.title}</h3><small>ARCANA PRESS</small></div><div className="book-info"><p>{book.author}</p><div><b>{book.price}</b><button onClick={() => setCartCount((count) => count + 1)} aria-label={`เพิ่ม ${book.title} ลงตะกร้า`}>+</button></div></div></article>)}</div>
      </section>
      <footer>ARCANA <span>✦</span> Books for the seekers, dreamers, and readers of signs.</footer>
    </main>
  );
}
