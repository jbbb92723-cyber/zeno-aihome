/**
 * POST /api/image/generate
 *
 * 服务端代理：调用火山方舟（豆包）图片生成 API，生成封面图。
 * ARK_API_KEY 只在服务端读取，绝不暴露给前端。
 *
 * 注意：
 * - 如果 API 返回 base64 图片数据，需要额外接入对象存储（OSS/COS/R2）才能
 *   生成可在微信公众号使用的外链 URL。当前版本直接返回 base64 供预览，
 *   生产环境请补充上传存储逻辑（见注释 TODO）。
 * - ARK_IMAGE_MODEL 通过环境变量配置，不写死，方便切换模型版本。
 */

import { NextRequest, NextResponse } from 'next/server'

// ─── 类型 ──────────────────────────────────────────────────────
interface GenerateRequestBody {
  prompt: string
  size?: string
}

// 火山方舟图片生成 API 响应结构（参考官方文档）
interface ArkImageResponse {
  data?: Array<{
    url?: string
    b64_json?: string
  }>
  error?: {
    message: string
    code?: string
  }
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
  const arkApiKey = process.env.ARK_API_KEY
  const arkModel  = process.env.ARK_IMAGE_MODEL

  if (!arkApiKey) {
    return NextResponse.json(
      { error: '服务端缺少 ARK_API_KEY 环境变量，请在 Vercel 后台设置。' },
      { status: 500 },
    )
  }
  if (!arkModel) {
    return NextResponse.json(
      { error: '服务端缺少 ARK_IMAGE_MODEL 环境变量，请在 Vercel 后台设置（例如：doubao-seedream-3-0-t2i-250415）。' },
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
    typeof (body as GenerateRequestBody).prompt !== 'string'
  ) {
    return NextResponse.json({ error: '缺少 prompt 字段。' }, { status: 400 })
  }

  const { prompt, size = '1024x1024' } = body as GenerateRequestBody

  if (!prompt.trim()) {
    return NextResponse.json({ error: '图片提示词不能为空。' }, { status: 400 })
  }

  // 火山方舟 OpenAI 兼容接口使用 "WxH" 字符串格式的 size 参数。
  // 豆包图片模型要求像素总数 ≥ 3,686,400（即 2560×1440）。
  // 支持的典型尺寸：2560x1440 / 1920x1920 / 1440x2560
  const validSize = size && /^\d+x\d+$/i.test(size) ? size : '2560x1440'

  // 调用火山方舟图片生成 API（OpenAI 兼容格式）
  // 文档：https://www.volcengine.com/docs/82379/1399008
  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(
      'https://ark.cn-beijing.volces.com/api/v3/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${arkApiKey}`,
        },
        body: JSON.stringify({
          model:  arkModel,
          prompt: prompt.trim(),
          size:   validSize, // 使用字符串格式，不传 width/height
          n:      1,
        }),
      },
    )
  } catch (err) {
    console.error('[image/generate] 网络请求失败:', err)
    return NextResponse.json(
      { error: '无法连接火山方舟服务，请稍后重试。' },
      { status: 502 },
    )
  }

  const upstreamText = await upstreamResponse.text()

  if (!upstreamResponse.ok) {
    console.error(
      `[image/generate] 上游返回 ${upstreamResponse.status}:`,
      upstreamText.slice(0, 500),
    )
    return NextResponse.json(
      {
        error: `图片生成失败（HTTP ${upstreamResponse.status}）。请检查 ARK_API_KEY 和 ARK_IMAGE_MODEL 是否正确，并查看服务端日志。`,
      },
      { status: upstreamResponse.status },
    )
  }

  let result: ArkImageResponse
  try {
    result = JSON.parse(upstreamText) as ArkImageResponse
  } catch {
    console.error('[image/generate] 无法解析上游响应:', upstreamText.slice(0, 200))
    return NextResponse.json(
      { error: '图片生成服务返回了无法解析的响应，请查看服务端日志。' },
      { status: 502 },
    )
  }

  // 检查上游业务错误
  if (result.error) {
    console.error('[image/generate] 上游业务错误:', result.error)
    return NextResponse.json(
      { error: `图片生成失败：${result.error.message}` },
      { status: 400 },
    )
  }

  const firstItem = result.data?.[0]
  if (!firstItem) {
    return NextResponse.json(
      { error: '图片生成服务未返回任何图片，请重试或更换提示词。' },
      { status: 502 },
    )
  }

  // 优先返回 URL，否则返回 base64（需接入存储服务）
  if (firstItem.url) {
    return NextResponse.json({ imageUrl: firstItem.url, type: 'url' })
  }

  if (firstItem.b64_json) {
    // ⚠️ TODO（生产环境）：
    //   base64 图片无法直接作为微信公众号封面，需要：
    //   1. 解码 base64
    //   2. 上传到 OSS / Cloudflare R2 / 腾讯 COS
    //   3. 返回可公开访问的 HTTPS URL
    //   4. 或者调用微信素材上传接口直接获取 media_id
    //
    //   当前版本直接返回 base64，可在页面预览，但无法直接设为公众号封面。
    return NextResponse.json({
      imageBase64: `data:image/png;base64,${firstItem.b64_json}`,
      type: 'base64',
      notice:
        '⚠️ 当前返回的是 base64 格式图片，可在页面预览。若要用作公众号封面，还需接入对象存储（OSS/R2/COS）转换为外链 URL，请联系开发补充上传逻辑。',
    })
  }

  return NextResponse.json(
    { error: '图片生成服务返回了空数据，请重试。' },
    { status: 502 },
  )
}
