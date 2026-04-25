/**
 * POST /api/publish/wechat-draft
 *
 * 公众号创作工作台 — 推送草稿（含网站回流链接注入）
 *
 * 与 /api/wechat/draft 的区别：
 *   在 Markdown 末尾自动追加"阅读原文"回流链接，
 *   驱动公众号读者回到 zenoaihome.com。
 *
 * 权限：仅管理员（admin_session cookie）
 * ⚠️  只创建草稿，不自动发布！
 */

import { NextRequest, NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'

// ─── 回流链接 ──────────────────────────────────────────────────

const SITE_BASE = 'https://zenoaihome.com'

/**
 * 生成追加到 Markdown 末尾的回流链接片段。
 * articlePath 可传 '/blog/some-slug'，默认指向首页。
 */
function buildBacklinkMarkdown(articlePath = ''): string {
  const url = `${SITE_BASE}${articlePath}?utm_source=wechat&utm_medium=article`
  return `\n\n---\n\n*本文同步发布于 [zenoaihome.com](${url})，欢迎访问网站阅读更多内容。*\n`
}

// ─── 请求体类型 ─────────────────────────────────────────────────

interface DraftRequestBody {
  title: string
  markdown: string
  coverImageUrl?: string
  theme?: string
  fontSize?: string
  /** 文章在网站的路径，例如 /blog/why-i-dont-just-teach-renovation，用于精准回流链接 */
  articlePath?: string
}

// ─── 路由处理器 ─────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // ── 权限验证 ──────────────────────────────────────────────────
  const admin = await isAdminUser()
  if (!admin) {
    return NextResponse.json(
      { error: '无权限。此接口仅限管理员使用。' },
      { status: 403 },
    )
  }

  // ── 环境变量检查 ───────────────────────────────────────────────
  const missingEnvs: string[] = []
  const apiKey       = process.env.MD2WECHAT_API_KEY
  const wechatAppid  = process.env.WECHAT_APPID
  const wechatSecret = process.env.WECHAT_APP_SECRET

  if (!process.env.MD2WECHAT_BASE_URL) missingEnvs.push('MD2WECHAT_BASE_URL')
  if (!apiKey)                          missingEnvs.push('MD2WECHAT_API_KEY')
  if (!wechatAppid)                     missingEnvs.push('WECHAT_APPID')
  if (!wechatSecret)                    missingEnvs.push('WECHAT_APP_SECRET')

  if (missingEnvs.length > 0) {
    return NextResponse.json(
      { error: `以下环境变量未配置：${missingEnvs.join('、')}` },
      { status: 503 },
    )
  }

  // ── 解析请求体 ─────────────────────────────────────────────────
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
    articlePath = '',
  } = body as DraftRequestBody

  if (!title.trim()) {
    return NextResponse.json({ error: '文章标题不能为空。' }, { status: 400 })
  }
  if (!markdown.trim()) {
    return NextResponse.json({ error: 'Markdown 内容不能为空。' }, { status: 400 })
  }

  // ── 注入回流链接 ───────────────────────────────────────────────
  const markdownWithBacklink = markdown.trimEnd() + buildBacklinkMarkdown(articlePath)

  // ── 构建草稿请求 ───────────────────────────────────────────────
  const draftPayload: Record<string, unknown> = {
    title: title.trim(),
    markdown: markdownWithBacklink,
    theme,
    fontSize,
    convertVersion: 'v1',
    draft: true,
  }

  if (coverImageUrl?.trim()) {
    draftPayload.coverImageUrl = coverImageUrl.trim()
  }

  const baseUrl = (process.env.MD2WECHAT_BASE_URL ?? 'https://md2wechat.com').replace(/\/$/, '')
  const draftUrl = `${baseUrl}/api/v1/article-draft`

  // ── 调用 md2wechat ─────────────────────────────────────────────
  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(draftUrl, {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'Md2wechat-API-Key': apiKey as string,
        'Wechat-Appid':      wechatAppid as string,
        'Wechat-App-Secret': wechatSecret as string,
      },
      body: JSON.stringify(draftPayload),
    })
  } catch (err) {
    console.error('[publish/wechat-draft] 网络请求失败:', err)
    return NextResponse.json(
      { error: '无法连接 md2wechat 服务，请稍后重试。' },
      { status: 502 },
    )
  }

  const upstreamText = await upstreamResponse.text()

  if (!upstreamResponse.ok) {
    console.error(
      `[publish/wechat-draft] 上游返回 ${upstreamResponse.status}:`,
      upstreamText.slice(0, 500),
    )
    return NextResponse.json(
      {
        error: `创建草稿失败（HTTP ${upstreamResponse.status}）。请检查微信 APPID/SECRET 或 md2wechat API Key 是否正确。`,
      },
      { status: upstreamResponse.status },
    )
  }

  try {
    const json = JSON.parse(upstreamText)
    return NextResponse.json({
      success: true,
      message: '草稿已创建成功！已自动注入网站回流链接。请前往微信公众号后台"草稿箱"审核后手动发布。',
      backlinkAdded: true,
      data: json,
    })
  } catch {
    return NextResponse.json({
      success: true,
      message: '草稿已创建成功！已自动注入网站回流链接。请前往微信公众号后台"草稿箱"审核后手动发布。',
      backlinkAdded: true,
      raw: upstreamText,
    })
  }
}
