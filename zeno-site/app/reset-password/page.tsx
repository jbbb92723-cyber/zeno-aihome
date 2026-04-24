'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/Container'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail]         = useState(searchParams.get('email') ?? '')
  const [code, setCode]           = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('两次密码不一致')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), code, newPassword: password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || '重置失败')
      setLoading(false)
      return
    }

    setSuccess('密码重置成功！正在跳转到登录页面...')
    setTimeout(() => router.push('/login'), 1500)
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-sm mx-auto">
        <div className="mb-10">
          <p className="page-label mb-3">重置密码</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">设置新密码</h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            输入邮箱收到的验证码和新密码。
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 px-4 py-3 border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 text-sm text-green-700 dark:text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">验证码</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
              placeholder="6 位数字"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">新密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
              placeholder="至少 8 位，包含字母和数字"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">确认新密码</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
          >
            {loading ? '重置中...' : '重置密码'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-stone hover:underline underline-offset-2">
            ← 返回登录
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
