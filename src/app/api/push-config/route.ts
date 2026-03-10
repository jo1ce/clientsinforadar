import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("push_config").select("*").order("info_type");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { info_type, target_type, target_id, enabled } = body;
  if (!info_type || !target_type || !target_id)
    return NextResponse.json({ error: "info_type, target_type, target_id required" }, { status: 400 });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("push_config")
    .insert({
      info_type,
      target_type,
      target_id,
      enabled: enabled !== false,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
