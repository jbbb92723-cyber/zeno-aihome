import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { createRedeemCode, batchCreateRedeemCodes } from '@/lib/actions/admin'

export const metadata: Metadata = { title: '兑换码 · Admin' }

const TYPE_LABEL: Record<string, string> = {
  membership:       '会员兑换',
  resource:         '资料解锁',
  coupon:           '优惠券',
  service_discount: '服务折扣',
}

export default async function RedeemCodesPage() {
  const codes = await prisma.redeemCode.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { _count: { select: { usages: true } } },
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
        <h1 className="text-xl font-semibold text-[#E8E2DA]">兑换码管理</h1>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6">
        {/* 单个创建 */}
        <div className="border border-[#3A3530] bg-[#252320] p-5">
          <p className="text-xs text-[#706860] uppercase tracking-widest font-semibold mb-4">创建单个兑换码</p>
          <form action={async (formData: FormData) => {
            'use server'
            await createRedeemCode({
              code:      formData.get('code') as string,
              type:      formData.get('type') as string,
              value:     formData.get('value') as string || undefined,
              maxUses:   Number(formData.get('maxUses') ?? 1),
              expiresAt: formData.get('expiresAt') as string || undefined,
              note:      formData.get('note') as string || undefined,
            })
          }} className="space-y-3">
            <div>
              <label className="block text-xs text-[#706860] mb-1">兑换码（大写字母+数字）</label>
              <input name="code" required placeholder="ZENO2025"
                className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882] font-mono uppercase" />
            </div>
            <div>
              <label className="block text-xs text-[#706860] mb-1">类型</label>
              <select name="type" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2">
                {Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#706860] mb-1">关联值（如套餐名 / 资料ID）</label>
              <input name="value" placeholder="creator / resource_01" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#706860] mb-1">最大使用次数</label>
                <input name="maxUses" type="number" defaultValue={1} min={1}
                  className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
              </div>
              <div>
                <label className="block text-xs text-[#706860] mb-1">到期时间（可选）</label>
                <input name="expiresAt" type="date"
                  className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#706860] mb-1">备注</label>
              <input name="note" placeholder="内部备注"
                className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
            </div>
            <button type="submit" className="w-full py-2 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30 hover:bg-[#C4A882]/20 transition-colors">
              创建
            </button>
          </form>
        </div>

        {/* 批量生成 */}
        <div className="border border-[#3A3530] bg-[#252320] p-5">
          <p className="text-xs text-[#706860] uppercase tracking-widest font-semibold mb-4">批量生成</p>
          <form action={async (formData: FormData) => {
            'use server'
            await batchCreateRedeemCodes({
              prefix:    formData.get('prefix') as string,
              count:     Number(formData.get('count') ?? 10),
              type:      formData.get('type') as string,
              value:     formData.get('value') as string || undefined,
              maxUses:   Number(formData.get('maxUses') ?? 1),
              expiresAt: formData.get('expiresAt') as string || undefined,
            })
          }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#706860] mb-1">前缀</label>
                <input name="prefix" required placeholder="ZENO" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882] font-mono uppercase" />
              </div>
              <div>
                <label className="block text-xs text-[#706860] mb-1">数量 (1–500)</label>
                <input name="count" type="number" defaultValue={10} min={1} max={500}
                  className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#706860] mb-1">类型</label>
              <select name="type" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2">
                {Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#706860] mb-1">关联值</label>
              <input name="value" placeholder="creator / resource_01" className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#706860] mb-1">每码使用次数</label>
                <input name="maxUses" type="number" defaultValue={1} min={1}
                  className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
              </div>
              <div>
                <label className="block text-xs text-[#706860] mb-1">到期时间</label>
                <input name="expiresAt" type="date"
                  className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]" />
              </div>
            </div>
            <button type="submit" className="w-full py-2 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30 hover:bg-[#C4A882]/20 transition-colors">
              批量生成
            </button>
          </form>
        </div>
      </div>

      {/* 列表 */}
      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['兑换码', '类型', '关联值', '使用 / 上限', '到期时间', '状态', '备注'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3530]">
            {codes.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#706860]">暂无兑换码</td></tr>
            )}
            {codes.map(c => (
              <tr key={c.id} className="hover:bg-[#2A2825] transition-colors">
                <td className="px-3 py-3 font-mono text-xs text-[#C4A882]">{c.code}</td>
                <td className="px-3 py-3 text-xs text-[#A09890]">{TYPE_LABEL[c.type] ?? c.type}</td>
                <td className="px-3 py-3 text-xs text-[#706860]">{c.value ?? '—'}</td>
                <td className="px-3 py-3 text-xs text-[#E8E2DA]">{c._count.usages} / {c.maxUses}</td>
                <td className="px-3 py-3 text-xs text-[#706860] whitespace-nowrap">
                  {c.expiresAt ? c.expiresAt.toLocaleDateString('zh-CN') : '永久'}
                </td>
                <td className="px-3 py-3 text-xs">
                  <span className={c.isActive ? 'text-green-400' : 'text-[#706860]'}>
                    {c.isActive ? '有效' : '停用'}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-[#706860] max-w-[120px] truncate">{c.note ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
