/**
 * app/admin/page.tsx
 *
 * 管理入口占位页
 * - 未登录：提示请先登录
 * - 已登录：显示后台入口
 * - 无真实权限系统，后续需补充 admin role 校验（TODO）
 */

import type { Metadata } from 'next'
import { auth } from '@/auth'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '管理入口',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const session = await auth()

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto">

        <div className="mb-10">
          <p className="page-label mb-3">后台</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">管理入口</h1>
        </div>

        {!session?.user ? (
          /* ── 未登录 ──────────────────────────────────── */
          <div className="border border-border bg-surface p-8 text-center space-y-4">
            <p className="text-sm text-ink-muted">请先登录才能访问后台。</p>
            <Link
              href="/login?callbackUrl=/admin"
              className="inline-block text-sm text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors"
            >
              前往登录
            </Link>
          </div>
        ) : (
          /* ── 已登录 ──────────────────────────────────── */
          <div className="space-y-4">
            <div className="border border-border bg-surface p-6 space-y-5">
              <p className="text-sm text-ink-muted">
                你好，{session.user.name ?? '管理员'}。以下功能仅供内部使用。
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
                  href="/account"
                  className="flex items-center justify-between w-full px-4 py-3 border border-border hover:bg-surface-warm transition-colors text-sm text-ink"
                >
                  <span>资料管理（用户中心）</span>
                  <span className="text-ink-faint">→</span>
                </Link>
              </div>

              {/* TODO（第二阶段）：增加 admin role 校验，非管理员不显示操作按钮 */}
              <p className="text-xs text-ink-faint border-t border-border pt-4">
                当前版本未做 admin 角色校验，所有已登录用户均可见此页。
                生产环境请在此处补充 role === &#39;admin&#39; 的检查。
              </p>
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
