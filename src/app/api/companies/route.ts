import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("companies").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, credit_code, source_ids } = body;
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("companies")
    .insert({ name, credit_code: credit_code ?? null, source_ids: source_ids ?? null })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
