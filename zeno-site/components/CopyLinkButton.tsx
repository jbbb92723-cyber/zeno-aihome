'use client'

export default function CopyLinkButton() {
  return (
    <button
      type="button"
      className="text-xs text-ink-muted border border-border px-3 py-1.5 hover:border-stone hover:text-stone transition-colors"
      onClick={() => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href)
        }
      }}
    >
      复制链接
    </button>
  )
}
