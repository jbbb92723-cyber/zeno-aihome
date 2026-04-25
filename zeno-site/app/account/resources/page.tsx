/**
 * app/account/resources/page.tsx
 *
 * 我的资料页面 — 真实读取 resource_claims 表
 */

import type { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/Container'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: '已领资料',
  robots: { index: false },
}

export default async function AccountResourcesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/resources')
  }

  const userId = session.user.id

  // 只查当前用户自己的领取记录，严格绑定 userId
  const claims = await prisma.resourceClaim.findMany({
    where: { userId },
    orderBy: { claimedAt: 'desc' },
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

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink tracking-tight">已领资料</h1>
            <p className="text-sm text-ink-muted mt-2">你通过领取或兑换获得的资料记录。</p>
          </div>
          <Link
            href="/account/redeem"
            className="shrink-0 text-sm text-stone border border-stone/30 px-4 py-2 hover:bg-surface-warm transition-colors"
          >
            兑换码
          </Link>
        </div>

        {claims.length === 0 ? (
          <div className="border border-border bg-surface p-10 text-center">
            <p className="text-sm font-medium text-ink mb-2">你还没有领取资料</p>
            <p className="text-xs text-ink-faint leading-relaxed max-w-xs mx-auto mb-6">
              你可以去资料库领取免费资料，或通过兑换码解锁会员专属内容。
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/resources"
                className="text-sm text-white bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
              >
                去资料库领取
              </Link>
              <Link
                href="/account/redeem"
                className="text-sm text-stone border border-stone/30 px-4 py-2 hover:bg-surface-warm transition-colors"
              >
                输入兑换码
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border border border-border">
            {claims.map((claim) => (
              <div key={claim.id} className="flex items-start justify-between gap-4 px-5 py-4 bg-surface">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{claim.resourceTitle}</p>
                  <p className="text-xs text-ink-faint mt-1">
                    领取于 {new Date(claim.claimedAt).toLocaleDateString('zh-CN', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                {claim.resourceUrl ? (
                  <a
                    href={claim.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs text-stone border border-stone/30 px-3 py-1.5 hover:bg-surface-warm transition-colors"
                  >
                    查看 / 下载
                  </a>
                ) : (
                  <span className="shrink-0 text-xs text-ink-faint border border-border px-3 py-1.5">
                    链接待补充
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between items-center text-xs text-ink-faint">
          <span>共 {claims.length} 条记录</span>
          <Link href="/resources" className="hover:text-stone transition-colors">
            去资料库看更多 →
          </Link>
        </div>

      </div>
    </Container>
  )
}
