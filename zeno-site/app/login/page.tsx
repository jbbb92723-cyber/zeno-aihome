/**
 * app/login/page.tsx
 *
 * 登录页面
 * - 邮箱 Magic Link（Resend，已接入）
 * - 微信网页扫码（待配置）
 * - 手机号验证码（待配置）
 */

import type { Metadata } from 'next'
import { auth, signIn } from '@/auth'
import { redirect } from 'next/navigation'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '登录',
  description: '登录 Zeno 赞诺，领取资料、查看提交记录、发表评论。公开内容不需要登录。',
  robots: { index: false },
}

const isResendConfigured  = !!process.env.AUTH_RESEND_KEY
const isWechatConfigured  = !!process.env.WECHAT_OPEN_CLIENT_ID && !!process.env.WECHAT_OPEN_CLIENT_SECRET

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string }
}) {
  const session = await auth()
  if (session?.user) {
    redirect(searchParams.callbackUrl ?? '/account')
  }

  const errorMessages: Record<string, string> = {
    OAuthSignin:        'OAuth 登录初始化失败，请重试。',
    OAuthCallback:      '登录回调出错，请检查回调地址配置。',
    OAuthCreateAccount: '创建账号时出错，请联系管理员。',
    EmailSignin:        '邮件发送失败，请稍后重试。',
    Callback:           '回调处理出错，请重试。',
    AccessDenied:       '登录被拒绝。',
    Configuration:      '认证配置错误，请联系管理员。',
    Default:            '登录时发生未知错误，请重试。',
  }

  const errorMsg = searchParams.error
    ? (errorMessages[searchParams.error] ?? errorMessages.Default)
    : null

  return (
    <Container size="content" className="py-section">
      <div className="max-w-md mx-auto">
        {/* 标题区 */}
        <div className="mb-10">
          <p className="page-label mb-3">登录</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">
            登录 Zeno 赞诺
          </h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            登录后可以领取资料、查看提交记录、发表评论，未来也可以访问会员内容。
            公开文章和网站内容不需要登录。
          </p>
        </div>

        {/* 错误提示 */}
        {errorMsg && (
          <div className="mb-6 px-4 py-3 border border-red-200 bg-red-50 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* 登录方式 */}
        <div className="space-y-4">

          {/* 微信登录 */}
          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-ink-faint shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.253 2 11.5c0 2.756 1.214 5.23 3.145 6.95L4.5 21.5l3.45-1.725A10.93 10.93 0 0 0 12 21c5.523 0 10-4.253 10-9.5S17.523 2 12 2zm0 17a8.93 8.93 0 0 1-3.775-.83l-.225-.112-2.3 1.15.59-2.065-.19-.183C4.443 15.57 3.5 13.63 3.5 11.5 3.5 6.806 7.262 3 12 3s8.5 3.806 8.5 8.5S16.738 19 12 19z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm font-semibold text-ink">微信登录</p>
              {isWechatConfigured ? null : (
                <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5 ml-auto">待配置</span>
              )}
            </div>
            {isWechatConfigured ? (
              <>
                <p className="text-xs text-ink-muted leading-relaxed mb-3">
                  使用微信扫码登录，无需注册新账号。
                </p>
                <form
                  action={async () => {
                    'use server'
                    await signIn('wechat', {
                      redirectTo: searchParams.callbackUrl ?? '/account',
                    })
                  }}
                >
                  <button
                    type="submit"
                    className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
                  >
                    微信扫码登录
                  </button>
                </form>
              </>
            ) : (
              <p className="text-xs text-ink-muted leading-relaxed">
                需要在微信开放平台申请「网站应用」并通过审核后开启。
              </p>
            )}
          </div>

          {/* 邮箱登录 */}
          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-ink-faint shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>
              </svg>
              <p className="text-sm font-semibold text-ink">邮箱登录</p>
              {!isResendConfigured && (
                <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5 ml-auto">待配置</span>
              )}
            </div>
            {isResendConfigured ? (
              <>
                <p className="text-xs text-ink-muted leading-relaxed mb-3">
                  输入邮箱，我们会发送一个登录链接，点击即可登录，无需密码。
                </p>
                <form
                  action={async (formData: FormData) => {
                    'use server'
                    const email = formData.get('email') as string
                    await signIn('resend', {
                      email,
                      redirectTo: searchParams.callbackUrl ?? '/account',
                    })
                  }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    className="w-full text-sm text-ink bg-paper border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
                  />
                  <button
                    type="submit"
                    className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
                  >
                    发送登录链接
                  </button>
                </form>
              </>
            ) : (
              <p className="text-xs text-ink-muted leading-relaxed">
                需要配置 Resend API Key 和验证发件域名后开启。
              </p>
            )}
          </div>

          {/* 手机号登录 */}
          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-ink-faint shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <p className="text-sm font-semibold text-ink">手机号登录</p>
              <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5 ml-auto">待配置</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              需要接入短信服务后开启，国内用户适用。
            </p>
          </div>

        </div>

        {/* 底部说明 */}
        <div className="mt-10 pt-6 border-t border-border space-y-3">
          <p className="text-xs text-ink-faint leading-relaxed">
            网站公开内容可以直接阅读，不需要登录。登录只是为了资料领取、评论等增强功能。
          </p>
          <p className="text-xs text-ink-faint leading-relaxed">
            我不会要求你重新注册一套账号，也不会向第三方出售你的信息。
          </p>
        </div>
      </div>
    </Container>
  )
}
