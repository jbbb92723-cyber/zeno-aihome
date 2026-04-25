'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const cnNavLinks = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我' },
  { href: '/blog', label: '文章' },
  { href: '/topics', label: '专题' },
  { href: '/resources', label: '资料库' },
  { href: '/services', label: '服务' },
  { href: '/tools/md2wechat', label: '排版工具' },
  { href: '/tools/publish', label: '创作工作台' },
  { href: '/contact', label: '联系' },
]

const enNavLinks = [
  { href: '/en', label: 'Home' },
  { href: '/en/about', label: 'About' },
  { href: '/en/tools', label: 'Tools' },
  { href: '/en/topics', label: 'Topics' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const pathname = usePathname()

  // 管理后台使用独立布局，隐藏全站 Footer
  if (pathname.startsWith('/admin')) return null

  const isEn = pathname.startsWith('/en')

  const navLinks = isEn ? enNavLinks : cnNavLinks

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-14">

        {/* 主体三列 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* 品牌 + 定位 */}
          <div className="sm:col-span-1">
            <Link href={isEn ? '/en' : '/'} className="text-ink font-semibold text-[0.9375rem] hover:text-stone transition-colors">
              {isEn ? 'Zeno' : 'Zeno 赞诺'}
            </Link>
            <p className="mt-3 text-[0.8125rem] text-ink-muted leading-relaxed max-w-[220px]">
              {isEn
                ? 'From renovation sites to real living, human judgment, and AI-enabled growth.'
                : '从装修出发，聊居住、美学、人性、成长与 AI 时代的长期主义。'}
            </p>
          </div>

          {/* 导航 */}
          <div>
            <p className="text-[0.65rem] text-ink-faint font-semibold uppercase tracking-widest mb-4">
              {isEn ? 'Navigate' : '导航'}
            </p>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.8125rem] text-ink-muted hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 联系方式 */}
          <div>
            <p className="text-[0.65rem] text-ink-faint font-semibold uppercase tracking-widest mb-4">
              {isEn ? 'Contact' : '联系方式'}
            </p>
            {isEn ? (
              <ul className="space-y-3">
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-[0.8125rem] text-ink">zenoaihome@qq.com</p>
                </li>
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">YouTube</p>
                  <p className="text-[0.8125rem] text-ink-muted">[To be added]</p>
                </li>
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">X (Twitter)</p>
                  <p className="text-[0.8125rem] text-ink-muted">[To be added]</p>
                </li>
              </ul>
            ) : (
              <ul className="space-y-3">
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">公众号</p>
                  <p className="text-[0.8125rem] text-ink">Zeno AI装修笔记</p>
                </li>
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">微信</p>
                  <p className="text-[0.8125rem] text-ink">zanxiansheng2025</p>
                </li>
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">邮箱</p>
                  <p className="text-[0.8125rem] text-ink">zenoaihome@qq.com</p>
                </li>
              </ul>
            )}
          </div>

        </div>

        {/* 版权栏 */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[0.75rem] text-ink-faint">
            © {year} {isEn ? 'Zeno' : 'Zeno 赞诺'} · zenoaihome.com
          </p>
          <p className="text-[0.75rem] text-ink-faint">
            {isEn
              ? 'Content updated regularly. Quality over quantity.'
              : '内容持续更新，欢迎关注公众号 Zeno AI装修笔记'}
          </p>
        </div>

      </div>
    </footer>
  )
}

