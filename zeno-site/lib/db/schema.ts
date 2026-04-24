/**
 * lib/db/schema.ts
 *
 * Auth.js v5 所需的数据库表结构（Drizzle ORM / Neon Postgres）
 *
 * 包含：
 * - users            — 用户基础信息
 * - accounts         — OAuth 账号关联（微信、未来第三方）
 * - sessions         — 数据库 session（JWT 模式下不写入，但需要存在）
 * - verificationTokens — 邮箱 Magic Link 一次性令牌
 */

import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

// ─── Users ─────────────────────────────────────────────────
export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name:          text('name'),
  email:         text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image:         text('image'),
  role:          text('role').default('user'),
})

// ─── Accounts (OAuth) ──────────────────────────────────────
export const accounts = pgTable(
  'account',
  {
    userId:            text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type:              text('type').$type<AdapterAccountType>().notNull(),
    provider:          text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token:     text('refresh_token'),
    access_token:      text('access_token'),
    expires_at:        integer('expires_at'),
    token_type:        text('token_type'),
    scope:             text('scope'),
    id_token:          text('id_token'),
    session_state:     text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
)

// ─── Sessions (unused with JWT, but required by adapter) ───
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId:       text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires:      timestamp('expires', { mode: 'date' }).notNull(),
})

// ─── Verification Tokens (邮箱 Magic Link) ─────────────────
export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token:      text('token').notNull(),
    expires:    timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)
