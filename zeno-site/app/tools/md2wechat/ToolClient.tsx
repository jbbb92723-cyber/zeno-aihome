'use client'

import { useState } from 'react'

// ─── 主题选项 ───────────────────────────────────────────────────
const THEMES = [
  { value: 'default',        label: '默认' },
  { value: 'bytedance',      label: '字节范' },
  { value: 'apple',          label: '苹果范' },
  { value: 'wechat-native',  label: '微信原生' },
  { value: 'github-readme',  label: 'GitHub' },
  { value: 'elegant-gold',   label: '精致·古铜金' },
  { value: 'minimal-gray',   label: '简约·石墨灰' },
  { value: 'bold-navy',      label: '醒目·深海蓝' },
]

const FONT_SIZES = [
  { value: 'small',  label: '小 (14px)' },
  { value: 'medium', label: '中 (15px)' },
  { value: 'large',  label: '大 (16px)' },
]

interface Props {
  isAdmin: boolean
  isApiConfigured: boolean
  isImageConfigured: boolean
  imageModel: string
  imagePrice: string
}

export default function Md2WechatToolClient({
  isAdmin,
  isApiConfigured,
  isImageConfigured,
  imageModel,
  imagePrice,
}: Props) {
  // ─── 输入状态 ─────────────────────────────────────────────────
  const [title, setTitle]           = useState('')
  const [markdown, setMarkdown]     = useState('')
  const [theme, setTheme]           = useState('default')
  const [fontSize, setFontSize]     = useState('medium')

  // ─── 结果状态 ─────────────────────────────────────────────────
  const [html, setHtml]             = useState('')
  const [wordCount, setWordCount]   = useState(0)

  // ─── 加载状态 ─────────────────────────────────────────────────
  const [converting, setConverting] = useState(false)
  const [genImage, setGenImage]     = useState(false)
  const [pushDraft, setPushDraft]   = useState(false)

  // ─── 消息状态 ─────────────────────────────────────────────────
  const [convertMsg, setConvertMsg] = useState('')
  const [imageMsg, setImageMsg]     = useState('')
  const [draftMsg, setDraftMsg]     = useState('')

  // ─── 生成的图片 ───────────────────────────────────────────────
  const [imageUrl, setImageUrl]     = useState('')

  // ─── 转换 Markdown ────────────────────────────────────────────
  async function handleConvert() {
    if (!markdown.trim()) {
      setConvertMsg('请先输入 Markdown 内容。')
      return
    }
    setConverting(true)
    setConvertMsg('')
    setHtml('')

    try {
      const res = await fetch('/api/md2wechat/convert', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ markdown, theme, fontSize }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setConvertMsg(data.error ?? '转换失败，请重试。')
      } else {
        setHtml(data.html ?? '')
        setWordCount(data.wordCount ?? 0)
        setConvertMsg('')
      }
    } catch {
      setConvertMsg('网络错误，请检查连接后重试。')
    } finally {
      setConverting(false)
    }
  }

  // ─── 复制 HTML ────────────────────────────────────────────────
  async function handleCopyHtml() {
    if (!html) return
    try {
      await navigator.clipboard.writeText(html)
      setConvertMsg('已复制 HTML，可粘贴到微信公众号后台。')
    } catch {
      setConvertMsg('复制失败，请手动全选复制。')
    }
  }

  // ─── 复制纯文本 ───────────────────────────────────────────────
  async function handleCopyText() {
    if (!markdown) return
    try {
      await navigator.clipboard.writeText(markdown)
      setConvertMsg('已复制原始 Markdown 文本。')
    } catch {
      setConvertMsg('复制失败，请手动全选复制。')
    }
  }

  // ─── 生成配图（管理员）────────────────────────────────────────
  async function handleGenerateImage(usage: 'cover' | 'inline' = 'cover') {
    if (!markdown.trim()) {
      setImageMsg('请先输入文章内容，再生成配图。')
      return
    }
    setGenImage(true)
    setImageMsg('')
    if (usage === 'cover') setImageUrl('')

    const prompt = usage === 'cover'
      ? `为微信公众号文章生成封面图。标题：${title || '(无标题)'}。文章风格：极简克制，个人写作站。`
      : `为微信公众号文章生成文中配图。内容摘要：${markdown.slice(0, 200)}`

    try {
      const res = await fetch('/api/images/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ prompt, usage }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setImageMsg(data.error ?? '图片生成失败。')
      } else {
        setImageUrl(data.imageUrl ?? '')
        setImageMsg(`生成成功，预计费用约 ¥${data.estimatedCost ?? imagePrice}。`)
      }
    } catch {
      setImageMsg('网络错误，请重试。')
    } finally {
      setGenImage(false)
    }
  }

  // ─── 推送草稿（管理员）────────────────────────────────────────
  async function handlePushDraft() {
    if (!markdown.trim()) {
      setDraftMsg('请先输入文章内容。')
      return
    }
    if (!title.trim()) {
      setDraftMsg('请先填写文章标题再推送草稿。')
      return
    }
    setPushDraft(true)
    setDraftMsg('')

    try {
      const res = await fetch('/api/wechat/draft', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          title: title.trim(),
          markdown,
          theme,
          fontSize,
          coverImageUrl: imageUrl || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setDraftMsg(data.error ?? '草稿推送失败。')
      } else {
        setDraftMsg(`草稿已创建！草稿 ID：${data.draftId}。请前往微信公众号后台审核发布。`)
      }
    } catch {
      setDraftMsg('网络错误，请重试。')
    } finally {
      setPushDraft(false)
    }
  }

  // ─── 渲染 ─────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* 输入区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 左：编辑 */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* 主题 */}
            <div>
              <label className="text-[0.65rem] text-ink-faint uppercase tracking-widest font-semibold block mb-1.5">
                主题
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="text-sm border border-border bg-surface text-ink px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-stone/30"
              >
                {THEMES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* 字号 */}
            <div>
              <label className="text-[0.65rem] text-ink-faint uppercase tracking-widest font-semibold block mb-1.5">
                字号
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="text-sm border border-border bg-surface text-ink px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-stone/30"
              >
                {FONT_SIZES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label className="text-[0.65rem] text-ink-faint uppercase tracking-widest font-semibold block mb-1.5">
              文章标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="填写标题（左侧可空，推送草稿时必填）"
              className="w-full border border-border bg-surface text-sm text-ink px-4 py-2 focus:outline-none focus:ring-1 focus:ring-stone/30 placeholder:text-ink-faint"
            />
          </div>

          {/* Markdown 输入 */}
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="在此输入 Markdown 内容…"
            rows={16}
            className="w-full border border-border bg-surface text-sm text-ink font-mono leading-relaxed px-4 py-3 resize-y focus:outline-none focus:ring-1 focus:ring-stone/30 placeholder:text-ink-faint"
          />

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={handleConvert}
              disabled={converting || !isApiConfigured}
              className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {converting ? '转换中…' : '转换'}
            </button>

            {html && (
              <>
                <button
                  onClick={handleCopyHtml}
                  className="text-sm text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
                >
                  复制 HTML
                </button>
                <button
                  onClick={handleCopyText}
                  className="text-sm text-ink-muted underline underline-offset-4"
                >
                  复制原文
                </button>
              </>
            )}

            {!isApiConfigured && (
              <span className="text-xs text-amber-600">排版服务暂未开放</span>
            )}
          </div>

          {/* 转换提示 */}
          {convertMsg && (
            <p className="text-xs text-ink-muted leading-relaxed">{convertMsg}</p>
          )}
          {wordCount > 0 && (
            <p className="text-xs text-ink-faint">字数：{wordCount}</p>
          )}
        </div>

        {/* 右：预览 */}
        <div>
          <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest font-semibold mb-2">
            预览
          </p>
          {html ? (
            <div
              className="border border-border bg-white p-4 overflow-auto max-h-[520px] text-sm"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <div className="border border-border bg-surface p-4 h-48 flex items-center justify-center">
              <p className="text-sm text-ink-faint">转换后在此处预览微信排版效果</p>
            </div>
          )}
        </div>
      </div>

      {/* 管理员操作按钮区（不再重复管理员整体说明，由 page.tsx 提供） */}
      {isAdmin && (
        <div className="border-t border-border pt-8">
          <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest font-semibold mb-6">
            管理员操作
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* AI 配图 */}
            <div className="border border-border bg-surface p-5 space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">AI 配图</p>
                <span className="text-[0.65rem] text-ink-faint border border-border px-1.5 py-0.5">仅管理员</span>
              </div>
              <p className="text-xs text-ink-faint font-mono">{imageModel}</p>
              <p className="text-xs text-ink-muted leading-relaxed">
                预估成本 ¥{imagePrice} / 张，实际费用以火山控制台为准。
              </p>
              {!isImageConfigured && (
                <p className="text-xs text-amber-600">图片生成服务暂未开放</p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleGenerateImage('cover')}
                  disabled={genImage || !isImageConfigured}
                  className="text-sm text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {genImage ? '生成中…' : '生成封面图'}
                </button>
                <button
                  onClick={() => handleGenerateImage('inline')}
                  disabled={genImage || !isImageConfigured}
                  className="text-sm text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {genImage ? '生成中…' : '生成文中配图'}
                </button>
              </div>
              {imageMsg && <p className="text-xs text-ink-muted">{imageMsg}</p>}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="配图预览"
                  className="w-full max-w-xs border border-border"
                />
              )}
            </div>

            {/* 推送草稿 */}
            <div className="border border-border bg-surface p-5 space-y-3">
              <p className="text-sm font-medium text-ink">推送到公众号草稿箱</p>
              <p className="text-xs text-ink-muted leading-relaxed">
                将文章创建为草稿，需要到微信公众号后台审核后手动发布。
                不会自动群发。
              </p>
              <button
                onClick={handlePushDraft}
                disabled={pushDraft || !html}
                className="text-sm text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {pushDraft ? '推送中…' : '推送草稿'}
              </button>
              {!html && (
                <p className="text-xs text-ink-faint">请先完成转换再推送草稿。</p>
              )}
              {draftMsg && <p className="text-xs text-ink-muted">{draftMsg}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
