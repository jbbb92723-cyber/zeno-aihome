/**
 * lib/track.ts
 *
 * 行为事件追踪工具
 *
 * 服务端调用：直接写数据库
 * 客户端调用：POST /api/track
 *
 * 事件类型：
 *   page_view | login | signup | claim_resource | click_service
 *   visit_membership | click_md2wechat | visit_publish
 *   create_order | use_coupon | redeem_code | checkin
 */

export type TrackEventType =
  | 'page_view'
  | 'login'
  | 'signup'
  | 'claim_resource'
  | 'click_service'
  | 'visit_membership'
  | 'click_md2wechat'
  | 'visit_publish'
  | 'create_order'
  | 'use_coupon'
  | 'redeem_code'
  | 'checkin'
  | (string & {})

export interface TrackEventOptions {
  userId?:   string
  path?:     string
  referrer?: string
  metadata?: Record<string, unknown>
}

// ─── 服务端直写（在 Server Actions / API Routes 中使用）─────
export async function trackEventServer(
  event: TrackEventType,
  options: TrackEventOptions = {}
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta: any = options.metadata ?? undefined
    await prisma.analyticsEvent.create({
      data: {
        event,
        userId:   options.userId   ?? null,
        path:     options.path     ?? null,
        referrer: options.referrer ?? null,
        metadata: meta,
      },
    })
  } catch {
    // 追踪失败不影响主流程
  }
}

// ─── 客户端调用（在 Client Components 中使用）────────────────
export function trackEvent(
  event: TrackEventType,
  options: TrackEventOptions = {}
) {
  if (typeof window === 'undefined') return

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      path:     options.path     ?? window.location.pathname,
      referrer: options.referrer ?? document.referrer,
      metadata: options.metadata,
    }),
    keepalive: true, // 保证页面切换时请求仍能发出
  }).catch(() => {})
}
