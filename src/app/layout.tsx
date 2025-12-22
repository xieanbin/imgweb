import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RefGuide - 漫画创作者参考库",
  description: "百万级手绘素材库管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
