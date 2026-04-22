export type ResourceAccessLevel = 'public' | 'login' | 'member' | 'paid' | 'admin'

export interface Resource {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  forWho: string
  solves: string
  howToUse: string[]
  howToGet: string
  caveats: string
  relatedArticleSlugs: string[]
  tag: string
  previewImage?: string
  previewAlt?: string
  /** 访问权限级别：public 免费 | login 登录领取 | member 会员专属 | paid 付费获取 */
  accessLevel?: ResourceAccessLevel
}

export const resources: Resource[] = [
  {
    id: '01',
    slug: 'zhuangxiu-yusuan-moban',
    title: '装修预算模板',
    subtitle: '把"感觉花钱"变成"有结构地花钱"',
    description:
      '一份按施工分区结构化的预算表，帮助你在方案阶段就建立清晰的成本框架，避免"越做越超"的常见陷阱。',
    forWho: '准备装修、但预算总是越做越乱的人。',
    solves: '把模糊的"大概要多少钱"拆解成可追踪、可调整的结构化预算。',
    howToUse: [
      '先填写基础信息（户型、面积、预算上限）',
      '按分区逐一填入已知费用项',
      '标记"已确认"和"待定"项，清楚看到缺口',
      '每次报价变动后更新，保留版本对比',
    ],
    howToGet: '关注公众号「Zeno AI装修笔记」，回复"预算模板"即可获取。',
    caveats:
      '模板是框架，不是报价标准。实际费用因地区、工人和材料差异较大，模板帮你看清结构，不替你做决策。',
    relatedArticleSlugs: ['02-jia-bu-shi-yangban-jian'],
    tag: '装修',
    previewImage: '',
    previewAlt: '装修预算模板预览图',
    accessLevel: 'login',
  },
  {
    id: '02',
    slug: 'baojia-shenhe-qingdan',
    title: '报价审核清单',
    subtitle: '快速识别报价单里的常见模糊项和风险项',
    description:
      '一份针对装修报价单的审查框架，帮你在签合同前找到最容易被忽略的坑点，减少后期扯皮的概率。',
    forWho: '看报价单看得头大，不知道从哪里核实的人。',
    solves: '把"感觉贵但说不出哪里不对"变成"有据可查的对照检查"。',
    howToUse: [
      '拿到报价单后，按清单逐项核对',
      '标记出描述模糊或缺少单位的项目',
      '列出需要向设计师/施工方确认的问题清单',
      '对比不同报价时，用同一清单框架评估',
    ],
    howToGet: '关注公众号「Zeno AI装修笔记」，回复"报价审核"即可获取。',
    caveats:
      '清单覆盖常见风险点，不代表全部情况。不同城市、不同工艺有差异，建议结合本地实际使用。',
    relatedArticleSlugs: ['02-jia-bu-shi-yangban-jian', '03-cong-gongdi-kan-shijie'],
    tag: '装修',
    previewImage: '',
    previewAlt: '报价审核清单预览图',
    accessLevel: 'login',
  },
  {
    id: '03',
    slug: 'yanshou-qingdan',
    title: '验收清单',
    subtitle: '在关键节点把问题提前拦住',
    description:
      '按施工节点整理的验收检查项，覆盖水电隐蔽、泥工、木作、油漆、竣工等关键环节，帮你在"做完才发现问题"之前发现问题。',
    forWho: '担心"做完才发现问题"、不知道每个节点该看什么的人。',
    solves: '把不知道看什么、只能靠感觉的验收，变成有章可循的节点检查。',
    howToUse: [
      '在每个施工节点完成后使用，不要等竣工再查',
      '按清单逐项检查，有问题的拍照留存',
      '确认合格后再允许进入下一施工环节',
      '发现问题时，明确书面记录和整改时限',
    ],
    howToGet: '关注公众号「Zeno AI装修笔记」，回复"验收清单"即可获取。',
    caveats:
      '验收清单是辅助工具，不替代专业监理。对复杂项目或大面积施工，建议同时引入第三方验收。',
    relatedArticleSlugs: ['03-cong-gongdi-kan-shijie'],
    tag: '装修',
    previewImage: '',
    previewAlt: '验收清单预览图',
    accessLevel: 'login',
  },
  {
    id: '04',
    slug: 'shizhu-pai-zijian-biao',
    title: '实住派装修自查表',
    subtitle: '让空间回到你的真实生活，而不是短期展示',
    description:
      '一份在方案阶段就该问自己的问题清单，帮你在被设计师或网图带偏之前，先厘清自己真正的居住需求。',
    forWho: '不想把家装成样板间，但又不知道如何表达自己需求的人。',
    solves: '把"我说不清楚我想要什么"变成"我知道我真正需要什么"。',
    howToUse: [
      '方案确定前，按清单逐项自问',
      '把答案写下来，不只是想',
      '拿着自查表和设计师对齐需求',
      '方案修改时，回头检查是否偏离了自查结论',
    ],
    howToGet: '关注公众号「Zeno AI装修笔记」，回复"实住自查"即可获取。',
    caveats:
      '这份清单帮你厘清需求，不帮你做具体工艺决策。需求清晰后，再和专业人士讨论实现方式。',
    relatedArticleSlugs: ['02-jia-bu-shi-yangban-jian', '01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu'],
    tag: '居住',
    previewImage: '',
    previewAlt: '实住派装修自查表预览图',
    accessLevel: 'login',
  },
  {
    id: '05',
    slug: 'ai-neirong-gongzuoliu-tishici-bao',
    title: 'AI 内容工作流提示词包',
    subtitle: '先建立自己的方法，再让工具放大效率',
    description:
      '一套面向传统行业内容创作者的提示词集合，覆盖选题策划、内容结构、表达打磨、复盘整理四个环节，帮你把 AI 用成真正的协作工具，而不是只产出通用废话。',
    forWho: '传统行业里想用 AI 提升内容效率，但用来用去感觉不像自己的人。',
    solves: '把"AI 产出的内容不是我想要的"变成"AI 帮我产出更像我的内容"。',
    howToUse: [
      '先选择对应你当前任务的提示词模块',
      '按说明填入你的背景信息和具体场景',
      '把 AI 输出作为草稿，不直接使用',
      '根据自己的判断修改，保留你的语气和立场',
    ],
    howToGet: '关注公众号「Zeno AI装修笔记」，回复"提示词包"即可获取。',
    caveats:
      '提示词是框架，不是魔法。最终让内容有价值的，还是你的真实经历和判断。工具放大的是你，不是它自己。',
    relatedArticleSlugs: ['04-wei-shenme-wo-kaishi-renzheng-xue-ai', '01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu'],
    tag: 'AI',
    previewImage: '',
    previewAlt: 'AI 内容工作流提示词包预览图',
    accessLevel: 'login',
  },
]

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug)
}
