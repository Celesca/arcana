import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARCANA — Books & Tarot",
  description: "A mystical bookstore for tarot readers and seekers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
