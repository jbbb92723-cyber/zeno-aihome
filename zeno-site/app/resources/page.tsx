/**
 * app/resources/page.tsx
 *
 * 资料库页面（权限改造版）
 * - 每张资料卡片显示 accessLevel 标签
 * - 按钮根据权限状态变化
 * - 第一阶段：前端展示权限逻辑，不做真实下载
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { resources } from '@/data/resources'
import type { ResourceAccessLevel } from '@/data/resources'
import { auth } from '@/auth'
import {
  canAccessResource,
  getAccessLabel,
  getAccessLevelStyle,
  getAccessButtonLabel,
} from '@/lib/permissions'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '资料库',
  description:
    '可直接使用的装修与内容工作流工具，包括装修预算模板、报价审核清单、验收清单、实住派自查表和 AI 提示词包，均可免费领取。',
}

const tagColors: Record<string, string> = {
  装修: 'bg-stone-pale text-stone border border-stone/20',
  居住: 'bg-stone-pale/60 text-stone border border-stone/20',
  AI:   'bg-[#EAE8F0] text-[#5B4E8A] border border-[#5B4E8A]/20',
}

export default async function ResourcesPage() {
  const session = await auth()
  const user = session?.user ?? null

  return (
    <>
      <PageHero
        label="资料库"
        title="拿来就能用的工具"
        subtitle="我只放自己用过、在真实场景里验证过的内容。先拿当前最痛的问题对应的资料，不要追求一次全拿。"
        size="content"
      />


      <Container size="content" className="py-section">

        {/* 权限说明 */}
        <div className="mb-12 p-5 border border-border bg-surface-warm">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
            如何领取
          </p>
          {user ? (
            <p className="text-sm text-ink-muted leading-relaxed">
              你已登录。标注「登录领取」的资料，关注公众号「Zeno AI装修笔记」后回复对应关键词即可获取。
            </p>
          ) : (
            <p className="text-sm text-ink-muted leading-relaxed">
              部分资料需要登录后领取。
              <Link href="/login" className="text-stone hover:underline underline-offset-2 ml-1">登录</Link>
              后可解锁更多内容。关注公众号「Zeno AI装修笔记」，回复对应关键词即可获取。
            </p>
          )}
        </div>

        {/* 资料卡片列表 */}
        <div className="space-y-8">
          {resources.map((resource) => {
            const level: ResourceAccessLevel = resource.accessLevel ?? 'login'
            const canAccess = canAccessResource(user, { accessLevel: level })
            const accessLabel = getAccessLabel(level)
            const accessStyle = getAccessLevelStyle(level)
            const buttonLabel = getAccessButtonLabel(user, { accessLevel: level })

            if (level === 'admin') return null

            return (
            <div
              key={resource.id}
              id={resource.slug}
              className="border border-border overflow-hidden scroll-mt-20"
            >
              {/* 卡片头部 */}
              <div className="px-6 py-5 border-b border-border bg-surface-warm flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 font-medium ${
                        tagColors[resource.tag] ?? 'bg-stone-pale text-stone border border-stone/20'
                      }`}
                    >
                      {resource.tag}
                    </span>
                    {/* 权限标签 */}
                    <span className={`text-xs px-2 py-0.5 font-medium ${accessStyle}`}>
                      {accessLabel}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-ink leading-tight">{resource.title}</h2>
                  <p className="text-sm text-stone mt-1">{resource.subtitle}</p>
                </div>
                {/* 预览图（有图才显示） */}
                {resource.previewImage && resource.previewImage.length > 0 ? (
                  <div className="relative shrink-0 w-20 h-14 overflow-hidden border border-border/60">
                    <Image
                      src={resource.previewImage}
                      alt={resource.previewAlt || resource.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <span className="text-3xl text-stone/15 font-light shrink-0 leading-none select-none">↓</span>
                )}
              </div>

              {/* 卡片内容 */}
              <div className="px-6 py-6 space-y-5">
                <p className="text-sm text-ink-muted leading-relaxed">{resource.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
                      适合谁
                    </p>
                    <p className="text-sm text-ink leading-relaxed">{resource.forWho}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
                      解决什么问题
                    </p>
                    <p className="text-sm text-ink leading-relaxed">{resource.solves}</p>
                  </div>
                </div>

                {/* 怎么用 */}
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">
                    怎么用
                  </p>
                  <ol className="space-y-1.5">
                    {resource.howToUse.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-stone text-xs font-semibold shrink-0 mt-0.5 w-4">
                          {i + 1}.
                        </span>
                        <span className="text-sm text-ink-muted leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* 注意事项 */}
                <div className="bg-surface-warm border border-border px-4 py-3">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1">
                    注意事项
                  </p>
                  <p className="text-xs text-ink-muted leading-relaxed">{resource.caveats}</p>
                </div>
              </div>

              {/* 卡片底部：领取方式 + 权限按鈕 */}
              <div className="px-6 py-4 border-t border-border bg-stone-pale/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1">
                    领取方式
                  </p>
                  <p className="text-sm text-ink-muted">{resource.howToGet}</p>
                </div>
                <div className="shrink-0">
                  {canAccess ? (
                    <Link
                      href="/contact"
                      className="inline-block text-sm text-stone hover:underline underline-offset-2 decoration-stone-light"
                    >
                      {buttonLabel} →
                    </Link>
                  ) : level === 'login' && !user ? (
                    <Link
                      href={`/login?callbackUrl=/resources%23${resource.slug}`}
                      className="inline-block text-sm text-stone border border-stone/30 px-3 py-1.5 hover:bg-stone-pale/50 transition-colors"
                    >
                      {buttonLabel}
                    </Link>
                  ) : (
                    <span className="inline-block text-sm text-ink-faint border border-border px-3 py-1.5">
                      {buttonLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            )
          })}
        </div>

        {/* 底部 CTA */}
        <div className="mt-14 pt-8 border-t border-border flex flex-wrap gap-3">
          <p className="w-full text-sm text-ink-muted mb-2">
            资料是辅助，不替代你的现场判断。先用一遍，再回来看对应文章，会更有感觉。
          </p>
          <CTA href="/blog" label="回去看文章" variant="secondary" />
          <CTA href="/topics" label="看专题" variant="ghost" />
        </div>

      </Container>
    </>
  )
}
