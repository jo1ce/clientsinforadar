"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";

type Manager = { id: string; name: string; feishu_user_id: string | null; role: string };
type Company = { id: string; name: string; credit_code: string | null };
type ManagerCompany = { id: string; manager_id: string; company_id: string; managers: Manager; companies: Company };
type PushConfig = { id: string; info_type: string; target_type: string; target_id: string; enabled: boolean };

export default function AdminPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [links, setLinks] = useState<ManagerCompany[]>([]);
  const [pushConfigs, setPushConfigs] = useState<PushConfig[]>([]);
  const [activeTab, setActiveTab] = useState<"managers" | "companies" | "links" | "push">("managers");
  const [newManagerName, setNewManagerName] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [linkManagerId, setLinkManagerId] = useState("");
  const [linkCompanyId, setLinkCompanyId] = useState("");
  const [pushInfoType, setPushInfoType] = useState("news");
  const [pushTargetId, setPushTargetId] = useState("");
  const [pushTargetType, setPushTargetType] = useState<"manager" | "feishu_group">("feishu_group");

  const load = () => {
    fetch("/api/managers").then((r) => r.json()).then((d) => setManagers(Array.isArray(d) ? d : []));
    fetch("/api/companies").then((r) => r.json()).then((d) => setCompanies(Array.isArray(d) ? d : []));
    fetch("/api/manager-companies").then((r) => r.json()).then((d) => setLinks(Array.isArray(d) ? d : []));
    fetch("/api/push-config").then((r) => r.json()).then((d) => setPushConfigs(Array.isArray(d) ? d : []));
  };

  useEffect(() => {
    load();
  }, []);

  const addManager = () => {
    if (!newManagerName.trim()) return;
    fetch("/api/managers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newManagerName.trim() }),
    })
      .then((r) => r.json())
      .then(() => {
        setNewManagerName("");
        load();
      });
  };

  const addCompany = () => {
    if (!newCompanyName.trim()) return;
    fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCompanyName.trim() }),
    })
      .then((r) => r.json())
      .then(() => {
        setNewCompanyName("");
        load();
      });
  };

  const addLink = () => {
    if (!linkManagerId || !linkCompanyId) return;
    fetch("/api/manager-companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manager_id: linkManagerId, company_id: linkCompanyId }),
    })
      .then((r) => r.json())
      .then(() => {
        setLinkManagerId("");
        setLinkCompanyId("");
        load();
      });
  };

  const removeLink = (id: string) => {
    fetch(`/api/manager-companies?id=${id}`, { method: "DELETE" }).then(() => load());
  };

  const addPushConfig = () => {
    if (!pushInfoType.trim() || !pushTargetId.trim()) return;
    fetch("/api/push-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        info_type: pushInfoType.trim(),
        target_type: pushTargetType,
        target_id: pushTargetId.trim(),
        enabled: true,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        setPushTargetId("");
        load();
      });
  };

  const togglePushConfig = (id: string, enabled: boolean) => {
    fetch(`/api/push-config/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    }).then(() => load());
  };

  const deletePushConfig = (id: string) => {
    fetch(`/api/push-config/${id}`, { method: "DELETE" }).then(() => load());
  };

  const tabs = [
    { id: "managers" as const, label: "客户经理" },
    { id: "companies" as const, label: "公司" },
    { id: "links" as const, label: "经理-公司关联" },
    { id: "push" as const, label: "推送配置" },
  ];

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">管理员 · 配置</h1>
        <div className="flex flex-wrap gap-2 border-b">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`px-3 py-2 text-sm rounded-t ${activeTab === t.id ? "bg-gray-200 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "managers" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <input
                className="border rounded-lg px-3 py-2 text-sm"
                placeholder="客户经理姓名"
                value={newManagerName}
                onChange={(e) => setNewManagerName(e.target.value)}
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" onClick={addManager}>
                添加
              </button>
            </div>
            <ul className="divide-y">
              {managers.map((m) => (
                <li key={m.id} className="py-2 flex justify-between items-center">
                  <span>{m.name}</span>
                  <span className="text-xs text-gray-500">{m.role}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "companies" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <input
                className="border rounded-lg px-3 py-2 text-sm"
                placeholder="公司名称"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" onClick={addCompany}>
                添加
              </button>
            </div>
            <ul className="divide-y">
              {companies.map((c) => (
                <li key={c.id} className="py-2">
                  {c.name}
                  {c.credit_code && <span className="text-xs text-gray-500 ml-2">{c.credit_code}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "links" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={linkManagerId}
                onChange={(e) => setLinkManagerId(e.target.value)}
              >
                <option value="">选择经理</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={linkCompanyId}
                onChange={(e) => setLinkCompanyId(e.target.value)}
              >
                <option value="">选择公司</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" onClick={addLink}>
                关联
              </button>
            </div>
            <ul className="divide-y">
              {links.map((l) => (
                <li key={l.id} className="py-2 flex justify-between items-center">
                  <span>{l.managers?.name} ← → {l.companies?.name}</span>
                  <button className="text-red-600 text-sm" onClick={() => removeLink(l.id)}>移除</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "push" && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              将某类信息推送到飞书群：目标类型选「飞书群」，目标 ID 填该群的 Webhook 路径中的 token（即 hook/ 后面的部分）。
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                className="border rounded-lg px-3 py-2 text-sm w-32"
                placeholder="信息类型"
                value={pushInfoType}
                onChange={(e) => setPushInfoType(e.target.value)}
              />
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={pushTargetType}
                onChange={(e) => setPushTargetType(e.target.value as "manager" | "feishu_group")}
              >
                <option value="feishu_group">飞书群</option>
                <option value="manager">客户经理</option>
              </select>
              <input
                className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px]"
                placeholder={pushTargetType === "feishu_group" ? "Webhook token" : "经理 ID"}
                value={pushTargetId}
                onChange={(e) => setPushTargetId(e.target.value)}
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" onClick={addPushConfig}>
                添加推送规则
              </button>
            </div>
            <ul className="divide-y">
              {pushConfigs.map((p) => (
                <li key={p.id} className="py-2 flex justify-between items-center flex-wrap gap-2">
                  <span className="text-sm">{p.info_type} → {p.target_type}: {p.target_id}</span>
                  <div className="flex gap-2">
                    <button
                      className={`text-sm px-2 py-1 rounded ${p.enabled ? "bg-green-100 text-green-800" : "bg-gray-200"}`}
                      onClick={() => togglePushConfig(p.id, !p.enabled)}
                    >
                      {p.enabled ? "已启用" : "已关闭"}
                    </button>
                    <button className="text-red-600 text-sm" onClick={() => deletePushConfig(p.id)}>删除</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
