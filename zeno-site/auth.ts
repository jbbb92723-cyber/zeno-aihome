/**
 * auth.ts — Auth.js v5 配置
 *
 * 支持的登录方式：
 *   - 邮箱 Magic Link（Resend），需要 AUTH_RESEND_KEY + DATABASE_URL
 *   - 微信网页 OAuth，需要 WECHAT_OPEN_CLIENT_ID + WECHAT_OPEN_CLIENT_SECRET
 *
 * 数据库：Neon Serverless Postgres + Drizzle ORM（存储用户 + 验证令牌）
 */

import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'

// ─────────────────────────────────────────────────────────────
// Resend 邮箱 Magic Link（需要 AUTH_RESEND_KEY）
// ─────────────────────────────────────────────────────────────
const resendProvider = process.env.AUTH_RESEND_KEY
  ? Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from:   process.env.EMAIL_FROM ?? 'Zeno 赞诺 <noreply@zenoaihome.com>',
    })
  : null

// ─────────────────────────────────────────────────────────────
// 微信网页 OAuth（网站扫码登录）
// 需要在微信开放平台注册「网站应用」并通过审核
// 回调地址：https://zenoaihome.com/api/auth/callback/wechat
// ─────────────────────────────────────────────────────────────
const wechatConfigured =
  !!process.env.WECHAT_OPEN_CLIENT_ID &&
  !!process.env.WECHAT_OPEN_CLIENT_SECRET

const wechatProvider = wechatConfigured
  ? {
      id:           'wechat',
      name:         '微信',
      type:         'oauth' as const,
      clientId:     process.env.WECHAT_OPEN_CLIENT_ID!,
      clientSecret: process.env.WECHAT_OPEN_CLIENT_SECRET!,
      authorization: {
        url: 'https://open.weixin.qq.com/connect/qrconnect',
        params: {
          scope:         'snsapi_login',
          response_type: 'code',
        },
      },
      token:    'https://api.weixin.qq.com/sns/oauth2/access_token',
      userinfo: {
        url: 'https://api.weixin.qq.com/sns/userinfo',
        async request({ tokens, provider }: {
          tokens:   Record<string, string>
          provider: { userinfo?: { url?: string } }
        }) {
          const url = `${provider.userinfo?.url}?access_token=${tokens.access_token}&openid=${tokens.openid}&lang=zh_CN`
          const res = await fetch(url)
          return res.json()
        },
      },
      profile(profile: Record<string, unknown>) {
        const openid = String(profile.openid ?? '')
        return {
          id:    openid,
          name:  String(profile.nickname ?? '微信用户'),
          // 微信不返回邮箱，用 openid 合成占位邮箱
          email: `${openid}@wechat.zenoaihome.com`,
          image: profile.headimgurl ? String(profile.headimgurl) : null,
        }
      },
    }
  : null

const authConfig: NextAuthConfig = {
  // ─── 数据库适配器（存储用户 + OAuth 账号 + 验证令牌）────────
  adapter: DrizzleAdapter(db, {
    usersTable:              users,
    accountsTable:           accounts,
    sessionsTable:           sessions,
    verificationTokensTable: verificationTokens,
  }),

  providers: [
    ...(resendProvider  ? [resendProvider]  : []),
    ...(wechatProvider  ? [wechatProvider]  : []),
  ],

  // ─── Session 策略：JWT（无需数据库 session 表）──────────────
  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60, // 30 天
  },

  // ─── 页面路由 ────────────────────────────────────────────
  pages: {
    signIn:        '/login',
    error:         '/login',
    verifyRequest: '/login/verify', // 邮件已发送确认页
  },

  // ─── 回调 ────────────────────────────────────────────────
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id   = user.id
        token.role = 'user'
      }
      if (account?.provider) {
        token.provider = account.provider
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id       = token.id       as string
        session.user.role     = token.role     as string
        session.user.provider = (token.provider as string) ?? ''
      }
      return session
    },
  },

  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        console.log('[Auth] New user signed in:', user.email)
      }
    },
  },

  secret: process.env.AUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// ─── 类型扩展 ────────────────────────────────────────────
declare module 'next-auth' {
  interface Session {
    user: {
      id:        string
      role:      string
      provider?: string
      name?:     string | null
      email?:    string | null
      image?:    string | null
    }
  }
}
