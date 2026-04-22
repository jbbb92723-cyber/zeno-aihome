export interface Topic {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  coreQuestion: string
  willWrite: string[]
  forWho: string
  relatedSlugs: string[]
  color: string
  image?: string
  imageAlt?: string
}

export const topics: Topic[] = [
  {
    id: '01',
    slug: 'shi-zhu-pai-zhuangxiu',
    title: '实住派装修',
    tagline: '家是拿来住的，不是拿来拍照打卡的',
    description:
      '从真实居住出发，回到预算、动线、材料、光线和长期维护——让空间真正服务你的生活，而不是你的朋友圈。',
    coreQuestion: '家是用来住的，不是用来拍照打卡的。',
    willWrite: [
      '预算结构与取舍逻辑',
      '动线与收纳的真实使用逻辑',
      '材料选择与长期维护成本',
      '真实家庭场景下的居住体验',
      '避坑：被设计师或网图带偏的常见情况',
    ],
    forWho:
      '正在装修、准备装修，或住进去后发现"看起来好但用起来累"的人。',
    relatedSlugs: [
      '02-jia-bu-shi-yangban-jian',
    ],
    color: '#8B7355',
    image: '',
    imageAlt: '实住派装修专题封面',
  },
  {
    id: '02',
    slug: 'cong-gongdi-kan-shijie',
    title: '从工地看世界',
    tagline: '工地是人性、协作与责任的放大镜',
    description:
      '工程现场不只是施工现场。冲突如何发生、决策如何失真、责任如何被转移——这些在工地里每天都在上演，也映射着更大的世界。',
    coreQuestion: '工程现场如何映射人的判断、协作与责任？',
    willWrite: [
      '冲突如何在信息失真中发生',
      '决策如何在压力下变形',
      '责任如何在多方协作中消散',
      '如何在复杂现场里保持清晰执行',
      '工地观察与生活判断的迁移',
    ],
    forWho:
      '对现实决策机制感兴趣，想提升判断力与执行力的人。',
    relatedSlugs: [
      '03-cong-gongdi-kan-shijie',
    ],
    color: '#6B7A5E',
    image: '',
    imageAlt: '从工地看世界专题封面',
  },
  {
    id: '03',
    slug: 'changqi-zhuyi-shenghuo',
    title: '长期主义生活',
    tagline: '不被短期情绪牵着走，慢慢变强',
    description:
      '长期主义不是慢吞吞，也不是忍耐。它是一种选择结构：让今天的决定不透支明天，让注意力指向真正有复利的事。',
    coreQuestion: '如何在高噪音环境里保持长期选择？',
    willWrite: [
      '如何识别"短期诱惑"陷阱',
      '注意力和节奏的主动管理',
      '在压力下如何维持清晰判断',
      '搭建可持续的个人系统',
      '从装修决策到人生决策的长期逻辑',
    ],
    forWho:
      '想把生活和工作从"被推着走"变成"主动构建"的人。',
    relatedSlugs: [
      '01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu',
      '05-changqi-zhuyi-bushi-rennai',
    ],
    color: '#5B6E8A',
    image: '',
    imageAlt: '长期主义生活专题封面',
  },
  {
    id: '04',
    slug: 'chuantong-hangyeren-zenme-yong-ai',
    title: '传统行业人如何用 AI 升级自己',
    tagline: 'AI 时代，真正稀缺的是会判断、会整合、会落地的人',
    description:
      '不是技术人也能用好 AI。关键不在工具本身，而在如何把自己的行业经验和判断力与工具结合，建立真正的效率杠杆。',
    coreQuestion: 'AI 时代，不被替代的关键能力如何重建？',
    willWrite: [
      'AI 工具的真实边界与适用场景',
      '内容工作流的搭建方法',
      '传统经验如何与新工具结合',
      '从效率提升到认知升级的路径',
      '实际工作流案例与模板',
    ],
    forWho:
      '来自传统行业，想认真用 AI 做升级，而不是只追热点的人。',
    relatedSlugs: [
      '04-wei-shenme-wo-kaishi-renzheng-xue-ai',
    ],
    color: '#7A6B8A',
    image: '',
    imageAlt: '传统行业人如何用 AI 升级自己专题封面',
  },
  {
    id: '05',
    slug: 'meixue-yu-shenghuo',
    title: '美学与生活',
    tagline: '审美不是摆拍，是每天生活感受到的秩序',
    description:
      '审美不是"让家看起来漂亮"，而是让空间和日常生活变得更顺手、更舒展。从材质、光线、比例到日常秩序，美学最终服务的是人的真实状态。',
    coreQuestion: '什么样的审美才是真正适合自己生活的？',
    willWrite: [
      '空间比例与视觉舒适的关系',
      '材质选择与日常感受',
      '光线与居住情绪',
      '从样板间幻觉到真实居住体验的差距',
      '日常秩序如何构成一种审美',
    ],
    forWho:
      '想在装修或生活中建立自己审美判断，而不只是跟风网图的人。',
    relatedSlugs: [
      '02-jia-bu-shi-yangban-jian',
    ],
    color: '#8A6B5B',
    image: '',
    imageAlt: '美学与生活专题封面',
  },
]

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}
