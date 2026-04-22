/**
 * POST /api/wechat/draft
 *
 * 服务端代理：调用 md2wechat 的 article-draft API，在微信公众号后台创建草稿。
 * ⚠️ 只创建草稿，不自动发布！最终由人工在公众号后台审核发布。
 *
 * 所有微信密钥（APPID / APP_SECRET）只在服务端读取，不会暴露给前端。
 */

import { NextRequest, NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'

// ─── 类型 ──────────────────────────────────────────────────────
interface DraftRequestBody {
  title: string
  markdown: string
  coverImageUrl?: string
  theme?: string
  fontSize?: string
}

export async function POST(request: NextRequest) {
  // 校验管理员身份（基于 session，与图片生成接口一致）
  const admin = await isAdminUser()
  if (!admin) {
    return NextResponse.json(
      { error: '无权限。草稿推送接口仅限管理员使用。' },
      { status: 403 },
    )
  }

  // 检查必要环境变量
  const missingEnvs: string[] = []
  const apiKey       = process.env.MD2WECHAT_API_KEY
  const wechatAppid  = process.env.WECHAT_APPID
  const wechatSecret = process.env.WECHAT_APP_SECRET

  if (!apiKey)       missingEnvs.push('MD2WECHAT_API_KEY')
  if (!wechatAppid)  missingEnvs.push('WECHAT_APPID')
  if (!wechatSecret) missingEnvs.push('WECHAT_APP_SECRET')

  if (missingEnvs.length > 0) {
    return NextResponse.json(
      {
        error: `服务端缺少以下环境变量，请在 Vercel 后台设置：${missingEnvs.join('、')}`,
      },
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
    typeof (body as DraftRequestBody).title !== 'string' ||
    typeof (body as DraftRequestBody).markdown !== 'string'
  ) {
    return NextResponse.json({ error: '缺少 title 或 markdown 字段。' }, { status: 400 })
  }

  const {
    title,
    markdown,
    coverImageUrl,
    theme = 'default',
    fontSize = 'medium',
  } = body as DraftRequestBody

  if (!title.trim()) {
    return NextResponse.json({ error: '文章标题不能为空。' }, { status: 400 })
  }
  if (!markdown.trim()) {
    return NextResponse.json({ error: 'Markdown 内容不能为空。' }, { status: 400 })
  }

  // 构建请求体
  const draftPayload: Record<string, unknown> = {
    title: title.trim(),
    markdown,
    theme,
    fontSize,
    convertVersion: 'v1',
    // draft: true 代表只创建草稿，不发布
    draft: true,
  }

  if (coverImageUrl && coverImageUrl.trim()) {
    draftPayload.coverImageUrl = coverImageUrl.trim()
  }

  // md2wechat API 地址通过环境变量 MD2WECHAT_BASE_URL 配置。
  // 默认值仅作占位，实际地址请到 md2wechat 控制台或文档中确认。
  const baseUrl = (process.env.MD2WECHAT_BASE_URL ?? 'https://md2wechat.com').replace(/\/$/, '')
  const draftUrl = `${baseUrl}/api/v1/article-draft`

  // 调用 md2wechat article-draft API
  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(draftUrl, {
      method: 'POST',
      headers: {
        'Content-Type':        'application/json',
        'Md2wechat-API-Key':   apiKey as string,
        'Wechat-Appid':        wechatAppid as string,
        'Wechat-App-Secret':   wechatSecret as string,
      },
      body: JSON.stringify(draftPayload),
    })
  } catch (err) {
    console.error('[wechat/draft] 网络请求失败:', err)
    return NextResponse.json(
      { error: '无法连接 md2wechat 服务，请稍后重试。' },
      { status: 502 },
    )
  }

  const upstreamText = await upstreamResponse.text()

  if (!upstreamResponse.ok) {
    // 只打印到服务端日志，不把密钥/原始错误暴露给前端
    console.error(
      `[wechat/draft] 上游返回 ${upstreamResponse.status}:`,
      upstreamText.slice(0, 500),
    )
    return NextResponse.json(
      {
        error: `创建草稿失败（HTTP ${upstreamResponse.status}）。请检查微信 APPID/SECRET 或 md2wechat API Key 是否正确，并查看服务端日志获取详情。`,
      },
      { status: upstreamResponse.status },
    )
  }

  // 解析并返回草稿创建结果
  try {
    const json = JSON.parse(upstreamText)
    return NextResponse.json({
      success: true,
      message: '草稿已创建成功！请前往微信公众号后台"草稿箱"审核后手动发布。',
      data: json,
    })
  } catch {
    return NextResponse.json({
      success: true,
      message: '草稿已创建成功！请前往微信公众号后台"草稿箱"审核后手动发布。',
      raw: upstreamText,
    })
  }
}
