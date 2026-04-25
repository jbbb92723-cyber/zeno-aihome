/**
 * POST /api/admin/login
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminPassword, generateAdminToken } from '@/lib/admin'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: Request) {
  // ── IP 暴力破解防护：5 次失败锁定 10 分钟 ──────────────────
  const ip = getClientIp(req)
  const limiter = checkRateLimit(`admin-login:${ip}`, 5, 10 * 60_000)
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: `登录尝试过多，请 10 分钟后重试` },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => null)
  const password = body?.password as string

  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: '密码不正确' }, { status: 401 })
  }

  const token = generateAdminToken()
  const cookieStore = await cookies()
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   7 * 24 * 60 * 60,
  })

  return NextResponse.json({ message: '登录成功' })
}
