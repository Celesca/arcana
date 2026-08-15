"use client";

import Link from "next/link";
import { useShop } from "../app/providers";

export function ArticleList() {
  const { articles } = useShop();
  return <div className="article-grid">{articles.map((article) => <article className="article-card" key={article.slug}><div className={`article-image ${article.color}`}><span>{article.symbol}</span></div><div className="article-copy"><p className="article-meta">{article.category} <i>·</i> {article.date}</p><h2>{article.title}</h2><p>{article.excerpt}</p><Link href={`/articles/${article.slug}`}>อ่านบทความ <span>→</span></Link></div></article>)}</div>;
}
