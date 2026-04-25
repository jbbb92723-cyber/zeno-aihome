/**
 * POST /api/auth/register
 *
 * 邮箱注册：验证码 + 密码
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数格式不正确' }, { status: 400 })
  }

  const { email, password, code } = parsed.data

  // 查找最新未使用的验证码
  const record = await prisma.verificationCode.findFirst({
    where: {
      email,
      type: 'register',
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

  // 增加尝试次数
  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } },
  })

  const valid = await bcrypt.compare(code, record.codeHash)
  if (!valid) {
    return NextResponse.json({ error: '验证码不正确' }, { status: 400 })
  }

  // 检查邮箱是否已注册
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    })
    return NextResponse.json({ error: '此邮箱已注册，请直接登录，或使用"忘记密码"找回。' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      emailVerified: new Date(),
    },
  })

  // 标记验证码已消耗
  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  })

  return NextResponse.json({ message: '注册成功' })
}
