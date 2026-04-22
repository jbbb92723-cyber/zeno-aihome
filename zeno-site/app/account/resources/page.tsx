/**
 * app/account/resources/page.tsx
 *
 * 我的资料页面
 * - 显示用户可访问的资料列表
 * - 第一版使用 mock 逻辑（未来接入 resource_downloads 表）
 */

import type { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/Container'
import { resources } from '@/data/resources'
import { canAccessResource } from '@/lib/permissions'
import type { AccessLevel } from '@/lib/permissions'

export const metadata: Metadata = {
  title: '已领资料',
  robots: { index: false },
}

export default async function AccountResourcesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/resources')
  }

  const user = session.user

  // TODO（第二阶段）：从 resource_downloads 表查询用户实际下载记录
  // 目前只展示用户「有权限访问」的资料，作为占位逻辑

  // 将 data/resources.ts 中的资料数据添加默认 accessLevel（第一阶段兼容）
  const accessibleResources = resources.filter((r) => {
    const accessLevel = ((r as unknown as { accessLevel?: AccessLevel }).accessLevel) ?? 'login'
    return canAccessResource(user, { accessLevel })
  })

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto">

        {/* 导航 */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-ink-muted">
          <Link href="/account" className="hover:text-stone transition-colors">用户中心</Link>
          <span>/</span>
          <span className="text-stone">已领资料</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">已领资料</h1>
          <p className="text-sm text-ink-muted mt-2">
            根据你的账号权限，以下资料你可以领取。
          </p>
        </div>

        {/* TODO 提示 */}
        <div className="mb-8 px-4 py-3 border border-amber-200 bg-amber-50/60 text-xs text-amber-700 leading-relaxed">
          <strong>开发说明：</strong>
          当前版本展示「你有权限领取的资料」，不代表真实下载记录。
          第二阶段接入数据库后，将显示实际领取历史。
        </div>

        {accessibleResources.length === 0 ? (
          <div className="border border-border bg-surface p-8 text-center">
            <p className="text-sm text-ink-muted mb-3">暂无可领取的资料</p>
            <p className="text-xs text-ink-faint mb-6">
              {user.role === 'user'
                ? '登录用户可领取「登录领取」类资料。开通会员可解锁更多内容。'
                : '暂时没有符合权限的资料。'}
            </p>
            <Link
              href="/resources"
              className="text-sm text-stone hover:underline underline-offset-2 decoration-stone-light"
            >
              去资料库看看 →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {accessibleResources.map((resource) => (
              <div
                key={resource.id}
                className="border border-border bg-surface p-5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink leading-tight">{resource.title}</p>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">{resource.subtitle}</p>
                </div>
                <Link
                  href={`/resources#${resource.slug}`}
                  className="shrink-0 text-xs text-stone hover:underline underline-offset-2 decoration-stone-light"
                >
                  领取方式 →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-ink-faint leading-relaxed">
            资料领取方式目前通过公众号「Zeno AI装修笔记」回复关键词获取。
            后续将支持直接在账号中心下载。
          </p>
        </div>

      </div>
    </Container>
  )
}
