import Container from '@/components/Container'

interface PageHeroProps {
  /** 页面小标签，例如「关于我」「文章」 */
  label: string
  /** H1 大标题 */
  title: string
  /** 副标题说明 */
  subtitle: string
  /** 可选补充文案 */
  note?: string
  /** 容器宽度，默认 content (max-w-4xl) */
  size?: 'layout' | 'wide' | 'content' | 'reading'
}

export default function PageHero({
  label,
  title,
  subtitle,
  note,
  size = 'content',
}: PageHeroProps) {
  return (
    <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
      <Container size={size}>
        <p className="page-label mb-4">{label}</p>
        <h1 className="page-title mb-5">{title}</h1>
        <p className="text-base sm:text-lg text-ink-muted leading-[1.7] max-w-2xl">
          {subtitle}
        </p>
        {note && (
          <p className="mt-4 text-sm text-ink-faint leading-relaxed max-w-xl">{note}</p>
        )}
      </Container>
    </div>
  )
}
