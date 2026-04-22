/**
 * components/CommentSection.tsx
 *
 * 评论区底座组件
 * - 未登录：显示登录提示
 * - 已登录：显示评论输入框
 * - 评论默认 pending，需管理员审核
 * - 第一版：只做前端 UI，API 路由已占位
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Comment {
  id: string
  userName: string
  content: string
  createdAt: string
}

interface CommentSectionProps {
  articleSlug: string
  isLoggedIn: boolean
  userName?: string | null
  // 已审核通过的评论列表（第一版可以传空数组）
  approvedComments?: Comment[]
}

export default function CommentSection({
  articleSlug,
  isLoggedIn,
  userName,
  approvedComments = [],
}: CommentSectionProps) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    // 内容长度限制（防止超大提交）
    if (content.length > 2000) {
      setError('评论内容不能超过 2000 字。')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          content: content.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? '提交失败，请稍后重试。')
      }

      setSubmitted(true)
      setContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-reading mx-auto px-5 sm:px-8 py-12 border-t border-border">
      <h2 className="text-base font-semibold text-ink mb-6">评论</h2>

      {/* 已审核的评论列表 */}
      {approvedComments.length > 0 && (
        <div className="space-y-6 mb-10">
          {approvedComments.map((comment) => (
            <div key={comment.id} className="border-b border-border pb-6 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-ink">{comment.userName}</span>
                <span className="text-xs text-ink-faint">{comment.createdAt}</span>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* 评论输入区 */}
      {!isLoggedIn ? (
        /* 未登录提示 */
        <div className="border border-border bg-surface-warm px-5 py-4">
          <p className="text-sm text-ink-muted">
            <Link
              href={`/login?callbackUrl=/blog/${articleSlug}`}
              className="text-stone hover:underline underline-offset-2 decoration-stone-light"
            >
              登录
            </Link>
            后可以发表评论。评论需经过审核后显示。
          </p>
        </div>
      ) : submitted ? (
        /* 提交成功提示 */
        <div className="border border-border bg-surface-warm px-5 py-4">
          <p className="text-sm text-ink-muted">
            评论已提交，审核通过后将公开显示。感谢你的参与。
          </p>
        </div>
      ) : (
        /* 评论表单 */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor={`comment-${articleSlug}`}
              className="block text-xs text-ink-faint uppercase tracking-widest font-semibold mb-2"
            >
              {userName ? `以 ${userName} 身份评论` : '发表评论'}
            </label>
            <textarea
              id={`comment-${articleSlug}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="分享你的想法，评论需经过审核后才会公开显示。"
              className="w-full border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint resize-none focus:outline-none focus:border-stone transition-colors"
              disabled={submitting}
            />
            <p className="text-xs text-ink-faint mt-1 text-right">
              {content.length} / 2000
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-600 border border-red-200 bg-red-50 px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-ink-faint">
              评论默认待审核，不会立即公开。
            </p>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="text-sm text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '提交评论'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
