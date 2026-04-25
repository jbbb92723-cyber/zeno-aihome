/**
 * lib/email.ts — Resend 邮件验证码发送
 *
 * 注意：Resend 客户端在每次函数调用时从 process.env 读取，避免 Next.js
 * 模块缓存导致顶层初始化时 env 未就绪的问题。
 */

import { Resend } from 'resend'

/**
 * 判断 Resend API Key 是否已配置（在请求时读取，而非模块加载时）
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

export async function sendVerificationCode(email: string, code: string): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY
  const emailFrom = process.env.EMAIL_FROM ?? 'Zeno AI Home <noreply@zenoaihome.com>'

  // 诊断日志 —— 可在 Vercel Functions Logs 中看到
  console.log('[Email] RESEND_API_KEY exists:', !!resendKey)
  console.log('[Email] EMAIL_FROM:', emailFrom)
  console.log('[Email] to:', email)

  if (!resendKey) {
    console.error('[Email] RESEND_API_KEY is not set at request time')
    return false
  }

  const resend = new Resend(resendKey)

  try {
    const { data, error } = await resend.emails.send({
      from:    emailFrom,
      to:      email,
      subject: 'Zeno AI Home 验证码',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #2A2723; margin-bottom: 24px;">
            Zeno AI Home 验证码
          </h2>
          <p style="font-size: 14px; color: #6F6860; line-height: 1.6; margin-bottom: 20px;">
            你的验证码是：
          </p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2A2723; background: #FAF8F4; border: 1px solid #E8E1D8; padding: 16px 24px; text-align: center; margin-bottom: 20px;">
            ${code}
          </div>
          <p style="font-size: 13px; color: #A09890; line-height: 1.6;">
            10 分钟内有效。如果不是你本人操作，可以忽略这封邮件。
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('[Email] Resend API error:', JSON.stringify(error, null, 2))
      console.error('[Email] from:', emailFrom, '| to:', email)
      return false
    }

    console.log('[Email] Sent successfully, Resend id:', data?.id)
    return true
  } catch (e) {
    console.error('[Email] Unexpected send error:', e)
    return false
  }
}
