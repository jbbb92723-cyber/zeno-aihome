import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ClaimSchema = z.object({
  resourceId:    z.string().min(1).max(50),
  resourceTitle: z.string().min(1).max(200),
  resourceUrl:   z.string().url().optional().or(z.literal('')),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const parsed = ClaimSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数校验失败', detail: parsed.error.flatten() }, { status: 422 })
  }

  const { resourceId, resourceTitle, resourceUrl } = parsed.data
  const userId = session.user.id

  // 幂等：已领取则直接返回现有记录
  const existing = await prisma.resourceClaim.findFirst({
    where: { userId, resourceId },
  })
  if (existing) {
    return NextResponse.json({ ok: true, claim: existing, created: false })
  }

  const claim = await prisma.resourceClaim.create({
    data: {
      userId,
      resourceId,
      resourceTitle,
      resourceUrl: resourceUrl || null,
    },
  })

  return NextResponse.json({ ok: true, claim, created: true }, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const claims = await prisma.resourceClaim.findMany({
    where: { userId: session.user.id },
    orderBy: { claimedAt: 'desc' },
  })

  return NextResponse.json({ claims })
}
