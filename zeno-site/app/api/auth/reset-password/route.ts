/**
 * POST /api/auth/reset-password
 *
 * 忘记密码 → 通过邮箱验证码重置密码
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resetPasswordSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = resetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数格式不正确' }, { status: 400 })
  }

  const { email, code, newPassword } = parsed.data

  const record = await prisma.verificationCode.findFirst({
    where: {
      email,
      type: 'reset_password',
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

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // 不泄露邮箱是否存在
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    })
    return NextResponse.json({ message: '如果账号存在，密码已重置。' })
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  })

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  })

  return NextResponse.json({ message: '密码重置成功，请使用新密码登录。' })
}
