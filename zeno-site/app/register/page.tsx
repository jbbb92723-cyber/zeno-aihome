'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import PasswordInput from '@/components/PasswordInput'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [code, setCode]             = useState('')
  const [codeSent, setCodeSent]     = useState(false)
  const [countdown, setCountdown]   = useState(0)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [loading, setLoading]       = useState(false)
  const [emailDown, setEmailDown]   = useState(false)

  async function sendCode() {
    if (!email.trim()) {
      setError('请输入邮箱')
      return
    }
    setError('')

    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), type: 'register' }),
    })
    const data = await res.json()

    if (res.status === 503) {
      setEmailDown(true)
      return
    }
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

    if (password !== confirm) {
      setError('两次密码不一致')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password, code }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || '注册失败')
      setLoading(false)
      return
    }

    setSuccess('注册成功！正在跳转到登录页面...')
    setTimeout(() => router.push('/login'), 1500)
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-[28rem] mx-auto">
        <div className="mb-10">
          <p className="page-label mb-3">注册</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">注册 Zeno 赞诺</h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            注册后可以领取资料、发表评论。
          </p>
        </div>

        {emailDown && (
          <div className="mb-6 px-4 py-4 border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            <p className="font-medium mb-1">注册功能暂时不可用</p>
            <p className="text-xs opacity-80">Exchange verification codes require the email service (Resend). The admin has not yet configured <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1">RESEND_API_KEY</code> in Vercel. Please try again later.</p>
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
            <label className="block text-sm text-ink-muted mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">密码</label>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="至少 8 位，包含字母和数字"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">确认密码</label>
            <PasswordInput
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="再输一次密码"
            />
          </div>

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
                {countdown > 0 ? `${countdown}s` : codeSent ? '重新发送' : '获取验证码'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-ink-muted">
            已有账号？{' '}
            <Link href="/login" className="text-stone hover:underline underline-offset-2">
              登录
            </Link>
          </p>
        </div>
      </div>
    </Container>
  )
}
