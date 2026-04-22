interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  size?: 'sm' | 'md' | 'lg'
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'left',
  size = 'md',
}: SectionTitleProps) {
  const titleSizes = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-semibold',
  }

  const alignClasses = align === 'center' ? 'text-center' : ''

  return (
    <div className={`mb-8 ${alignClasses}`}>
      <h2 className={`${titleSizes[size]} text-ink tracking-tight`}>{title}</h2>
      {subtitle && (
        <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-3 h-px bg-stone-pale ${align === 'center' ? 'mx-auto w-12' : 'w-10'}`}
        style={{ backgroundColor: '#8B7355', opacity: 0.35 }}
      />
    </div>
  )
}
