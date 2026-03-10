import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** 客户经理信息流：按经理 ID 只返回其负责公司的信息 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const managerId = searchParams.get("manager_id");
  const companyId = searchParams.get("company_id");
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const supabase = createAdminClient();

  if (managerId) {
    const { data: links } = await supabase
      .from("manager_companies")
      .select("company_id")
      .eq("manager_id", managerId);
    const companyIds = (links ?? []).map((r) => r.company_id);
    if (companyIds.length === 0) return NextResponse.json([]);
    const { data, error } = await supabase
      .from("info_items")
      .select("*, companies(name)")
      .in("company_id", companyIds)
      .order("fetched_at", { ascending: false })
      .limit(limit);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  if (companyId) {
    const { data, error } = await supabase
      .from("info_items")
      .select("*, companies(name)")
      .eq("company_id", companyId)
      .order("fetched_at", { ascending: false })
      .limit(limit);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  const { data, error } = await supabase
    .from("info_items")
    .select("*, companies(name)")
    .order("fetched_at", { ascending: false })
    .limit(limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

/** 写入信息（爬虫/API 拉取后调用） */
export async function POST(request: Request) {
  const body = await request.json();
  const { company_id, type, title, summary, url, source, raw, fetched_at } = body;
  if (!company_id || !type || !title || !source)
    return NextResponse.json({ error: "company_id, type, title, source required" }, { status: 400 });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("info_items")
    .insert({
      company_id,
      type,
      title,
      summary: summary ?? null,
      url: url ?? null,
      source,
      raw: raw ?? null,
      fetched_at: fetched_at ?? new Date().toISOString(),
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
