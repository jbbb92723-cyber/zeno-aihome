'use client'

import { useState } from 'react'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import ArticleCardEn from '@/app/en/ArticleCardEn'
import { getDictionary, getLocalizedArticles, getLocalizedCategories } from '@/lib/i18n'

export default function EnBlogPage() {
  const t = getDictionary('en')
  const allArticles = getLocalizedArticles('en')
  const categories = getLocalizedCategories('en')

  const [activeCategory, setActiveCategory] = useState<string>(t.blog.allCategories)

  const allCats = [t.blog.allCategories, ...categories]

  const filtered =
    activeCategory === t.blog.allCategories
      ? allArticles
      : allArticles.filter((a) => a.category === activeCategory)

  return (
    <>
      <PageHero
        label={t.blog.pageLabel}
        title={t.blog.pageTitle}
        subtitle={t.blog.pageSubtitle}
      />

      <Container size="content" className="py-12 sm:py-16">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm px-4 py-1.5 border transition-colors ${
                activeCategory === cat
                  ? 'border-stone bg-stone text-white'
                  : 'border-border text-ink-muted hover:border-stone hover:text-stone'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article list */}
        <div>
          {filtered.length === 0 ? (
            <p className="text-sm text-ink-muted py-8">{t.blog.noArticles}</p>
          ) : (
            filtered.map((article) => (
              <ArticleCardEn key={article.id} article={article} />
            ))
          )}
        </div>
      </Container>
    </>
  )
}
