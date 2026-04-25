import type { Metadata } from 'next'
import Container from '@/components/Container'
import { isAdminUser } from '@/lib/admin'
import PublishClient from './PublishClient'

export const metadata: Metadata = {
  title: '公众号创作工作台',
  description:
    '写完文章在这里排版、生成配图，一键推送到公众号草稿箱，并自动注入网站回流链接。',
  robots: { index: false },
}

export default async function PublishPage() {
  const isAdmin = await isAdminUser()

  const isApiConfigured = !!(
    process.env.MD2WECHAT_BASE_URL &&
    process.env.MD2WECHAT_API_KEY
  )

  const isImageConfigured = !!(
    process.env.VOLCENGINE_ARK_API_KEY &&
    process.env.VOLCENGINE_IMAGE_MODEL
  )

  const isWechatConfigured = !!(
    process.env.WECHAT_APPID &&
    process.env.WECHAT_APP_SECRET
  )

  const imagePrice = process.env.VOLCENGINE_IMAGE_PRICE_PER_IMAGE ?? '0.22'

  return (
    <Container size="wide" className="py-14 sm:py-18">

      {/* 页面标题 */}
      <div className="mb-10">
        <p className="page-label mb-3">工具</p>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">
          公众号创作工作台
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed max-w-xl">
          Markdown 排版 → AI 配图 → 同步草稿箱，并在文末自动注入网站回流链接，驱动公众号读者回到
          zenoaihome.com。
        </p>
      </div>

      {/* 配置状态提示（管理员可见） */}
      {isAdmin && (
        <div className="mb-10 border border-border bg-surface p-5 space-y-2">
          <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-3">环境变量状态</p>
          {[
            { label: 'MD2WECHAT 排版 API',  ok: isApiConfigured },
            { label: '火山引擎图片生成',       ok: isImageConfigured },
            { label: '微信公众号草稿 API',     ok: isWechatConfigured },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-ink-muted">
              <span className={item.ok ? 'text-emerald-500' : 'text-red-400'}>
                {item.ok ? '✓' : '✗'}
              </span>
              {item.label}
              {!item.ok && <span className="text-ink-faint">（未配置）</span>}
            </div>
          ))}
        </div>
      )}

      {/* 主工作流 */}
      <PublishClient
        isAdmin={isAdmin}
        isApiConfigured={isApiConfigured}
        isImageConfigured={isImageConfigured}
        imagePrice={imagePrice}
      />

    </Container>
  )
}
