/**
 * lib/entitlements.ts
 *
 * 订单权益兑现：订单付款确认后，自动开通对应会员/资源
 */

import { prisma } from './prisma'

interface Order {
  id:          string
  userId:      string | null
  productType: string
  productName: string
  // value 字段来自 metadata，格式与兑换码 value 一致
  // membership: "creator:30" / resource: "resourceId|title|url"
}

/**
 * 根据订单开通权益（在事务外调用，内部使用独立事务）
 * @param orderId DB 中的 order.id
 */
export async function grantEntitlement(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  })

  if (!order || !order.userId) {
    console.warn('[entitlement] order not found or no userId:', orderId)
    return
  }

  const userId = order.userId as string
  // value 字段：使用 remark 字段存储（orders 表已有 remark 字段）
  const value = order.remark ?? ''

  await prisma.$transaction(async (tx) => {
    if (order.productType === 'membership') {
      // value 格式：plan:days  例如 "creator:30"
      const [plan, daysStr] = value.split(':')
      const days = parseInt(daysStr ?? '30', 10)
      const now = new Date()
      const expiresAt = new Date(now.getTime() + days * 86400_000)

      // 续期逻辑：如已有未过期会员则顺延
      const existing = await tx.membership.findUnique({ where: { userId } })
      const newExpiry = (existing?.expiresAt && existing.expiresAt > now)
        ? new Date(existing.expiresAt.getTime() + days * 86400_000)
        : expiresAt

      await tx.membership.upsert({
        where:  { userId },
        create: { userId, plan: plan || 'creator', status: 'active', expiresAt: newExpiry },
        update: { plan: plan || 'creator', status: 'active', expiresAt: newExpiry },
      })
    } else if (order.productType === 'resource') {
      // value 格式：resourceId|resourceTitle|resourceUrl
      const parts = value.split('|')
      const resourceId    = parts[0] ?? orderId
      const resourceTitle = parts[1] ?? order.productName
      const resourceUrl   = parts[2] ?? undefined

      const existing = await tx.resourceClaim.findFirst({ where: { userId, resourceId } })
      if (!existing) {
        await tx.resourceClaim.create({
          data: { userId, resourceId, resourceTitle, resourceUrl },
        })
      }
    }

    // 标记订单为 completed
    await tx.order.update({
      where: { id: orderId },
      data:  { status: 'completed', completedAt: new Date() },
    })

    await tx.adminLog.create({
      data: {
        action: 'grant_entitlement',
        target: orderId,
        detail: { userId, productType: order.productType, value },
      },
    })
  })
}
