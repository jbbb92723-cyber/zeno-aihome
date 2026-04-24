import type { Metadata } from 'next'
import Link from 'next/link'
import { services } from '@/data/services'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '服务',
  description:
    '赞诺提供装修报价单审核、装修预算咨询、真实居住派装修服务、AI 传统行业内容系统咨询。每项服务写清适合谁、不适合谁，不接所有咨询，只接能真正帮到的。',
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

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="服务"
        title="如果你需要更具体的帮助"
        subtitle="文章可以给方向，但有些问题需要具体情况具体判断。这里是目前提供的服务，每一项都写清适合谁、不适合谁。"
        size="content"
      />

      <Container size="content" className="py-section">

        {/* 服务卡片列表 */}
        <div className="space-y-10">
          {services.map((service, index) => (
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
