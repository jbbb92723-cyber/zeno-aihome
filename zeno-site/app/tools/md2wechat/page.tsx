import type { Metadata } from 'next'
import Container from '@/components/Container'
import { isAdminUser } from '@/lib/admin'
import Md2WechatToolClient from './ToolClient'

export const metadata: Metadata = {
  title: 'Markdown 微信排版工具',
  description:
    '把 Markdown 转成适合微信公众号后台的排版。公开用户可免费转换、预览和复制；AI 配图与推送草稿仅限管理员。',
  robots: { index: false },
}

export default async function Md2WechatPage() {
  const isAdmin = await isAdminUser()

  // API 是否已配置（不暴露密钥，只传 boolean 给客户端）
  const isApiConfigured = !!(
    process.env.MD2WECHAT_BASE_URL &&
    process.env.MD2WECHAT_API_KEY
  )

  // 图片生成配置（服务端读取，只传安全信息给客户端）
  const isImageConfigured = !!(process.env.VOLCENGINE_ARK_API_KEY && process.env.VOLCENGINE_IMAGE_MODEL)
  const imageModel = process.env.VOLCENGINE_IMAGE_MODEL ?? 'Doubao-Seedream-5.0-lite'
  const imagePrice = process.env.VOLCENGINE_IMAGE_PRICE_PER_IMAGE ?? '0.22'

  return (
    <Container size="wide" className="py-14 sm:py-18">
      {/* 页面标题 */}
      <div className="mb-10">
        <p className="page-label mb-3">工具</p>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">
          Markdown 微信排版工具
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed max-w-xl">
          把 Markdown 转成适合微信公众号后台的排版。
          公开用户可以免费转换、预览和复制；AI 配图与推送公众号草稿箱仅限管理员使用。
        </p>
      </div>

      <Md2WechatToolClient
        isAdmin={isAdmin}
        isApiConfigured={isApiConfigured}
        isImageConfigured={isImageConfigured}
        imageModel={imageModel}
        imagePrice={imagePrice}
      />
    </Container>
  )
}
