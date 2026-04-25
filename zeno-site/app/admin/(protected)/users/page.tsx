import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata: Metadata = { title: '用户管理 · Admin' }

const PAGE_SIZE = 30

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const params = await searchParams
  const q = params.q ?? ''
  const page = Math.max(1, Number(params.page ?? 1))
  const skip = (page - 1) * PAGE_SIZE

  const where = q
    ? { OR: [
        { email: { contains: q, mode: 'insensitive' as const } },
        { name:  { contains: q, mode: 'insensitive' as const } },
      ]}
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      include: {
        membership: { select: { plan: true, status: true, expiresAt: true } },
        _count: { select: { orders: true, resourceClaims: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
          <h1 className="text-xl font-semibold text-[#E8E2DA]">用户管理</h1>
        </div>
        <span className="text-sm text-[#706860]">共 {total} 人</span>
      </div>

      {/* 搜索 */}
      <form method="GET" className="mb-5 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="搜索邮箱或昵称…"
          className="flex-1 bg-[#252320] border border-[#3A3530] text-[#E8E2DA] placeholder-[#706860] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]"
        />
        <button type="submit" className="px-4 py-2 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30 hover:bg-[#C4A882]/20 transition-colors">
          搜索
        </button>
        {q && (
          <Link href="/admin/users" className="px-4 py-2 text-sm text-[#706860] border border-[#3A3530] hover:text-[#E8E2DA] transition-colors">
            清除
          </Link>
        )}
      </form>

      {/* 表格 */}
      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['邮箱', '昵称', '会员', '注册时间', '订单数', '资料领取'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3530]">
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#706860] text-sm">无结果</td>
              </tr>
            )}
            {users.map(u => {
              const m = u.membership
              const memberLabel = !m || m.plan === 'free'
                ? '免费'
                : m.status === 'active' ? '创作会员' : '已过期'
              const memberColor = memberLabel === '创作会员' ? 'text-[#C4A882]' : 'text-[#706860]'

              return (
                <tr key={u.id} className="hover:bg-[#2A2825] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#E8E2DA] max-w-[200px] truncate">{u.email}</td>
                  <td className="px-4 py-3 text-[#E8E2DA]">{u.name ?? '—'}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${memberColor}`}>{memberLabel}</td>
                  <td className="px-4 py-3 text-xs text-[#706860] whitespace-nowrap">
                    {u.createdAt.toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-center text-[#A09890]">{u._count.orders}</td>
                  <td className="px-4 py-3 text-center text-[#A09890]">{u._count.resourceClaims}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 items-center">
          {page > 1 && (
            <Link href={`/admin/users?q=${q}&page=${page - 1}`} className="text-xs text-[#A09890] border border-[#3A3530] px-3 py-1.5 hover:text-[#E8E2DA] transition-colors">← 上一页</Link>
          )}
          <span className="text-xs text-[#706860]">{page} / {totalPages}</span>
          {page < totalPages && (
            <Link href={`/admin/users?q=${q}&page=${page + 1}`} className="text-xs text-[#A09890] border border-[#3A3530] px-3 py-1.5 hover:text-[#E8E2DA] transition-colors">下一页 →</Link>
          )}
        </div>
      )}
    </div>
  )
}
