"use client";

import Link from "next/link";
import { useShop } from "../app/providers";

export function CartToast() {
  const { toast } = useShop();
  if (!toast) return null;
  return (
    <div className="cart-toast-wrap" key={toast.id} role="status" aria-live="polite">
      <div className="cart-toast">
        <span className="toast-check" aria-hidden="true">✓</span>
        <div className="toast-copy"><b>เพิ่มลงตะกร้าแล้ว</b><small>{toast.symbol} {toast.title}</small></div>
        <Link href="/cart">ดูตะกร้า →</Link>
      </div>
    </div>
  );
}