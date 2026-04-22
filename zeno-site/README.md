# Zeno Site — 运行说明

> Zeno 个人网站 v1.0。技术栈：Next.js 14 + TypeScript + Tailwind CSS。静态生成，无数据库，无登录。

---

## 1. 项目介绍

这是 Zeno（zenoaihome.com）的个人网站代码雏形。

**网站定位**：个人信任中枢 + 博客沉淀 + 资料领取入口 + 联系入口

**核心表达**：从装修出发，聊居住、美学、人性、成长与 AI 时代的长期主义。

**当前包含的页面**：

| 路径 | 说明 |
|---|---|
| `/` | 首页 |
| `/about` | 关于我 |
| `/blog` | 文章列表（支持分类筛选） |
| `/blog/[slug]` | 文章详情 |
| `/topics` | 专题页 |
| `/resources` | 资料库 |
| `/contact` | 联系页 |

---

## 2. 技术栈

- **框架**：Next.js 14（App Router，静态导出 `output: 'export'`）
- **语言**：TypeScript
- **样式**：Tailwind CSS v3
- **Markdown 渲染**：react-markdown + remark-gfm
- **字体**：Noto Sans SC（中文）+ Inter（英文）via `next/font/google`
- **部署**：Vercel（推荐）或任意静态托管

---

## 3. 如何安装依赖

确保本地已安装 Node.js 18+，然后运行：

```bash
cd zeno-site
npm install
```

如果需要安装 Typography 插件（tailwind prose 样式）：

```bash
npm install @tailwindcss/typography
```

---

## 4. 如何本地运行

```bash
npm run dev
```

浏览器访问 `http://localhost:3000`，即可看到首页。

**常用命令**：

```bash
npm run dev      # 开发模式（热更新）
npm run build    # 构建静态文件（输出到 out/ 目录）
npm run start    # 本地预览生产构建（需先 build）
npm run lint     # 代码检查
```

---

## 5. 如何修改首页文案

首页内容在 `app/page.tsx`：

- **Hero 主标题/副标题**：修改 `<h1>` 和 `<p>` 内容
- **我主要写什么**：修改 `writingAreas` 数组
- **关于我简介**：修改底部 `<p>` 文字
- **按钮文案**：修改 `CTAGroup` 的 `items` 数组中的 `label`

---

## 6. 如何新增文章

**步骤一**：打开 `data/articles.ts`

**步骤二**：在 `articles` 数组末尾新增一项：

```typescript
{
  id: '06',                          // 顺序递增
  slug: '06-你的文章slug',            // 只用英文小写+连字符
  title: '文章标题',
  excerpt: '100字以内摘要，不剧透结论',
  category: '居住与装修',              // 必须是5个分类之一
  tags: ['标签1', '标签2'],
  date: '2026-05-01',                // YYYY-MM-DD 格式
  content: `正文内容（Markdown 格式）`,
}
```

**分类选项**（固定5类）：
- `居住与装修`
- `美学与生活`
- `人性与判断`
- `成长与长期主义`
- `AI 与新生产力`

文章会自动出现在 `/blog` 列表页和对应分类筛选中。如果日期最新，也会出现在首页的"最近写的"模块。

---

## 7. 如何新增资料

打开 `data/resources.ts`，在 `resources` 数组末尾新增一项：

```typescript
{
  id: '06',
  slug: 'ziyuan-slug',
  title: '资料标题',
  subtitle: '一句话副标题',
  description: '资料简介（2-3句话）',
  forWho: '适合谁',
  solves: '解决什么问题',
  howToUse: ['步骤一', '步骤二', '步骤三'],
  howToGet: '关注公众号，回复"关键词"即可获取。',
  caveats: '注意事项',
  relatedArticleSlugs: ['文章slug'],  // 可以为空数组
  tag: '装修',  // 装修 | 居住 | AI
}
```

---

## 8. 如何部署到 Vercel

**方式一：通过 Vercel 网页（推荐）**

