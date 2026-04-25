import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: '行为事件 · Admin' }

const PAGE_SIZE = 50

const EVENT_LABEL: Record<string, string> = {
  page_view:         '页面访问',
  login:             '登录',
  signup:            '注册',
  claim_resource:    '领取资料',
  click_service:     '点击服务',
  visit_membership:  '访问会员页',
  click_md2wechat:   '点击 md2wechat',
  visit_publish:     '进入创作工作台',
  create_order:      '创建订单',
  use_coupon:        '使用优惠券',
  redeem_code:       '兑换码使用',
  checkin:           '签到打卡',
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string; page?: string }>
}) {
  const params = await searchParams
  const eventFilter = params.event ?? ''
  const page = Math.max(1, Number(params.page ?? 1))
  const skip = (page - 1) * PAGE_SIZE

  const where = eventFilter ? { event: eventFilter } : {}

  const [events, total, eventCounts] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.analyticsEvent.count({ where }),
    prisma.analyticsEvent.groupBy({
      by: ['event'],
      _count: { event: true },
      orderBy: { _count: { event: 'desc' } },
      take: 10,
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
          <h1 className="text-xl font-semibold text-[#E8E2DA]">行为事件</h1>
        </div>
        <span className="text-sm text-[#706860]">共 {total} 条</span>
      </div>

      {/* 事件汇总 */}
      {eventCounts.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mb-6">
          {eventCounts.slice(0, 10).map(ec => (
            <div key={ec.event} className="border border-[#3A3530] bg-[#252320] px-3 py-3 text-center">
              <p className="text-xs text-[#706860] mb-1 truncate">{EVENT_LABEL[ec.event] ?? ec.event}</p>
              <p className="text-lg font-semibold text-[#C4A882]">{ec._count.event}</p>
            </div>
          ))}
        </div>
      )}

      {/* 列表 */}
      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['事件', '路径', '用户ID', '时间'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3530]">
            {events.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[#706860]">暂无事件</td></tr>
            )}
            {events.map(e => (
              <tr key={e.id} className="hover:bg-[#2A2825] transition-colors">
                <td className="px-4 py-3 text-xs">
                  <span className="text-[#C4A882]">{EVENT_LABEL[e.event] ?? e.event}</span>
                </td>
                <td className="px-4 py-3 text-xs text-[#706860] font-mono max-w-[180px] truncate">
                  {e.path ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-[#706860] font-mono max-w-[120px] truncate">
                  {e.userId ?? '匿名'}
                </td>
                <td className="px-4 py-3 text-xs text-[#706860] whitespace-nowrap">
                  {e.createdAt.toLocaleString('zh-CN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2">
          {page > 1 && <a href={`/admin/events?event=${eventFilter}&page=${page - 1}`} className="text-xs text-[#A09890] border border-[#3A3530] px-3 py-1.5">← 上一页</a>}
          <span className="text-xs text-[#706860] py-1.5">{page} / {totalPages}</span>
          {page < totalPages && <a href={`/admin/events?event=${eventFilter}&page=${page + 1}`} className="text-xs text-[#A09890] border border-[#3A3530] px-3 py-1.5">下一页 →</a>}
        </div>
      )}
    </div>
  )
}
