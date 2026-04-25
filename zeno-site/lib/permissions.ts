/**
 * lib/permissions.ts
 *
 * 权限工具函数 v2
 *
 * 访问层级（从低到高）：
 *   public → login → content_member → creator_member → admin
 *
 * content_member:  有任意有效会员（plan 任意）
 * creator_member:  有 plan='creator' 的有效会员
 */

import { prisma } from './prisma'

// ─── 类型定义 ─────────────────────────────────────────────────

/** 资源访问级别 */
export type AccessLevel =
  | 'public'
  | 'login'
  | 'content_member'
  | 'creator_member'
  | 'admin'

// 向后兼容旧别名
export type { AccessLevel as UserRole }

export interface SessionUser {
  id:     string
  role?:  string | null
  name?:  string | null
  email?: string | null
  image?: string | null
}

export interface ResourcePermission {
  accessLevel: AccessLevel
}

// ─── 核心判断（需数据库，用于服务端） ─────────────────────────

/**
 * 查询用户是否有有效会员（服务端专用）
 * @param userId
 * @param plan 可选，限定 plan 类型
 */
export async function hasActiveMembership(
  userId: string,
  plan?: string,
): Promise<boolean> {
  const where: Record<string, unknown> = {
    userId,
    status:    'active',
    expiresAt: { gt: new Date() },
  }
  if (plan) where.plan = plan

  const membership = await prisma.membership.findFirst({ where, select: { id: true } })
  return !!membership
}

/**
 * 服务端：判断用户是否满足访问级别
 */
export async function canAccessServer(
  user: SessionUser | null | undefined,
  accessLevel: AccessLevel,
): Promise<boolean> {
  if (accessLevel === 'public') return true
  if (!user?.id) return false

  // admin 通过 role 字段判断（admin_session cookie 不写入 session user）
  const isAdmin = user.role === 'admin'

  switch (accessLevel) {
    case 'login':        return true
    case 'admin':        return isAdmin
    case 'content_member':
      if (isAdmin) return true
      return hasActiveMembership(user.id)
    case 'creator_member':
      if (isAdmin) return true
      return hasActiveMembership(user.id, 'creator')
    default:
      return false
  }
}

// ─── 客户端判断（仅基于 session，不访问数据库） ────────────────

/**
 * 客户端/轻量判断：基于 session.user.role
 * role 字段格式：'user' | 'content_member' | 'creator_member' | 'admin'
 */
export function canAccessResource(
  user: SessionUser | null | undefined,
  resource: ResourcePermission,
): boolean {
  const { accessLevel } = resource
  if (accessLevel === 'public') return true
  if (!user) return false

  const role = user.role ?? 'user'

  const LEVEL_ORDER: AccessLevel[] = [
    'public',
    'login',
    'content_member',
    'creator_member',
    'admin',
  ]

  const roleToLevel: Record<string, AccessLevel> = {
    user:            'login',
    content_member:  'content_member',
    creator_member:  'creator_member',
    admin:           'admin',
    // 向后兼容
    member:          'content_member',
    customer:        'creator_member',
  }

  const userLevel = roleToLevel[role] ?? 'login'
  return LEVEL_ORDER.indexOf(userLevel) >= LEVEL_ORDER.indexOf(accessLevel)
}

// ─── 标签 / 按钮文案 ──────────────────────────────────────────

export function getAccessLabel(level: AccessLevel): string {
  const labels: Partial<Record<string, string>> = {
    public:          '免费',
    login:           '登录领取',
    content_member:  '会员专属',
    creator_member:  '创作会员专属',
    admin:           '内部',
    // 向后兼容旧值
    member:          '会员专属',
    paid:            '付费获取',
  }
  return labels[level] ?? level
}

export function getAccessButtonLabel(
  user: SessionUser | null | undefined,
  resource: ResourcePermission,
): string {
  const { accessLevel } = resource

  if (accessLevel === 'public') return '查看 / 下载'
  if (accessLevel === 'admin')  return ''

  if (!user) {
    switch (accessLevel) {
      case 'login':           return '登录后领取'
      case 'content_member':  return '登录查看会员资料'
      case 'creator_member':  return '登录后开通会员'
    }
  }

  if (canAccessResource(user, resource)) return '立即领取'

  switch (accessLevel) {
    case 'content_member':  return '开通会员'
    case 'creator_member':  return '升级创作会员'
    default:                return '查看详情'
  }
}


/**
 * 获取访问级别的样式类（用于标签颜色）
 */
export function getAccessLevelStyle(level: string): string {
  const styles: Record<string, string> = {
    public:         'bg-stone-pale text-stone border border-stone/20',
    login:          'bg-blue-50 text-blue-700 border border-blue-200',
    content_member: 'bg-amber-50 text-amber-700 border border-amber-200',
    creator_member: 'bg-purple-50 text-purple-700 border border-purple-200',
    admin:          'bg-red-50 text-red-700 border border-red-200',
    // 向后兼容
    member: 'bg-amber-50 text-amber-700 border border-amber-200',
    paid:   'bg-purple-50 text-purple-700 border border-purple-200',
  }
  return styles[level] ?? ''
}

export function isLoggedIn(user: SessionUser | null | undefined): boolean {
  return !!user
}

export function isAdmin(user: SessionUser | null | undefined): boolean {
  return user?.role === 'admin'
}

export function isMember(user: SessionUser | null | undefined): boolean {
  if (!user) return false
  return ['member', 'content_member', 'creator_member', 'customer', 'admin'].includes(user.role ?? '')
}

