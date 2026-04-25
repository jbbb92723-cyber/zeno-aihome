import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { createCoupon } from '@/lib/actions/admin'

export const metadata: Metadata = { title: '优惠券 · Admin' }

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      _count: { select: { claims: true, usages: true } },
    },
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
        <h1 className="text-xl font-semibold text-[#E8E2DA]">优惠券管理</h1>
      </div>

      {/* 创建优惠券 */}
      <div className="border border-[#3A3530] bg-[#252320] p-5 mb-6">
        <p className="text-xs text-[#706860] uppercase tracking-widest font-semibold mb-4">创建优惠券</p>
        <form action={async (formData: FormData) => {
          'use server'
          const type  = formData.get('type') as 'fixed' | 'percent'
          const value = type === 'fixed'
            ? Math.round(Number(formData.get('value')) * 100) // 元 → 分
            : Number(formData.get('value'))                   // 折扣直接存
          await createCoupon({
            code:      formData.get('code') as string,
            name:      formData.get('name') as string,
            type,
            value,
            minAmount: Math.round(Number(formData.get('minAmount') ?? 0) * 100),
            maxUses:   formData.get('maxUses') ? Number(formData.get('maxUses')) : undefined,
            expiresAt: formData.get('expiresAt') as string || undefined,
          })
        }} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#706860] mb-1">优惠码</label>
            <input name="code" required placeholder="ZENO10" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882] font-mono uppercase" />
          </div>
          <div>
            <label className="block text-xs text-[#706860] mb-1">显示名称</label>
            <input name="name" required placeholder="满减 10 元" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
          </div>
          <div>
            <label className="block text-xs text-[#706860] mb-1">类型</label>
            <select name="type" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2">
              <option value="fixed">固定减（元）</option>
              <option value="percent">折扣（如 90 表示九折）</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#706860] mb-1">优惠值</label>
            <input name="value" type="number" required min={1} placeholder="10 或 90" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
          </div>
          <div>
            <label className="block text-xs text-[#706860] mb-1">最低消费（元）</label>
            <input name="minAmount" type="number" defaultValue={0} min={0} className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
          </div>
          <div>
            <label className="block text-xs text-[#706860] mb-1">最大使用次数（空 = 不限）</label>
            <input name="maxUses" type="number" min={1} placeholder="不限" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
          </div>
          <div>
            <label className="block text-xs text-[#706860] mb-1">到期时间</label>
            <input name="expiresAt" type="date" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full py-2 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30 hover:bg-[#C4A882]/20 transition-colors">
              创建优惠券
            </button>
          </div>
        </form>
      </div>

      {/* 优惠券列表 */}
      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['优惠码', '名称', '类型', '优惠值', '最低消费', '领取/使用', '到期时间', '状态'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3530]">
            {coupons.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[#706860]">暂无优惠券</td></tr>
            )}
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-[#2A2825] transition-colors">
                <td className="px-3 py-3 font-mono text-xs text-[#C4A882]">{c.code}</td>
                <td className="px-3 py-3 text-[#E8E2DA]">{c.name}</td>
                <td className="px-3 py-3 text-xs text-[#A09890]">{c.type === 'fixed' ? '固定减' : '折扣'}</td>
                <td className="px-3 py-3 text-sm text-[#C4A882]">
                  {c.type === 'fixed' ? `¥${(c.value / 100).toFixed(0)}` : `${c.value}折`}
                </td>
                <td className="px-3 py-3 text-xs text-[#706860]">
                  {c.minAmount > 0 ? `¥${(c.minAmount / 100).toFixed(0)}` : '无门槛'}
                </td>
                <td className="px-3 py-3 text-xs text-[#A09890]">
                  {c._count.claims} / {c._count.usages}
                </td>
                <td className="px-3 py-3 text-xs text-[#706860] whitespace-nowrap">
                  {c.expiresAt ? c.expiresAt.toLocaleDateString('zh-CN') : '永久'}
                </td>
                <td className="px-3 py-3 text-xs">
                  <span className={c.isActive ? 'text-green-400' : 'text-[#706860]'}>
                    {c.isActive ? '有效' : '停用'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
