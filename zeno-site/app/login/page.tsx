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
            当前登录功能正在配置中。网站公开内容可以直接阅读，不需要登录。
            等 IDC Flare OAuth 配置完成后，社区用户可以直接使用原账号进入本站。
          </p>
          <p className="text-xs text-ink-faint mt-3 leading-relaxed">
            我不会要求你重新注册一套网站账号，也不会向第三方出售你的信息。
          </p>
          {!isIdcFlareConfigured && (
            <p className="text-xs text-amber-600 mt-3 leading-relaxed">
              当前登录功能还在配置中。
            </p>
          )}
        </div>
      </div>
    </Container>
  )
}
