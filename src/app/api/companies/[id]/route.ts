import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("companies").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: error.code === "PGRST116" ? 404 : 500 });
  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, credit_code, source_ids } = body;
  const supabase = createAdminClient();
  const updates: Database["public"]["Tables"]["companies"]["Update"] = {};
  if (name !== undefined) updates.name = name;
  if (credit_code !== undefined) updates.credit_code = credit_code;
  if (source_ids !== undefined) updates.source_ids = source_ids;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase client chain typing quirk
  const { data, error } = await (supabase as any).from("companies").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("companies").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
