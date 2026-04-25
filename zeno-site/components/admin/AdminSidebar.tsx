'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { group: '概览', items: [
    { href: '/admin/dashboard', label: '数据看板' },
  ]},
  { group: '用户运营', items: [
    { href: '/admin/users',   label: '用户管理' },
    { href: '/admin/members', label: '会员管理' },
    { href: '/admin/orders',  label: '订单管理' },
  ]},
  { group: '内容与服务', items: [
    { href: '/admin/services',          label: '服务申请' },
    { href: '/admin/resources/claims',  label: '资料领取' },
  ]},
  { group: '营销工具', items: [
    { href: '/admin/redeem-codes', label: '兑换码' },
    { href: '/admin/coupons',      label: '优惠券' },
  ]},
  { group: '分析', items: [
    { href: '/admin/events', label: '行为事件' },
  ]},
]

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-52 shrink-0 border-r border-[#3A3530] bg-[#1C1A17] min-h-screen flex flex-col">
      {/* logo */}
      <div className="px-5 py-4 border-b border-[#3A3530]">
        <Link href="/admin/dashboard" className="text-sm font-semibold text-[#E8E2DA] tracking-tight">
          Zeno 后台
        </Link>
        <p className="text-[0.65rem] text-[#706860] mt-0.5">Admin Panel</p>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV.map(group => (
          <div key={group.group}>
            <p className="text-[0.6rem] text-[#706860] uppercase tracking-widest font-semibold px-2 mb-1.5">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-sm rounded-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#C4A882]/15 text-[#C4A882]'
                        : 'text-[#A09890] hover:text-[#E8E2DA] hover:bg-[#252320]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* footer links */}
      <div className="px-5 py-4 border-t border-[#3A3530] space-y-1.5">
        <Link href="/" className="block text-xs text-[#706860] hover:text-[#A09890] transition-colors">
          ← 返回前台
        </Link>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-xs text-[#706860] hover:text-[#A09890] transition-colors">
            退出登录
          </button>
        </form>
      </div>
    </aside>
  )
}
