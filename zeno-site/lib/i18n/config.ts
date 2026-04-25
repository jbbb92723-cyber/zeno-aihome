/**
 * lib/i18n/config.ts
 *
 * i18n 核心配置
 */

export const defaultLocale = 'zh' as const
export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]

/** 从路径判断 locale */
export function getLocaleFromPath(pathname: string): Locale {
  return pathname.startsWith('/en') ? 'en' : 'zh'
}

/** 根据 locale 返回文章列表的基础路径 */
export function getBlogBasePath(locale: Locale): string {
  return locale === 'en' ? '/en/blog' : '/blog'
}

/** 根据 locale 返回首页路径 */
export function getHomePath(locale: Locale): string {
  return locale === 'en' ? '/en' : '/'
}
