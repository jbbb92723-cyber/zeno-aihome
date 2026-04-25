import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import { getDictionary } from '@/lib/i18n'
import { getRecentLocalizedArticles } from '@/lib/i18n'
import ArticleCardEn from './ArticleCardEn'

export const metadata: Metadata = {
  title: 'Zeno — From Renovation Sites to Real Living',
  description:
    "I'm Zeno — 16 years in home renovation, now writing about livable design, human judgment, and building a thoughtful life in the age of AI.",
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://zenoaihome.com/en',
    siteName: 'Zeno',
    title: 'Zeno — From Renovation Sites to Real Living',
    description: 'From renovation sites to real living — on design, human nature, growth, and long-term thinking in the age of AI.',
  },
  alternates: {
    canonical: 'https://zenoaihome.com/en',
    languages: { 'zh-CN': 'https://zenoaihome.com', en: 'https://zenoaihome.com/en' },
  },
}

export default function EnHomePage() {
  const t = getDictionary('en')
  const recentArticles = getRecentLocalizedArticles('en', 3)

  return (
    <>
      {/* ───────────────── Hero ───────────────── */}
      <section className="py-12 sm:py-16 border-b border-border">
        <Container size="reading">
          <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-stone mb-5">
            {t.home.heroLabel}
          </p>
          <h1 className="text-[1.625rem] sm:text-[1.875rem] md:text-[2.25rem] font-semibold leading-[1.3] tracking-[-0.02em] text-ink mb-5 max-w-xl whitespace-pre-line">
            {t.home.heroTitle}
          </h1>
          <p className="text-[0.9375rem] text-ink-muted leading-[1.85] max-w-lg mb-8">
            {t.home.heroDesc}
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/en/blog"
              className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
            >
              {t.home.ctaBlog}
            </Link>
            <Link
              href="/en/about"
              className="text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
            >
              {t.home.ctaAbout}
            </Link>
          </div>
        </Container>
      </section>

      {/* ───────────────── Writing Areas ───────────────── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container>
          <div className="mb-10">
            <p className="page-label mb-3">{t.home.sectionDirections}</p>
            <h2 className="section-heading">{t.home.sectionDirectionsHeading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.writingAreas.map((area) => (
              <div
                key={area.title}
                className="border border-border bg-surface p-6 card-hover"
              >
                <h3 className="card-title mb-3">{area.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/en/blog" className="text-sm text-stone hover:underline underline-offset-2 decoration-stone-light">
              {t.home.viewAllArticles}
            </Link>
          </div>
        </Container>
      </section>

      {/* ───────────────── Recent Articles ───────────────── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="page-label mb-3">{t.home.sectionRecent}</p>
              <h2 className="section-heading">{t.home.sectionRecentHeading}</h2>
            </div>
            <Link href="/en/blog" className="text-sm text-stone hover:underline underline-offset-2 shrink-0 ml-4 pb-1">
              {t.home.viewAll}
            </Link>
          </div>
          <div>
            {recentArticles.map((article) => (
              <ArticleCardEn key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────── About (brief) ───────────────── */}
      <section className="py-16 sm:py-20">
        <Container size="content">
          <div className="border border-border bg-surface p-7 sm:p-9">
            <p className="text-base text-ink-muted leading-relaxed mb-6">
              I&apos;m not building a typical website. What matters to me is sharing front-line
              experience and long-term thinking — to help you navigate complex decisions with
              fewer wrong turns.
            </p>
            <Link
              href="/en/about"
              className="text-sm text-stone hover:underline underline-offset-2 decoration-stone-light"
            >
              More about me →
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
