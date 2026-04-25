/**
 * lib/email.ts — Resend 邮件验证码发送
 */

import { Resend } from 'resend'

const resendKey = process.env.RESEND_API_KEY
const emailFrom = process.env.EMAIL_FROM ?? 'Zeno AI Home <noreply@zenoaihome.com>'

let resend: Resend | null = null
if (resendKey) {
  resend = new Resend(resendKey)
} else {
  console.error('[Email] RESEND_API_KEY is not set — email sending disabled')
}

export function isEmailConfigured(): boolean {
  return !!resendKey
}

export async function sendVerificationCode(email: string, code: string): Promise<boolean> {
  if (!resend) {
    console.error('[Email] Resend client not initialized (RESEND_API_KEY missing)')
    return false
  }

  console.log(`[Email] Attempting to send verification code to: ${email} | from: ${emailFrom}`)

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
      // 输出完整错误，便于在 Vercel Functions Logs 中诊断
      console.error('[Email] Resend API error:', JSON.stringify({
        name:       (error as { name?: string }).name,
        message:    error.message,
        statusCode: (error as { statusCode?: number }).statusCode,
      }))
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
