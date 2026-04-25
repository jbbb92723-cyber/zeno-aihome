import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Avatar from '@/components/Avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  getDictionary,
  getArticleByLocalizedSlug,
  getRecentLocalizedArticles,
  getAlternateSlug,
} from '@/lib/i18n'
import ArticleCardEn from '@/app/en/ArticleCardEn'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleByLocalizedSlug(slug, 'en')
  if (!article) return {}

  const zhSlug = getAlternateSlug(article.id, 'zh')

  return {
    title: `${article.title} — Zeno`,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      locale: 'en',
      publishedTime: article.date,
      tags: article.tags,
    },
    alternates: {
      canonical: `https://zenoaihome.com/en/blog/${article.localizedSlug}`,
      languages: {
        'zh-CN': zhSlug ? `https://zenoaihome.com/blog/${zhSlug}` : undefined,
        en: `https://zenoaihome.com/en/blog/${article.localizedSlug}`,
      },
    },
  }
}

export default async function EnArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleByLocalizedSlug(slug, 'en')
  if (!article) notFound()

  const t = getDictionary('en')

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const recentArticles = getRecentLocalizedArticles('en', 3).filter(
    (a) => a.id !== article.id,
  ).slice(0, 2)

  return (
    <>
      {/* ── Header ────────────────────────────────────── */}
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <div className="max-w-[42rem] mx-auto px-5 sm:px-8 lg:px-10">
          <nav className="flex items-center gap-2 mb-8 text-xs text-ink-muted">
            <Link href="/en" className="hover:text-stone transition-colors">{t.article.breadcrumbHome}</Link>
            <span>/</span>
            <Link href="/en/blog" className="hover:text-stone transition-colors">{t.article.breadcrumbBlog}</Link>
          </nav>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs text-stone font-medium">{article.category}</span>
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-ink-faint">#{tag}</span>
            ))}
          </div>
          <h1 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] font-semibold text-ink leading-[1.3] tracking-tight">
            {article.title}
          </h1>
          <p className="text-sm text-ink-muted mt-4">
            {t.article.authorName} · {formattedDate}
          </p>
        </div>
      </div>

      {/* ── Cover image ───────────────────────────────── */}
      {article.coverImage && article.coverImage.length > 0 && (
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 mt-8">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.coverAlt || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        </div>
      )}

      {/* ── Content ───────────────────────────────────── */}
      <article className="max-w-[42rem] mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16">
        <div className="prose-zeno">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* ── Author ────────────────────────────────────── */}
      <div className="max-w-[42rem] mx-auto px-5 sm:px-8 lg:px-10 pb-12">
        <div className="border-t border-border pt-8 flex items-start gap-4">
          <Avatar size={40} />
          <div>
            <p className="text-sm font-semibold text-ink">{t.article.authorName}</p>
            <p className="text-xs text-ink-muted mt-1">{t.article.authorDesc}</p>
          </div>
        </div>
      </div>

      {/* ── Related articles ──────────────────────────── */}
      {recentArticles.length > 0 && (
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 pb-16 sm:pb-20">
          <p className="page-label mb-6">{t.article.relatedArticles}</p>
          <div>
            {recentArticles.map((a) => (
              <ArticleCardEn key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
