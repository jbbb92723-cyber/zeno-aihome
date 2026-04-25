import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: '数据看板 · Admin' }

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
function startOfMonth() {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function yuan(cents: number) {
  return `¥${(cents / 100).toFixed(2)}`
}

export default async function DashboardPage() {
  const today = startOfToday()
  const monthStart = startOfMonth()

  const [
    totalUsers,
    newUsersToday,
    activeMembers,
    resourceClaimsToday,
    serviceRequestsToday,
    ordersToday,
    ordersTodayRevenue,
    ordersMonth,
    ordersMonthRevenue,
    recentUsers,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.membership.count({ where: { status: 'active', plan: { not: 'free' } } }),
    prisma.resourceClaim.count({ where: { claimedAt: { gte: today } } }),
    prisma.serviceRequest.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({ _sum: { paidAmount: true }, where: { createdAt: { gte: today }, status: { in: ['paid', 'completed'] } } }),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.order.aggregate({ _sum: { paidAmount: true }, where: { createdAt: { gte: monthStart }, status: { in: ['paid', 'completed'] } } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, createdAt: true } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, orderNo: true, productName: true, paidAmount: true, status: true, createdAt: true } }),
  ])

  const stats = [
    { label: '总用户', value: totalUsers },
    { label: '今日新增', value: newUsersToday },
    { label: '活跃会员', value: activeMembers },
    { label: '今日资料领取', value: resourceClaimsToday },
    { label: '今日服务申请', value: serviceRequestsToday },
    { label: '今日订单', value: ordersToday },
    { label: '今日收入', value: yuan(ordersToday > 0 ? (ordersTodayRevenue._sum.paidAmount ?? 0) : 0) },
    { label: '本月订单', value: ordersMonth },
    { label: '本月收入', value: yuan(ordersMonth > 0 ? (ordersMonthRevenue._sum.paidAmount ?? 0) : 0) },
  ]

  const ORDER_STATUS: Record<string, string> = {
    pending: '待付款', paid: '已付款', processing: '处理中', completed: '已完成',
    cancelled: '已取消', refunded: '已退款',
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
        <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">数据看板</h1>
      </div>

      {/* 指标卡片 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map(s => (
          <div key={s.label} className="border border-[#3A3530] bg-[#252320] px-5 py-4">
            <p className="text-xs text-[#706860] mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-[#C4A882]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 最近注册用户 */}
        <div className="border border-[#3A3530] bg-[#252320]">
          <div className="px-5 py-3 border-b border-[#3A3530]">
            <p className="text-xs text-[#706860] uppercase tracking-widest font-semibold">最近注册</p>
          </div>
          {recentUsers.length === 0 ? (
            <p className="px-5 py-8 text-sm text-[#706860] text-center">暂无用户</p>
          ) : (
            <ul className="divide-y divide-[#3A3530]">
              {recentUsers.map(u => (
                <li key={u.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#E8E2DA]">{u.name ?? '—'}</p>
                    <p className="text-xs text-[#706860] mt-0.5 truncate max-w-[160px]">{u.email}</p>
                  </div>
                  <p className="text-xs text-[#706860] shrink-0 ml-3">
                    {u.createdAt.toLocaleDateString('zh-CN')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 最近订单 */}
        <div className="border border-[#3A3530] bg-[#252320]">
          <div className="px-5 py-3 border-b border-[#3A3530]">
            <p className="text-xs text-[#706860] uppercase tracking-widest font-semibold">最近订单</p>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-sm text-[#706860] text-center">暂无订单</p>
          ) : (
            <ul className="divide-y divide-[#3A3530]">
              {recentOrders.map(o => (
                <li key={o.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-[#E8E2DA] truncate">{o.productName}</p>
                    <p className="text-xs text-[#706860] mt-0.5 font-mono">{o.orderNo}</p>
                  </div>
                  <div className="shrink-0 text-right ml-3">
                    <p className="text-sm text-[#C4A882]">{yuan(o.paidAmount)}</p>
                    <p className="text-xs text-[#706860]">{ORDER_STATUS[o.status] ?? o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
