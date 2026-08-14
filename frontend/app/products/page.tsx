"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ProductCard } from "../../components/product-card";
import { products } from "../../lib/catalog";

const filters = ["ทั้งหมด", "ไพ่ทาโรต์", "โหราศาสตร์", "จิตวิญญาณ", "พิธีกรรม"];

function ProductsContent() {
  const params = useSearchParams(); const initialCategory = params.get("category") || "ทั้งหมด"; const [category, setCategory] = useState(initialCategory); const [query, setQuery] = useState(params.get("q") || "");
  const visible = useMemo(() => products.filter((product) => (category === "ทั้งหมด" || product.category === category) && `${product.title} ${product.author} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return <main className="inner-page"><div className="page-intro"><p className="eyebrow">THE COLLECTION</p><h1>สินค้าทั้งหมด</h1><p>คัดสรรสำรับไพ่และหนังสือ เพื่อการเดินทางที่เป็นของคุณ</p></div><section className="catalog section"><div className="catalog-tools"><div className="catalog-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาสินค้า..." /></div><span>{visible.length} รายการ</span></div><div className="filter-row">{filters.map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>{visible.length ? <div className="book-grid catalog-grid">{visible.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <div className="empty-state"><span>☽</span><h2>ไม่พบสินค้าที่ค้นหา</h2><p>ลองเปลี่ยนคำค้น หรือเลือกหมวดหมู่อื่น</p></div>}</section></main>;
}

export default function ProductsPage() { return <Suspense fallback={<main className="inner-page" />}><ProductsContent /></Suspense>; }
