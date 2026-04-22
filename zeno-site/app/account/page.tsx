/**
 * app/account/page.tsx
 *
 * 用户中心首页
 * - 未登录：提示登录
 * - 已登录：显示用户信息、会员状态、快捷入口
 */

import type { Metadata } from 'next'
import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Avatar from '@/components/Avatar'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '用户中心',
  description: '管理你的账号、已领取资料和订单。',
  robots: { index: false },
}

export default async function AccountPage() {
  const session = await auth()

  // 未登录：跳转到登录页
  if (!session?.user) {
    redirect('/login?callbackUrl=/account')
  }

  const user = session.user

  // 角色显示名称
  const roleLabels: Record<string, string> = {
    user:     '已注册',
    member:   '免费会员',
    customer: '付费会员',
    admin:    '管理员',
    visitor:  '未登录',
  }
  const roleLabel = roleLabels[user.role ?? 'user'] ?? '已注册'

  // 会员状态样式
  const roleStyles: Record<string, string> = {
    user:     'text-ink-muted',
    member:   'text-amber-700',
    customer: 'text-purple-700',
    admin:    'text-stone font-semibold',
  }
  const roleStyle = roleStyles[user.role ?? 'user'] ?? 'text-ink-muted'

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto">

        {/* 页面标题 */}
        <div className="mb-10">
          <p className="page-label mb-3">我的账号</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">用户中心</h1>
        </div>

        {/* 用户信息卡片 */}
        <div className="border border-border bg-surface p-6 mb-8">
          <div className="flex items-start gap-4">
            <Avatar
              src={user.image ?? ''}
              alt={user.name ?? 'User'}
              fallback={(user.name?.[0] ?? 'U').toUpperCase()}
              size={48}
            />
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-ink leading-tight">
                {user.name ?? '用户'}
              </p>
              <p className="text-sm text-ink-muted mt-0.5 truncate">
                {user.email ?? ''}
              </p>
              <p className={`text-xs mt-2 ${roleStyle}`}>
                {roleLabel}
              </p>
            </div>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/account/resources"
            className="border border-border bg-surface hover:bg-surface-warm p-5 transition-colors group"
          >
            <p className="text-xs text-ink-faint uppercase tracking-widest font-semibold mb-2">
              已领资料
            </p>
            <p className="text-sm text-ink group-hover:text-stone transition-colors">
              查看已领取的资料 →
            </p>
          </Link>

          <Link
            href="/account/orders"
            className="border border-border bg-surface hover:bg-surface-warm p-5 transition-colors group"
          >
            <p className="text-xs text-ink-faint uppercase tracking-widest font-semibold mb-2">
              我的订单
            </p>
            <p className="text-sm text-ink group-hover:text-stone transition-colors">
              查看购买记录 →
            </p>
          </Link>
        </div>

        {/* 会员状态说明 */}
        {user.role === 'user' && (
          <div className="border border-border bg-stone-pale/30 p-5 mb-8">
            <p className="text-xs text-ink-faint uppercase tracking-widest font-semibold mb-2">
              会员状态
            </p>
            <p className="text-sm text-ink-muted leading-relaxed">
              你当前是注册用户，尚未开通会员。
            </p>
            <p className="text-xs text-ink-faint mt-2">
              会员功能正在建设中，开放后将在此处通知。
            </p>
          </div>
        )}

        {(user.role === 'member' || user.role === 'customer') && (
          <div className="border border-amber-200 bg-amber-50/50 p-5 mb-8">
            <p className="text-xs text-amber-600 uppercase tracking-widest font-semibold mb-2">
              会员专属
            </p>
            <p className="text-sm text-ink-muted leading-relaxed">
              会员资料和专属内容已解锁，前往资料库领取。
            </p>
          </div>
        )}

        {/* 退出登录 */}
        <div className="pt-6 border-t border-border">
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}
          >
            <button
              type="submit"
              className="text-sm text-ink-faint hover:text-ink transition-colors underline underline-offset-2 decoration-border"
            >
              退出登录
            </button>
          </form>
        </div>

      </div>
    </Container>
  )
}
