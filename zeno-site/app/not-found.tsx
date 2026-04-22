/**
 * app/not-found.tsx
 *
 * 全站自定义 404 页面
 * 取代 Next.js 默认 404，风格与 Zeno 网站统一
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '页面不存在',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <Container size="content" className="py-section">
      <div className="max-w-md mx-auto text-center">

        {/* 状态码 */}
        <p className="text-6xl font-light text-ink-faint tracking-widest mb-8 select-none">
          404
        </p>

        {/* 说明文字 */}
        <h1 className="text-xl font-semibold text-ink mb-4 tracking-tight">
          这个页面还没有建好。
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed mb-10">
          你可以返回首页，或查看文章和资料库。
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-ink text-paper text-sm font-medium hover:bg-ink/80 transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/blog"
            className="px-5 py-2.5 border border-border text-sm text-ink hover:bg-surface-warm transition-colors"
          >
            查看文章
          </Link>
          <Link
            href="/resources"
            className="px-5 py-2.5 border border-border text-sm text-ink hover:bg-surface-warm transition-colors"
          >
            查看资料库
          </Link>
        </div>

      </div>
    </Container>
  )
}
