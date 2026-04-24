/**
 * POST /api/auth/change-password
 *
 * 登录后通过邮箱验证码修改密码
 */

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { changePasswordSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = changePasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数格式不正确' }, { status: 400 })
  }

  const { code, newPassword } = parsed.data
  const email = session.user.email

  const record = await prisma.verificationCode.findFirst({
    where: {
      email,
      type: 'change_password',
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!record) {
    return NextResponse.json({ error: '验证码无效或已过期' }, { status: 400 })
  }

  if (record.attempts >= 5) {
    return NextResponse.json({ error: '验证码尝试次数过多，请重新获取' }, { status: 400 })
  }

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } },
  })

  const valid = await bcrypt.compare(code, record.codeHash)
  if (!valid) {
    return NextResponse.json({ error: '验证码不正确' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  })

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  })

  return NextResponse.json({ message: '密码修改成功。' })
}
