/**
 * app/tools/md2wechat/status/page.tsx
 *
 * 公众号发布工作台配置状态页面（Server Component）
 * 服务端读取环境变量，只向客户端传递 boolean / 非敏感值。
 * 任何密钥（API Key、AppSecret 等）均不会传递到客户端。
 */

import type { Metadata } from 'next'
import { isAdminUser } from '@/lib/admin'
import Container from '@/components/Container'
import StatusClient from './StatusClient'

export const metadata: Metadata = {
  title: '配置状态 · 公众号发布工作台',
  robots: 'noindex',  // 不希望搜索引擎收录此诊断页
}

export default async function StatusPage() {
  const admin = await isAdminUser()

  // 只传递安全信息到客户端，不传递任何密钥
  const config = {
    md2wechat: {
      baseUrl: !!process.env.MD2WECHAT_BASE_URL,
      apiKey:  !!process.env.MD2WECHAT_API_KEY,
      ready:   !!(process.env.MD2WECHAT_BASE_URL && process.env.MD2WECHAT_API_KEY),
    },
    volcengine: {
      apiKey:  !!process.env.VOLCENGINE_ARK_API_KEY,
      baseUrl: !!process.env.VOLCENGINE_IMAGE_BASE_URL,
      model:   process.env.VOLCENGINE_IMAGE_MODEL ?? '未配置',
      price:   process.env.VOLCENGINE_IMAGE_PRICE_PER_IMAGE ?? '0.22',
      ready:   !!(process.env.VOLCENGINE_ARK_API_KEY && process.env.VOLCENGINE_IMAGE_MODEL),
    },
    wechat: {
      appId:              !!process.env.WECHAT_APPID,
      appSecret:          !!process.env.WECHAT_APP_SECRET,
      defaultCoverMediaId: !!process.env.WECHAT_DEFAULT_COVER_MEDIA_ID,
      ready:              !!(process.env.WECHAT_APPID && process.env.WECHAT_APP_SECRET),
    },
    admin: {
      emailsConfigured:    !!process.env.ADMIN_EMAILS,
      isCurrentUserAdmin:  admin,
      ready:               !!process.env.ADMIN_EMAILS,
    },
  }

  return (
    <Container size="content" className="py-14 sm:py-18">

      {/* 页面标题 */}
      <div className="mb-10">
        <p className="page-label mb-3">工具 / 配置状态</p>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">
          公众号发布工作台配置状态
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed max-w-xl">
          此页面用于检查各项 API 是否已正确配置。不会显示任何密钥或敏感信息，只显示「已配置 / 未配置」。
          配置方法请参考{' '}
          <a
            href="https://github.com/jbbb92723-cyber/zenoaihome/blob/main/zeno-site/docs/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%8F%91%E5%B8%83%E5%B7%A5%E4%BD%9C%E5%8F%B0%E9%85%8D%E7%BD%AE%E6%A3%80%E6%9F%A5.md"
            className="text-stone hover:underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            配置说明文档
          </a>。
        </p>
      </div>

      <StatusClient config={config} isAdmin={admin} />

    </Container>
  )
}
