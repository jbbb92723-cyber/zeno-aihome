export interface Video {
  id: string
  slug: string
  title: string
  description: string
  /** 视频所在平台：bilibili | youtube | weixin | tencent | other */
  platform: 'bilibili' | 'youtube' | 'weixin' | 'tencent' | 'other'
  /** 视频主页链接，供用户点击跳转 */
  url: string
  /** 嵌入播放地址（iframe src），为空则只显示封面+跳转链接 */
  embedUrl: string
  /** 封面图路径（本地 public/images/ 相对路径），为空字符串表示待补充 */
  coverImage: string
  coverAlt: string
  /** 访问权限级别 */
  accessLevel: 'public' | 'login' | 'member' | 'paid'
  /** 关联的文章 slug，可选 */
  relatedArticleSlug?: string
  /** 关联的专题 slug，可选 */
  relatedTopic?: string
  /** 发布状态 */
  status: 'published' | 'draft' | 'planned'
}

export const videos: Video[] = [
  {
    id: '01',
    slug: 'wei-shenme-bu-zhi-zuo-zhuangxiu-bozhu',
    title: '为什么我不想只做一个装修博主',
    description:
      '装修是入口，但判断力、取舍和长期生活才是真正值得讨论的事。这是我做内容的出发点。',
    platform: 'bilibili',
    url: '【待补充】',
    embedUrl: '【待补充】',
    coverImage: '',
    coverAlt: '为什么我不想只做一个装修博主 — 视频封面',
    accessLevel: 'public',
    relatedArticleSlug: '01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu',
    relatedTopic: 'changqi-zhuyi-shenghuo',
    status: 'planned',
  },
  {
    id: '02',
    slug: 'zhuangxiu-yusuan-weishenme-zongchao',
    title: '装修预算为什么总超？',
    description:
      '从 16 年的工地经验出发，拆解预算超支的真实原因：不是材料贵，是结构没建好。',
    platform: 'bilibili',
    url: '【待补充】',
    embedUrl: '【待补充】',
    coverImage: '',
    coverAlt: '装修预算为什么总超 — 视频封面',
    accessLevel: 'public',
    relatedArticleSlug: 'zhuangxiu-yusuan-weishenme-zongchao',
    relatedTopic: 'shi-zhu-pai-zhuangxiu',
    status: 'planned',
  },
  {
    id: '03',
    slug: 'chuantong-hangyeren-weishenme-yao-xue-ai',
    title: '传统行业人为什么要学 AI',
    description:
      '不是因为它火，也不是为了转型。学 AI 的真正价值，在于让你的经验沉淀得更系统、杠杆更大。',
    platform: 'bilibili',
    url: '【待补充】',
    embedUrl: '【待补充】',
    coverImage: '',
    coverAlt: '传统行业人为什么要学 AI — 视频封面',
    accessLevel: 'public',
    relatedArticleSlug: '04-wei-shenme-wo-kaishi-renzheng-xue-ai',
    relatedTopic: 'chuantong-hangyeren-zenme-yong-ai',
    status: 'planned',
  },
]

export function getVideoById(id: string): Video | undefined {
  return videos.find((v) => v.id === id)
}

export function getPublishedVideos(): Video[] {
  return videos.filter((v) => v.status === 'published')
}

export function getVideosByArticleSlug(slug: string): Video[] {
  return videos.filter((v) => v.relatedArticleSlug === slug)
}
