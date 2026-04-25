import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import { isAdminUser } from '@/lib/admin'
import Md2WechatToolClient from './ToolClient'

export const metadata: Metadata = {
  title: '公众号排版工具',
  description:
    '把 Markdown 转成微信公众号排版。公开用户可跳转 md2wechat.cn 编辑；管理员可通过 API 推送公众号草稿箱。',
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

  const isWechatConfigured = !!(process.env.WECHAT_APPID && process.env.WECHAT_APP_SECRET)

  return (
    <Container size="wide" className="py-14 sm:py-18">
      {/* 页面标题 */}
      <div className="mb-10">
        <p className="page-label mb-3">工具</p>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">
          公众号排版工具
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed max-w-xl">
          如果你写公众号文章，可以在这里进入 Markdown 排版编辑器。
          公开用户可以跳转到 md2wechat.cn 进行排版；管理员可以在配置完成后，把文章通过 API 推送到公众号草稿箱。
        </p>
      </div>

      {/* ── 第一块：跳转 md2wechat.cn ── */}
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

      {/* ── 这个工具能做什么 ── */}
      <section className="mb-10 border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-ink mb-4">这个工具能做什么</h2>
        <ul className="space-y-2 text-sm text-ink-muted leading-relaxed">
          <li className="flex items-start gap-2"><span className="text-stone shrink-0">→</span>Markdown 转微信公众号排版</li>
          <li className="flex items-start gap-2"><span className="text-stone shrink-0">→</span>适合公众号文章、长文、图文内容</li>
          <li className="flex items-start gap-2"><span className="text-stone shrink-0">→</span>编辑完成后可以复制到公众号后台</li>
          <li className="flex items-start gap-2"><span className="text-stone shrink-0">→</span>管理员后续可走 API 推送草稿箱</li>
        </ul>
      </section>

      {/* ── 普通用户怎么用 ── */}
      <section className="mb-10 border border-border bg-surface-warm p-6">
        <h2 className="text-sm font-semibold text-ink mb-4">普通用户怎么用</h2>
        <ol className="space-y-2 text-sm text-ink-muted leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-stone text-xs font-semibold shrink-0 mt-0.5 w-4">1.</span>
            点击上方「打开 md2wechat.cn 编辑器」
          </li>
          <li className="flex items-start gap-2">
            <span className="text-stone text-xs font-semibold shrink-0 mt-0.5 w-4">2.</span>
            在编辑器里粘贴 Markdown 内容
          </li>
          <li className="flex items-start gap-2">
            <span className="text-stone text-xs font-semibold shrink-0 mt-0.5 w-4">3.</span>
            调整排版样式
          </li>
          <li className="flex items-start gap-2">
            <span className="text-stone text-xs font-semibold shrink-0 mt-0.5 w-4">4.</span>
            复制排版结果
          </li>
          <li className="flex items-start gap-2">
            <span className="text-stone text-xs font-semibold shrink-0 mt-0.5 w-4">5.</span>
            粘贴到公众号后台，或保存草稿
          </li>
        </ol>
      </section>

      {/* ── 站内轻量排版测试 ── */}
      <section className="mb-10">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-ink mb-2">站内轻量排版测试</h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            如果你只是想快速测试 Markdown 转换，可以在这里输入内容。更完整的编辑体验建议使用 md2wechat.cn。
          </p>
        </div>

        <Md2WechatToolClient
          isAdmin={isAdmin}
          isApiConfigured={isApiConfigured}
          isImageConfigured={isImageConfigured}
          imageModel={imageModel}
          imagePrice={imagePrice}
        />
      </section>

      {/* ── 管理员发布能力 ── */}
      {isAdmin ? (
        <section className="mb-10 border-t border-border pt-8">
          <h2 className="text-sm font-semibold text-ink mb-2">管理员发布能力</h2>
          <p className="text-xs text-ink-muted leading-relaxed mb-6">
            以下能力仅供 Zeno 管理员使用。普通用户不能调用图片生成，也不能推送到我的公众号草稿箱。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* AI 配图 */}
            <div className="border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-ink">AI 配图</p>
                <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5">仅管理员</span>
              </div>
              <ul className="text-xs text-ink-muted space-y-1 leading-relaxed">
                <li>模型：{imageModel}</li>
                <li>预估成本：¥{imagePrice} / 张</li>
                <li>实际费用以火山控制台为准</li>
              </ul>
              {!isImageConfigured && (
                <p className="text-xs text-amber-600 mt-2">火山引擎图片生成 API 尚未配置</p>
              )}
            </div>

            {/* 草稿箱推送 */}
            <div className="border border-border bg-surface p-5">
              <p className="text-sm font-medium text-ink mb-2">草稿箱推送</p>
              <ul className="text-xs text-ink-muted space-y-1 leading-relaxed">
                <li>md2wechat API 转换</li>
                <li>微信公众号草稿箱接口</li>
                <li>只创建草稿，不自动群发</li>
                <li>需配置微信公众号 AppID、AppSecret、默认封面 media_id</li>
              </ul>
              {!isWechatConfigured && (
                <p className="text-xs text-amber-600 mt-2">微信公众号接口尚未配置</p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-10 border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-ink mb-2">Zeno 管理员能力</h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            管理员可以通过 API 推送公众号草稿箱、生成 AI 封面图和配图。
            这些能力仅限管理员，普通用户的排版和复制功能不受任何限制。
          </p>
        </section>
      )}

      {/* ── 创作工作台入口 ── */}
      <section className="mb-10 pt-4 border-t border-border flex items-center gap-6">
        <Link
          href="/tools/publish"
          className="text-xs text-stone hover:text-stone/80 transition-colors"
        >
          → 公众号创作工作台（含回流链接注入）
        </Link>
        <Link
          href="/tools/md2wechat/status"
          className="text-xs text-ink-faint hover:text-ink-muted transition-colors"
        >
          查看 API 配置状态
        </Link>
      </section>

      {/* ── 安全说明 ── */}
      <section className="border border-border bg-surface-warm p-5">
        <h2 className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">安全说明</h2>
        <ul className="space-y-1.5 text-xs text-ink-muted leading-relaxed">
          <li>• 普通用户不会使用 Zeno 的公众号接口</li>
          <li>• 用户输入内容不会自动发到 Zeno 的公众号</li>
          <li>• API Key 和公众号密钥只保存在服务端，前端不可见</li>
          <li>• 第一版只创建草稿，不自动群发</li>
        </ul>
      </section>
    </Container>
  )
}
