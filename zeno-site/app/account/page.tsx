/**
 * app/account/page.tsx
 *
 * 用户中心首页
 * - 未登录：提示登录
 * - 已登录：显示用户信息、会员状态、快捷入口
 */

import type { Metadata } from 'next'
import { auth, signOut } from '@/auth'
import Link from 'next/link'
import Avatar from '@/components/Avatar'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '账号中心',
  description: '社区登录状态、已领取资料和使用记录。',
  robots: { index: false },
}

export default async function AccountPage() {
  const session = await auth()

  // 未登录：显示说明页，不强制跳转
  if (!session?.user) {
    return (
      <Container size="content" className="py-section">
        <div className="max-w-sm mx-auto">
          <div className="mb-10">
            <p className="page-label mb-3">账号中心</p>
            <h1 className="text-2xl font-semibold text-ink tracking-tight">账号中心</h1>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed mb-8">
            这里用于显示你的社区登录状态、已领取资料、评论记录和会员权限。
            当前 IDC Flare 登录还在配置中，公开内容可以直接阅读，不需要登录。
          </p>
          <Link
            href="/login"
            className="inline-block text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
          >
            前往登录页
          </Link>
        </div>
      </Container>
    )
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
          <p className="page-label mb-3">账号中心</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">账号中心</h1>
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
              暂未开放。
            </p>
          </div>
        )}

        {(user.role === 'member' || user.role === 'customer') && (
          <div className="border border-amber-200 bg-amber-50/50 p-5 mb-8">
            <p className="text-xs text-amber-600 uppercase tracking-widest font-semibold mb-2">
              会员状态
            </p>
            <p className="text-sm text-ink-muted leading-relaxed">
              已领取资料和评论记录待接入。
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
