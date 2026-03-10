import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("managers").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, feishu_user_id, feishu_open_id, role } = body;
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("managers")
    .insert({ name, feishu_user_id: feishu_user_id ?? null, feishu_open_id: feishu_open_id ?? null, role: role ?? "manager" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