1. 把代码推送到 GitHub（`g:\Zenoaihome.com` 仓库）
2. 登录 [vercel.com](https://vercel.com)，点击 "New Project"
3. 选择对应 GitHub 仓库，**Root Directory 设置为 `zeno-site`**
4. Framework Preset 选择 **Next.js**
5. 点击 Deploy，等待构建完成

**方式二：通过 Vercel CLI**

```bash
npm install -g vercel
cd zeno-site
vercel --prod
```

**自定义域名**：在 Vercel 项目设置 → Domains → 添加 `zenoaihome.com`，然后按提示在 IDC Flare（Cloudflare）添加 DNS 记录。

---

## 9. 后续如何接入 Supabase、登录、会员、资料权限

**当前 v1 完全不需要这些**，等内容积累到 20+ 篇、有稳定复访流量后再启动。

启动路径（按顺序）：

```
V2：接入 Supabase
  ↓ 创建资料领取记录表
  ↓ 接入邮件订阅（Resend）
  ↓ 接入全文搜索（Algolia 或 Fuse.js）

V3：登录 + 会员
  ↓ 使用 NextAuth.js 接入邮箱登录
  ↓ 可选接入 OAuth（微信/Google）
  ↓ 内容权限分层（公开 / 留资可见 / 会员）
  ↓ 个人中心（收藏、阅读历史）
```

**Supabase 接入时的改动点**：
- 移除 `next.config.mjs` 中的 `output: 'export'`（静态导出与数据库不兼容）
- 改为 Vercel 全功能部署
- 在 `data/` 目录的 fetch 函数改为从 Supabase 查询

---

## 10. 当前 v1.0 不做什么

| 功能 | 状态 | 理由 |
|---|---|---|
| 用户登录 / OAuth | ❌ 不做 | 先验证内容和信任是否成立 |
| 会员分层 | ❌ 不做 | 同上 |
| 评论系统 | ❌ 不做 | 先用公众号留言代替 |
| 邮件订阅 | ❌ 不做 | V2 再接 |
| 数据库 | ❌ 不做 | 静态内容，不需要 |
| 搜索功能 | ❌ 不做 | 文章少时意义不大 |
| 暗色模式 | ❌ 不做 | 保持专注，减少变量 |
| 多语言 | ❌ 不做 | 先做好中文版 |
| 付费内容 | ❌ 不做 | V3 再考虑 |

---

## 目录结构

```
zeno-site/
├── README.md                     # 本文件
├── package.json
├── next.config.mjs               # 静态导出配置
├── tsconfig.json
├── tailwind.config.ts            # 自定义色彩（暖白底+暖石accent）
├── postcss.config.js
├── styles/
│   └── globals.css               # 全局样式 + 中文阅读优化
├── data/
│   ├── articles.ts               # 5篇种子文章数据
│   ├── topics.ts                 # 4个专题数据
│   └── resources.ts              # 5份资料数据
├── components/
│   ├── Header.tsx                # 导航栏（含移动端折叠）
│   ├── Footer.tsx                # 底部
│   ├── ArticleCard.tsx           # 文章卡片（default + compact 两种）
│   ├── SectionTitle.tsx          # 区块标题
│   └── CTA.tsx                   # 按钮组件（primary/secondary/ghost）
└── app/
    ├── layout.tsx                # 根布局 + SEO metadata + 字体
    ├── page.tsx                  # 首页
    ├── about/page.tsx            # 关于页
    ├── blog/page.tsx             # 文章列表（分类筛选）
    ├── blog/[slug]/page.tsx      # 文章详情（react-markdown）
    ├── topics/page.tsx           # 专题页
    ├── resources/page.tsx        # 资料库
    └── contact/page.tsx          # 联系页
```

---

## 部署后如何修改网站

### 部署不是锁死网站

网站上线之后，你依然可以随时修改任何内容。不需要重新配置，不需要联系技术人员，也不需要在 Vercel 后台乱点东西。

**修改的流程永远只有三步：**

```
本地修改文件 → git push 到 GitHub → Vercel 自动重新部署（1-3 分钟）
```

---

### 常见修改场景

**修改文章内容**

1. 打开 `data/articles.ts`
2. 找到对应文章，修改 `title`、`content`、`excerpt` 等字段
3. 保存，提交到 GitHub
4. Vercel 自动重新部署

**新增文章**

同上，在 `articles` 数组末尾新增一项（格式见第 6 节）。

**修改或新增图片**

1. 把图片（webp 格式，≤200KB）放到 `public/images/` 对应目录
2. 更新对应 data 文件里的 `coverImage` 字段
3. 提交到 GitHub
4. Vercel 自动重新部署

图片路径规则：
- 文章封面：`/images/articles/文章slug/cover.webp`
- 品牌头像：`/images/brand/avatar.webp`
- 资料预览：`/images/resources/资料slug-preview.webp`

**修改或新增视频**

视频不直接放进网站，只改链接：

1. 把视频发布到 B站 / 视频号 / YouTube
2. 打开 `data/videos.ts`
3. 把 `url`、`embedUrl` 从 `【待补充】` 改成真实链接
4. 把 `status` 改为 `'published'`
5. 提交到 GitHub

**修改联系方式**

打开 `app/contact/page.tsx` 或 `components/Footer.tsx`，找到微信号 / 邮箱等字段，直接修改文字。

**修改服务价格或描述**

打开 `data/services.ts`，找到对应服务，修改 `price`、`description`、`forWho` 等字段。

---

### 不建议这样做

- ❌ 不要直接在 Vercel 后台的编辑器里改代码（没有版本管理，容易出错）
- ❌ 不要把大视频文件放进 `public/` 目录（会导致部署失败或网站变慢）
- ❌ 不要删除 `public/llms.txt`、`public/robots.txt`、`public/sitemap.xml`（这些对 SEO 和 AI 引用有用）

---

### 网站的唯一真相来源

**本地项目文件夹 `zeno-site/` + GitHub 仓库**

Vercel 只是运行网站，所有真实内容和代码都在本地和 GitHub。  
只要本地文件和 GitHub 仓库是完整的，网站随时可以重新部署到任何平台。

---

*v1.0 — 2026年4月 · zenoaihome.com*
