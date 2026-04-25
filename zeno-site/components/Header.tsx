'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

const cnNavLinks = [
  { href: '/',          label: '首页' },
  { href: '/about',     label: '关于我' },
  { href: '/blog',      label: '文章' },
  { href: '/topics',    label: '专题' },
  { href: '/resources', label: '资料库' },
  { href: '/services',  label: '服务' },
  { href: '/tools/md2wechat', label: '排版工具' },
  { href: '/contact',   label: '联系' },
]

const enNavLinks = [
  { href: '/en',        label: 'Home' },
  { href: '/en/about',  label: 'About' },
  { href: '/en/tools',  label: 'Tools' },
  { href: '/en/topics', label: 'Topics' },
]

// 明确的路由映射（CN → EN，以及 EN → CN）
// 凡是没有对应页的，做兜底跳转
const CN_TO_EN: Record<string, string> = {
  '/':                 '/en',
  '/about':            '/en/about',
  '/blog':             '/en/articles',
  '/topics':           '/en/topics',
  '/resources':        '/en/tools',
  '/services':         '/en/about',
  '/contact':          '/en/about',
  '/tools/md2wechat':  '/en/tools',
  '/login':            '/en/login',
  '/register':         '/en/register',
}

const EN_TO_CN: Record<string, string> = {
  '/en':           '/',
  '/en/about':     '/about',
  '/en/articles':  '/blog',
  '/en/topics':    '/topics',
  '/en/tools':     '/resources',
  '/en/tools/prompts': '/tools/md2wechat',
  '/en/login':     '/login',
  '/en/register':  '/register',
}

function getLangHref(pathname: string, isEn: boolean): string {
  if (isEn) {
    // EN → CN
    if (EN_TO_CN[pathname]) return EN_TO_CN[pathname]
    // 对于动态路由（如 /en/articles/slug），兜底到 /blog
    if (pathname.startsWith('/en/articles/')) return '/blog'
    // 去掉 /en 前缀，若有对应中文页则跳转
    const cnPath = pathname.replace(/^\/en/, '') || '/'
    // 如果是已知中文路由，直接跳
    const knownCnPaths = ['/', '/about', '/blog', '/topics', '/resources', '/services', '/contact', '/tools/md2wechat']
    if (knownCnPaths.includes(cnPath)) return cnPath
    // 否则兜底到首页
    return '/'
  } else {
    // CN → EN
    if (CN_TO_EN[pathname]) return CN_TO_EN[pathname]
    // 对于动态路由（如 /blog/slug），兜底到 /en/articles
    if (pathname.startsWith('/blog/')) return '/en/articles'
    // 其他未知路由兜底到 /en
    return '/en'
  }
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // 管理后台使用独立布局，隐藏全站导航
  if (pathname.startsWith('/admin')) return null

  const isEn = pathname.startsWith('/en')

  const navLinks = isEn ? enNavLinks : cnNavLinks
  const logoText = isEn ? 'Zeno' : 'Zeno 赞诺'
  const logoHref = isEn ? '/en' : '/'
  const loginLabel = isEn ? 'Log in' : '登录'
  const loginHref  = isEn ? '/en/login' : '/login'
  const langLabel = isEn ? '中文' : 'EN'
  const langHref = getLangHref(pathname, isEn)

  const isActive = (href: string) => {
    if (isEn) {
      return href === '/en' ? pathname === '/en' : pathname.startsWith(href)
    }
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-[3.5rem]">
          {/* Logo */}
          <Link
            href={logoHref}
            className="text-ink font-semibold text-[0.9375rem] tracking-tight hover:text-stone transition-colors"
          >
            {logoText}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.8125rem] transition-colors ${
                  isActive(link.href)
                    ? 'text-stone font-semibold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* 语言切换 */}
            <Link
              href={langHref}
              className="text-[0.75rem] text-ink-faint hover:text-ink-muted transition-colors"
            >
              {langLabel}
            </Link>

            {/* 主题切换 */}
            <ThemeToggle />

            {/* 登录入口 */}
            <Link
              href={loginHref}
              className={`text-[0.8125rem] transition-colors ${
                pathname === '/login' || pathname === '/en/login' || pathname.startsWith('/account')
                  ? 'text-stone font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {loginLabel}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-[18px] h-[1.5px] bg-ink transition-all duration-200 ${
                menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
              }`}
            />
            <span
              className={`block w-[18px] h-[1.5px] bg-ink transition-all duration-150 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-[18px] h-[1.5px] bg-ink transition-all duration-200 ${
                menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-canvas">
          <nav className="max-w-6xl mx-auto px-5 py-3 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 text-sm border-b border-border last:border-0 transition-colors ${
                  isActive(link.href) ? 'text-stone font-semibold' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* 语言切换 + 登录 */}
            <div className="flex items-center justify-between py-3">
              <Link
                href={loginHref}
                onClick={() => setMenuOpen(false)}
                className={`text-sm transition-colors ${
                  pathname === '/login' || pathname === '/en/login' || pathname.startsWith('/account')
                    ? 'text-stone font-semibold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {loginLabel}
              </Link>
              <Link
                href={langHref}
                className="text-[0.75rem] text-ink-faint hover:text-ink-muted transition-colors"
              >
                {langLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
