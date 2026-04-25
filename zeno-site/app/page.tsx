import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import Container from '@/components/Container'
import { getRecentArticles } from '@/data/articles'
import { topics } from '@/data/topics'

// 三条主线：真实居住 / AI 生产力 / 行业拆解
const pillars = [
  {
    label: '真实居住',
    title: '让真实生活更顺手',
    desc: '装修不是把房子装漂亮，而是让真实生活更顺手。从预算、材料、报价到长期居住，我更关心那些会影响你十年的判断。',
    href: '/topics',
    cta: '看真实居住专题',
  },
  {
    label: 'AI 生产力',
    title: '把经验变成可复用的系统',
    desc: 'AI 不是用来制造噱头，而是用来整理经验、降低沟通成本、提高决策效率。我把传统行业里散落的经验，变成可复用的工作流、清单和内容资产。',
    href: '/topics',
    cta: '了解 AI 生产力',
  },
  {
    label: '行业拆解',
    title: '拆开信息差，找到更好的做法',
    desc: '传统行业最大的问题不是没有人努力，而是信息差太大、流程不透明、信任成本太高。我想用真实经验和长期主义，拆开这些问题，并找到更好的做法。',
    href: '/blog',
    cta: '看行业拆解文章',
  },
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
      {/* ───── Hero：战略定位表达 ───── */}
      <section className="py-14 sm:py-20 border-b border-border">
        <Container size="reading">
          <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-stone mb-5">Zeno · 赞诺</p>
          <h1 className="text-[1.625rem] sm:text-[1.875rem] md:text-[2.25rem] font-semibold leading-[1.3] tracking-[-0.02em] text-ink mb-5 max-w-xl">
            从装修现场出发，<br />
            用 AI 重建传统行业的判断力。
          </h1>
          <p className="text-[0.9375rem] text-ink-muted leading-[1.85] max-w-lg mb-8">
            我长期在真实工地、客户沟通和传统行业一线工作。
            这里不只讲装修，也讲预算、信息差、行业规则、AI 工具和一人公司的长期生产力。
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/blog"
              className="text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors"
            >
              看 Zeno 方法
            </Link>
            <Link
              href="/resources"
              className="text-sm font-medium text-stone border border-stone/40 px-5 py-2.5 hover:bg-stone-pale transition-colors"
            >
              领取装修资料
            </Link>
            <Link
              href="/topics"
              className="text-sm text-stone underline underline-offset-4 decoration-stone/30 hover:decoration-stone transition-colors"
            >
              了解 AI 内容系统
            </Link>
          </div>
        </Container>
      </section>

      {/* ───── 三条主线：真实居住 / AI 生产力 / 行业拆解 ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container>
          <div className="mb-10">
            <p className="page-label mb-3">三条主线</p>
            <h2 className="section-heading">装修是入口，不是终局</h2>
            <p className="text-sm text-ink-muted mt-2">每条线都从真实经验出发，指向同一个目标——降低信息差，提高判断效率。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="group border border-border bg-surface p-6 sm:p-7 card-hover flex flex-col"
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{p.label}</p>
                <h3 className="card-title mb-3 group-hover:text-stone transition-colors">{p.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{p.desc}</p>
                <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">
                  {p.cta} →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── 最近写的 ───── */}
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

      {/* ───── 重点专题 ───── */}
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

      {/* ───── 资料库入口 ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="mb-8">
            <p className="page-label mb-3">实用资料</p>
            <h2 className="section-heading">装修实用资料</h2>
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

      {/* ───── 关于 Zeno ───── */}
      <section className="py-16 sm:py-20">
        <Container size="content">
          <div className="border border-border bg-surface p-7 sm:p-9">
            <p className="text-base text-ink leading-relaxed mb-4">
              我不是技术出身的人，也不是只会讲概念的 AI 博主。
              我从装修现场、客户沟通和项目管理里走出来，
              知道传统行业真正痛的不是"不努力"，而是信息太散、沟通太慢、经验太难沉淀。
            </p>
            <p className="text-sm text-ink-muted leading-relaxed mb-6">
              所以我用 AI 做的不是炫技，而是把经验、判断和流程整理成普通人也能用的系统。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="text-sm text-stone hover:underline underline-offset-2 decoration-stone-light"
              >
                了解更多关于 Zeno →
              </Link>
              <Link
                href="/services"
                className="text-sm text-ink-muted hover:text-stone transition-colors"
              >
                查看服务
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
