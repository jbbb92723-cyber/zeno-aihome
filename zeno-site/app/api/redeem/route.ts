/**
 * POST /api/redeem
 *
 * 用户兑换码核销接口
 *
 * 支持类型：
 *   membership      → 创建/更新 memberships 表
 *   resource        → 写入 resource_claims 表
 *   coupon          → 写入 coupon_claims 表
 *   service_discount → 记录兑换事件（暂不做复杂抵扣）
 */

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  code: z.string().trim().min(1).max(64),
})

export async function POST(req: Request) {
  // 1. 必须登录
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }
  const userId = session.user.id

  // 2. 解析参数
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '请输入有效的兑换码' }, { status: 400 })
  }
  const { code } = parsed.data

  // 3. 查询兑换码（不区分大小写）
  const redeemCode = await prisma.redeemCode.findFirst({
    where: { code: code.toUpperCase() },
    include: { usages: { where: { userId } } },
  })

  if (!redeemCode) {
    return NextResponse.json({ error: '兑换码不存在，请核对后重试' }, { status: 404 })
  }

  if (!redeemCode.isActive) {
    return NextResponse.json({ error: '该兑换码暂不可用' }, { status: 400 })
  }

  if (redeemCode.expiresAt && redeemCode.expiresAt < new Date()) {
    return NextResponse.json({ error: '兑换码已过期' }, { status: 400 })
  }

  if (redeemCode.usedCount >= redeemCode.maxUses) {
    return NextResponse.json({ error: '兑换码已被使用完' }, { status: 400 })
  }

  if (redeemCode.usages.length > 0) {
    return NextResponse.json({ error: '你已经兑换过该码' }, { status: 400 })
  }

  // 4. 兑换逻辑 — 在事务中写入
  const type = redeemCode.type
  const value = redeemCode.value ?? ''

  try {
    await prisma.$transaction(async (tx) => {
      // 4-a. 写兑换记录
      await tx.redeemCodeUsage.create({
        data: { redeemCodeId: redeemCode.id, userId },
      })

      // 4-b. 更新使用计数
      await tx.redeemCode.update({
        where: { id: redeemCode.id },
        data: { usedCount: { increment: 1 } },
      })

      // 4-c. 根据类型开通权益
      if (type === 'membership') {
        // value 格式：plan:days  例如 "creator:30" 或 "creator:365"
        const [plan, daysStr] = value.split(':')
        const days = parseInt(daysStr ?? '30', 10)
        const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

        await tx.membership.upsert({
          where: { userId },
          create: {
            userId,
            plan: plan || 'creator',
            status: 'active',
            expiresAt,
          },
          update: {
            plan: plan || 'creator',
            status: 'active',
            // 续期：如果已有未过期会员，顺延；否则从现在起算
            expiresAt: await (async () => {
              const existing = await tx.membership.findUnique({ where: { userId } })
              if (existing?.expiresAt && existing.expiresAt > new Date()) {
                return new Date(existing.expiresAt.getTime() + days * 24 * 60 * 60 * 1000)
              }
              return expiresAt
            })(),
          },
        })
      } else if (type === 'resource') {
        // value 格式：resourceId  例如 "01" 或 "zhuangxiu-yusuan-moban"
        // 支持：value 为 "resourceId|resourceTitle|resourceUrl"
        const parts = value.split('|')
        const resourceId    = parts[0] ?? value
        const resourceTitle = parts[1] ?? `资料 ${resourceId}`
        const resourceUrl   = parts[2] ?? undefined

        // 幂等：同一资料不重复写入
        const existing = await tx.resourceClaim.findFirst({
          where: { userId, resourceId },
        })
        if (!existing) {
          await tx.resourceClaim.create({
            data: { userId, resourceId, resourceTitle, resourceUrl },
          })
        }
      } else if (type === 'coupon') {
        // value 就是 coupon.code
        const coupon = await tx.coupon.findUnique({ where: { code: value } })
        if (coupon && coupon.isActive) {
          // 幂等
          const alreadyClaimed = await tx.couponClaim.findUnique({
            where: { couponId_userId: { couponId: coupon.id, userId } },
          })
          if (!alreadyClaimed) {
            await tx.couponClaim.create({
              data: { couponId: coupon.id, userId },
            })
          }
        }
      }
      // service_discount: 只记录兑换事件，权益由后台人工处理
    })
  } catch (e) {
    console.error('[redeem] transaction error:', e)
    return NextResponse.json({ error: '兑换失败，请稍后重试' }, { status: 500 })
  }

  // 5. 返回成功
  const resultMsg: Record<string, string> = {
    membership:       '会员已开通，权益已生效',
    resource:         '资料已解锁，可在「已领资料」查看',
    coupon:           '优惠券已领取，可在结账时使用',
    service_discount: '服务折扣已记录，客服将在 1 个工作日内联系你',
  }

  return NextResponse.json({
    success: true,
    type,
    message: resultMsg[type] ?? '兑换成功，权益已生效',
  })
}
