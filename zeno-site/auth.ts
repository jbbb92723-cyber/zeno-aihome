/**
 * auth.ts — Auth.js v5 配置
 *
 * 登录方式：
 *   1. 邮箱 + 密码（Credentials Provider）
 *   2. Google OAuth
 *
 * 数据库：Supabase Postgres + Prisma
 * 管理员：独立走 /admin/login + ADMIN_PASSWORD，与普通用户完全分离
 */

import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // ─── 邮箱 + 密码 ────────────────────────────────────────
    Credentials({
      id: 'credentials',
      name: '邮箱登录',
      credentials: {
        email:    { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string)?.trim().toLowerCase()
        const password = credentials?.password as string
        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: user.image,
        }
      },
    }),

    // ─── Google OAuth ──────────────────────────────────────
    Google({
      clientId:     process.env.AUTH_GOOGLE_ID     ?? process.env.GOOGLE_CLIENT_ID     ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

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
        session.user.id       = token.id as string
        session.user.role     = token.role as string
        session.user.provider = (token.provider as string) ?? ''
      }
      return session
    },
  },

  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
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
