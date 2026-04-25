import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Topics',
  description:
    'Explore topics: real living & renovation, aesthetics & daily life, human judgment, and AI for traditional industry people.',
}

const topics = [
  {
    title: 'Real Living & Renovation',
    description:
      'What renovation actually teaches you about decision-making, budgets, and living with imperfection. Based on 16+ years of on-site experience.',
    explores:
      'Budget traps and how to avoid them. Why the cheapest quote often costs the most. How to evaluate a contractor before signing. What acceptance inspection really means. Why renovation is infrastructure, not consumption.',
    relatedEntry: 'Start with: why renovation budgets always go over →',
    slug: 'living-renovation',
  },
  {
    title: 'Aesthetics & Daily Life',
    description:
      'How restraint, proportion, and everyday choices shape the way a home feels — beyond trends and decorating tips.',
    explores:
      'Why lighting is the most underrated design element. The case against "Instagram-style" decoration. How material choices affect daily living. What a home looks like after five years — not just on day one.',
    relatedEntry: 'Start with: aesthetics is not taste, it\'s judgment →',
    slug: 'aesthetics',
  },
  {
    title: 'Human Judgment',
    description:
      'Patterns in how people make decisions — on job sites, in business, and in life. Observations from the field, not from textbooks.',
    explores:
      'Why people lose their judgment during renovation. The three psychological traps homeowners fall into. Why trusting your instinct is dangerous in unfamiliar territory. The "responsibility vacuum" in renovation projects.',
    relatedEntry: 'Start with: why people lose judgment during renovation →',
    slug: 'judgment',
  },
  {
    title: 'AI for Traditional Industry People',
    description:
      'How practitioners in hands-on industries can genuinely benefit from AI — without hype, without replacing judgment, and without pretending it solves everything.',
    explores:
      'What AI actually helped me do (and what it didn\'t). How to keep your voice when writing with AI. Why prompts are workflows, not magic spells. The three levels of individual productivity upgrade.',
    relatedEntry: 'Start with: what AI did and didn\'t do for me →',
    slug: 'ai-upgrade',
  },
]

export default function EnTopicsPage() {
  return (
    <>
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">
            Topics
          </p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Explore Topics</h1>
          <p className="text-base text-ink-muted leading-[1.7] mt-4 max-w-2xl">
            Four areas I write about — each rooted in lived experience rather than abstract
            theory.
          </p>
        </Container>
      </div>

      <Container size="content" className="py-14 sm:py-16">
        <div className="space-y-8">
          {topics.map((topic) => (
            <div
              key={topic.slug}
              className="border border-border p-6 hover:bg-surface-warm transition-colors"
            >
              <h2 className="text-base font-semibold text-ink mb-2">{topic.title}</h2>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                {topic.description}
              </p>
              <div className="mb-4">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
                  What this topic explores
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">{topic.explores}</p>
              </div>
              <p className="text-sm text-stone">{topic.relatedEntry}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            English essays are added selectively — quality over quantity.
            More detailed articles are available on the{' '}
            <Link
              href="/topics"
              className="text-stone hover:underline underline-offset-2"
            >
              Chinese version
            </Link>.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/en/tools"
              className="text-sm text-stone hover:underline underline-offset-4 transition-colors"
            >
              Explore tools →
            </Link>
            <Link
              href="/en"
              className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </Container>
    </>
  )
}
