"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";

type Company = { name: string };
type InfoItem = {
  id: string;
  company_id: string;
  type: string;
  title: string;
  summary: string | null;
  url: string | null;
  source: string;
  fetched_at: string;
  companies: Company | null;
};

export default function DashboardPage() {
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [items, setItems] = useState<InfoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/managers")
      .then((r) => r.json())
      .then((data) => {
        setManagers(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0 && !selectedManagerId) {
          setSelectedManagerId(data[0].id);
        }
      })
      .catch(() => setManagers([]));
  }, [selectedManagerId]);

  useEffect(() => {
    if (!selectedManagerId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/info?manager_id=${selectedManagerId}&limit=50`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [selectedManagerId]);

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">客户经理 · 信息流</h1>
        <p className="text-gray-600 text-sm">
          选择客户经理后，仅展示其负责公司的动态信息。
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-sm text-gray-700">客户经理：</label>
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={selectedManagerId}
            onChange={(e) => setSelectedManagerId(e.target.value)}
          >
            <option value="">请选择</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <p className="text-gray-500 text-sm">加载中…</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-sm">暂无信息，或该经理未关联公司。</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">
                    {item.companies?.name ?? "未知公司"}
                  </span>
                  <span>{item.type}</span>
                  <span>{item.source}</span>
                  <span>{new Date(item.fetched_at).toLocaleString("zh-CN")}</span>
                </div>
                <h2 className="font-medium text-gray-900 mb-1">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h2>
                {item.summary && (
                  <p className="text-gray-600 text-sm line-clamp-2">{item.summary}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
