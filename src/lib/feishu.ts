/**
 * 飞书推送：按 push_config 将新信息推送给目标（用户或群）
 * 支持 Webhook（群）或 开放平台 API（发消息给用户）
 */

const FEISHU_WEBHOOK_BASE = "https://open.feishu.cn/open-apis/bot/v2/hook";

export type FeishuTarget = { type: "manager"; target_id: string } | { type: "feishu_group"; target_id: string };

export interface InfoItemForPush {
  id: string;
  company_id: string;
  type: string;
  title: string;
  summary: string | null;
  url: string | null;
  source: string;
  fetched_at: string;
  companies?: { name: string } | null;
}

/** 通过 Webhook 发群消息（target_id 为 webhook 路径后缀） */
export async function sendFeishuGroupMessage(
  webhookToken: string,
  content: { title: string; text: string; url?: string }
): Promise<boolean> {
  const url = `${FEISHU_WEBHOOK_BASE}/${webhookToken}`;
  const body = {
    msg_type: "interactive",
    card: {
      config: { wide_screen_mode: true },
      header: {
        title: { tag: "plain_text", content: content.title, i18n: {} },
        template: "blue",
      },
      elements: [
        { tag: "div", text: { tag: "lark_md", content: content.text } },
        ...(content.url
          ? [{ tag: "action", actions: [{ tag: "button", text: { tag: "plain_text", content: "查看详情" }, url: content.url }] }]
          : []),
      ],
    },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error("Feishu webhook error:", res.status, t);
    return false;
  }
  const data = await res.json();
  if (data.code !== 0) {
    console.error("Feishu webhook biz error:", data);
    return false;
  }
  return true;
}

/** 格式化单条信息为飞书卡片文案 */
export function formatInfoItemForFeishu(item: InfoItemForPush): { title: string; text: string; url?: string } {
  const companyName = item.companies?.name ?? "未知公司";
  const title = `[${companyName}] ${item.title}`;
  const lines = [
    `**类型** ${item.type}`,
    `**来源** ${item.source}`,
    `**时间** ${item.fetched_at}`,
    item.summary ? `\n${item.summary}` : "",
  ].filter(Boolean);
  return {
    title,
    text: lines.join("\n"),
    url: item.url ?? undefined,
  };
}
