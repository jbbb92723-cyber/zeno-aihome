/**
 * POST /api/orders/[orderNo]/notify
 *
 * 用户点击"我已付款"后调用，将订单状态改为 pending_confirmation
 */

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ orderNo: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const { orderNo } = await params

  const order = await prisma.order.findFirst({
    where: { orderNo, userId: session.user.id },
  })

  if (!order) {
    return NextResponse.json({ error: '订单不存在' }, { status: 404 })
  }

  if (order.status !== 'pending') {
    return NextResponse.json(
      { error: `订单当前状态为「${order.status}」，无需重复提交` },
      { status: 409 },
    )
  }

  await prisma.order.update({
    where: { id: order.id },
    data:  { status: 'pending_confirmation' },
  })

  return NextResponse.json({ message: '已提交付款通知' })
}
