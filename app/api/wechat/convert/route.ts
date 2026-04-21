import { NextRequest, NextResponse } from "next/server";

function requireAdmin(req: NextRequest) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return "服务端未配置 ADMIN_TOKEN";
  const actual = req.headers.get("x-admin-token");
  if (actual !== expected) return "后台口令错误";
  return null;
}

async function readJson(resp: Response) {
  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return NextResponse.json({ error: authError }, { status: 401 });

  const apiKey = process.env.MD2WECHAT_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "未配置 MD2WECHAT_API_KEY" }, { status: 500 });

  const body = await req.json();
  const markdown = body.markdown;
  if (!markdown) return NextResponse.json({ error: "缺少 markdown 内容" }, { status: 400 });

  const agentResp = await fetch("https://md2wechat.com/api/v1/convert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Md2wechat-API-Key": apiKey,
    },
    body: JSON.stringify({
      markdown,
      theme: body.theme || "default",
      fontSize: body.fontSize || "medium",
      convertVersion: body.convertVersion || "v1",
    }),
  });

  const agentData = await readJson(agentResp);
  if (agentResp.ok) {
    return NextResponse.json({ ok: true, mode: "agent-v1", data: agentData, html: agentData?.html || agentData?.data?.html });
  }

  console.warn("md2wechat agent convert failed, trying legacy convert", agentData);

  const legacyResp = await fetch("https://www.md2wechat.com/api/convert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      markdown,
      theme: body.theme || "default",
    }),
  });

  const legacyData = await readJson(legacyResp);
  if (legacyResp.ok) {
    return NextResponse.json({
      ok: true,
      mode: "legacy-api-convert",
      data: legacyData,
      html: legacyData?.data?.html || legacyData?.html,
    });
  }

  console.error("md2wechat convert failed", { agentData, legacyData });
  return NextResponse.json(
    {
      error: "md2wechat 转换失败。Agent API 与旧版 convert 接口都未成功。",
      agentStatus: agentResp.status,
      agentDetail: agentData,
      legacyStatus: legacyResp.status,
      legacyDetail: legacyData,
    },
    { status: legacyResp.status || agentResp.status || 500 }
  );
}
