import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Avatar from '@/components/Avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { articles, getArticleBySlug, getRecentArticles } from '@/data/articles'
import ArticleCard from '@/components/ArticleCard'
import CTA from '@/components/CTA'
import CommentSection from '@/components/CommentSection'
import { auth } from '@/auth'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      tags: article.tags,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const session = await auth()
  const isLoggedIn = !!session?.user

  const formattedDate = new Date(article.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Related: other articles in the same category, excluding current
  const related = getRecentArticles(6)
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3)

  const moreArticles = getRecentArticles(4).filter((a) => a.slug !== article.slug).slice(0, 3)

  const suggested = related.length > 0 ? related : moreArticles

  return (
    <>
      {/* 文章头部 */}
      <article className="max-w-reading mx-auto px-5 sm:px-8 pt-12 pb-16">
        {/* 面包屑 */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-ink-muted">
          <Link href="/blog" className="hover:text-stone transition-colors">文章</Link>
          <span>/</span>
          <span className="text-stone">{article.category}</span>
        </nav>

        {/* 标题 */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-stone font-medium border border-stone/30 px-2 py-0.5">
              {article.category}
            </span>
            <time className="text-xs text-ink-muted">{formattedDate}</time>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink leading-tight tracking-tight">
            {article.title}
          </h1>
          <p className="mt-5 text-base text-ink-muted leading-[1.8] border-l-2 border-stone-light pl-4">
            {article.excerpt}
          </p>
          {/* 标签 */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs text-ink-muted border border-border px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 封面图（有图才显示） */}
        {article.coverImage && article.coverImage.length > 0 && (
          <div className="relative w-full aspect-[16/7] overflow-hidden mb-10">
            <Image
              src={article.coverImage}
              alt={article.coverAlt || article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 680px"
            />
          </div>
        )}

        <hr className="border-border mb-10" />

        {/* 正文 */}
        <div className="article-prose prose prose-sm max-w-none text-ink
          [&_p]:text-[0.95rem] [&_p]:leading-[1.9] [&_p]:text-ink [&_p]:mb-0 [&_p+p]:mt-[1.5em]
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-ink [&_h2]:tracking-tight
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:text-ink
          [&_a]:text-stone [&_a]:underline [&_a]:decoration-stone-light [&_a:hover]:decoration-stone
          [&_ul]:my-5 [&_ul]:space-y-1.5 [&_ol]:my-5 [&_ol]:space-y-1.5
          [&_li]:text-[0.95rem] [&_li]:leading-[1.8]
          [&_strong]:text-ink [&_strong]:font-semibold
          [&_hr]:border-border [&_hr]:my-10
          [&_blockquote]:border-l-2 [&_blockquote]:border-stone-light [&_blockquote]:pl-4 [&_blockquote]:text-ink-muted
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>

        {/* 作者介绍 */}
        <div className="mt-14 pt-8 border-t border-border">
          <div className="flex items-start gap-4">
            <Avatar src="/images/brand/avatar.webp" alt="Zeno 头像" fallback="Z" size={40} className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">Zeno · 赞诺</p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed max-w-sm">
                16 年装修从业经历。做过工地，盯过施工，做过方案，也带过团队。
                现在把这些沉淀写出来——不追热点，只讲可用的判断。
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                <Link href="/about" className="text-xs text-stone hover:underline underline-offset-2 decoration-stone-light">
                  了解更多 →
                </Link>
                <Link href="/contact" className="text-xs text-stone hover:underline underline-offset-2 decoration-stone-light">
                  联系我交流
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* 按分类显示不同 CTA */}
      <section className="bg-stone-pale/30 border-y border-border py-10">
        <div className="max-w-reading mx-auto px-5 sm:px-8">
          {article.category === '居住与装修' ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div>
                <p className="text-sm font-medium text-ink">如果你手里已经有报价单，想少走弯路</p>
                <p className="text-xs text-ink-muted mt-1">可以直接查看报价审核服务，也可以先看资料建立判断。</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CTA href="/services" label="查看报价审核服务" variant="secondary" />
                <CTA href="/resources" label="先去资料库看看" variant="ghost" />
              </div>
            </div>
          ) : article.category === 'AI 与新生产力' ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div>
                <p className="text-sm font-medium text-ink">如果你想把 AI 真正接进自己的工作流</p>
                <p className="text-xs text-ink-muted mt-1">而不是只看工具介绍，可以了解 AI 内容系统咨询。</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CTA href="/services" label="查看 AI 咨询服务" variant="secondary" />
                <CTA href="/tools/prompts" label="先看资料和工具" variant="ghost" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div>
                <p className="text-sm font-medium text-ink">有相关的实用资料</p>
                <p className="text-xs text-ink-muted mt-1">装修清单、预算模板、AI 提示词包，可免费领取。</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CTA href="/resources" label="去资料库看看" variant="secondary" />
                <CTA href="/services" label="了解我提供的服务" variant="ghost" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 相关文章 */}
      {suggested.length > 0 && (
        <section className="max-w-reading mx-auto px-5 sm:px-8 py-12">
          <p className="text-xs text-stone font-medium uppercase tracking-widest mb-6">继续阅读</p>
          {suggested.map((a) => (
            <ArticleCard key={a.id} article={a} variant="compact" />
          ))}
          <div className="mt-6">
            <Link href="/blog" className="text-sm text-stone hover:underline underline-offset-2">
              查看全部文章 →
            </Link>
          </div>
        </section>
      )}

      {/* 评论区 */}
      <CommentSection
        articleSlug={article.slug}
        isLoggedIn={isLoggedIn}
        userName={session?.user?.name}
        approvedComments={[]}
      />
    </>
  )
}
