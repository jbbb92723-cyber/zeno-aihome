import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Creator Workspace',
  description:
    'Practical tools from Zeno — prompt playground, writing workflow, and AI-assisted creation for traditional industry practitioners.',
}

const tools = [
  {
    title: 'Prompt Playground',
    description:
      'A practical prompt utility for real work scenarios — especially for creators and traditional industry practitioners who want to use AI without hype.',
    status: 'available' as const,
    href: '/en/tools/prompts',
    cta: 'Try the prompt playground',
  },
  {
    title: 'Writing & Publishing Workflow',
    description:
      'A writing and publishing workflow for long-form content — from Markdown drafting to formatted publishing.',
    status: 'available' as const,
    href: '/tools/md2wechat',
    cta: 'Open writing tool',
  },
]

export default function EnToolsPage() {
  return (
    <>
      {/* Header */}
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">
            Creator Workspace
          </p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">
            Creator Workspace
          </h1>
          <p className="text-base text-ink-muted leading-[1.7] mt-4 max-w-2xl">
            Turn experience into content, content into trust, trust into business.
            Each tool here solves a real problem from renovation, writing, or AI-assisted work.
          </p>
        </Container>
      </div>

      {/* Tools list */}
      <Container size="content" className="py-14 sm:py-16">
        <div className="space-y-6">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="border border-border p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            >
              <div className="flex-1">
                <h2 className="text-base font-semibold text-ink mb-2">{tool.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed max-w-xl">
                  {tool.description}
                </p>
              </div>
              {tool.href && (
                <Link
                  href={tool.href}
                  className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors whitespace-nowrap self-start"
                >
                  {tool.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Approach note */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-ink mb-3">How I build tools</h3>
          <div className="space-y-3 text-sm text-ink-muted leading-relaxed max-w-xl">
            <p>
              Every tool here starts from a real problem — something I ran into on a job site,
              while writing, or while helping someone navigate a complex decision. I don&apos;t
              build tools to look impressive. I build them because they save real time.
            </p>
            <p>
              Tools are released incrementally and tested in my own workflow first.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/en"
            className="text-sm text-stone hover:underline underline-offset-4 transition-colors"
          >
            ← Back to home
          </Link>
          <Link
            href="/"
            className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 transition-colors"
          >
            Visit Chinese site
          </Link>
        </div>
      </Container>
    </>
  )
}
