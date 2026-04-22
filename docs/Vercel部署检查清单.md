# Vercel 部署检查清单

> 适用于 zenoaihome.com 项目

## 一、Vercel 项目设置

- [ ] Root Directory = `zeno-site`
- [ ] Framework Preset = `Next.js`
- [ ] Build Command = `npm run build`（默认）
- [ ] Output Directory = `.next`（默认）
- [ ] Node.js Version ≥ 18

## 二、必须配置的环境变量

### 基础

| 变量名 | 说明 | 示例 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 网站公开 URL | `https://zenoaihome.com` |
| `ADMIN_EMAILS` | 管理员邮箱，逗号分隔 | `you@example.com` |

### Auth（NextAuth + IDC Flare）

| 变量名 | 说明 |
|---|---|
| `AUTH_SECRET` | NextAuth 加密密钥（`npx auth secret` 生成） |
| `AUTH_IDC_FLARE_ID` | IDC Flare OAuth Client ID |
| `AUTH_IDC_FLARE_SECRET` | IDC Flare OAuth Client Secret |
| `AUTH_IDC_FLARE_ISSUER` | IDC Flare Issuer URL |

### 微信排版工具

| 变量名 | 说明 |
|---|---|
| `MD2WECHAT_BASE_URL` | md2wechat 转换服务地址 |
| `MD2WECHAT_API_KEY` | 转换服务 API Key |

### 微信公众号推送

| 变量名 | 说明 |
|---|---|
| `WECHAT_APPID` | 微信公众号 AppID |
| `WECHAT_APP_SECRET` | 微信公众号 AppSecret |
| `WECHAT_DEFAULT_AUTHOR` | 默认作者名 |
| `WECHAT_DEFAULT_COVER_MEDIA_ID` | 默认封面 media_id |

### AI 图片生成

| 变量名 | 说明 |
|---|---|
| `VOLCENGINE_ARK_API_KEY` | 火山引擎 Ark API Key |

## 三、部署后验证

1. 访问首页 `/` — 应正常展示
2. 访问 `/blog` — 应列出文章
3. 访问 `/tools/md2wechat` — 应展示排版工具
4. 访问 `/tools/md2wechat/status` — 应展示状态页
5. 访问 `/login` — 应展示登录页面
6. 检查 `/robots.txt` 和 `/sitemap.xml` 正常
7. 检查 `/llms.txt` 正常

## 四、常见问题

| 问题 | 解决 |
|---|---|
| Build 失败 | 检查 `npx tsc --noEmit`，修复类型错误 |
| 页面 404 | 确认 Root Directory = `zeno-site` |
| 登录不工作 | 确认 AUTH 相关环境变量已配置 |
| 工具页无法转换 | 确认 `MD2WECHAT_BASE_URL` 和 API Key |
