/**
 * lib/admin.ts
 *
 * 管理员身份判断 — 独立于普通用户系统
 *
 * 管理员通过 /admin/login 输入 ADMIN_PASSWORD 获取管理员 cookie。
 * 普通邮箱用户和 Google 用户都不是管理员。
 */

import { cookies } from 'next/headers'
import crypto from 'crypto'

const ADMIN_COOKIE = 'admin_session'

function getAdminSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? ''
}

/**
 * 生成管理员 session token
 */
export function generateAdminToken(): string {
  const secret = getAdminSecret()
  const payload = `admin:${Date.now()}`
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}:${hmac}`
}

/**
 * 验证管理员 session token
 */
export function verifyAdminToken(token: string): boolean {
  const secret = getAdminSecret()
  if (!secret || !token) return false

  const parts = token.split(':')
  if (parts.length !== 3) return false

  const [prefix, ts, hmac] = parts
  if (prefix !== 'admin') return false

  // 检查是否过期（7 天）
  const timestamp = parseInt(ts, 10)
  if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) return false

  const expected = crypto.createHmac('sha256', secret).update(`${prefix}:${ts}`).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))
}

/**
 * 判断当前请求者是否为管理员
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE)?.value
    if (!token) return false
    return verifyAdminToken(token)
  } catch {
    return false
  }
}

/**
 * 验证管理员密码
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPwd = process.env.ADMIN_PASSWORD
  if (!adminPwd || !password) return false
  return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(adminPwd))
}
