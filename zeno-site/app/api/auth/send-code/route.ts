/**
 * POST /api/auth/send-code
 *
 * 发送邮箱验证码（注册 / 重置密码 / 修改密码）
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCodeSchema } from '@/lib/validations'
import { sendVerificationCode, isEmailConfigured } from '@/lib/email'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json({ error: '邮箱服务待配置' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const parsed = sendCodeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数格式不正确' }, { status: 400 })
  }

  const { email, type } = parsed.data

  // 60 秒内不能重复发送
  const recent = await prisma.verificationCode.findFirst({
    where: {
      email,
      type,
      createdAt: { gt: new Date(Date.now() - 60_000) },
    },
    orderBy: { createdAt: 'desc' },
  })
  if (recent) {
    return NextResponse.json({ error: '请 60 秒后再试' }, { status: 429 })
  }

  // 生成 6 位验证码
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const codeHash = await bcrypt.hash(code, 10)

  await prisma.verificationCode.create({
    data: {
      email,
      codeHash,
      type,
      expiresAt: new Date(Date.now() + 10 * 60_000), // 10 分钟
    },
  })

  const sent = await sendVerificationCode(email, code)

  if (!sent) {
    // 邮件实际发送失败，删除刚创建的验证码记录，返回错误让前端正确提示
    await prisma.verificationCode.deleteMany({
      where: { email, type, consumedAt: null, expiresAt: { gt: new Date() } },
    }).catch(() => {})
    console.error('[send-code] Email delivery failed for:', email, '| type:', type)
    return NextResponse.json(
      { error: '验证码发送失败，请检查邮箱地址后重试，或联系管理员。' },
      { status: 500 },
    )
  }

  // 无论邮箱是否存在，都返回统一提示
  return NextResponse.json({ message: '验证码已发送，请查收邮件（含垃圾箱）。' })
}
