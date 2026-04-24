import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── 语义色（CSS 变量，自动响应暗色模式）───
        canvas:       'var(--color-canvas)',
        surface:      'var(--color-surface)',
        'surface-warm': 'var(--color-surface-warm)',
        ink:          'var(--color-ink)',
        'ink-muted':  'var(--color-ink-muted)',
        'ink-faint':  'var(--color-ink-faint)',
        stone:        'var(--color-stone)',
        'stone-light': '#C4A882',
        'stone-pale':  '#F0EAE2',
        'stone-deep':  '#6B5840',
        border:       'var(--color-border)',
        'border-subtle': '#F0EBE4',
        // ─── 专题色 ───
        topic1: '#8B7355',
        topic2: '#6B7A5E',
        topic3: '#5B6E8A',
        topic4: '#7A6B8A',
        topic5: '#8A6B5B',
      },
      fontFamily: {
        sans: ['var(--font-noto)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // 语义化字号别名
        label:  ['0.75rem',  { lineHeight: '1.4', letterSpacing: '0.06em' }], // 12px
        caption:['0.8125rem',{ lineHeight: '1.5' }],                           // 13px
        body:   ['1rem',     { lineHeight: '1.75' }],                          // 16px
        'body-lg':['1.0625rem',{ lineHeight: '1.85' }],                        // 17px
        prose:  ['1.125rem', { lineHeight: '1.9'  }],                          // 18px
      },
      spacing: {
        section:  '5rem',    // 80px  大区块上下
        'section-sm': '3rem',// 48px  小区块
        block:    '2rem',    // 32px  块内间距
      },
      maxWidth: {
        reading: '680px',   // 长文阅读
        content: '800px',   // 内页内容区
        wide:    '1000px',  // 宽页面
        layout:  '1152px',  // 全站 max（6xl ≈ 1152px）
      },
      borderRadius: {
        card: '12px',
        tag:  '4px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2A2723',
            lineHeight: '1.9',
            fontSize: '1.0625rem',
            '--tw-prose-body': '#2A2723',
            '--tw-prose-headings': '#2A2723',
            '--tw-prose-links': '#8B7355',
            '--tw-prose-bold': '#2A2723',
            '--tw-prose-quotes': '#6F6860',
            '--tw-prose-code': '#2A2723',
            '--tw-prose-hr': '#E8E1D8',
            p: { marginTop: '1.5em', marginBottom: '1.5em' },
            h2: { marginTop: '2.2em', marginBottom: '0.8em', fontWeight: '600', fontSize: '1.25rem' },
            h3: { marginTop: '1.8em', marginBottom: '0.6em', fontWeight: '600', fontSize: '1.0625rem' },
            a: {
              color: '#8B7355',
              textDecoration: 'underline',
              textDecorationColor: '#C4A882',
              '&:hover': { textDecorationColor: '#8B7355' },
            },
            'ul, ol': { marginTop: '1.2em', marginBottom: '1.2em' },
            li: { marginTop: '0.4em', marginBottom: '0.4em' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
