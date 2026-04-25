import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { updateServiceStatus } from '@/lib/actions/admin'
import Link from 'next/link'

export const metadata: Metadata = { title: '服务申请 · Admin' }

const STATUS_LABEL: Record<string, string> = {
  submitted: '已提交', reviewing: '审核中', completed: '已完成', rejected: '未通过',
}
const STATUS_COLOR: Record<string, string> = {
  submitted: 'text-[#C4A882]', reviewing: 'text-[#C4A882]',
  completed: 'text-green-400', rejected: 'text-[#706860]',
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status ?? ''

  const requests = await prisma.serviceRequest.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { email: true } } },
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
          <h1 className="text-xl font-semibold text-[#E8E2DA]">服务申请</h1>
        </div>
        <span className="text-sm text-[#706860]">{requests.length} 条</span>
      </div>

      {/* 状态筛选 */}
      <div className="flex gap-2 mb-5">
        {[['', '全部'], ...Object.entries(STATUS_LABEL)].map(([v, l]) => (
          <Link
            key={v}
            href={v ? `/admin/services?status=${v}` : '/admin/services'}
            className={`text-xs px-3 py-1.5 border transition-colors ${
              statusFilter === v
                ? 'border-[#C4A882]/50 text-[#C4A882] bg-[#C4A882]/10'
                : 'border-[#3A3530] text-[#706860] hover:text-[#E8E2DA]'
            }`}
          >
            {l}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {requests.length === 0 && (
          <div className="border border-[#3A3530] bg-[#252320] px-5 py-10 text-center text-[#706860] text-sm">
            暂无申请
          </div>
        )}
        {requests.map(r => (
          <div key={r.id} className="border border-[#3A3530] bg-[#252320] px-5 py-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-[#E8E2DA]">{r.serviceType}</p>
                  <span className={`text-xs ${STATUS_COLOR[r.status] ?? 'text-[#706860]'}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </div>
                <p className="text-xs text-[#706860] mt-1">
                  {r.createdAt.toLocaleString('zh-CN')} · {r.user?.email ?? '未登录'}
                </p>
              </div>
              {/* 状态变更 */}
              <form action={async (formData: FormData) => {
                'use server'
                const status = formData.get('status') as string
                await updateServiceStatus(r.id, status)
              }} className="flex items-center gap-2">
                <select
                  name="status"
                  defaultValue={r.status}
                  className="bg-[#1C1A17] border border-[#3A3530] text-[#A09890] text-xs px-2 py-1"
                >
                  {Object.entries(STATUS_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                <button type="submit" className="text-xs text-[#C4A882] hover:underline">更新</button>
              </form>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {r.name   && <div><span className="text-[#706860]">姓名：</span><span className="text-[#E8E2DA]">{r.name}</span></div>}
              {r.phone  && <div><span className="text-[#706860]">电话：</span><span className="text-[#E8E2DA]">{r.phone}</span></div>}
              {r.wechat && <div><span className="text-[#706860]">微信：</span><span className="text-[#E8E2DA]">{r.wechat}</span></div>}
              {r.email  && <div><span className="text-[#706860]">邮箱：</span><span className="text-[#E8E2DA]">{r.email}</span></div>}
            </div>

            {r.message && (
              <p className="mt-3 text-xs text-[#A09890] leading-relaxed border-t border-[#3A3530] pt-3">
                {r.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
