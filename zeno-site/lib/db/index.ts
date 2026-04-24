/**
 * lib/db/index.ts
 *
 * Neon Serverless Postgres 连接（HTTP 模式，无需长连接）
 * 配合 Drizzle ORM 使用
 *
 * 所需环境变量：
 *   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
 */

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('Missing env: DATABASE_URL — 请在 Neon 控制台获取连接字符串')
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema })
