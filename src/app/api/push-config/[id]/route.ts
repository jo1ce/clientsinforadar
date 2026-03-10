import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { info_type, target_type, target_id, enabled } = body;
  const supabase = createAdminClient();
  const updates: Database["public"]["Tables"]["push_config"]["Update"] = {};
  if (info_type !== undefined) updates.info_type = info_type;
  if (target_type !== undefined) updates.target_type = target_type;
  if (target_id !== undefined) updates.target_id = target_id;
  if (enabled !== undefined) updates.enabled = enabled;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase client chain typing quirk
  const { data, error } = await (supabase as any).from("push_config").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("push_config").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
