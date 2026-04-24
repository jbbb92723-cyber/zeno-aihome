import type { Metadata } from 'next'
import { auth, signOut } from '@/auth'
import Link from 'next/link'
import Avatar from '@/components/Avatar'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '个人中心',
  robots: { index: false },
}

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <Container size="content" className="py-section">
        <div className="max-w-md mx-auto">
          <div className="mb-10">
            <p className="page-label mb-3">个人中心</p>
            <h1 className="text-2xl font-semibold text-ink tracking-tight">个人中心</h1>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            请先登录，公开内容不需要登录即可阅读。
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="inline-block text-sm font-medium text-white bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
            >
              去登录
            </Link>
            <Link
              href="/"
              className="inline-block text-sm text-ink-muted border border-border px-4 py-2 hover:bg-surface-warm transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </Container>
    )
  }

  const user = session.user
  const providerLabel = user.provider === 'google' ? 'Google' : user.provider === 'credentials' ? '邮箱密码' : user.provider || '—'

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto">

        <div className="mb-10">
          <p className="page-label mb-3">个人中心</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">个人中心</h1>
        </div>

        {/* 基本信息 */}
        <div className="border border-border bg-surface p-6 mb-8">
          <div className="flex items-start gap-4 mb-6">
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
              <p className="text-sm text-ink-muted mt-1 truncate">{user.email ?? ''}</p>
            </div>
          </div>

          <div className="space-y-0 border border-border">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-xs text-ink-faint w-24 shrink-0">邮箱</p>
              <p className="text-sm text-ink font-mono break-all text-right">{user.email ?? '—'}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-xs text-ink-faint w-24 shrink-0">登录方式</p>
              <p className="text-sm text-ink-muted">{providerLabel}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-xs text-ink-faint w-24 shrink-0">状态</p>
              <p className="text-sm text-ink-muted">已登录</p>
            </div>
          </div>
        </div>

        {/* 功能入口 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/account/security"
            className="border border-border bg-surface p-5 hover:bg-surface-warm transition-colors"
          >
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">账号安全</p>
            <p className="text-sm text-ink-muted">修改密码</p>
          </Link>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">资料领取记录</p>
            <p className="text-sm text-ink-muted">待接入</p>
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">服务申请记录</p>
            <p className="text-sm text-ink-muted">待接入</p>
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">评论记录</p>
            <p className="text-sm text-ink-muted">待接入</p>
          </div>
        </div>

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
