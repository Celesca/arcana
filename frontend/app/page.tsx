"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "../components/product-card";
import { useShop } from "./providers";

const categories = [
  { icon: "☽", title: "ไพ่ทาโรต์", text: "สำรับไพ่สำหรับทุกเส้นทาง" },
  { icon: "✦", title: "โหราศาสตร์", text: "อ่านแผนที่แห่งดวงดาว" },
  { icon: "♆", title: "จิตวิญญาณ", text: "หนังสือเพื่อค้นพบตัวตน" },
  { icon: "☿", title: "การพยากรณ์", text: "ศาสตร์เร้นลับและสัญลักษณ์" },
  { icon: "☾", title: "พิธีกรรม", text: "เติมพลังให้ทุกวันของคุณ" },
];

function Icon({ name }: { name: "arrow" }) {
  const paths = {
    arrow: <path d="m9 18 6-6-6-6" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Home() {
  const { products } = useShop();
  const [slide, setSlide] = useState(0);
  const slides = [
    { eyebrow: "THE ARCANA COLLECTION", title: "The wisdom you seek\nis already within.", detail: "สำรวจไพ่ทาโรต์ หนังสือ และเครื่องมือสำหรับ\nการเดินทางอันลึกซึ้งของคุณ", cta: "เลือกสำรับไพ่ของคุณ", card: "THE\nHIGH\nPRIESTESS", number: "II" },
    { eyebrow: "NEW MOON EDIT", title: "A quiet ritual\nfor new beginnings.", detail: "หนังสือและสำรับไพ่คัดสรร เพื่อช่วงเวลาที่คุณ\nอยากฟังเสียงจากภายในอีกครั้ง", cta: "ค้นพบคอลเลกชัน", card: "THE\nMOON", number: "XVIII" },
    { eyebrow: "FOR CURIOUS SOULS", title: "Read the signs.\nTrust your path.", detail: "เริ่มเรียนรู้ศาสตร์ไพ่ทาโรต์ผ่านหนังสือที่เข้าใจง่าย\nและสำรับไพ่ที่งดงาม", cta: "เริ่มต้นที่นี่", card: "THE\nSTAR", number: "XVII" },
  ];
  const current = slides[slide];

  function nextSlide() { setSlide((value) => (value + 1) % slides.length); }
  useEffect(() => { const timer = window.setInterval(nextSlide, 5500); return () => window.clearInterval(timer); }, []);

  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-stars" aria-hidden="true">✦　·　✧　·　⋆　·　✦</div>
        <div className="hero-copy slide-fade" key={slide}>
          <p className="eyebrow">{current.eyebrow}</p>
          <h1>{current.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="hero-detail">{current.detail.split("\n").map((line) => <span key={line}>{line}</span>)}</p>
          <Link className="primary-button" href="/products">{current.cta}<Icon name="arrow" /></Link>
        </div>
        <div className="card-orbit" key={slide} aria-label={current.card.replaceAll("\n", " ")}>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="tarot-card"><span className="card-number">{current.number}</span><div className="card-sun">☾</div><strong>{current.card.split("\n").map((line) => <span key={line}>{line}</span>)}</strong><i>ARCANA</i><span className="card-number bottom">{current.number}</span></div>
        </div>
        <button className="hero-arrow hero-prev" onClick={() => setSlide((slide + slides.length - 1) % slides.length)} aria-label="สไลด์ก่อนหน้า">‹</button>
        <button className="hero-arrow hero-next" onClick={nextSlide} aria-label="สไลด์ถัดไป">›</button>
        <div className="hero-dots">{slides.map((_, index) => <button key={index} onClick={() => setSlide(index)} aria-label={`เลือกสไลด์ ${index + 1}`} className={index === slide ? "active" : ""} />)}</div>
      </section>

      <section className="categories section" id="categories">
        <div className="section-heading"><div><p className="eyebrow">FIND YOUR PATH</p><h2>เลือกตามสิ่งที่ใจเรียกร้อง</h2></div><Link href="/products">ดูทุกหมวดหมู่ <Icon name="arrow" /></Link></div>
        <div className="category-grid">{categories.map((category) => <Link href={`/products?category=${encodeURIComponent(category.title)}`} className="category" key={category.title}><span className="category-icon">{category.icon}</span><span><b>{category.title}</b><small>{category.text}</small></span><Icon name="arrow" /></Link>)}</div>
      </section>

      <section className="books-section section" id="new">
        <div className="section-heading"><div><p className="eyebrow">JUST ARRIVED</p><h2>มาใหม่ในห้องสมุด</h2></div><Link href="/products">เลือกชมทั้งหมด <Icon name="arrow" /></Link></div>
        <div className="book-grid">{products.slice(0, 4).map((product) => <ProductCard product={product} key={product.id} />)}</div>
      </section>
      <footer>ARCANA <span>✦</span> Books for the seekers, dreamers, and readers of signs.</footer>
    </main>
  );
}
