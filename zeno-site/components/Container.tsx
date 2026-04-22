interface ContainerProps {
  children: React.ReactNode
  /** 'layout' = max-w-6xl (全站默认) | 'wide' = max-w-5xl | 'content' = max-w-4xl | 'reading' = max-w-3xl */
  size?: 'layout' | 'wide' | 'content' | 'reading'
  className?: string
}

const sizeMap = {
  layout:  'max-w-6xl',
  wide:    'max-w-5xl',
  content: 'max-w-4xl',
  reading: 'max-w-3xl',
}

export default function Container({
  children,
  size = 'layout',
  className = '',
}: ContainerProps) {
  return (
    <div className={`${sizeMap[size]} mx-auto px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}
