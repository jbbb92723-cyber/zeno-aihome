'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '登录失败')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-sm mx-auto">
        <div className="mb-10">
          <p className="page-label mb-3">管理后台</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">管理员登录</h1>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">管理员密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
              placeholder="输入 ADMIN_PASSWORD"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
          >
            {loading ? '验证中...' : '登录管理后台'}
          </button>
        </form>
      </div>
    </Container>
  )
}
