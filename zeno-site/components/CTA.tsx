import Link from 'next/link'

interface CTAProps {
  href: string
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  external?: boolean
}

export default function CTA({ href, label, variant = 'primary', external = false }: CTAProps) {
  const base = 'inline-flex items-center text-sm transition-all duration-150 rounded-sm'

  const variants = {
    primary:
      'bg-stone text-white px-5 py-2.5 hover:bg-stone/90 font-medium',
    secondary:
      'border border-stone text-stone px-5 py-2.5 hover:bg-stone-pale font-medium',
    ghost:
      'text-stone underline decoration-stone-light underline-offset-2 hover:decoration-stone px-0 py-0',
  }

  const className = `${base} ${variants[variant]}`

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

interface CTAGroupProps {
  items: CTAProps[]
  layout?: 'row' | 'col'
}

export function CTAGroup({ items, layout = 'row' }: CTAGroupProps) {
  return (
    <div className={`flex ${layout === 'col' ? 'flex-col items-start' : 'flex-wrap items-center'} gap-3`}>
      {items.map((item, i) => (
        <CTA key={i} {...item} />
      ))}
    </div>
  )
}
