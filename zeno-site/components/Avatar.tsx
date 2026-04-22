'use client'

import Image from 'next/image'
import { useState } from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: number
  className?: string
}

/**
 * 头像组件：有图显示图片，无图或加载失败显示字母占位符。
 * 使用 onError 确保无图时不出现破损图标。
 */
export default function Avatar({
  src,
  alt = '头像',
  fallback = 'Z',
  size = 40,
  className = '',
}: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const hasImage = src && src.length > 0 && !failed

  return (
    <div
      className={`relative overflow-hidden border border-border bg-stone-pale/40 flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {hasImage && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${size}px`}
          onError={() => setFailed(true)}
        />
      )}
      <span className="text-stone text-sm font-semibold select-none">{fallback}</span>
    </div>
  )
}
