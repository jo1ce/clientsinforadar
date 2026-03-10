"use client";

import Link from "next/link";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900">
            客户信息雷达
          </Link>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">
              信息页
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm">
              配置
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
