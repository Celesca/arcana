import type { Metadata } from "next";
import "./globals.css";
import { ShopProvider } from "./providers";
import { SiteHeader } from "../components/site-header";
import { ChatWidget } from "../components/chat-widget";

export const metadata: Metadata = {
  title: "ARCANA — Books & Tarot",
  description: "A mystical bookstore for tarot readers and seekers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body><ShopProvider><SiteHeader />{children}<ChatWidget /></ShopProvider></body>
    </html>
  );
}
