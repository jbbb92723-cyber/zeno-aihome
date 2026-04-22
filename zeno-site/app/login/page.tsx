/**
 * app/login/page.tsx
 *
 * 登录页面
 * - 显示 IDC Flare OAuth 登录按钮
 * - 如果 IDC Flare 未配置，按钮显示「待配置」而不报错
 * - 支持后续扩展更多登录方式
 */

import type { Metadata } from 'next'
import { auth, signIn } from '@/auth'
import { redirect } from 'next/navigation'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '社区账号登录',
  description: '使用 IDC Flare 社区账号登录 Zeno AI Home，领取资料、发表评论。',
  robots: { index: false },
}

// IDC Flare 是否已配置（服务端判断，不暴露到客户端）
const isIdcFlareConfigured =
  !!process.env.IDCFLARE_CLIENT_ID &&
  !!process.env.IDCFLARE_CLIENT_SECRET &&
  !!process.env.IDCFLARE_AUTHORIZATION_URL

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string }
}) {
  // 已登录则跳转到用户中心
  const session = await auth()
  if (session?.user) {
    redirect(searchParams.callbackUrl ?? '/account')
  }

  const errorMessages: Record<string, string> = {
    OAuthSignin: 'OAuth 登录初始化失败，请重试。',
    OAuthCallback: '登录回调出错，请检查 IDC Flare 回调地址配置。',
    OAuthCreateAccount: '创建账号时出错，请联系管理员。',
    Callback: '回调处理出错，请重试。',
    AccessDenied: '登录被拒绝。',
    Configuration: '认证配置错误，请联系管理员。',
    Default: '登录时发生未知错误，请重试。',
  }

  const errorMsg = searchParams.error
    ? (errorMessages[searchParams.error] ?? errorMessages.Default)
    : null

  return (
    <Container size="content" className="py-section">
      <div className="max-w-sm mx-auto">
        {/* 标题区 */}
        <div className="mb-10">
          <p className="page-label mb-3">社区账号通行证</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">
            社区账号登录
          </h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            如果你已经是 IF / IDC Flare 社区用户，后续可以直接用社区账号进入 Zeno AI Home。
            公开内容不需要登录，登录只是为了资料领取、评论和后续会员权限。
          </p>
        </div>

        {/* 错误提示 */}
        {errorMsg && (
          <div className="mb-6 px-4 py-3 border border-red-200 bg-red-50 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* 登录按钮区 */}
        <div className="space-y-3">

          {/* 微信登录（开发中） */}
          <div className="w-full flex items-center gap-3 px-4 py-3 border border-border/50 bg-surface-warm text-sm text-ink-faint cursor-not-allowed select-none">
            <svg className="w-4 h-4 shrink-0 opacity-40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.253 2 11.5c0 2.756 1.214 5.23 3.145 6.95L4.5 21.5l3.45-1.725A10.93 10.93 0 0 0 12 21c5.523 0 10-4.253 10-9.5S17.523 2 12 2zm0 17a8.93 8.93 0 0 1-3.775-.83l-.225-.112-2.3 1.15.59-2.065-.19-.183C4.443 15.57 3.5 13.63 3.5 11.5 3.5 6.806 7.262 3 12 3s8.5 3.806 8.5 8.5S16.738 19 12 19z" clipRule="evenodd"/>
            </svg>
            <span>微信登录（即将开放）</span>
          </div>

          {/* 手机号登录（开发中） */}
          <div className="w-full flex items-center gap-3 px-4 py-3 border border-border/50 bg-surface-warm text-sm text-ink-faint cursor-not-allowed select-none">
            <svg className="w-4 h-4 shrink-0 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            <span>手机号登录（即将开放）</span>
          </div>

          {/* 邮箱登录（开发中） */}
          <div className="w-full flex items-center gap-3 px-4 py-3 border border-border/50 bg-surface-warm text-sm text-ink-faint cursor-not-allowed select-none">
            <svg className="w-4 h-4 shrink-0 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <polyline points="2,4 12,13 22,4"/>
            </svg>
            <span>邮箱登录（即将开放）</span>
          </div>

          {/* 分隔线 */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-ink-faint">或使用社区账号</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* IDC Flare 登录 */}
          {isIdcFlareConfigured ? (
            <form
              action={async () => {
                'use server'
                await signIn('idcflare', {
                  redirectTo: searchParams.callbackUrl ?? '/account',
                })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border bg-surface hover:bg-surface-warm text-sm font-medium text-ink transition-colors"
              >
                <span className="text-stone font-semibold">IDC</span>
                <span>使用 IDC Flare 登录</span>
              </button>
            </form>
          ) : (
            <div className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border/50 bg-surface-warm text-sm text-ink-faint cursor-not-allowed">
              <span className="text-stone/50 font-semibold">IDC</span>
              <span>使用 IDC Flare 登录（待配置）</span>
            </div>
          )}
        </div>

        {/* 说明文字 */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-ink-faint leading-relaxed">
            网站公开内容可以直接阅读，不需要登录。登录只是为了资料领取、评论等后续功能。
          </p>
          <p className="text-xs text-ink-faint mt-3 leading-relaxed">
            我不会要求你重新注册一套账号，也不会向第三方出售你的信息。
          </p>
        </div>
      </div>
    </Container>
  )
}
