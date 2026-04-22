/**
 * app/api/orders/route.ts
 *
 * 订单 API 路由（占位）
 *
 * 第一阶段：不处理真实支付，只做结构占位
 *
 * TODO（第二阶段）：
 * 1. 接入 Stripe / 微信支付 / 支付宝
 * 2. 创建支付意图（Payment Intent）
 * 3. 支付成功后更新 orders 表和 memberships 表
 * 4. 通过 webhook 而非前端回调确认支付成功
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: '请先登录。' }, { status: 401 })
  }

  // TODO（第二阶段）：
  // 1. 解析 productType 和 productId
  // 2. 查询产品价格
  // 3. 调用支付平台创建订单
  // 4. 在 orders 表插入 pending 记录
  // 5. 返回支付跳转链接或支付参数

  return NextResponse.json(
    {
      message: '支付系统正在建设中，暂不支持在线支付。',
      // TODO: paymentUrl: '...'
    },
    { status: 503 },
  )
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: '请先登录。' }, { status: 401 })
  }

  // TODO（第二阶段）：从 orders 表查询当前用户的订单列表
  /*
  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ orders })
  */

  return NextResponse.json({ orders: [] })
}
