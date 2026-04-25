/**
 * data/products.ts
 *
 * 站内售卖商品静态定义
 * 价格单位：分（人民币）
 */

export interface Product {
  id:          string
  name:        string
  tagline:     string
  type:        'membership' | 'resource' | 'service'
  /** 权益参数，与兑换码 value 格式一致 */
  value:       string
  price:       number    // 分
  originalPrice?: number // 划线价（分）
  description: string[]
  badge?:      string    // 角标文案，如 "推荐"
  isActive:    boolean
}

export const PRODUCTS: Product[] = [
  {
    id:           'creator-monthly',
    name:         '创作会员月卡',
    tagline:      '低门槛体验完整会员权益',
    type:         'membership',
    value:        'creator:30',
    price:        2900,
    description:  [
      '解锁全部选题库 & 标题库',
      'AI 提示词完整包',
      '文章结构模板（持续更新）',
      '发布前检查清单',
      '传统行业内容系统教程',
    ],
    isActive: true,
  },
  {
    id:           'creator-yearly',
    name:         '创作会员年卡',
    tagline:      '全年不断更，折合每天不到 6 毛',
    type:         'membership',
    value:        'creator:365',
    price:        19900,
    originalPrice: 34800,
    description:  [
      '创作会员月卡全部权益',
      '年卡专属：优先参与内测新功能',
      '年卡专属：1 次 30 分钟创作问诊（微信沟通）',
      '买断 12 个月，中途可随时暂停',
    ],
    badge:    '推荐',
    isActive: true,
  },
]

/** 根据 id 查找商品（不存在返回 null）*/
export function getProductById(id: string): Product | null {
  return PRODUCTS.find((p) => p.id === id && p.isActive) ?? null
}

/** 分 → 元字符串 */
export function formatYuan(cents: number): string {
  return `¥${(cents / 100).toFixed(2).replace(/\.00$/, '')}`
}
