import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "文字厨房 — 你读过的文字，变成你笔下的味道",
  description: "把你喜欢的文字喂给厨房，点一道菜，端出一盘属于你的作品。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSerif.variable} font-serif antialiased bg-cream text-espresso`}>
        {children}
      </body>
    </html>
  );
}
