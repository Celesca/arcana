"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { articles as initialArticles, products as initialProducts, type Article, type Product } from "../lib/catalog";

type CartItem = Product & { quantity: number };
type Order = { id: string; items: CartItem[]; total: number; status: "รอชำระเงิน" | "กำลังตรวจสอบ" | "ชำระเงินแล้ว"; createdAt: string };
type ChatMessage = { by: "guest" | "support"; text: string };
export type Coupon = { code: string; discount: number; active: boolean };
type ShopContextValue = {
  cart: CartItem[]; orders: Order[]; isLoggedIn: boolean; chat: ChatMessage[]; products: Product[]; articles: Article[]; coupons: Coupon[];
  addToCart: (product: Product) => void; updateQuantity: (id: string, quantity: number) => void; checkout: () => Order | null;
  login: () => void; logout: () => void; sendChat: (text: string) => void;
  addProduct: (product: Product) => void; updateProduct: (product: Product) => void; addArticle: (article: Article) => void; addCoupon: (coupon: Coupon) => void;
};
const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([{ by: "support", text: "สวัสดีค่ะ ให้เราช่วยเลือกสำรับไพ่ หรือแนะนำหนังสือให้ไหม?" }]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [coupons, setCoupons] = useState<Coupon[]>([{ code: "MOON10", discount: 10, active: true }]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("arcana-demo-store");
    if (stored) {
      const state = JSON.parse(stored) as Pick<ShopContextValue, "cart" | "orders" | "isLoggedIn" | "chat" | "products" | "articles" | "coupons">;
      setCart(state.cart || []); setOrders(state.orders || []); setIsLoggedIn(state.isLoggedIn || false); setChat(state.chat || chat);
      const restoredProducts = state.products || initialProducts;
      setProducts(restoredProducts.map((product) => { const migrated = { ...initialProducts.find((item) => item.id === product.id), ...product } as Product; return { ...migrated, description: migrated.description || "สินค้าคัดสรรจาก ARCANA สำหรับการสำรวจและเรียนรู้ในแบบของคุณ", stock: Number.isFinite(migrated.stock) ? migrated.stock : 10 }; }));
      setArticles(state.articles || initialArticles); setCoupons(state.coupons || [{ code: "MOON10", discount: 10, active: true }]);
    }
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("arcana-demo-store", JSON.stringify({ cart, orders, isLoggedIn, chat, products, articles, coupons })); }, [cart, orders, isLoggedIn, chat, products, articles, coupons, ready]);

  const value = useMemo(() => ({
    cart, orders, isLoggedIn, chat, products, articles, coupons,
    addToCart(product: Product) { setCart((items) => { const item = items.find((entry) => entry.id === product.id); return item ? items.map((entry) => entry.id === product.id ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...items, { ...product, quantity: 1 }]; }); },
    updateQuantity(id: string, quantity: number) { setCart((items) => quantity < 1 ? items.filter((item) => item.id !== id) : items.map((item) => item.id === id ? { ...item, quantity } : item)); },
    checkout() { if (!cart.length) return null; const order = { id: `AR-${String(Date.now()).slice(-6)}`, items: cart, total: cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0), status: "รอชำระเงิน" as const, createdAt: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) }; setOrders((list) => [order, ...list]); setCart([]); return order; },
    login() { setIsLoggedIn(true); }, logout() { setIsLoggedIn(false); },
    sendChat(text: string) { if (!text.trim()) return; setChat((messages) => [...messages, { by: "guest", text: text.trim() }]); },
    addProduct(product: Product) { setProducts((items) => [product, ...items]); },
    updateProduct(product: Product) { setProducts((items) => items.map((item) => item.id === product.id ? product : item)); },
    addArticle(article: Article) { setArticles((items) => [article, ...items]); },
    addCoupon(coupon: Coupon) { setCoupons((items) => [coupon, ...items.filter((item) => item.code !== coupon.code)]); },
  }), [cart, orders, isLoggedIn, chat, products, articles, coupons]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
export function useShop() { const context = useContext(ShopContext); if (!context) throw new Error("useShop must be used inside ShopProvider"); return context; }
