"use client";

import { useShop } from "../app/providers";
import { formatPrice, type Product } from "../lib/catalog";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useShop();
  return <article className="book"><Link href={`/products/${product.id}`} className={`book-cover ${product.color}`}>{product.badge && <span className="product-badge">{product.badge}</span>}<span className="cover-sigil">{product.symbol}</span><span className="cover-line" /><h3>{product.title}</h3><small>ARCANA PRESS</small></Link><div className="book-info"><p>{product.author}</p><div><span className="card-price">{product.salePrice && <del>{formatPrice(product.price)}</del>}<b>{formatPrice(product.salePrice || product.price)}</b></span><button onClick={() => addToCart(product)} aria-label={`เพิ่ม ${product.title} ลงตะกร้า`}>+</button></div></div></article>;
}
