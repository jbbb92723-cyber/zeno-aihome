import type { Metadata } from 'next'
import { auth, signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Avatar from '@/components/Avatar'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '用户资产中心',
  robots: { index: false },
}

// ─── 状态标签 ──────────────────────────────────────────────
const SERVICE_STATUS_LABEL: Record<string, string> = {
  submitted:  '已提交',
  reviewing:  '审核中',
  completed:  '已完成',
  rejected:   '未通过',
}

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <Container size="content" className="py-section">
        <div className="max-w-md mx-auto">
          <div className="mb-10">
            <p className="page-label mb-3">用户资产中心</p>
            <h1 className="text-2xl font-semibold text-ink tracking-tight">个人中心</h1>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            请先登录，公开内容不需要登录即可阅读。
          </p>
          <div className="flex gap-3">
            <Link href="/login" className="inline-block text-sm font-medium text-white bg-stone px-4 py-2 hover:bg-stone/85 transition-colors">
              去登录
            </Link>
            <Link href="/" className="inline-block text-sm text-ink-muted border border-border px-4 py-2 hover:bg-surface-warm transition-colors">
              返回首页
            </Link>
          </div>
        </div>
      </Container>
    )
  }

  const user = session.user
  const isGoogle = user.provider === 'google'
  const providerLabel = isGoogle ? 'Google' : user.provider === 'credentials' ? '邮箱密码' : user.provider || '—'

  // ── 并行查询三类数据 ────────────────────────────────────────
  const [membership, resourceClaims, serviceRequests] = await Promise.all([
    prisma.membership.findUnique({ where: { userId: user.id } }),
    prisma.resourceClaim.findMany({
      where: { userId: user.id },
      orderBy: { claimedAt: 'desc' },
      take: 20,
    }),
    prisma.serviceRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  const isMember = membership?.plan === 'creator' && membership?.status === 'active' &&
    (!membership.expiresAt || membership.expiresAt > new Date())

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto space-y-8">

        <div>
          <p className="page-label mb-3">个人中心</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">用户资产中心</h1>
        </div>

        {/* ── 1. 用户卡片 ───────────────────────────────────── */}
        <section className="border border-border bg-surface p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar
              src={user.image ?? ''}
              alt={user.name ?? 'User'}
              fallback={(user.name?.[0] ?? 'U').toUpperCase()}
              size={48}
            />
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-ink leading-tight">{user.name ?? '用户'}</p>
              <p className="text-sm text-ink-muted mt-1 truncate">{user.email ?? ''}</p>
              <p className="text-xs text-ink-faint mt-1">
                {isMember ? (
                  <span className="text-stone font-medium">创作会员</span>
                ) : (
                  '免费用户'
                )}
              </p>
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
              <p className="text-xs text-ink-faint w-24 shrink-0">账号状态</p>
              <p className="text-sm text-ink-muted">正常</p>
            </div>
          </div>
        </section>

        {/* ── 2. 会员权益 ───────────────────────────────────── */}
        <section className="border border-border bg-surface p-6">
          <p className="text-[0.65rem] text-ink-faint font-semibold uppercase tracking-widest mb-4">我的会员权益</p>

          {isMember ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone border border-stone/30 px-2 py-0.5">创作会员</span>
              </div>
              {membership?.expiresAt && (
                <p className="text-xs text-ink-muted">
                  有效期至：{membership.expiresAt.toLocaleDateString('zh-CN')}
                </p>
              )}
              <ul className="text-xs text-ink-muted space-y-1 leading-relaxed">
                <li className="flex items-center gap-2"><span className="text-stone">✓</span>选题库 &amp; 标题库</li>
                <li className="flex items-center gap-2"><span className="text-stone">✓</span>文章结构模板</li>
                <li className="flex items-center gap-2"><span className="text-stone">✓</span>AI 提示词包</li>
                <li className="flex items-center gap-2"><span className="text-stone">✓</span>发布检查清单</li>
                <li className="flex items-center gap-2"><span className="text-stone">✓</span>传统行业内容系统教程</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-ink mb-1">当前身份：<span className="text-ink-muted">免费用户</span></p>
                <p className="text-xs text-ink-faint leading-relaxed">可使用：免费资料、AI 提示词体验、md2wechat 排版跳转</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-ink-faint mb-2">升级后解锁：</p>
                <ul className="text-xs text-ink-faint space-y-1 leading-relaxed">
                  <li>选题库 &amp; 标题库 · 文章结构模板 · AI 提示词包</li>
                  <li>发布检查清单 · 传统行业内容系统教程</li>
                </ul>
              </div>
              <Link
                href="/services"
                className="inline-block text-xs text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors"
              >
                了解创作会员 →
              </Link>
            </div>
          )}
        </section>

        {/* ── 3. 资料领取记录 ───────────────────────────────── */}
        <section className="border border-border bg-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[0.65rem] text-ink-faint font-semibold uppercase tracking-widest">我的资料</p>
            <Link href="/resources" className="text-xs text-stone hover:underline underline-offset-2">去资料库</Link>
          </div>

          {resourceClaims.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-ink-muted mb-3">你还没有领取任何资料</p>
              <Link href="/resources" className="text-xs text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors">
                去资料库领取
              </Link>
            </div>
          ) : (
            <div className="space-y-0 border border-border">
              {resourceClaims.map((claim, i) => (
                <div
                  key={claim.id}
                  className={`flex items-center justify-between px-4 py-3 ${i < resourceClaims.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm text-ink truncate">{claim.resourceTitle}</p>
                    <p className="text-xs text-ink-faint mt-0.5">
                      {claim.claimedAt.toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  {claim.resourceUrl ? (
                    <a
                      href={claim.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs text-stone hover:underline underline-offset-2"
                    >
                      查看
                    </a>
                  ) : (
                    <span className="shrink-0 text-xs text-ink-faint">暂无链接</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 4. 创作工具 ───────────────────────────────────── */}
        <section className="border border-border bg-surface p-6">
          <p className="text-[0.65rem] text-ink-faint font-semibold uppercase tracking-widest mb-4">我的创作工具</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/tools/prompts',  label: 'AI 提示词体验场' },
              { href: '/tools/md2wechat', label: 'md2wechat 排版' },
              { href: '/tools/publish',  label: '公众号创作工作台' },
              { href: '/services',       label: '创作会员中心' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-border bg-canvas p-3 text-xs text-ink-muted hover:border-stone hover:text-stone transition-colors"
              >
                {item.label} →
              </Link>
            ))}
          </div>
        </section>

        {/* ── 5. 服务申请记录 ───────────────────────────────── */}
        <section className="border border-border bg-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[0.65rem] text-ink-faint font-semibold uppercase tracking-widest">服务申请</p>
            <Link href="/services" className="text-xs text-stone hover:underline underline-offset-2">查看服务</Link>
          </div>

          {serviceRequests.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-ink-muted mb-3">暂无服务申请记录</p>
              <Link href="/services" className="text-xs text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors">
                查看 Zeno 服务
              </Link>
            </div>
          ) : (
            <div className="space-y-0 border border-border">
              {serviceRequests.map((req, i) => (
                <div
                  key={req.id}
                  className={`px-4 py-3 ${i < serviceRequests.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-ink">{req.serviceType}</p>
                    <span className="text-xs text-ink-faint border border-border px-1.5 py-0.5">
                      {SERVICE_STATUS_LABEL[req.status] ?? req.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-faint mt-1">
                    {req.createdAt.toLocaleDateString('zh-CN')}
                    {req.message && <span className="ml-2 text-ink-faint">· {req.message.slice(0, 40)}{req.message.length > 40 ? '…' : ''}</span>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 6. 账号安全 ───────────────────────────────────── */}
        <section className="border border-border bg-surface p-6">
          <p className="text-[0.65rem] text-ink-faint font-semibold uppercase tracking-widest mb-4">账号安全</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink">登录方式</p>
                <p className="text-xs text-ink-faint mt-0.5">{providerLabel}</p>
              </div>
            </div>

            {isGoogle ? (
              <p className="text-xs text-ink-faint leading-relaxed border border-border bg-canvas px-4 py-3">
                密码由 Google 账号管理，本站不提供单独修改密码入口。如需更改，请前往 Google 账号设置。
              </p>
            ) : (
              <Link
                href="/account/security"
                className="inline-block text-xs text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors"
              >
                修改密码
              </Link>
            )}
          </div>
        </section>

        {/* ── 退出登录 ──────────────────────────────────────── */}
        <div className="pt-2 pb-8">
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
