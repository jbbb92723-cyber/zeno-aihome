/**
 * app/not-found.tsx
 *
 * 全站自定义 404 页面 — 中英文双语
 * /en 开头路径显示英文，其他显示中文
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Container from '@/components/Container'

export default function NotFound() {
  const pathname = usePathname()
  const isEn = pathname?.startsWith('/en')

  if (isEn) {
    return (
      <Container size="content" className="py-section">
        <div className="max-w-md mx-auto text-center">
          <p className="text-6xl font-light text-ink-faint tracking-widest mb-8 select-none">
            404
          </p>
          <h1 className="text-xl font-semibold text-ink mb-4 tracking-tight">
            This page is not ready yet.
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed mb-10">
            You can go back home, read the blog, or visit the resource library.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/en"
              className="px-5 py-2.5 bg-ink text-paper text-sm font-medium hover:bg-ink/80 transition-colors"
            >
              Back Home
            </Link>
            <Link
              href="/en/blog"
              className="px-5 py-2.5 border border-border text-sm text-ink hover:bg-surface-warm transition-colors"
            >
              Read Blog
            </Link>
            <Link
              href="/en/resources"
              className="px-5 py-2.5 border border-border text-sm text-ink hover:bg-surface-warm transition-colors"
            >
              View Resources
            </Link>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-md mx-auto text-center">
        <p className="text-6xl font-light text-ink-faint tracking-widest mb-8 select-none">
          404
        </p>
        <h1 className="text-xl font-semibold text-ink mb-4 tracking-tight">
          这个页面还没有建好。
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed mb-10">
          你可以返回首页，或查看文章和资料库。
        </p>
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
