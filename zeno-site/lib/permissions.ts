/**
 * lib/permissions.ts
 *
 * 权限工具函数
 * 判断当前用户是否可以访问某个资源
 *
 * 使用方式：
 *   import { canAccessResource, getAccessLabel } from '@/lib/permissions'
 *   const canAccess = canAccessResource(session?.user, resource)
 */

// ─── 资源访问级别类型 ──────────────────────────────────────────
export type AccessLevel = 'public' | 'login' | 'member' | 'paid' | 'admin'

// ─── 用户角色类型 ────────────────────────────────────────────
export type UserRole = 'visitor' | 'user' | 'member' | 'customer' | 'admin'

// ─── 精简用户信息（来自 session）────────────────────────────────
export interface SessionUser {
  id: string
  role: string
  name?: string | null
  email?: string | null
  image?: string | null
}

// ─── 资源权限信息 ────────────────────────────────────────────
export interface ResourcePermission {
  accessLevel: AccessLevel
}

/**
 * 判断用户是否可以访问某资源
 *
 * @param user - session.user，未登录时传 null 或 undefined
 * @param resource - 包含 accessLevel 的资源对象
 * @returns boolean
 */
export function canAccessResource(
  user: SessionUser | null | undefined,
  resource: ResourcePermission,
): boolean {
  const { accessLevel } = resource

  switch (accessLevel) {
    case 'public':
      return true

    case 'login':
      return !!user

    case 'member':
      if (!user) return false
      return user.role === 'member' || user.role === 'customer' || user.role === 'admin'

    case 'paid':
      if (!user) return false
      // TODO（第二阶段）：查询 orders 表确认是否已购买特定资源
      // 目前 customer 和 admin 视为有付费权限
      return user.role === 'customer' || user.role === 'admin'

    case 'admin':
      if (!user) return false
      return user.role === 'admin'

    default:
      return false
  }
}

/**
 * 获取访问级别的中文标签
 */
export function getAccessLabel(level: AccessLevel): string {
  const labels: Record<AccessLevel, string> = {
    public: '免费',
    login: '登录领取',
    member: '会员专属',
    paid: '付费获取',
    admin: '内部',
  }
  return labels[level]
}

/**
 * 获取按钮文案（根据用户状态和资源权限）
 *
 * @param user - 当前用户
 * @param resource - 资源权限信息
 * @returns 按钮显示文字
 */
export function getAccessButtonLabel(
  user: SessionUser | null | undefined,
  resource: ResourcePermission,
): string {
  const { accessLevel } = resource

  if (accessLevel === 'public') return '查看 / 下载'
  if (accessLevel === 'admin') return '' // admin 资源不对外显示按钮

  if (!user) {
    switch (accessLevel) {
      case 'login':
        return '登录后领取'
      case 'member':
        return '登录查看会员资料'
      case 'paid':
        return '登录后购买'
    }
  }

  if (canAccessResource(user, resource)) {
    return '立即领取'
  }

  switch (accessLevel) {
    case 'member':
      return '开通会员'
    case 'paid':
      return '购买获取'
    default:
      return '暂无权限'
  }
}

/**
 * 获取访问级别的样式类（用于标签颜色）
 */
export function getAccessLevelStyle(level: AccessLevel): string {
  const styles: Record<AccessLevel, string> = {
    public: 'bg-stone-pale text-stone border border-stone/20',
    login: 'bg-blue-50 text-blue-700 border border-blue-200',
    member: 'bg-amber-50 text-amber-700 border border-amber-200',
    paid: 'bg-purple-50 text-purple-700 border border-purple-200',
    admin: 'bg-red-50 text-red-700 border border-red-200',
  }
  return styles[level]
}

/**
 * 判断用户是否已登录
 */
export function isLoggedIn(user: SessionUser | null | undefined): boolean {
  return !!user
}

/**
 * 判断用户是否是管理员
 */
export function isAdmin(user: SessionUser | null | undefined): boolean {
  return user?.role === 'admin'
}

/**
 * 判断用户是否是会员（包括付费会员和管理员）
 */
export function isMember(user: SessionUser | null | undefined): boolean {
  if (!user) return false
  return ['member', 'customer', 'admin'].includes(user.role)
}
