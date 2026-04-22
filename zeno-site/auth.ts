/**
 * auth.ts — Auth.js v5 配置
 *
 * 使用 next-auth@5 (Auth.js v5 beta)
 *
 * IDC Flare OAuth 端点状态：【待补充】
 * 需要到 IDC Flare 开发者后台获取：
 *   - IDCFLARE_AUTHORIZATION_URL
 *   - IDCFLARE_TOKEN_URL
 *   - IDCFLARE_USERINFO_URL
 *   - IDCFLARE_CLIENT_ID
 *   - IDCFLARE_CLIENT_SECRET
 *
 * 详见：IDC-Flare-OAuth接入说明.md
 */

import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'

// ─────────────────────────────────────────
// IDC Flare 自定义 OAuth Provider
// 所有端点从环境变量读取，不写死
// ─────────────────────────────────────────
const idcFlareConfigured =
  !!process.env.IDCFLARE_CLIENT_ID &&
  !!process.env.IDCFLARE_CLIENT_SECRET &&
  !!process.env.IDCFLARE_AUTHORIZATION_URL &&
  !!process.env.IDCFLARE_TOKEN_URL &&
  !!process.env.IDCFLARE_USERINFO_URL

// 只有当所有端点都配置好了才注册这个 provider
const idcFlareProvider = idcFlareConfigured
  ? {
      id: 'idcflare',
      name: 'IDC Flare',
      type: 'oauth' as const,
      clientId: process.env.IDCFLARE_CLIENT_ID!,
      clientSecret: process.env.IDCFLARE_CLIENT_SECRET!,
      authorization: {
        url: process.env.IDCFLARE_AUTHORIZATION_URL!,
        params: {
          scope: 'openid profile email',
          response_type: 'code',
        },
      },
      token: process.env.IDCFLARE_TOKEN_URL!,
      userinfo: process.env.IDCFLARE_USERINFO_URL!,
      // userinfo 响应结构映射到 Auth.js Profile
      // 如果 IDC Flare 返回的字段名不同，在这里调整
      profile(profile: Record<string, unknown>) {
        return {
          id: String(profile.sub ?? profile.id ?? profile.user_id ?? ''),
          name: String(profile.name ?? profile.display_name ?? profile.nickname ?? ''),
          email: String(profile.email ?? ''),
          image: profile.avatar_url
            ? String(profile.avatar_url)
            : profile.picture
              ? String(profile.picture)
              : null,
        }
      },
    }
  : null

const authConfig: NextAuthConfig = {
  providers: [
    // 只加入已配置的 provider，避免环境变量缺失时报错
    ...(idcFlareProvider ? [idcFlareProvider] : []),
    // 未来可以在这里添加：
    // GitHub({ clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET })
    // Email({ server: process.env.EMAIL_SERVER, from: process.env.EMAIL_FROM })
  ],

  // ─── Session 策略：使用 JWT（无需数据库 session 表）─────────
  // 第一阶段使用 JWT，不依赖数据库 session。
  // 第二阶段如需数据库 session，改为 strategy: 'database'
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },

  // ─── 页面路由 ─────────────────────────────────────────────
  pages: {
    signIn: '/login',
    error: '/login',
  },

  // ─── 回调 ─────────────────────────────────────────────────
  callbacks: {
    /**
     * jwt 回调：在 JWT 中存储用户角色和 id
     * 第一阶段从 token.sub 读取，后续可以查询数据库补充 role
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // TODO（第二阶段）：从数据库 profiles 表查询 role
        // const profile = await db.profiles.findUnique({ where: { id: user.id } })
        // token.role = profile?.role ?? 'user'
        token.role = 'user' // 默认角色
      }
      return token
    },

    /**
     * session 回调：将 JWT 中的信息暴露给客户端
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  // ─── 事件钩子 ──────────────────────────────────────────────
  events: {
    /**
     * 用户首次登录时，在 profiles 表创建记录
     * TODO（第二阶段）：取消注释并接入真实数据库
     */
    async signIn({ user, isNewUser }) {
      if (isNewUser && user.id) {
        // await db.profiles.create({
        //   data: {
        //     id: user.id,
        //     email: user.email ?? '',
        //     display_name: user.name ?? '',
        //     avatar_url: user.image ?? '',
        //     role: 'user',
        //   },
        // })
        console.log('[Auth] New user signed in:', user.email)
      }
    },
  },

  // AUTH_SECRET 从环境变量读取，不写死
  secret: process.env.AUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// ─── 类型扩展 ──────────────────────────────────────────────
// 让 session.user 包含 id 和 role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
