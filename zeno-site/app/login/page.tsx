'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Container from '@/components/Container'
import PasswordInput from '@/components/PasswordInput'

/** 把 Auth.js URL error 参数映射成可读的中文提示 */
function mapAuthError(error: string | null): string {
  if (!error) return ''
  switch (error) {
    case 'CredentialsSignin':      return '邮箱或密码不正确，请重试。'
    case 'OAuthSignin':            return 'Google 登录启动失败，请重试。'
    case 'OAuthCallback':          return 'Google 登录回调异常，请重试。'
    case 'OAuthAccountNotLinked':  return '此 Google 账号与已有邮箱账号冲突，请用邮箱直接登录。'
    case 'SessionRequired':        return '请先登录再访问该页面。'
    case 'Configuration':          return '服务端配置异常，请稍后重试或联系管理员。'
    default:                       return '登录出现问题，请重试。'
  }
}

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/account'
  const errorParam  = searchParams.get('error')

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [error, setError]           = useState(mapAuthError(errorParam))
  const [loading, setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // 前端校验（因为 noValidate，需手动检查）
    if (!email.trim()) {
      setError('请输入邮箱地址。')
      return
    }
    if (!password) {
      setError('请输入密码。')
      return
    }

    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(mapAuthError(result.error))
        setLoading(false)
      } else if (result?.ok) {
        window.location.href = callbackUrl
      } else {
        setError('登录失败，请重试。')
        setLoading(false)
      }
    } catch {
      setError('网络错误，请检查网络后重试。')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (googleLoading) return
    setGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch {
      setError('Google 登录启动失败，请重试。')
      setGoogleLoading(false)
    }
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-sm mx-auto">
        <div className="mb-10">
          <p className="page-label mb-3">登录</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">登录 Zeno 赞诺</h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            登录后可以领取资料、发表评论。公开内容不需要登录。
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* noValidate：禁用浏览器原生弹窗，由 JS 统一处理 */}
        <form onSubmit={handleCredentials} noValidate className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">密码</label>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="至少 8 位，包含字母和数字"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 分隔线 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-ink-faint">或</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google 登录 */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-ink border border-border px-4 py-2.5 hover:bg-surface-warm disabled:opacity-50 transition-colors"
        >
          {googleLoading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? '跳转中...' : '使用 Google 登录'}
        </button>

        {/* 底部链接 */}
        <div className="mt-8 space-y-2 text-center">
          <p className="text-sm text-ink-muted">
            还没有账号？{' '}
            <Link href="/register" className="text-stone hover:underline underline-offset-2">
              注册
            </Link>
          </p>
          <p className="text-sm text-ink-muted">
            <Link href="/forgot-password" className="text-stone hover:underline underline-offset-2">
              忘记密码？
            </Link>
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-ink-faint leading-relaxed text-center">
            公开内容不需要登录。登录只是为了资料领取、评论等增强功能。
          </p>
        </div>
      </div>
    </Container>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
