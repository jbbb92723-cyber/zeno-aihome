'use client'

import { useState } from 'react'

// ─── 常量 ──────────────────────────────────────────────────────

const THEMES = [
  { value: 'default',       label: '默认' },
  { value: 'bytedance',     label: '字节范' },
  { value: 'apple',         label: '苹果范' },
  { value: 'elegant-gold',  label: '精致·古铜金' },
  { value: 'minimal-gray',  label: '简约·石墨灰' },
  { value: 'bold-navy',     label: '醒目·深海蓝' },
]

const FONT_SIZES = [
  { value: 'small',  label: '小 (14px)' },
  { value: 'medium', label: '中 (15px)' },
  { value: 'large',  label: '大 (16px)' },
]

// ─── Props ─────────────────────────────────────────────────────

interface Props {
  isAdmin: boolean
  isApiConfigured: boolean
  isImageConfigured: boolean
  imagePrice: string
}

// ─── 复用样式片段 ──────────────────────────────────────────────

const INPUT_CLS = 'w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors'
const SELECT_CLS = 'text-sm text-ink bg-surface border border-border px-3 py-2 focus:outline-none focus:border-stone transition-colors'
const LABEL_CLS = 'block text-xs text-ink-faint uppercase tracking-widest font-semibold mb-1.5'
const BTN_PRIMARY = 'text-sm text-stone border border-stone/40 px-5 py-2 hover:bg-stone-pale transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
const BTN_SECONDARY = 'text-sm text-ink-muted border border-border px-4 py-2 hover:border-stone hover:text-stone transition-colors disabled:opacity-40 disabled:cursor-not-allowed'

// ─── 辅助 UI ───────────────────────────────────────────────────

function StatusMsg({ msg, type }: { msg: string; type: 'error' | 'success' | 'info' }) {
  if (!msg) return null
  const cls = type === 'error'
    ? 'text-red-500'
    : type === 'success'
    ? 'text-emerald-600'
    : 'text-ink-muted'
  return <p className={`text-xs mt-2 ${cls}`}>{msg}</p>
}

function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest font-semibold mb-4">
      {children}
    </p>
  )
}

// ─── 主组件 ────────────────────────────────────────────────────

