import { NextRequest, NextResponse } from "next/server";

function requireAdmin(req: NextRequest) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return "服务端未配置 ADMIN_TOKEN";
  const actual = req.headers.get("x-admin-token");
  if (actual !== expected) return "后台口令错误";
  return null;
}

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return NextResponse.json({ error: authError }, { status: 401 });

  const md2wechatKey = process.env.MD2WECHAT_API_KEY;
  const wechatAppId = process.env.WECHAT_APPID;
  const wechatSecret = process.env.WECHAT_APP_SECRET;

  if (!md2wechatKey || !wechatAppId || !wechatSecret) {
    return NextResponse.json(
      { error: "缺少 MD2WECHAT_API_KEY / WECHAT_APPID / WECHAT_APP_SECRET 环境变量" },
      { status: 500 }
    );
  }

  const body = await req.json();
  if (!body.title || !body.markdown) {
    return NextResponse.json({ error: "缺少 title 或 markdown" }, { status: 400 });
  }

  const resp = await fetch("https://md2wechat.com/api/v1/article-draft", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Md2wechat-API-Key": md2wechatKey,
      "Wechat-Appid": wechatAppId,
      "Wechat-App-Secret": wechatSecret,
    },
    body: JSON.stringify({
      title: body.title,
      markdown: body.markdown,
      coverImageUrl: body.coverImageUrl || undefined,
      theme: body.theme || "default",
      fontSize: body.fontSize || "medium",
      convertVersion: body.convertVersion || "v1",
    }),
  });

  const text = await resp.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!resp.ok) {
    console.error("md2wechat draft error", data);
    return NextResponse.json({ error: "公众号草稿创建失败", detail: data }, { status: resp.status });
  }

  return NextResponse.json(data);
}
