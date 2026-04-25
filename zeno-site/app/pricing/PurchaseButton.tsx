'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  productId: string
  label:     string
  isLoggedIn: boolean
}

export default function PurchaseButton({ productId, label, isLoggedIn }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/pricing`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ productId, paymentMethod: 'wechat' }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '创建订单失败，请稍后重试')
        return
      }

      router.push(`/order/${data.orderNo}`)
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <p className="text-xs text-red-500 mb-2">{error}</p>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
      >
        {loading ? '处理中…' : isLoggedIn ? label : '登录后购买'}
      </button>
    </div>
  )
}
