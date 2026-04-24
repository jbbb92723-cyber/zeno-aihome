import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '查看邮箱 — 登录链接已发送',
  robots: { index: false },
}

export default function VerifyPage() {
  return (
    <Container size="content" className="py-section">
      <div className="max-w-md mx-auto text-center">

        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 border border-border bg-surface flex items-center justify-center">
            <svg
              className="w-7 h-7 text-stone"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <polyline points="2,4 12,13 22,4"/>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-ink tracking-tight mb-4">
          登录链接已发送
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed mb-6">
          请打开你的邮箱，点击邮件中的登录链接即可完成登录。
          链接有效期为 <strong className="text-ink font-medium">24 小时</strong>，使用一次后自动失效。
        </p>

        <div className="border border-border bg-surface px-5 py-4 mb-8 text-left">
          <p className="text-xs text-ink-faint leading-relaxed">
            没收到邮件？请检查垃圾邮件文件夹，或确认邮箱地址是否填写正确。
            发件人为 <span className="font-mono text-ink-muted">noreply@zenoaihome.com</span>。
          </p>
        </div>

        <Link
          href="/login"
          className="text-sm text-ink-muted hover:text-ink transition-colors underline underline-offset-2 decoration-border"
        >
          ← 返回登录页面
        </Link>
      </div>
    </Container>
  )
}
