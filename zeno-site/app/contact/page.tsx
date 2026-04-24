import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '联系我',
  description:
    '欢迎真实、具体、可落地的交流。内容交流、装修相关咨询、AI 工作流与内容系统交流、商务合作——找到适合你的联系入口。',
}

const contactChannels = [
  {
    id: 'wechat-official',
    title: '公众号',
    desc: '最主要的内容发布渠道。关注后回复关键词可领取资料，也可以在文章下留言互动。',
    value: 'Zeno AI装修笔记',
    tag: '内容',
  },
  {
    id: 'wechat',
    title: '微信',
    desc: '装修咨询和 AI 工作流交流的主要渠道。加微信时请备注来意，便于我判断是否能帮到你。',
    value: 'zanxiansheng2025',
    tag: '咨询',
  },
  {
    id: 'email',
    title: '邮箱',
    desc: '适合内容合作、长篇问题讨论，或希望保留完整对话记录的交流场景。',
    value: '1603165918@qq.com',
    tag: '合作',
  },
]

const suitableFor = [
  { title: '装修相关咨询',      desc: '你正在做关键决策，需要第二视角来校准方案、预算或执行路径。' },
  { title: '报价审核',          desc: '拿到报价单但看不懂，想知道哪些是正常的，哪些需要问清楚。' },
  { title: '内容交流',          desc: '你读过文章或专题后，有明确观点想讨论，或有一线经验想补充。' },
  { title: 'AI 工作流与内容系统', desc: '你来自传统行业，想把 AI 真正用进工作，而不是只做演示。' },
  { title: '商务合作',          desc: '如果你的合作与网站主题高度相关，可以发邮件说明背景和具体想法。' },
]

const notSuitableFor = [
  '只想要"立刻见效"的万能模板，不提供任何上下文。',
  '只问一句"怎么快速做成"，没有具体场景。',
  '纯广告推广，与网站主题无关。',
  '希望免费获得详细咨询方案，且不愿意提供必要信息。',
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="联系"
        title="欢迎真实的交流"
        subtitle="如果只是泛泛聊聊机会，我们可能都在浪费时间。如果你有具体问题、真实场景，我们会更有效率。"
      />

      <Container size="content" className="py-14 sm:py-16">

        {/* ── 联系前先判断 ── */}
        <section className="mb-14">
          <h2 className="section-heading mb-6">联系前先判断</h2>
          <p className="text-sm text-ink-muted mb-6">不同的情况，有不同的最优路径。先看看你属于哪一种：</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-border p-5">
              <p className="text-sm font-semibold text-ink mb-2">你有明确的问题要解决</p>
              <p className="text-xs text-ink-muted leading-relaxed mb-4">
                手里有报价单、方案、预算，或者想把 AI 接进工作流——直接看服务页更高效。
              </p>
              <Link href="/services" className="text-sm text-stone hover:underline underline-offset-2 decoration-stone/40">
                查看服务 →
              </Link>
            </div>
            <div className="border border-border p-5">
              <p className="text-sm font-semibold text-ink mb-2">你还在了解阶段</p>
              <p className="text-xs text-ink-muted leading-relaxed mb-4">
                先建立基本判断，再决定下一步。资料库里有免费清单、模板和工具。
              </p>
              <Link href="/resources" className="text-sm text-stone hover:underline underline-offset-2 decoration-stone/40">
                先看资料库 →
              </Link>
            </div>
            <div className="border border-border p-5">
              <p className="text-sm font-semibold text-ink mb-2">合作或其他事项</p>
              <p className="text-xs text-ink-muted leading-relaxed mb-4">
                内容合作、媒体合作、或不适合走标准服务流程的沟通，请直接联系。
              </p>
              <span className="text-xs text-ink-faint">↓ 往下看联系方式</span>
            </div>
          </div>
        </section>

        <hr className="border-border mb-14" />

        {/* ── 联系方式 ── */}
        <section className="mb-14">
          <h2 className="section-heading mb-6">联系方式</h2>
          <div className="space-y-4">
            {contactChannels.map((channel) => (
              <div key={channel.id} className="border border-border bg-surface p-5 sm:p-6 card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-sm font-semibold text-ink">{channel.title}</p>
                  <span className="text-xs text-stone border border-stone/30 px-2 py-px">
                    {channel.tag}
                  </span>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed mb-3">{channel.desc}</p>
                <p className="text-base font-semibold text-stone">{channel.value}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-border mb-14" />

        {/* ── 适合联系的情况 ── */}
        <section className="mb-14">
          <h2 className="section-heading mb-6">适合联系我的情况</h2>
          <div className="space-y-5">
            {suitableFor.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="text-stone text-sm mt-0.5 shrink-0">→</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">{item.title}</p>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 不太适合 ── */}
        <section className="mb-14">
          <h2 className="section-heading mb-6">不太适合的情况</h2>
          <div className="space-y-2.5">
            {notSuitableFor.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-ink-faint text-sm mt-0.5 shrink-0">×</span>
                <p className="text-sm text-ink-muted">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-border mb-14" />

        {/* ── 建议这样发消息 ── */}
        <section className="mb-14">
          <h2 className="section-heading mb-4">建议这样发消息</h2>
          <p className="text-sm text-ink-muted mb-5">有背景信息，会更快得到有效回复。</p>
          <div className="border border-border bg-surface p-6 space-y-4">
            {[
              '你当前的背景（正在装修 / 行业身份 / 当前阶段）',
              '你最核心的一个问题',
              '你已经尝试过什么',
              '你希望得到什么类型的帮助',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-stone text-xs shrink-0 font-semibold mt-0.5">{i + 1}.</span>
                <p className="text-sm text-ink-muted">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 回复说明 ── */}
        <section className="border-t border-border pt-10">
          <p className="text-sm text-ink-muted leading-relaxed mb-3">
            我会按优先级和时间窗口回复，一般 1–3 个工作日处理，复杂问题可能更长。
          </p>
          <p className="text-sm text-ink leading-relaxed">
            我更相信长期连接，而不是一次性成交。如果你也认同这种节奏，欢迎来聊。
          </p>
        </section>

      </Container>
    </>
  )
}

