import type { Metadata } from 'next'
import Link from 'next/link'
import { services } from '@/data/services'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '服务 — 不是卖套餐，是帮你做更清醒的判断',
  description:
    '赞诺提供装修报价审核、预算咨询、真实居住派装修服务，以及面向传统行业的 AI 内容资产系统搭建、个人 IP 咨询和一人公司工作流落地。每项服务写清适合谁、不适合谁。',
}

const serviceRelatedArticles: Record<string, { label: string; href: string }[]> = {
  'baojia-shenhe': [
    { label: '报价单真正该怎么看', href: '/blog/baojia-dan-zenme-kan' },
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '便宜的报价，往往是最贵的选择', href: '/blog/article-03-04' },
  ],
  'yusuan-zixun': [
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '水电工程为什么总是超预算', href: '/blog/shuidian-gongcheng-zongchao-yusuan' },
    { label: '装修完最后悔的五件事', href: '/blog/zhuangxiu-hou-hue-de-wu-jian' },
  ],
  'shi-zhu-pai-zhuangxiu': [
    { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
    { label: '实住派装修，究竟反对什么', href: '/blog/article-01-03' },
    { label: '真正耐住十年的装修，优先级是什么', href: '/blog/article-01-07' },
  ],
  'ai-neirong-xitong-zixun': [
    { label: '为什么传统行业人必须认真学 AI', href: '/blog/article-05-01' },
    { label: '内容资产，才是传统行业人的第二生产线', href: '/blog/article-05-02' },
    { label: '我的内容系统是怎么建起来的', href: '/blog/neirong-xitong-jianqi' },
  ],
}

// 装修用户服务 slugs
const renovationSlugs = ['baojia-shenhe', 'yusuan-zixun', 'shi-zhu-pai-zhuangxiu']
// AI / 传统行业服务 slugs
const industrySlugs = ['ai-neirong-xitong-zixun']

// 面向传统行业老板 / 创作者——暂无完整数据，用描述卡展示
const industryExtras = [
  {
    title: '传统行业个人 IP 搭建',
    desc: '你有手艺、有案例、有经验，但不知道怎么让人看到。从定位、内容结构到平台选择，帮你把经验变成可被搜到的资产。',
  },
  {
    title: '一人公司内容工作流',
    desc: '一个人怎么高效地持续输出？从选题到发布，用最少人力维持专业内容产出，建立长期复利。',
  },
  {
    title: 'AI 工具落地咨询',
    desc: '不是教你用哪个 AI 产品，而是帮你把具体业务流程拆解清楚，找到 AI 真正能替代的环节，降低试错成本。',
  },
]

