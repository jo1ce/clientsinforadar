import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const managerId = searchParams.get("manager_id");
  const companyId = searchParams.get("company_id");
  const supabase = createAdminClient();
  let q = supabase.from("manager_companies").select("*, managers(*), companies(*)");
  if (managerId) q = q.eq("manager_id", managerId);
  if (companyId) q = q.eq("company_id", companyId);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { manager_id, company_id } = body;
  if (!manager_id || !company_id)
    return NextResponse.json({ error: "manager_id and company_id required" }, { status: 400 });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("manager_companies")
    .insert({ manager_id, company_id })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const managerId = searchParams.get("manager_id");
  const companyId = searchParams.get("company_id");
  const supabase = createAdminClient();
  let q = supabase.from("manager_companies").delete();
  if (id) q = q.eq("id", id);
  else if (managerId && companyId) q = q.eq("manager_id", managerId).eq("company_id", companyId);
  else return NextResponse.json({ error: "id or (manager_id and company_id) required" }, { status: 400 });
  const { error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
