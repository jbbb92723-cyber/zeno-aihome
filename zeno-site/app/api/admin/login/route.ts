/**
 * POST /api/admin/login
 * POST /api/admin/logout
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminPassword, generateAdminToken } from '@/lib/admin'

export async function POST(req: Request) {
  const url = new URL(req.url)
  const isLogout = url.searchParams.get('action') === 'logout'

  if (isLogout) {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    return NextResponse.json({ message: 'ok' })
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
