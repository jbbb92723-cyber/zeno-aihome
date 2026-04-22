/**
 * app/api/payments/webhook/route.ts
 *
 * 支付 Webhook 占位路由
 *
 * ⚠️ 重要安全说明：
 * 支付回调必须做签名验证（HMAC），不能只靠请求内容判断支付成功。
 * 第一阶段只做占位，不处理真实支付事件。
 *
 * TODO（第二阶段）：
 * 1. 根据支付平台读取相应的 webhook secret
 * 2. 验证签名（Stripe 用 stripe-signature header，微信用 XML + MD5）
 * 3. 验签通过后才处理业务逻辑
 * 4. 将原始事件存入 payment_events 表（幂等处理）
 * 5. 支付成功后更新 orders 表状态为 paid
 * 6. 支付成功后更新 memberships 表开通会员权限
 * 7. 返回正确的 HTTP 200（否则支付平台会重试）
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // TODO（第二阶段）：
  // 1. 获取原始请求体（用于验签，不能 .json() 后再验）
  // const rawBody = await request.text()

  // 2. 根据 header 判断来自哪个支付平台
  // const stripeSignature = request.headers.get('stripe-signature')

  // 3. 验签
  // const event = stripe.webhooks.constructEvent(rawBody, stripeSignature!, process.env.STRIPE_WEBHOOK_SECRET!)

  // 4. 处理事件
  // if (event.type === 'payment_intent.succeeded') { ... }

  // 5. 存入 payment_events 表
  // await db.paymentEvent.create({ data: { provider, eventType, rawPayload, processed: false } })

  // 第一阶段：仅打印日志并返回 200（避免支付平台重试）
  console.log('[Payment Webhook] Received webhook (placeholder - not processing)')

  return NextResponse.json({ received: true }, { status: 200 })
}
