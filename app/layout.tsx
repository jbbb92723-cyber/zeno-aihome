import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "赞诺 Zeno AI Home",
  description: "从工地看世界，帮你在真实生活里做更清醒、更耐久的选择。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
