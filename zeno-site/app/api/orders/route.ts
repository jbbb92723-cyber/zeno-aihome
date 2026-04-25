/**
 * app/api/orders/route.ts
 *
 * POST /api/orders — 创建待付款订单
 * GET  /api/orders — 当前用户订单列表
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getProductById } from '@/data/products'
import { z } from 'zod'

const createOrderSchema = z.object({
  productId:     z.string().min(1).max(64),
  paymentMethod: z.enum(['wechat', 'alipay']).default('wechat'),
  couponCode:    z.string().optional(),
})

/** 生成订单号：ZENO-YYYYMMDD-XXXX */
function genOrderNo(): string {
  const d = new Date()
  const date = d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ZENO-${date}-${rand}`
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数错误' }, { status: 400 })
  }

  const { productId, paymentMethod } = parsed.data
  const product = getProductById(productId)
  if (!product) {
    return NextResponse.json({ error: '商品不存在或已下架' }, { status: 404 })
  }

  const orderNo = genOrderNo()

  const order = await prisma.order.create({
    data: {
      userId:        session.user.id,
      orderNo,
      productId,
      productName:   product.name,
      productType:   product.type,
      amount:        product.price,
      discountAmount: 0,
      paidAmount:    product.price,
      status:        'pending',
      paymentMethod,
      source:        'web',
      // remark 存储权益 value，grantEntitlement 读取
      remark:        product.value,
    },
  })

  return NextResponse.json({ orderNo: order.orderNo }, { status: 201 })
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where:   { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take:    20,
    select:  {
      orderNo:     true,
      productName: true,
      paidAmount:  true,
      status:      true,
      createdAt:   true,
      paidAt:      true,
    },
  })

  return NextResponse.json({ orders })
}

