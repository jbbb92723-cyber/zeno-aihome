'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
  orderNo: string
  status:  string
}

export default function OrderActions({ orderNo, status }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  async function handleNotify() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/orders/${orderNo}/notify`, { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '提交失败，请稍后再试')
        return
      }

      setDone(true)
      router.refresh()
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'completed') {
    return (
      <div className="space-y-3">
        <div className="px-4 py-3 border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 text-sm text-green-700 dark:text-green-400">
          权益已开通，感谢支持！
        </div>
        <Link
          href="/account"
          className="block w-full text-center text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 transition-colors"
        >
          前往个人中心
        </Link>
      </div>
    )
  }

  if (status === 'pending_confirmation' || done) {
    return (
      <div className="space-y-3">
        <div className="px-4 py-3 border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-400">
          已收到付款通知，将在 24 小时内人工确认并开通权益。
        </div>
        <Link
          href="/account"
          className="block w-full text-center text-sm font-medium border border-border text-ink-muted px-4 py-2.5 hover:text-ink transition-colors"
        >
          返回个人中心
        </Link>
      </div>
    )
  }

  if (status === 'cancelled' || status === 'refunded') {
    return (
      <div className="px-4 py-3 border border-border text-sm text-ink-muted">
        该订单已{status === 'cancelled' ? '取消' : '退款'}
      </div>
    )
  }

  // pending — 显示通知按钮
  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      <button
        onClick={handleNotify}
        disabled={loading}
        className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
      >
        {loading ? '提交中…' : '我已完成付款，等待确认'}
      </button>
      <Link
        href="/pricing"
        className="block w-full text-center text-xs text-ink-faint hover:text-ink-muted py-1"
      >
        返回选择套餐
      </Link>
    </div>
  )
}
