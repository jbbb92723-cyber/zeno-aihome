/**
 * POST /api/debug/send-test-email
 *
 * 仅限管理员使用的 Resend 连通性测试接口。
 * 不依赖任何模块缓存，每次调用均从 process.env 实时读取配置。
 *
 * 请求体：{ "to": "test@example.com" }
 * 响应：Resend 完整返回值（含 error / data）
 */

import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'
import { Resend } from 'resend'

export async function POST(req: Request) {
  // 仅管理员可调用
  const ok = await isAdminUser()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const to: string = typeof body?.to === 'string' ? body.to.trim() : ''
  if (!to || !to.includes('@')) {
    return NextResponse.json({ error: '请提供有效的收件邮箱 to 字段' }, { status: 400 })
  }

  // 实时读取环境变量——绕开任何模块缓存问题
  const resendKey = process.env.RESEND_API_KEY
  const emailFrom = process.env.EMAIL_FROM ?? 'Zeno AI Home <noreply@zenoaihome.com>'

  // 返回当前读到的配置，便于核对
  const envDiag = {
    RESEND_API_KEY_exists: !!resendKey,
    RESEND_API_KEY_prefix: resendKey ? resendKey.slice(0, 6) + '…' : null,
    EMAIL_FROM: emailFrom,
    to,
  }
  console.log('[debug/send-test-email] env:', JSON.stringify(envDiag))

  if (!resendKey) {
    return NextResponse.json({
      success: false,
      error: 'RESEND_API_KEY 未设置',
      envDiag,
    }, { status: 503 })
  }

  const resend = new Resend(resendKey)

  try {
    const { data, error } = await resend.emails.send({
      from:    emailFrom,
      to,
      subject: '[Zeno Debug] Resend 连通性测试',
      html: `<p>这是一封测试邮件，由 <code>/api/debug/send-test-email</code> 触发。</p>
             <p>如果你能收到这封邮件，说明 Resend + 域名配置均正常。</p>
             <hr/>
             <pre>${JSON.stringify(envDiag, null, 2)}</pre>`,
    })

    if (error) {
      console.error('[debug/send-test-email] Resend error:', JSON.stringify(error, null, 2))
      return NextResponse.json({
        success: false,
        envDiag,
        resendError: error,
      }, { status: 500 })
    }

    console.log('[debug/send-test-email] Sent OK, id:', data?.id)
    return NextResponse.json({
      success: true,
      envDiag,
      resendData: data,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[debug/send-test-email] Unexpected error:', msg)
    return NextResponse.json({
      success: false,
      envDiag,
      unexpectedError: msg,
    }, { status: 500 })
  }
}
