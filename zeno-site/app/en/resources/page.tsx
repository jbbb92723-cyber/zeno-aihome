import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Resource Library — Zeno',
  description:
    'Practical checklists, templates, and thinking tools for real-life renovation and content systems.',
  alternates: {
    canonical: 'https://zenoaihome.com/en/resources',
    languages: {
      'zh-CN': 'https://zenoaihome.com/resources',
      en: 'https://zenoaihome.com/en/resources',
    },
  },
}

const resources = [
  {
    title: 'Renovation Budget Template',
    desc: 'A structured spreadsheet to plan and track your renovation budget with realistic contingency buffers.',
  },
  {
    title: 'Quotation Review Checklist',
    desc: 'Key items to verify before signing any contractor quote — unit prices, scope, hidden fees, and payment terms.',
  },
  {
    title: 'Final Acceptance Checklist',
    desc: 'A step-by-step walkthrough for inspecting finished work before final payment.',
  },
  {
    title: 'AI Prompt Pack for Renovation Content',
    desc: 'Curated prompts for writing renovation articles, structuring project notes, and generating risk checklists.',
  },
]

export default function EnResourcesPage() {
  return (
    <>
      <PageHero
        label="Resource Library"
        title="Resource Library"
        subtitle="Practical checklists, templates, and thinking tools for real-life renovation and content systems."
      />

      <Container size="content" className="py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {resources.map((r) => (
            <div
              key={r.title}
              className="border border-border p-6 hover:border-stone/40 transition-colors"
            >
              <h3 className="text-[0.9375rem] font-semibold text-ink mb-2">{r.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Translation note */}
        <div className="mt-12 px-5 py-4 border border-border bg-surface-warm text-sm text-ink-muted leading-relaxed">
          Some resources are still being translated. Chinese resources remain available for now.
        </div>

        <div className="mt-8">
          <Link
            href="/resources"
            className="inline-block text-sm font-medium text-stone border border-stone/30 px-5 py-2.5 hover:bg-stone-pale/50 transition-colors"
          >
            View Chinese Resource Library →
          </Link>
        </div>
      </Container>
    </>
  )
}
