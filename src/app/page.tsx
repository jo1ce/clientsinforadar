import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">客户信息雷达</h1>
      <nav className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          客户经理 · 信息页
        </Link>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
        >
          管理员 · 配置
        </Link>
      </nav>
    </main>
  );
}
