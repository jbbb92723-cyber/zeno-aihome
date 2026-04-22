import Link from 'next/link'
import { CTAGroup } from '@/components/CTA'
import ArticleCard from '@/components/ArticleCard'
import Container from '@/components/Container'
import { getRecentArticles } from '@/data/articles'
import { topics } from '@/data/topics'

const writingAreas = [
  { title: '居住与装修', desc: '从真实居住出发，讲判断、预算、工地、材料和长期舒适。' },
  { title: '美学与生活', desc: '审美不是摆拍，而是在长期生活里建立克制、秩序和舒适感。' },
  { title: '人性与判断', desc: '装修现场一面墙，往往照见信息差、协作、冲突和责任。' },
  { title: '成长与长期主义', desc: '不追短期刺激，练习在真实生活里做更耐久的选择。' },
  { title: 'AI 与个体升级', desc: '传统行业的人，也应该拥有自己的内容资产、工具系统和数字能力。' },
]

const topicAccents: Record<string, string> = {
  'shi-zhu-pai-zhuangxiu':              'border-l-topic1',
  'cong-gongdi-kan-shijie':             'border-l-topic2',
  'changqi-zhuyi-shenghuo':             'border-l-topic3',
  'chuantong-hangyeren-zenme-yong-ai':  'border-l-topic4',
  'meixue-yu-shenghuo':                 'border-l-topic5',
}

export default function HomePage() {
  const recentArticles = getRecentArticles(3)

  return (
    <>
      {/* ───────────────── Hero ───────────────── */}
      <section className="py-14 sm:py-18 border-b border-border">
        <Container size="content">
          <p className="page-label mb-4">赞诺 · Zeno</p>
          <h1 className="hero-title mb-5 max-w-2xl">
            从装修出发，<br />
            聊居住、美学、人性、成长<br className="hidden sm:block" />
            与 AI 时代的长期主义。
          </h1>
          <p className="text-[0.9375rem] sm:text-base text-ink-muted leading-[1.85] max-w-[560px] mb-8">
            我是 Zeno。做装修，盯过工地，也在持续学习 AI 和技术。
            这里不只谈房子怎么装，也谈人怎么判断、怎么成长、
            怎么在变化越来越快的时代里活得更清醒。
          </p>
          <CTAGroup
            items={[
              { href: '/blog',      label: '看最新文章', variant: 'primary'   },
              { href: '/about',     label: '了解我是谁', variant: 'secondary' },
              { href: '/resources', label: '领取资料',   variant: 'ghost'     },
            ]}
          />
        </Container>
      </section>

      {/* ───────────────── 我主要写什么 ───────────────── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container>
          <div className="mb-10">
            <p className="page-label mb-3">内容方向</p>
            <h2 className="section-heading">我主要写什么</h2>
            <p className="text-sm text-ink-muted mt-2">五个方向，都从真实经历出发。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {writingAreas.map((area) => (
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
            <Link href="/blog" className="text-sm text-stone hover:underline underline-offset-2 decoration-stone-light">
              查看所有文章 →
            </Link>
          </div>
        </Container>
      </section>

      {/* ───────────────── 最近写的 ───────────────── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="page-label mb-3">最近写的</p>
              <h2 className="section-heading">优先放能代表判断力的文章</h2>
              <p className="text-sm text-ink-muted mt-2">不按流量排序。</p>
            </div>
            <Link href="/blog" className="text-sm text-stone hover:underline underline-offset-2 shrink-0 ml-4 pb-1">
              全部 →
            </Link>
          </div>
          <div>
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────── 重点专题 ───────────────── */}
      <section className="py-16 sm:py-20 bg-surface-warm border-b border-border">
        <Container>
          <div className="mb-10">
            <p className="page-label mb-3">专题</p>
            <h2 className="section-heading">连续问题的连续回答</h2>
            <p className="text-sm text-ink-muted mt-2">如果你不想碎片化阅读，从专题开始。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics#${topic.slug}`}
                className={`group block p-5 bg-surface border border-border border-l-4 ${topicAccents[topic.slug] ?? 'border-l-stone'} card-hover`}
              >
                <h3 className="text-sm font-semibold text-ink group-hover:text-stone transition-colors leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-ink-muted mt-2 leading-relaxed">{topic.tagline}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/topics" className="text-sm text-stone hover:underline underline-offset-2">
              查看全部专题 →
            </Link>
          </div>
        </Container>
      </section>

      {/* ───────────────── 资料库入口 ───────────────── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="mb-8">
            <p className="page-label mb-3">实用资料</p>
            <h2 className="section-heading">拿来就能用的工具</h2>
            <p className="text-sm text-ink-muted mt-2">我只放自己用过或验证过的内容。</p>
          </div>
          <div className="space-y-3">
            {[
              { label: '装修预算模板',          desc: '把"感觉花钱"变成"有结构地花钱"' },
              { label: '报价审核清单',          desc: '识别报价单里的常见模糊项和风险项' },
              { label: 'AI 内容工作流提示词包', desc: '先建立自己的方法，再让工具放大效率' },
            ].map((item) => (
              <Link
                key={item.label}
                href="/resources"
                className="group flex items-start gap-4 p-5 border border-border bg-surface card-hover"
              >
                <span className="text-stone shrink-0 mt-0.5">↓</span>
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/resources" className="text-sm text-stone hover:underline underline-offset-2">
              查看全部资料 →
            </Link>
          </div>
        </Container>
      </section>

      {/* ───────────────── 关于我（简） ───────────────── */}
      <section className="py-16 sm:py-20">
        <Container size="content">
          <div className="border border-border bg-surface p-7 sm:p-9">
            <p className="text-base text-ink-muted leading-relaxed mb-6">
              我不是来做一个"标准官网"的。我更在意的是，把一线经验和长期思考讲清楚，帮你在复杂问题前少走弯路。
              如果你也关心居住品质、判断力、人与工具的关系，我们大概率会聊得来。
            </p>
            <Link
              href="/about"
              className="text-sm text-stone hover:underline underline-offset-2 decoration-stone-light"
            >
              了解更多关于我 →
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
