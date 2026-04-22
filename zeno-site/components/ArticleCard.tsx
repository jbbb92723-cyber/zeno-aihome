import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/data/articles'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'compact'
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const formattedDate = new Date(article.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (variant === 'compact') {
    return (
      <Link
        href={`/blog/${article.slug}`}
        className="group flex items-start gap-4 py-4 border-b border-border last:border-0 hover:opacity-80 transition-opacity"
      >
        <span className="text-xs text-stone font-medium mt-0.5 shrink-0 pt-px">
          {article.category}
        </span>
        <div>
          <h3 className="text-sm text-ink font-medium group-hover:text-stone transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-ink-muted mt-1">{formattedDate}</p>
        </div>
      </Link>
    )
  }

  const hasCover = article.coverImage && article.coverImage.length > 0

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block py-6 border-b border-border last:border-0"
    >
      {hasCover && (
        <div className="relative w-full aspect-[16/7] overflow-hidden mb-4">
          <Image
            src={article.coverImage!}
            alt={article.coverAlt || article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-stone font-medium">{article.category}</span>
        <span className="text-border">·</span>
        <time className="text-xs text-ink-muted">{formattedDate}</time>
      </div>
      <h2 className="text-base sm:text-lg font-medium text-ink group-hover:text-stone transition-colors leading-snug mb-2">
        {article.title}
      </h2>
      <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-1 mt-3">
        <span className="text-xs text-stone group-hover:underline transition-all">
          阅读全文
        </span>
        <span className="text-xs text-stone opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </div>
    </Link>
  )
}
