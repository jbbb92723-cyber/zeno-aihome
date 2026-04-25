import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: '资料领取 · Admin' }

export default async function ResourceClaimsPage() {
  const claims = await prisma.resourceClaim.findMany({
    orderBy: { claimedAt: 'desc' },
    take: 200,
    include: { user: { select: { email: true, name: true } } },
  })

  // 按资料 ID 汇总
  const countByResource = claims.reduce<Record<string, { title: string; count: number }>>(
    (acc, c) => {
      if (!acc[c.resourceId]) acc[c.resourceId] = { title: c.resourceTitle, count: 0 }
      acc[c.resourceId].count++
      return acc
    },
    {}
  )
  const topResources = Object.entries(countByResource)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
          <h1 className="text-xl font-semibold text-[#E8E2DA]">资料领取记录</h1>
        </div>
        <span className="text-sm text-[#706860]">共 {claims.length} 条</span>
      </div>

      {/* 热门资料 */}
      {topResources.length > 0 && (
        <div className="border border-[#3A3530] bg-[#252320] p-5 mb-6">
          <p className="text-xs text-[#706860] uppercase tracking-widest font-semibold mb-3">热门资料 TOP 5</p>
          <div className="space-y-2">
            {topResources.map(([id, data]) => (
              <div key={id} className="flex items-center justify-between">
                <p className="text-sm text-[#E8E2DA] truncate max-w-xs">{data.title}</p>
                <span className="text-sm font-semibold text-[#C4A882] shrink-0 ml-3">{data.count} 次</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 明细列表 */}
      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['用户', '资料名称', '领取时间'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3530]">
            {claims.map(c => (
              <tr key={c.id} className="hover:bg-[#2A2825] transition-colors">
                <td className="px-4 py-3">
                  <p className="text-[#E8E2DA] text-xs">{c.user.name ?? '—'}</p>
                  <p className="text-xs text-[#706860] mt-0.5 truncate max-w-[160px]">{c.user.email}</p>
                </td>
                <td className="px-4 py-3 text-[#E8E2DA] max-w-[200px] truncate">{c.resourceTitle}</td>
                <td className="px-4 py-3 text-xs text-[#706860] whitespace-nowrap">
                  {c.claimedAt.toLocaleString('zh-CN')}
                </td>
              </tr>
            ))}
            {claims.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-[#706860]">暂无记录</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
