/**
 * 定时任务：拉取未推送的信息，按 push_config 推送到飞书
 * Vercel Cron 可配置 GET /api/cron/push；或外部 cron 调用时需带 CRON_SECRET
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendFeishuGroupMessage, formatInfoItemForFeishu } from "@/lib/feishu";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase client chain typing
  const { data: configs } = await (supabase as any).from("push_config").select("*").eq("enabled", true);
  if (!configs?.length) return NextResponse.json({ ok: true, pushed: 0, message: "No push config" });

  // 简化：取最近 24 小时内的信息，按 info_type 匹配推送（实际可加「已推送」标记表做增量）
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase client chain typing
  const { data: items } = await (supabase as any)
    .from("info_items")
    .select("*, companies(name)")
    .gte("fetched_at", since)
    .order("fetched_at", { ascending: false })
    .limit(100);

  if (!items?.length) return NextResponse.json({ ok: true, pushed: 0, message: "No new items" });

  let pushed = 0;
  type PushConfigRow = { info_type: string; target_type: string; target_id: string };
  type InfoRow = { type: string; [key: string]: unknown };
  for (const config of configs as PushConfigRow[]) {
    const matched = (items as InfoRow[]).filter((i) => i.type === config.info_type);
    for (const item of matched) {
      if (config.target_type === "feishu_group" && config.target_id) {
        const content = formatInfoItemForFeishu(item as unknown as Parameters<typeof formatInfoItemForFeishu>[0]);
        const ok = await sendFeishuGroupMessage(config.target_id, content);
        if (ok) pushed++;
      }
      // target_type === 'manager' 时可调飞书开放平台发私信（需 app_id/app_secret），此处仅做群推送
    }
  }

  return NextResponse.json({ ok: true, pushed });
}
