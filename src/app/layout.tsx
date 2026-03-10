import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "客户信息雷达",
  description: "客户公司信息动态收集与飞书推送",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
