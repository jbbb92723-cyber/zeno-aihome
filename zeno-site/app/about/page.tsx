import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '关于我',
  description:
    '我是 Zeno。做过装修，盯过工地，处理过无数报价纠纷和客户分歧。用斯多葛式清醒、审美秩序和 AI 工具，帮助人在真实生活里做出更清醒、更耐久的选择。',
}

const believes = [
  '真实比包装重要。',
  '清晰比热闹重要。',
  '过程比口号重要。',
  '长期积累比短期爆发更可靠。',
]

const dontDo = [
  '不做传统装修公司官网式表达。',
  '不做"焦虑驱动"的营销话术。',
  '不做卖课式承诺和速成神话。',
]

const doingNow = [
  '持续更新文章和专题内容。',
  '沉淀装修与居住相关的实用资料。',
  '把 AI 工作流用于内容生产与知识整理。',
  '打磨一个「可长期复利」的个人内容系统。',
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="关于我"
        title="我是 Zeno。"
        subtitle="从工地出发的现实派生活建造者。这不是一份履历，而是你判断这个人是否值得长期关注的页面。"
      />

      <Container size="content" className="py-14 sm:py-16">
        {/* ── 我是谁 ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">我是谁</h2>
          <p className="text-base text-ink leading-[1.85]">
            我是 Zeno。
            做过装修，盯过工地，处理过无数报价纠纷和客户分歧。
            这 16 年教会我一件事：大多数坏结果，不是运气问题，是决策顺序的问题。
          </p>
          <p className="text-base text-ink leading-[1.85] mt-4">
            我从工地现场走来，见过预算失控的全过程，也见过一份清晰的报价单如何让人少踩多少坑。
            这些经历让我能从「用的人」的角度，而不是从「卖的人」的角度，讲清楚装修和真实居住这件事。
          </p>
          <p className="text-base text-ink leading-[1.85] mt-4">
            现在我用内容系统，把这些积累整理成真正能帮到人的判断和资产。
            同时认真学 AI，不是为了跟风，而是让经验沉淀得更系统、传播得更远。
            不卖焦虑，不卖风格，只谈真实。
          </p>
        </section>

        {/* ── 我相信什么 ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">我相信什么</h2>
          <div className="space-y-3">
            {believes.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-stone text-sm mt-1 shrink-0">—</span>
                <p className="text-sm text-ink leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 我不做什么 ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">我不做什么</h2>
          <div className="space-y-3">
            {dontDo.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-stone text-sm mt-1 shrink-0">×</span>
                <p className="text-sm text-ink-muted leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 我现在在做什么 ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">我现在在做什么</h2>
          <div className="space-y-3">
            {doingNow.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-stone text-sm mt-1 shrink-0">→</span>
                <p className="text-sm text-ink">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 联系入口 ── */}
        <section className="border-t border-border pt-10">
          <h2 className="section-heading mb-4">如果你想联系我</h2>

          <CTA href="/contact" label="去联系页" variant="secondary" />
        </section>
      </Container>
    </>
  )
}
