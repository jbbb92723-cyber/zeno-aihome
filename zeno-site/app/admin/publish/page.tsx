'use client'

/**
 * app/admin/publish/page.tsx
 *
 * 公众号草稿发布后台
 * - 需要输入 ADMIN_TOKEN 才能操作（Token 只和服务端比对）
 * - 支持：生成封面图 / 预览公众号排版 / 创建草稿
 * - 不自动发布，仅创建草稿，由人工在公众号后台审核后发布
 */

import { useState, useRef } from 'react'

// ─── 工具函数 ──────────────────────────────────────────────────
async function apiFetch(
  url: string,
  adminToken: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; data: unknown; statusCode: number }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'x-admin-token': adminToken,
    },
    body: JSON.stringify(body),
  })
  let data: unknown
  try {
    data = await res.json()
  } catch {
    data = await res.text()
  }
  return { ok: res.ok, data, statusCode: res.status }
}

// ─── 组件 ──────────────────────────────────────────────────────
export default function AdminPublishPage() {
  // 管理员 Token
  const [adminToken, setAdminToken] = useState('')
  const [tokenLocked, setTokenLocked] = useState(false)

  // 文章内容
  const [title, setTitle]         = useState('')
  const [markdown, setMarkdown]   = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [theme] = useState('default')

  // UI 状态
  const [loading, setLoading]       = useState<string | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const [success, setSuccess]       = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<{
    type: 'url' | 'base64'
    src: string
    notice?: string
  } | null>(null)
  const [draftResult, setDraftResult] = useState<Record<string, unknown> | null>(null)

  const previewRef = useRef<HTMLDivElement>(null)

  function clearMessages() {
    setError(null)
    setSuccess(null)
  }

  // ── 锁定 Token ──────────────────────────────────────────────
  function handleLockToken() {
    if (!adminToken.trim()) {
      setError('请输入 ADMIN_TOKEN。')
      return
    }
    setTokenLocked(true)
    setError(null)
    setSuccess('Token 已设置，现在可以使用所有功能。')
  }

  // ── 生成封面图 ───────────────────────────────────────────────
  async function handleGenerateImage() {
    clearMessages()
    if (!imagePrompt.trim()) {
      setError('请输入封面图提示词。')
      return
    }
    setLoading('image')
    setGeneratedImage(null)

    const result = await apiFetch('/api/image/generate', adminToken, {
      prompt: imagePrompt,
      size:   '2560x1440', // 豆包最低要求 3,686,400 像素，2560×1440 = 3,686,400
    })

    setLoading(null)

    if (!result.ok) {
      const d = result.data as Record<string, string>
      setError(d?.error ?? `生成封面图失败（HTTP ${result.statusCode}）。`)
      return
    }

    const d = result.data as Record<string, string>

    if (d.notice) {
      setError(d.notice) // notice 作为警告显示
    }

    if (d.type === 'url' && d.imageUrl) {
      setGeneratedImage({ type: 'url', src: d.imageUrl })
      setCoverImageUrl(d.imageUrl)
      setSuccess('封面图已生成！URL 已自动填入下方输入框。')
    } else if (d.type === 'base64' && d.imageBase64) {
      setGeneratedImage({ type: 'base64', src: d.imageBase64, notice: d.notice })
      setSuccess('封面图已生成（base64 预览）。如需用于公众号，请接入存储服务后获取外链 URL。')
    }
  }

  // ── 预览公众号排版 ───────────────────────────────────────────
  async function handlePreview() {
    clearMessages()
    if (!markdown.trim()) {
      setError('请输入 Markdown 内容。')
      return
    }
    setLoading('preview')
    setPreviewHtml(null)

    const result = await apiFetch('/api/wechat/convert', adminToken, {
      markdown,
      theme,
      fontSize: 'medium',
    })

    setLoading(null)

    if (!result.ok) {
      const d = result.data as Record<string, string>
      setError(d?.error ?? `排版预览失败（HTTP ${result.statusCode}）。`)
      return
    }

    // 上游可能返回 HTML 字符串或 JSON 包含 html 字段
    const d = result.data
    if (typeof d === 'string') {
      setPreviewHtml(d)
    } else if (typeof d === 'object' && d !== null) {
      const obj = d as Record<string, unknown>
      const html = (obj.html ?? obj.content ?? obj.data) as string | undefined
      setPreviewHtml(html ?? JSON.stringify(d, null, 2))
    }

    setSuccess('排版预览已生成，请查看下方预览区域。')
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  // ── 创建草稿 ─────────────────────────────────────────────────
  async function handleCreateDraft() {
    clearMessages()
    if (!title.trim()) {
      setError('请输入文章标题。')
      return
    }
    if (!markdown.trim()) {
      setError('请输入 Markdown 内容。')
      return
    }
    setLoading('draft')
    setDraftResult(null)

    const result = await apiFetch('/api/wechat/draft', adminToken, {
      title,
      markdown,
      coverImageUrl: coverImageUrl.trim() || undefined,
      theme,
      fontSize: 'medium',
    })

    setLoading(null)

    if (!result.ok) {
      const d = result.data as Record<string, string>
      setError(d?.error ?? `创建草稿失败（HTTP ${result.statusCode}）。`)
      return
    }

    const d = result.data as Record<string, unknown>
    setDraftResult(d as Record<string, unknown>)
    setSuccess(
      (d.message as string) ??
        '草稿已创建！请前往微信公众号后台"草稿箱"审核后手动发布。',
    )
  }

  // ─── 渲染 ──────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* 标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">公众号草稿发布后台</h1>
          <p className="mt-1 text-sm text-gray-500">
            只创建草稿，不自动发布。请在微信公众号后台手动审核并发布。
          </p>
        </div>

        {/* ── Token 区 ─────────────────────────────────────── */}
        <Section title="① 管理员验证">
          {!tokenLocked ? (
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="输入 ADMIN_TOKEN"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLockToken()}
                className={inputCls}
              />
              <button onClick={handleLockToken} className={btnPrimary}>
                确认
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-green-600 font-medium">✓ Token 已验证</span>
              <button
                onClick={() => {
                  setTokenLocked(false)
                  setAdminToken('')
                  clearMessages()
                }}
                className="text-sm text-gray-400 underline"
              >
                重新输入
              </button>
            </div>
          )}
        </Section>

        {/* ── 文章信息区 ────────────────────────────────────── */}
        <Section title="② 文章内容">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>文章标题</label>
              <input
                type="text"
                placeholder="最多 32 个字符（微信公众号限制）"
                value={title}
                maxLength={32}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
                disabled={!tokenLocked}
              />
              <p className="mt-1 text-xs text-gray-400 text-right">{title.length} / 32</p>
            </div>
            <div>
              <label className={labelCls}>Markdown 正文</label>
              <textarea
                placeholder="在此粘贴 Markdown 内容..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                rows={14}
                className={`${inputCls} font-mono text-sm resize-y`}
                disabled={!tokenLocked}
              />
            </div>
          </div>
        </Section>

        {/* ── 封面图区 ──────────────────────────────────────── */}
        <Section title="③ 封面图">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>AI 生成封面图提示词</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="例：极简中式风格装修，温暖灯光，宽幅横图"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className={inputCls}
                  disabled={!tokenLocked}
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={!tokenLocked || loading === 'image'}
                  className={btnSecondary}
                >
                  {loading === 'image' ? '生成中…' : '生成封面图'}
                </button>
              </div>
            </div>

            {generatedImage && (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedImage.src}
                  alt="生成的封面图"
                  className="w-full object-cover max-h-64"
                />
                {generatedImage.notice && (
                  <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2">
                    {generatedImage.notice}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className={labelCls}>封面图 URL（手动填写或生成后自动填入）</label>
              <input
                type="url"
                placeholder="https://example.com/cover.jpg"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className={inputCls}
                disabled={!tokenLocked}
              />
              <p className="mt-1 text-xs text-gray-400">
                微信公众号封面图需要是可公开访问的 HTTPS 图片 URL。
              </p>
            </div>
          </div>
        </Section>

        {/* ── 操作按钮区 ────────────────────────────────────── */}
        <Section title="④ 操作">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePreview}
              disabled={!tokenLocked || loading === 'preview'}
              className={btnSecondary}
            >
              {loading === 'preview' ? '排版中…' : '预览公众号排版'}
            </button>
            <button
              onClick={handleCreateDraft}
              disabled={!tokenLocked || loading === 'draft'}
              className={btnPrimary}
            >
              {loading === 'draft' ? '创建中…' : '创建公众号草稿'}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            ⚠️ 创建草稿后不会自动发布。请登录微信公众号后台，在「草稿箱」中审核并手动发布。
          </p>
        </Section>

        {/* ── 消息提示 ──────────────────────────────────────── */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 whitespace-pre-wrap">
            ✕ {error}
          </div>
        )}
        {success && !error && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
            ✓ {success}
          </div>
        )}

        {/* ── 草稿创建结果 ──────────────────────────────────── */}
        {draftResult && (
          <Section title="草稿创建结果">
            <pre className="bg-gray-100 rounded p-4 text-xs overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(draftResult, null, 2)}
            </pre>
          </Section>
        )}

        {/* ── 公众号排版预览 ────────────────────────────────── */}
        {previewHtml && (
          <Section title="公众号排版预览">
            <div
              ref={previewRef}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              {/* 用 iframe srcdoc 隔离样式，防止污染页面 */}
              <iframe
                srcDoc={previewHtml}
                title="公众号排版预览"
                className="w-full"
                style={{ height: '600px', border: 'none' }}
                sandbox="allow-same-origin"
              />
            </div>
            <button
              onClick={() => setPreviewHtml(null)}
              className="mt-2 text-sm text-gray-400 underline"
            >
              关闭预览
            </button>
          </Section>
        )}
      </div>
    </main>
  )
}

// ─── 小组件 ────────────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  )
}

// ─── 样式常量 ──────────────────────────────────────────────────
const inputCls =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition'

const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

const btnPrimary =
  'rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap'

const btnSecondary =
  'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap'
