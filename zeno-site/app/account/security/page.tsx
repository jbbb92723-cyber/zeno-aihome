'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Container from '@/components/Container'

export default function SecurityPage() {
  const { data: session } = useSession()
  const [code, setCode]           = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [countdown, setCountdown] = useState(0)
  const [codeSent, setCodeSent]   = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [loading, setLoading]     = useState(false)

  const email = session?.user?.email ?? ''
  const isGoogle = session?.user?.provider === 'google'

  async function sendCode() {
    if (!email) return
    setError('')

    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type: 'change_password' }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || '发送失败')
      return
    }

    setCodeSent(true)
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirm) {
      setError('两次密码不一致')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, newPassword: password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || '修改失败')
      setLoading(false)
      return
    }

    setSuccess('密码修改成功！')
    setCode('')
    setPassword('')
    setConfirm('')
    setLoading(false)
  }

  if (!session?.user) {
    return (
      <Container size="content" className="py-section">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm text-ink-muted mb-4">请先登录</p>
          <Link href="/login" className="text-sm text-stone hover:underline">去登录</Link>
        </div>
      </Container>
    )
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-sm mx-auto">

        <div className="mb-10">
          <p className="page-label mb-3">账号安全</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">修改密码</h1>
        </div>

        <div className="border border-border bg-surface p-5 mb-6">
          <p className="text-xs text-ink-faint mb-1">当前登录邮箱</p>
          <p className="text-sm text-ink font-mono">{email}</p>
          <p className="text-xs text-ink-faint mt-2">
            登录方式：{isGoogle ? 'Google' : '邮箱密码'}
          </p>
        </div>

        {isGoogle && (
          <div className="mb-6 px-4 py-3 border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
            你当前使用 Google 登录。设置密码后，也可以用邮箱密码登录。
          </div>
        )}

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
            <label className="block text-sm text-ink-muted mb-1.5">邮箱验证码</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                className="flex-1 text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
                placeholder="6 位数字"
              />
              <button
                type="button"
                onClick={sendCode}
                disabled={countdown > 0}
                className="shrink-0 text-sm text-stone border border-stone/30 px-3 py-2 hover:bg-stone-pale/50 disabled:opacity-50 transition-colors"
              >
                {countdown > 0 ? `${countdown}s` : codeSent ? '重新发送' : '发送验证码'}
              </button>
            </div>
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
            {loading ? '修改中...' : '修改密码'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/account" className="text-sm text-stone hover:underline underline-offset-2">
            ← 返回个人中心
          </Link>
        </div>

      </div>
    </Container>
  )
}
