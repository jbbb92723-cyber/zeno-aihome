'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── 类型 ──────────────────────────────────────────────────────

interface ConfigState {
  database: {
    url: boolean
    directUrl: boolean
    ready: boolean
  }
  email: {
    resendKey: boolean
    emailFrom: string
    ready: boolean
  }
  google: {
    clientId: boolean
    clientSecret: boolean
    ready: boolean
  }
  admin: {
    password: boolean
    sessionSecret: boolean
    isAdmin: boolean
    ready: boolean
  }
  md2wechat: {
    baseUrl: boolean
    apiKey: boolean
    convertEndpoint: string
    draftEndpoint: string
    uploadEndpoint: string
    ready: boolean
  }
  volcengine: {
    apiKey: boolean
    baseUrl: boolean
    model: string
    price: string
    ready: boolean
  }
  wechat: {
    appId: boolean
    appSecret: boolean
    defaultCoverMediaId: boolean
    ready: boolean
  }
}

interface Props {
  config: ConfigState
  isAdmin: boolean
}

// ─── 子组件 ────────────────────────────────────────────────────

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 border ${
        ok
          ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/30'
          : 'text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950/30'
      }`}
    >
      {ok ? '已配置' : '未配置'}
    </span>
  )
}

function Row({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <p className="text-sm text-ink-muted font-mono text-[0.8125rem]">{label}</p>
      <StatusBadge ok={ok} />
    </div>
  )
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <p className="text-sm text-ink-muted font-mono text-[0.8125rem]">{label}</p>
      <p className="text-xs font-mono text-ink-faint bg-surface-warm px-2 py-0.5 border border-border">{value}</p>
    </div>
  )
}

// ─── 主组件 ────────────────────────────────────────────────────

export default function StatusClient({ config, isAdmin }: Props) {
  const [convertResult, setConvertResult]   = useState('')
  const [convertLoading, setConvertLoading] = useState(false)
  const [imageResult, setImageResult]       = useState('')
  const [imageLoading, setImageLoading]     = useState(false)
  const [confirmImage, setConfirmImage]     = useState(false)

  async function testConvert() {
    setConvertLoading(true)
    setConvertResult('')
    try {
      const res = await fetch('/api/md2wechat/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown: '# 测试标题\n\n这是一段测试内容。',
          theme: 'default',
          fontSize: 'medium',
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setConvertResult(`❌ 失败：${data.error ?? '未知错误'}`)
      } else {
        setConvertResult(`✅ 成功！返回 HTML ${(data.html ?? '').length} 字符`)
      }
    } catch (e) {
      setConvertResult(`❌ 网络错误：${e instanceof Error ? e.message : '未知'}`)
    } finally {
      setConvertLoading(false)
    }
  }

  async function testImageGenerate() {
    setImageLoading(true)
    setImageResult('')
    setConfirmImage(false)
    try {
      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '极简风格测试封面图', usage: 'cover' }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setImageResult(`❌ ${data.error ?? '失败'}`)
      } else {
        setImageResult(`✅ 成功！模型：${data.model}，预估 ¥${data.estimatedCost}`)
      }
    } catch (e) {
      setImageResult(`❌ 网络错误：${e instanceof Error ? e.message : '未知'}`)
    } finally {
      setImageLoading(false)
    }
  }

  return (
    <div className="space-y-8">

      {/* 1. 数据库 */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">数据库（Supabase Postgres）</h2>
          <StatusBadge ok={config.database.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="DATABASE_URL" ok={config.database.url} />
          <Row label="DIRECT_URL" ok={config.database.directUrl} />
        </div>
      </section>

      {/* 2. 邮箱注册登录 */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">邮箱注册登录（Resend）</h2>
          <StatusBadge ok={config.email.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="RESEND_API_KEY" ok={config.email.resendKey} />
          <ValueRow label="EMAIL_FROM" value={config.email.emailFrom} />
        </div>
      </section>

      {/* 3. Google 登录 */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">Google 登录</h2>
          <StatusBadge ok={config.google.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="AUTH_GOOGLE_ID" ok={config.google.clientId} />
          <Row label="AUTH_GOOGLE_SECRET" ok={config.google.clientSecret} />
        </div>
      </section>

      {/* 4. 管理员后台 */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">管理员后台</h2>
          <StatusBadge ok={config.admin.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="ADMIN_PASSWORD" ok={config.admin.password} />
          <Row label="ADMIN_SESSION_SECRET" ok={config.admin.sessionSecret} />
          <div className="flex items-center justify-between py-2.5">
            <p className="text-sm text-ink-muted font-mono text-[0.8125rem]">当前管理员状态</p>
            <span className={`text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 border ${
              config.admin.isAdmin
                ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/30'
                : 'text-ink-faint border-border bg-surface'
            }`}>
              {config.admin.isAdmin ? '已登录' : '未登录'}
            </span>
          </div>
        </div>
      </section>

      {/* 5. md2wechat */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">md2wechat 转换服务</h2>
          <StatusBadge ok={config.md2wechat.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="MD2WECHAT_BASE_URL" ok={config.md2wechat.baseUrl} />
          <Row label="MD2WECHAT_API_KEY" ok={config.md2wechat.apiKey} />
          <ValueRow label="Convert Endpoint" value={config.md2wechat.convertEndpoint} />
          <ValueRow label="Draft Endpoint" value={config.md2wechat.draftEndpoint} />
        </div>
        <div className="px-5 py-4 border-t border-border space-y-2">
          <button
            onClick={testConvert}
            disabled={convertLoading}
            className="text-sm text-stone border border-stone/40 px-4 py-2 hover:bg-surface-warm transition-colors disabled:opacity-40"
          >
            {convertLoading ? '测试中…' : '测试 Markdown 转换'}
          </button>
          {convertResult && (
            <p className="text-xs text-ink-muted border border-border bg-surface px-3 py-2">{convertResult}</p>
          )}
        </div>
      </section>

      {/* 6. 豆包图片生成 */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">豆包图片生成</h2>
          <StatusBadge ok={config.volcengine.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="VOLCENGINE_ARK_API_KEY" ok={config.volcengine.apiKey} />
          <ValueRow label="VOLCENGINE_IMAGE_MODEL" value={config.volcengine.model} />
          <ValueRow label="每张预估（元）" value={config.volcengine.price} />
        </div>
        {isAdmin && (
          <div className="px-5 py-4 border-t border-border space-y-2">
            {!confirmImage ? (
              <button
                onClick={() => setConfirmImage(true)}
                disabled={!config.volcengine.ready}
                className="text-sm text-stone border border-stone/40 px-4 py-2 hover:bg-surface-warm transition-colors disabled:opacity-40"
              >
                测试图片生成
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={testImageGenerate}
                  disabled={imageLoading}
                  className="text-sm text-white bg-stone px-4 py-2 hover:bg-stone/85 transition-colors disabled:opacity-40"
                >
                  {imageLoading ? '生成中…' : `确认（约 ¥${config.volcengine.price}）`}
                </button>
                <button onClick={() => setConfirmImage(false)} className="text-sm text-ink-muted underline underline-offset-2">取消</button>
              </div>
            )}
            {imageResult && (
              <p className="text-xs text-ink-muted border border-border bg-surface px-3 py-2">{imageResult}</p>
            )}
          </div>
        )}
      </section>

      {/* 7. 微信公众号草稿箱 */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">微信公众号草稿箱</h2>
          <StatusBadge ok={config.wechat.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="WECHAT_APPID" ok={config.wechat.appId} />
          <Row label="WECHAT_APP_SECRET" ok={config.wechat.appSecret} />
          <Row label="WECHAT_DEFAULT_COVER_MEDIA_ID（可选）" ok={config.wechat.defaultCoverMediaId} />
        </div>
      </section>

      {/* 返回 */}
      <div className="pt-2 flex items-center gap-6">
        <Link href="/tools/md2wechat" className="text-sm text-stone hover:underline underline-offset-2">
          ← 返回排版工具
        </Link>
        <Link href="/admin" className="text-sm text-ink-faint hover:text-ink transition-colors">
          管理入口
        </Link>
      </div>
    </div>
  )
}
