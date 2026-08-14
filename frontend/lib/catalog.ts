export type Product = {
  id: string;
  title: string;
  author: string;
  price: number;
  category: "ไพ่ทาโรต์" | "โหราศาสตร์" | "จิตวิญญาณ" | "พิธีกรรม";
  color: "violet" | "plum" | "blue" | "wine" | "forest" | "ink";
  symbol: string;
  badge?: string;
};

export const products: Product[] = [
  { id: "moonlit-tarot", title: "The Moonlit Tarot", author: "A. Morningstar", price: 890, category: "ไพ่ทาโรต์", color: "violet", symbol: "☾", badge: "มาใหม่" },
  { id: "reading-cards", title: "The Art of Reading Cards", author: "Maeve Blackwood", price: 645, category: "ไพ่ทาโรต์", color: "plum", symbol: "✧" },
  { id: "cosmic-cycles", title: "Cosmic Cycles", author: "Luna Ardent", price: 720, category: "โหราศาสตร์", color: "blue", symbol: "♆" },
  { id: "ritual-soul", title: "Rituals for the Soul", author: "S. Vanora", price: 590, category: "พิธีกรรม", color: "wine", symbol: "☿" },
  { id: "wild-unknown", title: "The Wild Unknown", author: "Kim Krans", price: 990, category: "ไพ่ทาโรต์", color: "forest", symbol: "☽", badge: "ขายดี" },
  { id: "birth-chart", title: "Your Birth Chart", author: "E. Hart", price: 520, category: "โหราศาสตร์", color: "ink", symbol: "✦" },
  { id: "inner-temple", title: "The Inner Temple", author: "Rhea Sol", price: 680, category: "จิตวิญญาณ", color: "plum", symbol: "◒" },
  { id: "little-oracle", title: "Little Oracle Deck", author: "N. Aster", price: 450, category: "ไพ่ทาโรต์", color: "violet", symbol: "☼" },
];

export const articles = [
  { slug: "beginner-tarot", category: "คู่มือทาโรต์", date: "12 สิงหาคม 2569", title: "เริ่มอ่านไพ่ทาโรต์ด้วยตัวเอง: 5 สิ่งที่ควรรู้", excerpt: "การเริ่มต้นอ่านไพ่ไม่ได้ต้องการพรสวรรค์ เพียงพื้นที่ให้ตัวเองได้ฟังสัญชาตญาณ", symbol: "☾", color: "violet" },
  { slug: "new-moon", category: "พิธีกรรม", date: "7 สิงหาคม 2569", title: "New Moon Ritual: ตั้งเจตนาในคืนเดือนมืด", excerpt: "พิธีกรรมเรียบง่าย 15 นาที เพื่อกลับมาเชื่อมต่อกับความตั้งใจของตัวเอง", symbol: "☿", color: "wine" },
  { slug: "major-arcana", category: "ความหมายไพ่", date: "29 กรกฎาคม 2569", title: "22 Major Arcana และการเดินทางของ The Fool", excerpt: "ทำความรู้จักบทเรียนสำคัญบนเส้นทางของผู้แสวงหา ผ่านไพ่เมเจอร์อาร์คานา", symbol: "✧", color: "blue" },
];

export const formatPrice = (price: number) => `฿${price.toLocaleString("th-TH")}`;
