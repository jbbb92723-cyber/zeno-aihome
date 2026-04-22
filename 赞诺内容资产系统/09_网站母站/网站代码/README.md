# Zeno 网站代码说明

> 代码位置：项目根目录 `zeno-site/`
> 内容规划位置：`赞诺内容资产系统/09_网站母站/`

---

## 1. 项目说明

这是 zenoaihome.com 的网站前端代码。

这不是普通博客，也不是装修公司官网。这是赞诺的**长期知识母站、信任资产库、搜索入口和服务转化入口**。

**网站核心定位**：从装修出发，聊居住、美学、人性、成长与 AI 时代的长期主义。

---

## 2. 技术栈

| 技术 | 说明 |
|---|---|
| Next.js 14 | React 框架，App Router |
| TypeScript | 类型安全 |
| Tailwind CSS | 样式方案 |
| `output: 'export'` | 静态网站导出 |
| 本地数据文件 | 内容维护方式（无数据库） |

**V1 不包含**：数据库、登录、OAuth、支付、后台 CMS、会员系统。

---

## 3. 如何安装依赖

```bash
cd zeno-site
npm install
```

---

## 4. 如何本地运行

```bash
npm run dev
```

访问 http://localhost:3000

**生产构建**：
```bash
npm run build
```

静态文件输出到 `out/` 目录。

---

## 5. 如何修改首页文案

首页文案在两个地方：

**1. Hero 区块（标题、副标题、按钮）**：
修改 `app/page.tsx` 文件顶部的 `writingAreas` 数组和 Hero section。

**2. 五大内容主轴卡片**：
修改 `app/page.tsx` 中 `writingAreas` 数组。

**3. 首页参考文案**：
参见 `赞诺内容资产系统/09_网站母站/首页.md`

---

## 6. 如何新增文章

**第一步**：在 `data/articles.ts` 的 `articles` 数组中添加新条目：

```typescript
{
  id: '07',                                    // 文章序号
  slug: 'your-article-slug',                   // URL slug（拼音，用连字符）
  title: '文章标题',
  excerpt: '文章摘要，显示在列表和卡片上。',
  category: '居住与装修',                       // 必须是 categories 数组中的值
  tags: ['标签1', '标签2'],
  date: '2026-05-01',                          // 发布日期 YYYY-MM-DD
  content: `文章正文，支持 Markdown 格式。`
}
```

**第二步**：文章正文支持 Markdown 格式（`## 标题`、`**加粗**`、`- 列表项`等），正文会自动渲染。

**文章规划参考**：`赞诺内容资产系统/09_网站母站/网站文章/`

---

## 7. 如何新增资料

修改 `data/resources.ts` 的 `resources` 数组，参考现有条目格式添加新资料项。

资料的 `howToGet` 字段填写领取方式（如「关注公众号，回复"关键词"」）。

---

## 8. 如何新增服务

修改 `data/services.ts` 的 `services` 数组，参考现有条目格式添加新服务。

服务页面自动渲染所有服务项，无需修改页面代码。

---

## 9. 如何部署到 Vercel

**方式一：通过 GitHub 自动部署（推荐）**

1. 把 `zeno-site/` 目录（或整个项目）推送到 GitHub
2. 在 Vercel 导入该仓库
3. 设置 Root Directory 为 `zeno-site`
4. Framework Preset 选 Next.js
5. 点击 Deploy

之后每次 push 到 main 分支，Vercel 自动重新部署。

**方式二：手动部署**

```bash
cd zeno-site
npm run build
# 将 out/ 目录上传到任意静态托管服务
```

---

## 10. 后续阶段升级路径

### V2 阶段（内容积累稳定后）

| 功能 | 技术方案 |
|---|---|
| 邮件订阅 | Resend + React Email |
| 网站统计 | Umami（隐私友好型） |
| 全文搜索 | Pagefind（静态搜索） |
| RSS 订阅 | 自动生成 feed.xml |

### V3 阶段（有付费资料需求时）

| 功能 | 技术方案 |
|---|---|
| 用户登录 | Supabase Auth |
| 资料权限控制 | Supabase Storage + RLS |
| 付费功能 | Stripe |

### 内容管理升级

当文章数量超过 30 篇时，可以考虑：
- 接入 Contentlayer（本地 Markdown 文件管理，无需手动维护 TS 数组）
- 或接入 Notion API（在 Notion 里写文章，自动同步到网站）

---

## 11. 当前 V1 不做什么

- ❌ 数据库（无 Supabase、MySQL 等）
- ❌ 用户登录
- ❌ OAuth（微信/GitHub 登录）
- ❌ 支付功能
- ❌ 后台 CMS
- ❌ 会员系统
- ❌ 评论系统
- ❌ 复杂动效

**V1 原则：结构清晰，表达可信，长期可维护。**

---

## 目录结构说明

```
zeno-site/
├── app/                    Next.js App Router 页面
│   ├── layout.tsx          全局布局（Header + Footer）
│   ├── page.tsx            首页
│   ├── about/page.tsx      关于我
│   ├── blog/               文章列表 + 详情
│   ├── topics/page.tsx     专题
│   ├── resources/page.tsx  资料库
│   ├── services/page.tsx   服务页（新增）
│   └── contact/page.tsx    联系
├── components/             可复用组件
│   ├── Header.tsx          导航栏
│   ├── Footer.tsx          页脚
│   ├── ArticleCard.tsx     文章卡片
│   ├── SectionTitle.tsx    区块标题
│   └── CTA.tsx             按钮组件
├── data/                   内容数据（本地维护）
│   ├── articles.ts         文章数据
│   ├── topics.ts           专题数据
│   ├── resources.ts        资料库数据
│   └── services.ts         服务数据（新增）
├── styles/
│   └── globals.css         全局样式
└── public/
    └── llms.txt            AI 系统说明文件（新增）
```
