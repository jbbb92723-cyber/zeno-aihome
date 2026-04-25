/**
 * lib/rateLimit.ts
 *
 * 轻量级滑动窗口限速器（模块级内存存储）
 *
 * 局限性：仅在同一 serverless 实例内生效，cold start 后重置。
 * 对于 MVP 阶段已足够——大量攻击通常在同一暖实例内完成。
 * 生产中如需跨实例，可改为 Upstash Redis。
 */

interface WindowEntry {
  timestamps: number[]
}

// 全局 Map（模块级单例，同一实例内复用）
const store = new Map<string, WindowEntry>()

/**
 * 滑动窗口计数器
 * @param key       唯一标识，如 "send-code:1.2.3.4"
 * @param limit     窗口内最大请求数
 * @param windowMs  窗口大小（毫秒）
 * @returns { allowed, count, remaining }
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; count: number; remaining: number } {
  const now = Date.now()
  const entry = store.get(key) ?? { timestamps: [] }

  // 过滤窗口外的时间戳
  entry.timestamps = entry.timestamps.filter((t) => t > now - windowMs)
  entry.timestamps.push(now)
  store.set(key, entry)

  const count = entry.timestamps.length
  return {
    allowed:   count <= limit,
    count,
    remaining: Math.max(0, limit - count),
  }
}

/**
 * 获取 Next.js App Router Request 的客户端 IP
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}
