/**
 * POST /api/debug/resend-probe?secret=<PROBE_SECRET>
 *
 * 临时诊断端点——用完即删。
 * 直接调用 Resend 并把完整响应（含错误）返回到 HTTP body。
 * 通过 PROBE_SECRET 环境变量保护，防止随意访问。
 *
 * 使用方法：
 *   1. 在 Vercel 环境变量中设置 PROBE_SECRET=任意随机字符串
 *   2. POST https://zenoaihome.com/api/debug/resend-probe?secret=<那个字符串>
 *      Body: { "to": "你的真实邮箱@example.com" }
 *   3. 看响应中的 resendError 字段
 *   4. 确认问题后删除此文件
 */

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  // 从 URL query 取 secret
  const url  = new URL(req.url)
  const secret = url.searchParams.get('secret') ?? ''
  const envSecret = process.env.PROBE_SECRET ?? ''

  if (!envSecret || secret !== envSecret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const emailFrom = process.env.EMAIL_FROM ?? 'Zeno AI Home <noreply@zenoaihome.com>'

  const diag = {
    RESEND_API_KEY_exists: !!resendKey,
    RESEND_API_KEY_prefix: resendKey ? resendKey.slice(0, 6) + '…' : null,
    EMAIL_FROM: emailFrom,
    NODE_ENV: process.env.NODE_ENV,
  }

  if (!resendKey) {
    return NextResponse.json({ success: false, diag, error: 'RESEND_API_KEY not set' })
  }

  const body = await req.json().catch(() => ({}))
  const to: string = typeof body?.to === 'string' ? body.to.trim() : ''
  if (!to || !to.includes('@')) {
    return NextResponse.json({ success: false, diag, error: 'provide valid "to" field' }, { status: 400 })
  }

  const resend = new Resend(resendKey)

  try {
    const { data, error } = await resend.emails.send({
      from:    emailFrom,
      to,
      subject: '[Zeno Probe] Resend 连通性测试',
      html:    '<p>这是一封诊断测试邮件，可以安全忽略。</p>',
    })

    if (error) {
      // 返回完整 Resend 错误对象（JSON.stringify 确保所有字段可见）
      return NextResponse.json({
        success:    false,
        diag,
        resendError: JSON.parse(JSON.stringify(error)),
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, diag, resendData: data })
  } catch (e) {
    return NextResponse.json({
      success: false,
      diag,
      unexpectedError: e instanceof Error ? e.message : String(e),
    }, { status: 500 })
  }
}
