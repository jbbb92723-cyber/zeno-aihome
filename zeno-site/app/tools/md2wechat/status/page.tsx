/**
 * app/tools/md2wechat/status/page.tsx
 *
 * 系统配置状态页面（Server Component）
 * 服务端读取环境变量，只向客户端传递 boolean / 非敏感值。
 */

import type { Metadata } from 'next'
import { isAdminUser } from '@/lib/admin'
import Container from '@/components/Container'
import StatusClient from './StatusClient'

export const metadata: Metadata = {
  title: '系统配置状态',
  robots: 'noindex',
}

export default async function StatusPage() {
  const admin = await isAdminUser()

  const config = {
    database: {
      url:       !!process.env.DATABASE_URL,
      directUrl: !!process.env.DIRECT_URL,
      ready:     !!(process.env.DATABASE_URL && process.env.DIRECT_URL),
    },
    email: {
      resendKey: !!process.env.RESEND_API_KEY,
      emailFrom: process.env.EMAIL_FROM || '未配置',
      ready:     !!process.env.RESEND_API_KEY,
    },
    google: {
      clientId:     !!(process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID),
      clientSecret: !!(process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET),
      ready:        !!(
        (process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID) &&
        (process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET)
      ),
    },
    admin: {
      password:      !!process.env.ADMIN_PASSWORD,
      sessionSecret: !!process.env.ADMIN_SESSION_SECRET,
      isAdmin:       admin,
      ready:         !!(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET),
    },
    md2wechat: {
      baseUrl: !!process.env.MD2WECHAT_BASE_URL,
      apiKey:  !!process.env.MD2WECHAT_API_KEY,
      convertEndpoint: process.env.MD2WECHAT_CONVERT_ENDPOINT || '/api/v1/convert',
      draftEndpoint:   process.env.MD2WECHAT_DRAFT_ENDPOINT || '/article-draft',
      uploadEndpoint:  process.env.MD2WECHAT_UPLOAD_ENDPOINT || '未配置',
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
  }

  return (
    <Container size="content" className="py-14 sm:py-18">
      <div className="mb-10">
        <p className="page-label mb-3">系统 / 配置状态</p>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">
          系统配置状态
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed max-w-xl">
          此页面用于检查各项服务是否已正确配置。不会显示任何密钥或敏感信息。
        </p>
      </div>

      <StatusClient config={config} isAdmin={admin} />
    </Container>
  )
}
