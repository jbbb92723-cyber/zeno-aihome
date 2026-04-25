/**
 * GET /api/health
 * 快速检查数据库连接、邮件服务、管理员配置是否就绪
 * 包含 Auth.js 所需的全部环境变量检查
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isEmailConfigured } from '@/lib/email'

export async function GET() {
  const checks: Record<string, { ok: boolean; msg: string }> = {}

  // 1. Database
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = { ok: true, msg: '已连接' }
  } catch (e) {
    checks.database = { ok: false, msg: `连接失败: ${(e as Error).message.slice(0, 120)}` }
  }

  // 2. Email (Resend)
  const emailFrom = process.env.EMAIL_FROM
  const resendOk = isEmailConfigured()
  if (!resendOk) {
    checks.email = { ok: false, msg: 'RESEND_API_KEY 未设置 → 验证码发送功能不可用' }
  } else if (!emailFrom) {
    checks.email = { ok: false, msg: 'RESEND_API_KEY 已配置，但 EMAIL_FROM 未设置（将使用默认值）' }
  } else {
    // 验证 EMAIL_FROM 格式合理（含 @）
    const hasAt = emailFrom.includes('@')
    checks.email = hasAt
      ? { ok: true,  msg: `RESEND_API_KEY 已配置 | EMAIL_FROM: ${emailFrom}` }
      : { ok: false, msg: `EMAIL_FROM 格式可能有误: "${emailFrom}"` }
  }

  // 3. Auth secret
  checks.auth_secret = process.env.AUTH_SECRET
    ? { ok: true, msg: 'AUTH_SECRET 已配置' }
    : { ok: false, msg: 'AUTH_SECRET 未设置 → 所有登录将失败' }

  // 4. AUTH_URL / NEXTAUTH_URL
  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  checks.auth_url = authUrl
    ? { ok: true, msg: `${authUrl}` }
    : { ok: false, msg: 'AUTH_URL 未设置 → Google OAuth 回调可能指向错误域名，建议设为 https://zenoaihome.com' }

  // 5. Google OAuth
  const googleId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID
  const googleSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET
  if (googleId && googleSecret) {
    checks.google = { ok: true, msg: 'Google OAuth 已配置' }
  } else {
    const missing = [!googleId && 'AUTH_GOOGLE_ID', !googleSecret && 'AUTH_GOOGLE_SECRET'].filter(Boolean).join('、')
    checks.google = { ok: false, msg: `未配置：${missing} → Google 登录不可用` }
  }

  // 6. Admin password
  checks.admin = process.env.ADMIN_PASSWORD
    ? { ok: true, msg: 'ADMIN_PASSWORD 已配置' }
    : { ok: false, msg: 'ADMIN_PASSWORD 未设置' }

  // 7. 关键 DB URL 提示（只检查是否存在 pgbouncer 参数，不暴露值）
  const dbUrl = process.env.DATABASE_URL ?? ''
  checks.database_url_pooler = dbUrl.includes('pgbouncer=true')
    ? { ok: true, msg: 'DATABASE_URL 已使用 pgbouncer pooler（Vercel 必须）' }
    : { ok: false, msg: 'DATABASE_URL 未包含 ?pgbouncer=true → Vercel 上邮箱登录可能超时' }

  const critical = ['database', 'auth_secret']
  const allOk = critical.every((k) => checks[k].ok)

  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 503 })
}
