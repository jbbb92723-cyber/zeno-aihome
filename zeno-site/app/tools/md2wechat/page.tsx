import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import { isAdminUser } from '@/lib/admin'
import Md2WechatToolClient from './ToolClient'

export const metadata: Metadata = {
  title: '创作工作台',
  description:
    '把经验变成内容，把内容变成信任，把信任变成生意。Zeno 的创作工作流入口。',
  robots: { index: false },
}

export default async function Md2WechatPage() {
  const isAdmin = await isAdminUser()

  const isApiConfigured = !!(
    process.env.MD2WECHAT_BASE_URL &&
    process.env.MD2WECHAT_API_KEY
  )

  const isImageConfigured = !!(process.env.VOLCENGINE_ARK_API_KEY && process.env.VOLCENGINE_IMAGE_MODEL)
  const imageModel = process.env.VOLCENGINE_IMAGE_MODEL ?? 'Doubao-Seedream-5.0-lite'
  const imagePrice = process.env.VOLCENGINE_IMAGE_PRICE_PER_IMAGE ?? '0.22'

  return (
    <Container size="wide" className="py-14 sm:py-18">
      {/* 页面标题 */}
      <div className="mb-10">
        <p className="page-label mb-3">创作工作台</p>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">
          创作工作台
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed max-w-xl">
          把经验变成内容，把内容变成信任，把信任变成生意。
          这里是 Zeno 日常创作的起点——从 Markdown 写作到公众号排版，一步完成。
        </p>
      </div>

      {/* ── 外部编辑器入口 ── */}
      <section className="mb-10">
        <a
          href="https://www.md2wechat.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors"
        >
          打开 md2wechat.cn 编辑器
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      </section>

      {/* ── 创作流程说明 ── */}
      <section className="mb-10 border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-ink mb-4">创作流程</h2>
        <ul className="space-y-2 text-sm text-ink-muted leading-relaxed">
          <li className="flex items-start gap-2"><span className="text-stone shrink-0">1.</span>在 Markdown 编辑器中写好文章</li>
          <li className="flex items-start gap-2"><span className="text-stone shrink-0">2.</span>打开 md2wechat.cn，粘贴内容并调整排版</li>
          <li className="flex items-start gap-2"><span className="text-stone shrink-0">3.</span>复制排版结果，粘贴到公众号后台</li>
          <li className="flex items-start gap-2"><span className="text-stone shrink-0">4.</span>发布前检查配图、标题和摘要</li>
        </ul>
      </section>

      {/* ── 站内轻量排版测试（降低视觉权重） ── */}
      <section className="mb-10">
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-ink-muted hover:text-ink transition-colors">
            站内快速排版测试（展开）
          </summary>
          <div className="mt-4">
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              如果你只是想快速测试 Markdown 转换效果，可以在这里输入内容。更完整的编辑体验建议使用 md2wechat.cn。
            </p>
            <Md2WechatToolClient
              isAdmin={isAdmin}
              isApiConfigured={isApiConfigured}
              isImageConfigured={isImageConfigured}
              imageModel={imageModel}
              imagePrice={imagePrice}
            />
          </div>
        </details>
      </section>

      {/* ── 管理员能力（仅管理员可见） ── */}
      {isAdmin && (
        <section className="mb-10 border-t border-border pt-8">
          <h2 className="text-sm font-semibold text-ink mb-2">管理员能力</h2>
          <p className="text-xs text-ink-muted leading-relaxed mb-6">
            以下功能仅限管理员使用，普通用户不受影响。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-ink">AI 配图</p>
                <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5">仅管理员</span>
              </div>
              <ul className="text-xs text-ink-muted space-y-1 leading-relaxed">
                <li>模型：{imageModel}</li>
                <li>预估成本：¥{imagePrice} / 张</li>
              </ul>
              {!isImageConfigured && (
                <p className="text-xs text-amber-600 mt-2">图片生成服务暂未开放</p>
              )}
            </div>
            <div className="border border-border bg-surface p-5">
              <p className="text-sm font-medium text-ink mb-2">草稿箱推送</p>
              <ul className="text-xs text-ink-muted space-y-1 leading-relaxed">
                <li>Markdown 转微信排版</li>
                <li>推送到公众号草稿箱</li>
                <li>只创建草稿，不自动群发</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-6">
            <Link href="/tools/publish" className="text-xs text-stone hover:text-stone/80 transition-colors">
              → 完整发布工作台
            </Link>
            <Link href="/tools/md2wechat/status" className="text-xs text-ink-faint hover:text-ink-muted transition-colors">
              查看配置状态
            </Link>
          </div>
        </section>
      )}

      {/* ── 安全说明 ── */}
      <section className="border border-border bg-surface-warm p-5">
        <h2 className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">安全说明</h2>
        <ul className="space-y-1.5 text-xs text-ink-muted leading-relaxed">
          <li>• 普通用户的操作仅限排版和复制，不影响任何外部系统</li>
          <li>• 用户输入的内容不会被自动发布</li>
          <li>• 所有密钥仅保存在服务端，前端不可见</li>
        </ul>
      </section>
    </Container>
  )
}
