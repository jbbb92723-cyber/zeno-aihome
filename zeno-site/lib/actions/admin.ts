'use server'

import { revalidatePath } from 'next/cache'
import { isAdminUser } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { grantEntitlement } from '@/lib/entitlements'

// ─── 权限守卫 ────────────────────────────────────────────────
async function requireAdmin() {
  const ok = await isAdminUser()
  if (!ok) throw new Error('Unauthorized')
}

// ─── 订单状态 ────────────────────────────────────────────────
export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin()
  const validStatuses = ['pending', 'paid', 'processing', 'completed', 'cancelled', 'refunded']
  if (!validStatuses.includes(status)) throw new Error('Invalid status')

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...(status === 'paid'      ? { paidAt: new Date() } : {}),
      ...(status === 'completed' ? { completedAt: new Date() } : {}),
    },
  })

  await prisma.adminLog.create({ data: { action: 'update_order_status', target: orderId, detail: { status } } })
  revalidatePath('/admin/orders')
}

// ─── 会员管理 ────────────────────────────────────────────────
export async function grantMembership(userId: string, plan: string, days: number) {
  await requireAdmin()
  const expiresAt = new Date(Date.now() + days * 86400_000)

  await prisma.membership.upsert({
    where:  { userId },
    create: { userId, plan, status: 'active', expiresAt },
    update: { plan, status: 'active', expiresAt, startedAt: new Date() },
  })

  await prisma.adminLog.create({ data: { action: 'grant_membership', target: userId, detail: { plan, days } } })
  revalidatePath('/admin/members')
}

export async function revokeMembership(membershipId: string) {
  await requireAdmin()
  await prisma.membership.update({
    where: { id: membershipId },
    data:  { status: 'cancelled' },
  })
  await prisma.adminLog.create({ data: { action: 'revoke_membership', target: membershipId } })
  revalidatePath('/admin/members')
}

// ─── 服务申请状态 ─────────────────────────────────────────────
export async function updateServiceStatus(requestId: string, status: string) {
  await requireAdmin()
  const validStatuses = ['submitted', 'reviewing', 'completed', 'rejected']
  if (!validStatuses.includes(status)) throw new Error('Invalid status')

  await prisma.serviceRequest.update({ where: { id: requestId }, data: { status } })
  await prisma.adminLog.create({ data: { action: 'update_service_status', target: requestId, detail: { status } } })
  revalidatePath('/admin/services')
}

// ─── 兑换码 ──────────────────────────────────────────────────
export async function createRedeemCode(data: {
  code: string; type: string; value?: string
  maxUses: number; expiresAt?: string; note?: string
}) {
  await requireAdmin()

  if (!/^[A-Z0-9\-]{4,32}$/.test(data.code)) throw new Error('Invalid code format')

  await prisma.redeemCode.create({
    data: {
      code:      data.code.toUpperCase(),
      type:      data.type,
      value:     data.value ?? null,
      maxUses:   data.maxUses,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      note:      data.note ?? null,
    },
  })

  await prisma.adminLog.create({ data: { action: 'create_redeem_code', detail: { code: data.code } } })
  revalidatePath('/admin/redeem-codes')
}

export async function batchCreateRedeemCodes(data: {
  prefix: string; count: number; type: string; value?: string
  maxUses: number; expiresAt?: string
}) {
  await requireAdmin()
  if (data.count < 1 || data.count > 500) throw new Error('Count 1–500')

  const codes = Array.from({ length: data.count }, () => {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
    return {
      code: `${data.prefix.toUpperCase()}-${rand}`,
      type: data.type,
      value: data.value ?? null,
      maxUses: data.maxUses,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    }
  })

  await prisma.redeemCode.createMany({ data: codes, skipDuplicates: true })
  await prisma.adminLog.create({ data: { action: 'batch_create_redeem_codes', detail: { count: codes.length } } })
  revalidatePath('/admin/redeem-codes')
}

// ─── 优惠券 ──────────────────────────────────────────────────
export async function createCoupon(data: {
  code: string; name: string; type: 'fixed' | 'percent'
  value: number; minAmount: number; maxUses?: number; expiresAt?: string
}) {
  await requireAdmin()

  await prisma.coupon.create({
    data: {
      code:      data.code.toUpperCase(),
      name:      data.name,
      type:      data.type,
      value:     data.value,
      minAmount: data.minAmount,
      maxUses:   data.maxUses ?? null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  })

  await prisma.adminLog.create({ data: { action: 'create_coupon', detail: { code: data.code } } })
  revalidatePath('/admin/coupons')
}

// ─── 支付确认（手动付款流） ────────────────────────────────────
export async function confirmPayment(orderId: string) {
  await requireAdmin()

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Order not found')

  const allowedStatuses = ['pending', 'pending_confirmation']
  if (!allowedStatuses.includes(order.status)) {
    throw new Error(`订单状态为 ${order.status}，无法确认`)
  }

  // 先更新为 paid，grantEntitlement 内部会改为 completed
  await prisma.order.update({
    where: { id: orderId },
    data:  { status: 'paid', paidAt: new Date() },
  })

  // 开通权益 + 改为 completed
  await grantEntitlement(orderId)

  await prisma.adminLog.create({
    data: { action: 'confirm_payment', target: orderId },
  })

  revalidatePath('/admin/orders')
}