export default function PublishClient({
  isAdmin,
  isApiConfigured,
  isImageConfigured,
  imagePrice,
}: Props) {
  // ── 表单状态 ─────────────────────────────────────────────────
  const [title, setTitle]             = useState('')
  const [markdown, setMarkdown]       = useState('')
  const [theme, setTheme]             = useState('default')
  const [fontSize, setFontSize]       = useState('medium')
  const [coverImageUrl, setCover]     = useState('')
  const [articlePath, setArticlePath] = useState('')

  // ── 结果状态 ─────────────────────────────────────────────────
  const [html, setHtml]               = useState('')
  const [wordCount, setWordCount]     = useState(0)
  const [imageUrl, setImageUrl]       = useState('')
  const [imagePrompt, setImagePrompt] = useState('')

  // ── 加载状态 ─────────────────────────────────────────────────
  const [converting, setConverting]   = useState(false)
  const [genImage, setGenImage]       = useState(false)
  const [pushDraft, setPushDraft]     = useState(false)

  // ── 消息状态 ─────────────────────────────────────────────────
  const [convertMsg, setConvertMsg]   = useState<{text: string; type: 'error'|'success'|'info'}>({ text: '', type: 'info' })
  const [imageMsg, setImageMsg]       = useState<{text: string; type: 'error'|'success'|'info'}>({ text: '', type: 'info' })
  const [draftMsg, setDraftMsg]       = useState<{text: string; type: 'error'|'success'|'info'}>({ text: '', type: 'info' })

  // ── 转换 Markdown ─────────────────────────────────────────────
  async function handleConvert() {
    if (!markdown.trim()) {
      setConvertMsg({ text: '请先输入 Markdown 内容。', type: 'error' })
      return
    }
    setConverting(true)
    setConvertMsg({ text: '', type: 'info' })
    setHtml('')

    try {
      const res = await fetch('/api/md2wechat/convert', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ markdown, theme, fontSize }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setConvertMsg({ text: data.error ?? '转换失败，请重试。', type: 'error' })
      } else {
        setHtml(data.html ?? '')
        setWordCount(data.wordCount ?? 0)
        setConvertMsg({ text: `转换成功，共 ${data.wordCount ?? 0} 字`, type: 'success' })
      }
    } catch {
      setConvertMsg({ text: '网络错误，请重试。', type: 'error' })
    } finally {
      setConverting(false)
    }
  }

  // ── 生成配图（管理员）────────────────────────────────────────
  async function handleGenImage() {
    const prompt = imagePrompt.trim() || `为微信文章生成封面图。标题：${title || '(无标题)'}，风格：极简克制，个人写作站。`
    setGenImage(true)
    setImageMsg({ text: '', type: 'info' })

    try {
      const res = await fetch('/api/images/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ prompt, usage: 'cover' }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setImageMsg({ text: data.error ?? '图片生成失败。', type: 'error' })
      } else {
        const url = data.imageUrl ?? ''
        setImageUrl(url)
        setCover(url)
        setImageMsg({ text: `生成成功，预计费用约 ¥${data.estimatedCost ?? imagePrice}。已自动填入封面图地址。`, type: 'success' })
      }
    } catch {
      setImageMsg({ text: '网络错误，请重试。', type: 'error' })
    } finally {
      setGenImage(false)
    }
  }

  // ── 推送草稿（管理员，含回流链接）───────────────────────────
  async function handlePushDraft() {
    if (!markdown.trim()) {
      setDraftMsg({ text: '请先输入文章内容。', type: 'error' })
      return
    }
    if (!title.trim()) {
      setDraftMsg({ text: '请先填写文章标题再推送草稿。', type: 'error' })
      return
    }
    setPushDraft(true)
    setDraftMsg({ text: '', type: 'info' })

    try {
      const res = await fetch('/api/publish/wechat-draft', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          title:         title.trim(),
          markdown,
          theme,
          fontSize,
          coverImageUrl: coverImageUrl || undefined,
          articlePath:   articlePath || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setDraftMsg({ text: data.error ?? '草稿推送失败。', type: 'error' })
      } else {
        setDraftMsg({
          text: data.message ?? '草稿已创建！请前往微信公众号后台审核发布。',
          type: 'success',
        })
      }
    } catch {
      setDraftMsg({ text: '网络错误，请重试。', type: 'error' })
    } finally {
      setPushDraft(false)
    }
  }

  // ── 渲染 ──────────────────────────────────────────────────────
  return (
    <div className="space-y-10">

      {/* ── Step 1: 文章信息 ──────────────────────────────────── */}
      <section>
        <StepLabel>1 · 文章信息</StepLabel>

        <div className="space-y-4">
          {/* 标题 */}
          <div>
            <label className={LABEL_CLS}>文章标题</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="填写公众号文章标题"
              className={INPUT_CLS}
            />
          </div>

          {/* 排版主题 + 字号 */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className={LABEL_CLS}>排版主题</label>
              <select value={theme} onChange={e => setTheme(e.target.value)} className={SELECT_CLS}>
                {THEMES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>字号</label>
              <select value={fontSize} onChange={e => setFontSize(e.target.value)} className={SELECT_CLS}>
                {FONT_SIZES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── Step 2: Markdown 内容 ─────────────────────────────── */}
      <section>
        <StepLabel>2 · Markdown 内容</StepLabel>

        <div className="flex items-center gap-3 mb-3">
          <a
            href="https://www.md2wechat.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-stone transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
            打开 md2wechat.cn 可视化编辑器
          </a>
        </div>

        <textarea
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          placeholder={'在这里粘贴 Markdown 内容…\n\n# 标题\n\n正文段落。'}
          rows={16}
          className={`${INPUT_CLS} font-mono text-xs resize-y`}
          spellCheck={false}
        />

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleConvert}
            disabled={converting || !isApiConfigured}
            className={BTN_PRIMARY}
          >
            {converting ? '转换中…' : '站内排版转换'}
          </button>
          {!isApiConfigured && (
            <span className="text-xs text-ink-muted">（MD2WECHAT_API_KEY 未配置）</span>
          )}
        </div>
        <StatusMsg msg={convertMsg.text} type={convertMsg.type} />
      </section>

      {/* ── Step 3: 排版预览 ──────────────────────────────────── */}
      {html && (
        <section>
          <StepLabel>3 · 排版预览 · 共 {wordCount} 字</StepLabel>
          <div
            className="border border-border bg-white overflow-auto max-h-[600px] p-4 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </section>
      )}

      {/* ── Step 4: AI 配图（管理员）─────────────────────────── */}
      {isAdmin && (
        <section>
          <StepLabel>
            4 · AI 配图
            <span className="ml-2 text-[0.6rem] border border-border px-1.5 py-0.5 normal-case tracking-normal font-normal">管理员</span>
          </StepLabel>

          {!isImageConfigured ? (
            <p className="text-xs text-ink-muted">
              VOLCENGINE_ARK_API_KEY 或 VOLCENGINE_IMAGE_MODEL 未配置，图片生成功能不可用。
            </p>
          ) : (
            <div className="space-y-3">
              <div>
                <label className={LABEL_CLS}>Prompt（留空则自动生成）</label>
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  placeholder={`为文章《${title || '(无标题)'}》生成封面图，极简克制风格`}
                  className={INPUT_CLS}
                />
              </div>

              <button
                onClick={handleGenImage}
                disabled={genImage}
                className={BTN_SECONDARY}
              >
                {genImage ? '生成中…' : '生成封面图'}
              </button>

              <StatusMsg msg={imageMsg.text} type={imageMsg.type} />

              {imageUrl && (
                <div className="mt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="生成的封面图" className="max-w-sm w-full border border-border" />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Step 5: 封面图 URL ────────────────────────────────── */}
      {isAdmin && (
        <section>
          <StepLabel>
            5 · 封面图 URL
            <span className="ml-2 text-[0.6rem] border border-border px-1.5 py-0.5 normal-case tracking-normal font-normal">管理员</span>
          </StepLabel>
          <p className="text-xs text-ink-muted mb-3">
            AI 生成的封面图已自动填入。也可手动填写公开可访问的 HTTPS 图片地址。
          </p>
          <input
            type="url"
            value={coverImageUrl}
            onChange={e => setCover(e.target.value)}
            placeholder="https://example.com/cover.jpg"
            className={INPUT_CLS}
          />
        </section>
      )}

      {/* ── Step 6: 网站文章路径（回流链接）───────────────────── */}
      {isAdmin && (
        <section>
          <StepLabel>
            6 · 回流链接路径（可选）
            <span className="ml-2 text-[0.6rem] border border-border px-1.5 py-0.5 normal-case tracking-normal font-normal">管理员</span>
          </StepLabel>
          <p className="text-xs text-ink-muted mb-3">
            填写后，草稿末尾会追加指向该路径的回流链接，驱动公众号读者回到网站。
            留空则链接指向网站首页。
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted shrink-0">zenoaihome.com</span>
            <input
              type="text"
              value={articlePath}
              onChange={e => setArticlePath(e.target.value)}
              placeholder="/blog/your-article-slug"
              className={`${INPUT_CLS} flex-1`}
            />
          </div>
          {articlePath && (
            <p className="text-xs text-ink-muted mt-1.5">
              回流 URL：
              <span className="text-stone ml-1">
                https://zenoaihome.com{articlePath}?utm_source=wechat&utm_medium=article
              </span>
            </p>
          )}
        </section>
      )}

      {/* ── Step 7: 推送草稿（管理员）───────────────────────── */}
      {isAdmin && (
        <section className="border-t border-border pt-8">
          <StepLabel>
            7 · 推送到公众号草稿箱
            <span className="ml-2 text-[0.6rem] border border-border px-1.5 py-0.5 normal-case tracking-normal font-normal">管理员</span>
          </StepLabel>
          <p className="text-xs text-ink-muted mb-4 leading-relaxed">
            草稿创建后，请前往微信公众号后台「草稿箱」手动审核并发布。末尾将自动注入网站回流链接。
          </p>

          <button
            onClick={handlePushDraft}
            disabled={pushDraft || !markdown.trim() || !title.trim()}
            className={BTN_PRIMARY}
          >
            {pushDraft ? '推送中…' : '同步到公众号草稿箱'}
          </button>

          <StatusMsg msg={draftMsg.text} type={draftMsg.type} />
        </section>
      )}

    </div>
  )
}
