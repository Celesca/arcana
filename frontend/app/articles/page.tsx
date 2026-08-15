import { ArticleList } from "../../components/article-list";

export const metadata = { title: "บทความ | ARCANA", description: "บทความ ไพ่ทาโรต์ พิธีกรรม และการค้นพบตัวเองจาก ARCANA" };

export default function ArticlesPage() {
  return <main className="inner-page"><div className="page-intro"><p className="eyebrow">ARCANA JOURNAL</p><h1>บทความและแรงบันดาลใจ</h1><p>พื้นที่เล็ก ๆ สำหรับเรียนรู้ อ่านความหมาย และกลับไปฟังเสียงข้างใน</p></div><section className="articles section"><ArticleList /></section></main>;
}
