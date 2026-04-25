import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { grantMembership, revokeMembership } from '@/lib/actions/admin'

export const metadata: Metadata = { title: '会员管理 · Admin' }

export default async function MembersPage() {
  const members = await prisma.membership.findMany({
    where: { plan: { not: 'free' } },
    orderBy: { startedAt: 'desc' },
    include: { user: { select: { email: true, name: true } } },
    take: 100,
  })

  const active   = members.filter(m => m.status === 'active')
  const inactive = members.filter(m => m.status !== 'active')

  const STATUS_LABEL: Record<string, string> = {
    active: '活跃', expired: '已过期', cancelled: '已取消',
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
        <h1 className="text-xl font-semibold text-[#E8E2DA]">会员管理</h1>
      </div>

      {/* 手动开通 */}
      <div className="border border-[#3A3530] bg-[#252320] p-5 mb-6">
        <p className="text-xs text-[#706860] uppercase tracking-widest font-semibold mb-4">手动开通会员</p>
        <form action={async (formData: FormData) => {
          'use server'
          const email = formData.get('email') as string
          const plan  = formData.get('plan')  as string
          const days  = Number(formData.get('days'))
          if (!email || !plan || !days) return
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) return
          await grantMembership(user.id, plan, days)
        }} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-[#706860] mb-1">用户邮箱</label>
            <input name="email" required placeholder="user@example.com"
              className="w-52 bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
          </div>
          <div>
            <label className="block text-xs text-[#706860] mb-1">套餐</label>
            <select name="plan" className="bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2">
              <option value="creator">创作会员</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#706860] mb-1">天数</label>
            <input name="days" type="number" defaultValue={365} min={1} max={3650}
              className="w-24 bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
          </div>
          <button type="submit" className="px-5 py-2 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30 hover:bg-[#C4A882]/20">
            开通
          </button>
        </form>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="border border-[#3A3530] bg-[#252320] p-4">
          <p className="text-xs text-[#706860] mb-1">活跃会员</p>
          <p className="text-2xl font-semibold text-[#C4A882]">{active.length}</p>
        </div>
        <div className="border border-[#3A3530] bg-[#252320] p-4">
          <p className="text-xs text-[#706860] mb-1">历史总数</p>
          <p className="text-2xl font-semibold text-[#E8E2DA]">{members.length}</p>
        </div>
        <div className="border border-[#3A3530] bg-[#252320] p-4">
          <p className="text-xs text-[#706860] mb-1">失效 / 取消</p>
          <p className="text-2xl font-semibold text-[#706860]">{inactive.length}</p>
        </div>
      </div>

      {/* 列表 */}
      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['用户', '套餐', '状态', '开始时间', '到期时间', '操作'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3530]">
            {members.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#706860]">暂无会员</td></tr>
            )}
            {members.map(m => (
              <tr key={m.id} className="hover:bg-[#2A2825] transition-colors">
                <td className="px-4 py-3">
                  <p className="text-[#E8E2DA]">{m.user.name ?? '—'}</p>
                  <p className="text-xs text-[#706860] mt-0.5 truncate max-w-[160px]">{m.user.email}</p>
                </td>
                <td className="px-4 py-3 text-sm text-[#C4A882]">{m.plan}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={m.status === 'active' ? 'text-green-400' : 'text-[#706860]'}>
                    {STATUS_LABEL[m.status] ?? m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#706860] whitespace-nowrap">
                  {m.startedAt.toLocaleDateString('zh-CN')}
                </td>
                <td className="px-4 py-3 text-xs text-[#706860] whitespace-nowrap">
                  {m.expiresAt ? m.expiresAt.toLocaleDateString('zh-CN') : '永久'}
                </td>
                <td className="px-4 py-3">
                  {m.status === 'active' && (
                    <form action={async () => {
                      'use server'
                      await revokeMembership(m.id)
                    }}>
                      <button type="submit" className="text-xs text-red-400 hover:underline">取消</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
