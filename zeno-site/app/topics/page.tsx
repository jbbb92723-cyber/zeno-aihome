import type { Metadata } from 'next'
import Link from 'next/link'
import { topics } from '@/data/topics'
import { getArticleBySlug } from '@/data/articles'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '专题',
  description:
    '专题不是标签集合，而是"一个连续问题的连续回答"。实住派装修、从工地看世界、长期主义生活、传统行业人如何用 AI 升级自己。',
}

const topicAccents: Record<string, string> = {
  'shi-zhu-pai-zhuangxiu':            '#8B7355',
  'cong-gongdi-kan-shijie':           '#6B7A5E',
  'changqi-zhuyi-shenghuo':           '#5B6E8A',
  'chuantong-hangyeren-zenme-yong-ai':'#7A6B8A',
  'meixue-yu-shenghuo':               '#8A6B5B',
}

export default function TopicsPage() {
  return (
    <>
      <PageHero
        label="专题"
        title="连续问题的连续回答"
        subtitle="专题不是标签堆叠，而是围绕一个长期问题，把文章串成可持续阅读的路径。如果你不想碎片化阅读，从专题开始。"
        size="content"
      />

      <Container size="content" className="py-section">

        {/* 建议阅读顺序提示 */}
        <div className="mb-12 p-5 border border-border bg-surface-warm">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
            建议阅读顺序
          </p>
          <div className="space-y-1.5 text-sm text-ink-muted">
            <p>
              <span className="text-stone font-medium">新读者</span>
              　先看「实住派装修」和「从工地看世界」
            </p>
            <p>
              <span className="text-stone font-medium">想做自我升级</span>
              　再看「长期主义生活」
            </p>
            <p>
              <span className="text-stone font-medium">想把工具落地</span>
              　最后看「传统行业人如何用 AI 升级自己」
            </p>
          </div>
        </div>

        {/* 专题列表 */}
        <div className="space-y-10">
          {topics.map((topic, index) => {
            const accent = topicAccents[topic.slug] ?? '#8B7355'
            const relatedArticles = topic.relatedSlugs
              .map((slug) => getArticleBySlug(slug))
              .filter(Boolean)

            return (
              <div
                key={topic.id}
                id={topic.slug}
                className="border border-border scroll-mt-20 overflow-hidden"
              >
                {/* 卡片头部 */}
                <div
                  className="px-6 py-5 border-b border-border flex items-start gap-4"
                  style={{ borderLeftWidth: '3px', borderLeftColor: accent }}
                >
                  <span className="text-2xl font-light leading-none shrink-0 mt-0.5"
                    style={{ color: `${accent}40`, fontVariantNumeric: 'tabular-nums' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="section-heading">{topic.title}</h2>
                    <p className="text-sm mt-1.5" style={{ color: accent }}>{topic.tagline}</p>
                  </div>
                </div>

                {/* 卡片内容 */}
                <div className="px-6 py-6 space-y-5">

                  {/* 核心问题 */}
                  <div className="border-l-2 pl-4" style={{ borderColor: `${accent}50` }}>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">
                      核心问题
                    </p>
                    <p className="text-sm text-ink leading-relaxed">{topic.coreQuestion}</p>
                  </div>

                  {/* 描述 */}
                  <p className="text-sm text-ink-muted leading-relaxed">{topic.description}</p>

                  {/* 会写什么 */}
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                      这里会写什么
                    </p>
                    <ul className="space-y-1.5">
                      {topic.willWrite.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-stone-light block" />
                          <span className="text-sm text-ink-muted leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 适合谁 */}
                  <p className="text-xs text-ink-muted">
                    <span className="font-semibold text-ink-muted">适合：</span>
                    {topic.forWho}
                  </p>

                  {/* 已有文章 */}
                  {relatedArticles.length > 0 && (
                    <div>
                      <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                        已有文章
                      </p>
                      <div className="border border-border divide-y divide-border">
                        {relatedArticles.map((article) => {
                          if (!article) return null
                          return (
                            <Link
                              key={article.id}
                              href={`/blog/${article.slug}`}
                              className="group flex items-center justify-between px-4 py-3 hover:bg-surface-warm transition-colors"
                            >
                              <span className="text-sm text-ink group-hover:text-stone transition-colors">
                                {article.title}
                              </span>
                              <span className="text-stone text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
                                →
                              </span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 底部 CTA */}
        <div className="mt-14 pt-8 border-t border-border flex flex-wrap gap-3">
          <CTA href="/blog" label="看所有文章" variant="secondary" />
          <CTA href="/contact" label="联系我" variant="ghost" />
        </div>

      </Container>
    </>
  )
}
