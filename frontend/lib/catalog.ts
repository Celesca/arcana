export type Product = {
  id: string;
  title: string;
  author: string;
  price: number;
  category: "ไพ่ทาโรต์" | "โหราศาสตร์" | "จิตวิญญาณ" | "พิธีกรรม";
  color: "violet" | "plum" | "blue" | "wine" | "forest" | "ink";
  symbol: string;
  badge?: string;
  description: string;
  stock: number;
  salePrice?: number;
  images?: string[];
  coupon?: string;
};

export const products: Product[] = [
  { id: "moonlit-tarot", title: "The Moonlit Tarot", author: "A. Morningstar", price: 890, salePrice: 790, category: "ไพ่ทาโรต์", color: "violet", symbol: "☾", badge: "มาใหม่", stock: 18, coupon: "MOON10", images: ["ปกหน้า", "ด้านหลัง", "ตัวอย่างไพ่"], description: "สำรับไพ่ทาโรต์ที่ถ่ายทอดพลังของดวงจันทร์ผ่านภาพประกอบอันละเอียดอ่อน เหมาะสำหรับทั้งผู้เริ่มต้นและนักอ่านไพ่ที่ต้องการเชื่อมต่อกับสัญชาตญาณของตัวเอง" },
  { id: "reading-cards", title: "The Art of Reading Cards", author: "Maeve Blackwood", price: 645, category: "ไพ่ทาโรต์", color: "plum", symbol: "✧", stock: 24, images: ["ปกหน้า", "สารบัญ"], description: "คู่มืออ่านไพ่แบบร่วมสมัยที่พาคุณรู้จักสัญลักษณ์ การวางไพ่ และวิธีสร้างบทสนทนาระหว่างไพ่กับผู้ถาม" },
  { id: "cosmic-cycles", title: "Cosmic Cycles", author: "Luna Ardent", price: 720, category: "โหราศาสตร์", color: "blue", symbol: "♆", stock: 9, images: ["ปกหน้า", "แผนภูมิดาว"], description: "อ่านจังหวะชีวิตผ่านการโคจรของดาว พร้อมแบบฝึกหัดที่ช่วยให้เข้าใจ Birth Chart และวางแผนชีวิตอย่างสอดคล้องกับตัวเอง" },
  { id: "ritual-soul", title: "Rituals for the Soul", author: "S. Vanora", price: 590, category: "พิธีกรรม", color: "wine", symbol: "☿", stock: 31, images: ["ปกหน้า", "หน้าภายใน"], description: "รวมพิธีกรรมเรียบง่ายสำหรับเช้าและค่ำ เพื่อสร้างพื้นที่สงบ เติมพลัง และกลับมาอยู่กับสิ่งสำคัญในชีวิตประจำวัน" },
  { id: "wild-unknown", title: "The Wild Unknown", author: "Kim Krans", price: 990, salePrice: 890, category: "ไพ่ทาโรต์", color: "forest", symbol: "☽", badge: "ขายดี", stock: 7, images: ["กล่อง", "สำรับไพ่", "คู่มือ"], description: "สำรับไพ่ภาพธรรมชาติที่โดดเด่นด้วยลายเส้นดิบและงดงาม ชวนให้สำรวจเงา ความกล้า และความจริงภายใน" },
  { id: "birth-chart", title: "Your Birth Chart", author: "E. Hart", price: 520, category: "โหราศาสตร์", color: "ink", symbol: "✦", stock: 15, images: ["ปกหน้า", "ตัวอย่างบท"], description: "คู่มือแปลความหมายแผนภูมิกำเนิดฉบับอ่านง่าย ตั้งแต่ลัคนา เรือน ไปจนถึงแง่มุมสำคัญของดาว" },
  { id: "inner-temple", title: "The Inner Temple", author: "Rhea Sol", price: 680, category: "จิตวิญญาณ", color: "plum", symbol: "◒", stock: 12, images: ["ปกหน้า", "แบบฝึกหัด"], description: "หนังสือฝึกสมาธิและการจดบันทึกเพื่อสร้างพื้นที่ศักดิ์สิทธิ์ภายใน และกลับมารับฟังความต้องการที่แท้จริง" },
  { id: "little-oracle", title: "Little Oracle Deck", author: "N. Aster", price: 450, category: "ไพ่ทาโรต์", color: "violet", symbol: "☼", stock: 42, images: ["กล่อง", "ไพ่ 3 ใบ"], description: "Oracle Deck ขนาดพกพา 44 ใบ พร้อมข้อความสั้นสำหรับเปิดไพ่ประจำวันและเติมแรงบันดาลใจ" },
];

export type Article = { slug: string; category: string; date: string; title: string; excerpt: string; symbol: string; color: string; status?: "เผยแพร่" | "ฉบับร่าง" };

export const articles: Article[] = [
  { slug: "beginner-tarot", category: "คู่มือทาโรต์", date: "12 สิงหาคม 2569", title: "เริ่มอ่านไพ่ทาโรต์ด้วยตัวเอง: 5 สิ่งที่ควรรู้", excerpt: "การเริ่มต้นอ่านไพ่ไม่ได้ต้องการพรสวรรค์ เพียงพื้นที่ให้ตัวเองได้ฟังสัญชาตญาณ", symbol: "☾", color: "violet" },
  { slug: "new-moon", category: "พิธีกรรม", date: "7 สิงหาคม 2569", title: "New Moon Ritual: ตั้งเจตนาในคืนเดือนมืด", excerpt: "พิธีกรรมเรียบง่าย 15 นาที เพื่อกลับมาเชื่อมต่อกับความตั้งใจของตัวเอง", symbol: "☿", color: "wine" },
  { slug: "major-arcana", category: "ความหมายไพ่", date: "29 กรกฎาคม 2569", title: "22 Major Arcana และการเดินทางของ The Fool", excerpt: "ทำความรู้จักบทเรียนสำคัญบนเส้นทางของผู้แสวงหา ผ่านไพ่เมเจอร์อาร์คานา", symbol: "✧", color: "blue" },
];

export const formatPrice = (price: number) => `฿${price.toLocaleString("th-TH")}`;
