/**
 * app/account/orders/page.tsx
 *
 * 我的订单页面
 * - 第一版：空状态，支付系统后续接入
 */

import type { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '我的订单',
  robots: { index: false },
}

export default async function AccountOrdersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/orders')
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto">

        {/* 导航 */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-ink-muted">
          <Link href="/account" className="hover:text-stone transition-colors">用户中心</Link>
          <span>/</span>
          <span className="text-stone">我的订单</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">我的订单</h1>
          <p className="text-sm text-ink-muted mt-2">
            查看付费内容和服务的购买记录。
          </p>
        </div>

        {/* 空状态 */}
        <div className="border border-border bg-surface p-10 text-center">
          <p className="text-sm font-medium text-ink mb-2">暂无订单</p>
          <p className="text-xs text-ink-faint leading-relaxed max-w-xs mx-auto">
            付费内容和会员订阅功能正在建设中。
            开放后你的所有购买记录将在这里显示。
          </p>
        </div>

        {/* 系统说明 */}
        <div className="mt-8 px-4 py-4 border border-border bg-surface-warm">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
            关于支付系统
          </p>
          <p className="text-xs text-ink-muted leading-relaxed">
            支付系统后续接入。第二阶段将支持微信支付、支付宝和 Stripe，
            用于购买付费资料和开通会员。当前阶段免费资料通过公众号领取。
          </p>
        </div>

      </div>
    </Container>
  )
}
