/**
 * app/admin/page.tsx
 *
 * 管理入口 — 独立于普通用户登录系统
 * 通过 ADMIN_PASSWORD cookie 鉴权
 */

import type { Metadata } from 'next'
import { isAdminUser } from '@/lib/admin'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '管理入口',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const isAdmin = await isAdminUser()

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto">

        <div className="mb-10">
          <p className="page-label mb-3">后台</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">管理入口</h1>
        </div>

        {!isAdmin ? (
          <div className="border border-border bg-surface p-8 text-center space-y-4">
            <p className="text-sm text-ink-muted">请先登录管理员后台。</p>
            <Link
              href="/admin/login"
              className="inline-block text-sm text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors"
            >
              管理员登录
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-border bg-surface p-6 space-y-5">
              <p className="text-sm text-ink-muted">
                你好，管理员。以下功能仅供内部使用。
              </p>

              <div className="space-y-2">
                <Link
                  href="/admin/publish"
                  className="flex items-center justify-between w-full px-4 py-3 border border-border hover:bg-surface-warm transition-colors text-sm text-ink"
                >
                  <span>公众号草稿发布</span>
                  <span className="text-ink-faint">→</span>
                </Link>
                <Link
                  href="/tools/md2wechat/status"
                  className="flex items-center justify-between w-full px-4 py-3 border border-border hover:bg-surface-warm transition-colors text-sm text-ink"
                >
                  <span>系统状态</span>
                  <span className="text-ink-faint">→</span>
                </Link>
              </div>
            </div>

            <Link
              href="/"
              className="inline-block text-sm text-ink-faint hover:text-ink underline-offset-2 hover:underline transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        )}
      </div>
    </Container>
  )
}
