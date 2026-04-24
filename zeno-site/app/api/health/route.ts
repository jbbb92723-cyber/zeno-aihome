/**
 * GET /api/health
 * 快速检查数据库连接、邮件服务、管理员配置是否就绪
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
    checks.database = { ok: false, msg: `连接失败: ${(e as Error).message.slice(0, 80)}` }
  }

  // 2. Email
  checks.email = isEmailConfigured()
    ? { ok: true, msg: 'RESEND_API_KEY 已配置' }
    : { ok: false, msg: 'RESEND_API_KEY 未设置' }

  // 3. Auth secret
  checks.auth = process.env.AUTH_SECRET
    ? { ok: true, msg: 'AUTH_SECRET 已配置' }
    : { ok: false, msg: 'AUTH_SECRET 未设置' }

  // 4. Admin password
  checks.admin = process.env.ADMIN_PASSWORD
    ? { ok: true, msg: 'ADMIN_PASSWORD 已配置' }
    : { ok: false, msg: 'ADMIN_PASSWORD 未设置' }

  // 5. Google OAuth (optional)
  const googleId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID
  checks.google = googleId
    ? { ok: true, msg: 'Google OAuth 已配置' }
    : { ok: false, msg: '未配置（可选）' }

  const allOk = ['database', 'email', 'auth', 'admin'].every((k) => checks[k].ok)

  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 503 })
}