export default function ServicesPage() {
  const renovationServices = services.filter((s) => renovationSlugs.includes(s.slug))
  const industryServices = services.filter((s) => industrySlugs.includes(s.slug))

  return (
    <>
      <PageHero
        label="服务"
        title="不是卖套餐，是帮你做更清醒的判断。"
        subtitle="无论是装修决策，还是传统行业的内容转型，我更关心的是：信息是否透明，判断是否清楚，长期是否值得。"
        size="content"
      />

      <Container size="content" className="py-section">

        {/* ───── A. 面向装修用户 ───── */}
        <div className="mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">A</p>
          <h2 className="text-lg font-semibold text-ink">面向装修用户</h2>
          <p className="text-sm text-ink-muted mt-1">帮你看清报价、控住预算、做出更值得的决定。</p>
        </div>

        <div className="space-y-10">
          {renovationServices.map((service, index) => (
            <div key={service.id} className="border border-border overflow-hidden">

              {/* 卡片头部 */}
              <div className="px-6 py-5 border-b border-border bg-surface-warm flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-stone/30 text-xs font-mono shrink-0 mt-[3px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-ink leading-tight">{service.title}</h2>
                    <p className="text-sm text-stone mt-1">{service.tagline}</p>
                  </div>
                </div>
                <span className="shrink-0 self-start border border-stone/30 text-stone text-xs px-3 py-1 font-medium whitespace-nowrap">
                  {service.price}
                </span>
              </div>

              {/* 卡片正文 */}
              <div className="px-6 py-6 space-y-6">

                <p className="text-sm text-ink leading-relaxed">{service.description}</p>

                {/* 适合谁 / 不适合谁 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                      适合谁
                    </p>
                    <ul className="space-y-2">
                      {service.forWho.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-stone text-xs shrink-0 mt-1">+</span>
                          <span className="text-sm text-ink leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                      不适合谁
                    </p>
                    <ul className="space-y-2">
                      {service.notForWho.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-ink-muted text-xs shrink-0 mt-1">—</span>
                          <span className="text-sm text-ink-muted leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 我会帮你看 */}
                {service.checks && service.checks.length > 0 && (
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                      我会帮你看
                    </p>
                    <ul className="space-y-2">
                      {service.checks.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-stone text-xs shrink-0 mt-1">·</span>
                          <span className="text-sm text-ink leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 交付结果 */}
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                    交付结果
                  </p>
                  <ul className="space-y-2">
                    {service.iDeliver.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-stone text-xs shrink-0 mt-1">·</span>
                        <span className="text-sm text-ink leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 服务边界 */}
                <div className="border-l-2 border-stone-light pl-4">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">
                    服务边界
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed">{service.boundary}</p>
                </div>

              </div>

              {/* 卡片底部：咨询方式 */}
              <div className="px-6 py-4 border-t border-border bg-stone-pale/20">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">
                  咨询方式
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">{service.contactNote}</p>
              </div>

              {/* 相关文章 */}
              {serviceRelatedArticles[service.slug] && (
                <div className="px-6 py-4 border-t border-border">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1">
                    先了解判断逻辑
                  </p>
                  <p className="text-xs text-ink-muted mb-3">
                    如果你想先了解我的判断方式，再决定是否需要这项服务，可以先读这几篇：
                  </p>
                  <div className="space-y-1.5">
                    {serviceRelatedArticles[service.slug].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 text-sm text-ink-muted hover:text-stone transition-colors"
                      >
                        <span className="text-stone/60">→</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* ───── B. 面向传统行业老板 / 创作者 ───── */}
        <div className="mt-16 mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">B</p>
          <h2 className="text-lg font-semibold text-ink">面向传统行业老板 / 创作者</h2>
          <p className="text-sm text-ink-muted mt-1">帮你把经验、判断和流程，整理成可复用的内容资产和工作系统。</p>
        </div>

        {/* 已有完整数据的服务 */}
        <div className="space-y-10">
          {industryServices.map((service, index) => (
            <div key={service.id} className="border border-border overflow-hidden">
              <div className="px-6 py-5 border-b border-border bg-surface-warm flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-stone/30 text-xs font-mono shrink-0 mt-[3px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-ink leading-tight">{service.title}</h2>
                    <p className="text-sm text-stone mt-1">{service.tagline}</p>
                  </div>
                </div>
                <span className="shrink-0 self-start border border-stone/30 text-stone text-xs px-3 py-1 font-medium whitespace-nowrap">
                  {service.price}
                </span>
              </div>
              <div className="px-6 py-6 space-y-6">
                <p className="text-sm text-ink leading-relaxed">{service.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">适合谁</p>
                    <ul className="space-y-2">
                      {service.forWho.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-stone text-xs shrink-0 mt-1">+</span>
                          <span className="text-sm text-ink leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">不适合谁</p>
                    <ul className="space-y-2">
                      {service.notForWho.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-ink-muted text-xs shrink-0 mt-1">—</span>
                          <span className="text-sm text-ink-muted leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">交付结果</p>
                  <ul className="space-y-2">
                    {service.iDeliver.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-stone text-xs shrink-0 mt-1">·</span>
                        <span className="text-sm text-ink leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-l-2 border-stone-light pl-4">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">服务边界</p>
                  <p className="text-sm text-ink-muted leading-relaxed">{service.boundary}</p>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border bg-stone-pale/20">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1.5">咨询方式</p>
                <p className="text-sm text-ink-muted leading-relaxed">{service.contactNote}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 即将推出的行业服务 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {industryExtras.map((item) => (
            <div key={item.title} className="border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-ink mb-3">{item.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed mb-4">{item.desc}</p>
              <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">即将开放</span>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-12 border border-border p-6 sm:p-8">
          <p className="text-sm text-ink leading-relaxed mb-3">
            我不接所有咨询，只接我能真正帮到的。
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-6">
            如果你的需求不在范围内，或读完之后觉得匹配度不高，不用勉强——文章和资料库对你可能更有用。
            如果读完觉得「好像说的就是我的问题」，可以发一条简短的背景说明，我会评估是否能帮到你。
          </p>
          <CTA href="/contact" label="查看联系方式" variant="secondary" />
        </div>

        {/* 改了什么：新增"不确定"降级引导 */}
        {/* 为什么改：直接上 ¥399/699 门槛高，给用户一个免费起点 */}
        <div className="mt-6 border border-border bg-surface-warm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div>
            <p className="text-sm font-medium text-ink">还没想好？先从免费资料开始。</p>
            <p className="text-xs text-ink-muted mt-1 max-w-md">
              装修预算模板、报价审核清单、验收清单都可以免费领取。先用资料建立判断，再决定是否需要服务。
            </p>
          </div>
          <CTA href="/resources" label="去资料库" variant="secondary" />
        </div>

        {/* 关联内容入口 */}
        <div className="mt-10">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">
            更多参考
          </p>
          <div className="space-y-2">
            {[
              { label: '所有文章', href: '/blog' },
              { label: '资料库（免费资料）', href: '/resources' },
              { label: 'AI 提示词体验场', href: '/tools/prompts' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 text-sm text-ink-muted hover:text-stone transition-colors"
              >
                <span className="text-stone">→</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </Container>
    </>
  )
}
