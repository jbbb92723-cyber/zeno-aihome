/**
 * app/api/auth/[...nextauth]/route.ts
 *
 * Auth.js v5 路由处理器
 * 处理所有 /api/auth/* 请求（登录、登出、回调等）
 */

import { handlers } from '@/auth'

export const { GET, POST } = handlers
