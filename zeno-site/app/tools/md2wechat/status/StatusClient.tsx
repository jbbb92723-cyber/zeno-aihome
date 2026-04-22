'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── 类型 ──────────────────────────────────────────────────────

interface ConfigState {
  md2wechat: {
    baseUrl: boolean
    apiKey: boolean
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
  admin: {
    emailsConfigured: boolean
    isCurrentUserAdmin: boolean
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
          ? 'text-green-700 border-green-200 bg-green-50'
          : 'text-amber-700 border-amber-200 bg-amber-50'
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
      <p className="text-xs font-mono text-ink-faint bg-stone-pale/40 px-2 py-0.5 border border-border">{value}</p>
    </div>
  )
}

// ─── 主组件 ────────────────────────────────────────────────────

export default function StatusClient({ config, isAdmin }: Props) {
  const [convertResult, setConvertResult]   = useState('')
  const [convertLoading, setConvertLoading] = useState(false)
  const [imageResult, setImageResult]       = useState('')
  const [imageLoading, setImageLoading]     = useState(false)
  const [wechatCheck, setWechatCheck]       = useState('')
  const [confirmImage, setConfirmImage]     = useState(false)

  // ─── 测试 Markdown 转换 ────────────────────────────────────────
  async function testConvert() {
    setConvertLoading(true)
    setConvertResult('')
    try {
      const res = await fetch('/api/md2wechat/convert', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          markdown:  '# 测试标题\n\n这是一段测试内容，用于验证 md2wechat API 是否正常工作。',
          theme:     'default',
          fontSize:  'medium',
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setConvertResult(`❌ 失败：${data.error ?? '未知错误'}`)
      } else {
        const htmlLen = (data.html ?? '').length
        setConvertResult(`✅ 成功！字数：${data.wordCount ?? '-'}，返回 HTML 长度：${htmlLen} 字符`)
      }
    } catch (e) {
      setConvertResult(`❌ 网络错误：${e instanceof Error ? e.message : '未知'}`)
    } finally {
      setConvertLoading(false)
    }
  }

  // ─── 测试图片生成（管理员，需二次确认）────────────────────────────
  async function testImageGenerate() {
    setImageLoading(true)
    setImageResult('')
    setConfirmImage(false)
    try {
      const res = await fetch('/api/images/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          prompt: '极简风格，中文公众号封面图，浅色背景，测试用，不需要文字。',
          usage:  'cover',
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setImageResult(`❌ ${data.error ?? '失败'}`)
      } else {
        setImageResult(`✅ 成功！模型：${data.model}，预估费用 ¥${data.estimatedCost}`)
      }
    } catch (e) {
      setImageResult(`❌ 网络错误：${e instanceof Error ? e.message : '未知'}`)
    } finally {
      setImageLoading(false)
    }
  }

  // ─── 检查微信配置 ──────────────────────────────────────────────
  function checkWechatConfig() {
    const issues: string[] = []
    if (!config.wechat.appId)     issues.push('WECHAT_APPID 未填写')
    if (!config.wechat.appSecret) issues.push('WECHAT_APP_SECRET 未填写')
    if (!config.wechat.defaultCoverMediaId) issues.push('WECHAT_DEFAULT_COVER_MEDIA_ID 未填写（可选，不影响创建草稿）')

    if (issues.length === 0) {
      setWechatCheck('✅ 微信公众号配置已齐全，可以在排版工具页面推送草稿。')
    } else {
      setWechatCheck(`⚠️ 请检查：${issues.join('；')}`)
    }
  }

  return (
    <div className="space-y-8">

      {/* md2wechat 转换服务 */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">md2wechat 转换服务</h2>
          <StatusBadge ok={config.md2wechat.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="MD2WECHAT_BASE_URL" ok={config.md2wechat.baseUrl} />
          <Row label="MD2WECHAT_API_KEY" ok={config.md2wechat.apiKey} />
        </div>
        <div className="px-5 py-4 border-t border-border space-y-2">
          <button
            onClick={testConvert}
            disabled={convertLoading}
            className="text-sm text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {convertLoading ? '测试中…' : '测试 Markdown 转换'}
          </button>
          <p className="text-[0.7rem] text-ink-faint">发送测试 Markdown，验证 md2wechat API 是否正常响应。</p>
          {convertResult && (
            <p className="text-xs text-ink-muted leading-relaxed border border-border bg-surface px-3 py-2">{convertResult}</p>
          )}
        </div>
      </section>

      {/* 火山引擎图片生成 */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">火山引擎图片生成</h2>
          <StatusBadge ok={config.volcengine.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="VOLCENGINE_ARK_API_KEY" ok={config.volcengine.apiKey} />
          <Row label="VOLCENGINE_IMAGE_BASE_URL" ok={config.volcengine.baseUrl} />
          <ValueRow label="VOLCENGINE_IMAGE_MODEL" value={config.volcengine.model} />
          <ValueRow label="VOLCENGINE_IMAGE_PRICE_PER_IMAGE（元/张）" value={config.volcengine.price} />
        </div>
        <div className="px-5 py-4 border-t border-border space-y-2">
          {isAdmin ? (
            <>
              {!confirmImage ? (
                <button
                  onClick={() => setConfirmImage(true)}
                  disabled={!config.volcengine.ready}
                  className="text-sm text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  测试图片生成（管理员）
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={testImageGenerate}
                    disabled={imageLoading}
                    className="text-sm text-white bg-stone px-4 py-2 hover:bg-stone/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {imageLoading ? '生成中…' : '确认生成（会产生约 ¥' + config.volcengine.price + ' 费用）'}
                  </button>
                  <button
                    onClick={() => setConfirmImage(false)}
                    className="text-sm text-ink-muted underline underline-offset-2"
                  >
                    取消
                  </button>
                </div>
              )}
              {!config.volcengine.ready && (
                <p className="text-xs text-amber-600">VOLCENGINE_ARK_API_KEY 或 VOLCENGINE_IMAGE_MODEL 尚未配置</p>
              )}
              {imageResult && (
                <p className="text-xs text-ink-muted border border-border bg-surface px-3 py-2">{imageResult}</p>
              )}
            </>
          ) : (
            <p className="text-xs text-ink-faint">图片生成测试仅管理员可见。</p>
          )}
        </div>
      </section>

      {/* 微信公众号草稿箱 */}
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
        <div className="px-5 py-4 border-t border-border space-y-3">
          <button
            onClick={checkWechatConfig}
            className="text-sm text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
          >
            检查微信配置完整性
          </button>
          {wechatCheck && (
            <p className="text-xs text-ink-muted border border-border bg-surface px-3 py-2">{wechatCheck}</p>
          )}
          <p className="text-[0.7rem] text-ink-faint leading-relaxed">
            此处只做配置检查，不会创建真实草稿。
            实际推送草稿请在{' '}
            <Link href="/tools/md2wechat" className="text-stone hover:underline underline-offset-2">
              排版工具页面
            </Link>
            {' '}操作。
          </p>
        </div>
      </section>

      {/* 管理员权限 */}
      <section className="border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-warm">
          <h2 className="text-sm font-semibold text-ink">管理员权限</h2>
          <StatusBadge ok={config.admin.ready} />
        </div>
        <div className="px-5 py-2">
          <Row label="ADMIN_EMAILS 已配置" ok={config.admin.emailsConfigured} />
          <Row label="当前用户识别为管理员" ok={config.admin.isCurrentUserAdmin} />
        </div>
        {!config.admin.isCurrentUserAdmin && (
          <div className="px-5 py-4 border-t border-border">
            <p className="text-xs text-ink-faint leading-relaxed">
              管理员功能需要登录 ADMIN_EMAILS 中配置的邮箱账号。
              未登录或邮箱未在列表中时，管理员区域不可见。
            </p>
          </div>
        )}
      </section>

      {/* 返回链接 */}
      <div className="pt-2 flex items-center gap-6">
        <Link
          href="/tools/md2wechat"
          className="text-sm text-stone hover:underline underline-offset-2"
        >
          ← 返回排版工具
        </Link>
      </div>

    </div>
  )
}
