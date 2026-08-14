import Link from "next/link";
import { articles } from "../../lib/catalog";

export const metadata = { title: "บทความ | ARCANA", description: "บทความ ไพ่ทาโรต์ พิธีกรรม และการค้นพบตัวเองจาก ARCANA" };

export default function ArticlesPage() {
  return <main className="inner-page"><div className="page-intro"><p className="eyebrow">ARCANA JOURNAL</p><h1>บทความและแรงบันดาลใจ</h1><p>พื้นที่เล็ก ๆ สำหรับเรียนรู้ อ่านความหมาย และกลับไปฟังเสียงข้างใน</p></div><section className="articles section"><div className="article-grid">{articles.map((article) => <article className="article-card" key={article.slug}><div className={`article-image ${article.color}`}><span>{article.symbol}</span></div><div className="article-copy"><p className="article-meta">{article.category} <i>·</i> {article.date}</p><h2>{article.title}</h2><p>{article.excerpt}</p><Link href={`/articles/${article.slug}`}>อ่านบทความ <span>→</span></Link></div></article>)}</div></section></main>;
}
