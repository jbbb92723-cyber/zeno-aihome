'use client'

/**
 * app/account/redeem/page.tsx
 *
 * 兑换码页面 — 用户输入兑换码，核销并开通对应权益
 * 登录保护由 layout.tsx 处理
 */

import { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/Container'

type ResultType = 'membership' | 'resource' | 'coupon' | 'service_discount'

interface RedeemResult {
  success: boolean
  type?: ResultType
  message?: string
  error?: string
}

export default function RedeemPage() {
  const [code, setCode]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<RedeemResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/redeem', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code: code.trim().toUpperCase() }),
      })
      const data: RedeemResult = await res.json()
      setResult(data)
    } catch {
      setResult({ success: false, error: '网络错误，请稍后重试' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-md mx-auto">

        {/* 导航 */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-ink-muted">
          <Link href="/account" className="hover:text-stone transition-colors">用户中心</Link>
          <span>/</span>
          <span className="text-stone">兑换码</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">兑换码</h1>
          <p className="text-sm text-ink-muted mt-2">
            输入兑换码，立即开通对应权益（会员、资料或优惠券）。
          </p>
        </div>

        {/* 兑换成功 */}
        {result?.success ? (
          <div className="border border-border bg-surface p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base font-semibold text-ink">兑换成功</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed mb-6">
              {result.message}
            </p>
            <div className="flex flex-wrap gap-3">
              {(result.type === 'membership') && (
                <Link
                  href="/account"
                  className="text-sm text-white bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
                >
                  查看我的会员
                </Link>
              )}
              {(result.type === 'resource') && (
                <Link
                  href="/account/resources"
                  className="text-sm text-white bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
                >
                  查看我的资料
                </Link>
              )}
              {(result.type === 'coupon') && (
                <Link
                  href="/account"
                  className="text-sm text-white bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
                >
                  查看个人中心
                </Link>
              )}
              <button
                type="button"
                onClick={() => { setCode(''); setResult(null) }}
                className="text-sm text-stone border border-stone/30 px-4 py-2 hover:bg-surface-warm transition-colors"
              >
                再兑换一个
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-ink-muted uppercase tracking-widest mb-2">
                兑换码
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  setResult(null)
                }}
                placeholder="例如：ZENO-XXXX-XXXX"
                maxLength={64}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="w-full text-sm text-ink bg-surface border border-border px-4 py-3 font-mono tracking-wider placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
              />
            </div>

            {/* 错误提示 */}
            {result?.error && (
              <div className="px-4 py-3 border border-red-200 bg-red-50/60 text-sm text-red-700 leading-relaxed">
                {result.error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full text-sm text-white bg-stone px-4 py-3 hover:bg-stone/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? '正在兑换…' : '立即兑换'}
            </button>
          </form>
        )}

        {/* 说明 */}
        <div className="mt-8 px-4 py-4 border border-border bg-surface-warm">
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-widest mb-2">
            使用说明
          </p>
          <ul className="text-xs text-ink-muted leading-relaxed space-y-1.5">
            <li>· 每个兑换码只能使用一次（部分多次使用码除外）</li>
            <li>· 兑换码有效期以码上说明为准</li>
            <li>· 会员类兑换码将立即开通，到期前可续期</li>
            <li>· 资料类兑换码兑换后可在「已领资料」查看</li>
            <li>· 如遇问题，请通过联系页反馈</li>
          </ul>
        </div>

      </div>
    </Container>
  )
}
