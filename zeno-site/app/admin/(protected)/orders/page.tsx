import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { updateOrderStatus, confirmPayment } from '@/lib/actions/admin'
import Link from 'next/link'

export const metadata: Metadata = { title: '订单管理 · Admin' }

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending:               '待付款',
  pending_confirmation:  '待确认',
  paid:                  '已付款',
  processing:            '处理中',
  completed:             '已完成',
  cancelled:             '已取消',
  refunded:              '已退款',
}
const STATUS_COLOR: Record<string, string> = {
  pending:              'text-[#A09890]',
  pending_confirmation: 'text-[#C4A882]',
  paid:                 'text-[#C4A882]',
  processing:           'text-[#C4A882]',
  completed:            'text-green-400',
  cancelled:            'text-[#706860]',
  refunded:             'text-[#706860]',
}

const PAGE_SIZE = 30

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const q = params.q ?? ''
  const statusFilter = params.status ?? ''
  const page = Math.max(1, Number(params.page ?? 1))
  const skip = (page - 1) * PAGE_SIZE

  const where: Record<string, unknown> = {}
  if (statusFilter) where.status = statusFilter
  if (q) where.OR = [
    { orderNo: { contains: q } },
    { productName: { contains: q, mode: 'insensitive' } },
    { user: { email: { contains: q, mode: 'insensitive' } } },
  ]

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.order.count({ where }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
          <h1 className="text-xl font-semibold text-[#E8E2DA]">订单管理</h1>
        </div>
        <span className="text-sm text-[#706860]">共 {total} 笔</span>
      </div>

      {/* 筛选 */}
      <form method="GET" className="mb-5 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="搜索订单号 / 商品 / 邮箱…"
          className="w-60 bg-[#252320] border border-[#3A3530] text-[#E8E2DA] placeholder-[#706860] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]"
        />
        <select
          name="status"
          defaultValue={statusFilter}
          className="bg-[#252320] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]"
        >
          <option value="">全部状态</option>
          {Object.entries(ORDER_STATUS_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30">筛选</button>
        {(q || statusFilter) && (
          <Link href="/admin/orders" className="px-4 py-2 text-sm text-[#706860] border border-[#3A3530]">清除</Link>
        )}
      </form>

      {/* 表格 */}
      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['订单号', '用户', '商品', '原价', '实付', '状态', '下单时间', '操作'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3530]">
            {orders.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[#706860]">无订单</td></tr>
            )}
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-[#2A2825] transition-colors">
                <td className="px-3 py-3 font-mono text-xs text-[#A09890] whitespace-nowrap">{o.orderNo}</td>
                <td className="px-3 py-3 text-xs text-[#A09890] max-w-[140px] truncate">
                  {o.user?.email ?? '—'}
                </td>
                <td className="px-3 py-3 text-[#E8E2DA] max-w-[140px] truncate">{o.productName}</td>
                <td className="px-3 py-3 text-[#706860] whitespace-nowrap">¥{(o.amount / 100).toFixed(2)}</td>
                <td className="px-3 py-3 text-[#C4A882] whitespace-nowrap">¥{(o.paidAmount / 100).toFixed(2)}</td>
                <td className={`px-3 py-3 text-xs font-medium whitespace-nowrap ${STATUS_COLOR[o.status] ?? 'text-[#706860]'}`}>
                  {ORDER_STATUS_LABEL[o.status] ?? o.status}
                </td>
                <td className="px-3 py-3 text-xs text-[#706860] whitespace-nowrap">
                  {o.createdAt.toLocaleDateString('zh-CN')}
                </td>
                <td className="px-3 py-3">
                  {/* 快速确认按钮（待确认状态） */}
                  {(o.status === 'pending_confirmation' || o.status === 'pending') && (
                    <form action={async () => {
                      'use server'
                      await confirmPayment(o.id)
                    }} className="mb-2">
                      <button
                        type="submit"
                        className="text-xs bg-[#C4A882] text-[#1C1A17] font-semibold px-3 py-1 hover:bg-[#D4B892] transition-colors"
                      >
                        确认已付款
                      </button>
                    </form>
                  )}
                  <form action={async (formData: FormData) => {
                    'use server'
                    const status = formData.get('status') as string
                    await updateOrderStatus(o.id, status)
                  }}>
                    <select
                      name="status"
                      defaultValue={o.status}
                      className="bg-[#1C1A17] border border-[#3A3530] text-[#A09890] text-xs px-2 py-1 mr-2"
                    >
                      {Object.entries(ORDER_STATUS_LABEL).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                    <button type="submit" className="text-xs text-[#C4A882] hover:underline">更新</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 items-center">
          {page > 1 && <Link href={`/admin/orders?q=${q}&status=${statusFilter}&page=${page - 1}`} className="text-xs text-[#A09890] border border-[#3A3530] px-3 py-1.5">← 上一页</Link>}
          <span className="text-xs text-[#706860]">{page} / {totalPages}</span>
          {page < totalPages && <Link href={`/admin/orders?q=${q}&status=${statusFilter}&page=${page + 1}`} className="text-xs text-[#A09890] border border-[#3A3530] px-3 py-1.5">下一页 →</Link>}
        </div>
      )}
    </div>
  )
}
