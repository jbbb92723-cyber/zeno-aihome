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
  title: '登录',
  description: '登录赞诺内容母站，领取专属资料，参与内容交流。',
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
          <p className="page-label mb-3">账号登录</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">
            登录赞诺
          </h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            登录后可以领取资料、发表评论，后续还将支持会员专属内容。
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
              <span>IDC Flare 登录（待配置）</span>
            </div>
          )}

          {/* 未来扩展：GitHub 登录 */}
          {/* 
          <form action={async () => { 'use server'; await signIn('github', { redirectTo: '/account' }) }}>
            <button type="submit" className="...">使用 GitHub 登录</button>
          </form>
          */}
        </div>

        {/* 说明文字 */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-ink-faint leading-relaxed">
            登录即表示你同意赞诺的内容使用说明。
            我不会向第三方出售你的信息，也不会发送垃圾邮件。
          </p>
          {!isIdcFlareConfigured && (
            <p className="text-xs text-amber-600 mt-3 leading-relaxed">
              ⚠ 当前登录功能尚未配置完成，请联系管理员。
            </p>
          )}
        </div>
      </div>
    </Container>
  )
}
