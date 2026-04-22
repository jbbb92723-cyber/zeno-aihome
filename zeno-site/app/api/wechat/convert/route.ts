/**
 * POST /api/wechat/convert
 *
 * 服务端代理：调用 md2wechat 的 convert API，把 Markdown 转成微信公众号 HTML。
 * API Key 只在服务端读取，不会暴露给前端。
 */

import { NextRequest, NextResponse } from 'next/server'

// ─── 类型 ──────────────────────────────────────────────────────
interface ConvertRequestBody {
  markdown: string
  theme?: string
  fontSize?: string
}

// ─── 管理员 Token 校验 ──────────────────────────────────────────
function verifyAdminToken(request: NextRequest): boolean {
  const token = request.headers.get('x-admin-token')
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return false
  return token === expected
}

export async function POST(request: NextRequest) {
  // 校验管理员身份
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: '未授权，请检查 ADMIN_TOKEN' }, { status: 401 })
  }

  // 检查必要环境变量
  const apiKey = process.env.MD2WECHAT_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: '服务端缺少 MD2WECHAT_API_KEY 环境变量，请在 Vercel 后台设置。' },
      { status: 500 },
    )
  }

  // 解析请求体
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误，需要 JSON 格式。' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as ConvertRequestBody).markdown !== 'string'
  ) {
    return NextResponse.json({ error: '缺少 markdown 字段。' }, { status: 400 })
  }

  const { markdown, theme = 'default', fontSize = 'medium' } =
    body as ConvertRequestBody

  if (!markdown.trim()) {
    return NextResponse.json({ error: 'markdown 内容不能为空。' }, { status: 400 })
  }

  // md2wechat API 地址通过环境变量 MD2WECHAT_BASE_URL 配置。
  // 默认值仅作占位，实际地址请到 md2wechat 控制台或文档中确认。
  const baseUrl = (process.env.MD2WECHAT_BASE_URL ?? 'https://md2wechat.com').replace(/\/$/, '')
  const convertUrl = `${baseUrl}/api/v1/convert`

  // 调用 md2wechat API
  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(convertUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Md2wechat-API-Key': apiKey,
      },
      body: JSON.stringify({
        markdown,
        theme,
        fontSize,
        convertVersion: 'v1',
      }),
    })
  } catch (err) {
    console.error('[wechat/convert] 网络请求失败:', err)
    return NextResponse.json(
      { error: '无法连接 md2wechat 服务，请稍后重试。' },
      { status: 502 },
    )
  }

  // 转发上游响应
  const upstreamText = await upstreamResponse.text()

  if (!upstreamResponse.ok) {
    // 打印错误到服务端日志（不把 API Key 返回前端）
    console.error(
      `[wechat/convert] 上游返回 ${upstreamResponse.status}:`,
      upstreamText.slice(0, 500),
    )
    return NextResponse.json(
      { error: `md2wechat 转换失败（HTTP ${upstreamResponse.status}），请检查 API Key 或 Markdown 格式。` },
      { status: upstreamResponse.status },
    )
  }

  // 尝试解析为 JSON，否则作为文本返回
  try {
    const json = JSON.parse(upstreamText)
    return NextResponse.json(json)
  } catch {
    return new NextResponse(upstreamText, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
