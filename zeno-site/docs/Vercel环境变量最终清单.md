# Vercel 环境变量最终清单

> 在 Vercel Dashboard → Settings → Environment Variables 中配置以下变量。

---

## Auth 基础

| 变量 | 必填 | 说明 |
|------|------|------|
| `AUTH_SECRET` | ✅ | Auth.js 签名密钥，`openssl rand -base64 32` 生成 |
| `NEXTAUTH_URL` | 生产可选 | 本地开发填 `http://localhost:3000`，Vercel 会自动检测 |

## Supabase Postgres 数据库

| 变量 | 必填 | 说明 |
|------|------|------|
| `DATABASE_URL` | ✅ | Supabase Pooled 连接串（端口 6543，带 `?pgbouncer=true`） |
| `DIRECT_URL` | ✅ | Supabase Direct 连接串（端口 5432，用于 Prisma Migrate） |

获取方式：Supabase Dashboard → Settings → Database → Connection string

## Google 登录

| 变量 | 必填 | 说明 |
|------|------|------|
| `AUTH_GOOGLE_ID` | 推荐 | Google Cloud Console OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | 推荐 | Google Cloud Console OAuth Client Secret |

回调地址：`https://zenoaihome.com/api/auth/callback/google`

设置位置：Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs

## 邮件验证码（Resend）

| 变量 | 必填 | 说明 |
|------|------|------|
| `RESEND_API_KEY` | ✅ | Resend API Key |
| `EMAIL_FROM` | ✅ | 发件地址，如 `Zeno <noreply@zenoaihome.com>` |

前提：在 Resend 中验证 `zenoaihome.com` 域名（添加 DNS 记录）。

## 管理员后台

| 变量 | 必填 | 说明 |
|------|------|------|
| `ADMIN_PASSWORD` | ✅ | 管理员登录密码（独立于用户系统） |
| `ADMIN_SESSION_SECRET` | ✅ | 管理员 Cookie 签名密钥，`openssl rand -base64 32` 生成 |

## md2wechat 排版 API

| 变量 | 必填 | 说明 |
|------|------|------|
| `MD2WECHAT_BASE_URL` | 推荐 | md2wechat API 地址 |
| `MD2WECHAT_API_KEY` | 推荐 | md2wechat API Key |
| `MD2WECHAT_CONVERT_ENDPOINT` | 可选 | 默认 `/api/v1/convert` |
| `MD2WECHAT_DRAFT_ENDPOINT` | 可选 | 默认 `/article-draft` |
| `MD2WECHAT_UPLOAD_ENDPOINT` | 可选 | 图片上传端点 |

## 豆包图片生成（火山引擎）

| 变量 | 必填 | 说明 |
|------|------|------|
| `VOLCENGINE_ARK_API_KEY` | 可选 | 火山引擎 API Key |
| `VOLCENGINE_IMAGE_MODEL` | 可选 | 模型名，默认 `Doubao-Seedream-5.0-lite` |
| `VOLCENGINE_IMAGE_BASE_URL` | 可选 | API 地址，默认 `https://ark.cn-beijing.volces.com/api/v3` |
| `VOLCENGINE_IMAGE_PRICE_PER_IMAGE` | 可选 | 每张预估成本（元），默认 `0.22` |

## 微信公众号草稿箱

| 变量 | 必填 | 说明 |
|------|------|------|
| `WECHAT_APPID` | 可选 | 微信公众号 AppID |
| `WECHAT_APP_SECRET` | 可选 | 微信公众号 AppSecret |
| `WECHAT_DEFAULT_AUTHOR` | 可选 | 默认作者名，默认 `Zeno` |
| `WECHAT_DEFAULT_COVER_MEDIA_ID` | 可选 | 默认封面图 media_id |

## 站点 URL

| 变量 | 必填 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 推荐 | `https://zenoaihome.com` |
