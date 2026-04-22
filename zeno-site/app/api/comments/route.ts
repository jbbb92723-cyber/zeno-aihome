/**
 * app/api/comments/route.ts
 *
 * 评论 API 路由
 * 第一阶段：占位实现，接收评论但不存入真实数据库
 *
 * TODO（第二阶段）：
 * 1. 安装 Prisma 或 @supabase/supabase-js
 * 2. 取消注释数据库写入代码
 * 3. 配置 DATABASE_URL 环境变量
 * 4. 在 Supabase 管理面板审核评论
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  // ─── 认证检查 ────────────────────────────────────────────────
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json(
      { message: '请先登录后再发表评论。' },
      { status: 401 },
    )
  }

  // ─── 解析请求体 ──────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: '请求格式错误。' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).articleSlug !== 'string' ||
    typeof (body as Record<string, unknown>).content !== 'string'
  ) {
    return NextResponse.json({ message: '缺少必要字段。' }, { status: 400 })
  }

  const { articleSlug, content } = body as { articleSlug: string; content: string }

  // ─── 内容校验 ────────────────────────────────────────────────
  const trimmedContent = content.trim()
  if (!trimmedContent) {
    return NextResponse.json({ message: '评论内容不能为空。' }, { status: 400 })
  }
  if (trimmedContent.length > 2000) {
    return NextResponse.json({ message: '评论内容不能超过 2000 字。' }, { status: 400 })
  }
  if (!articleSlug || articleSlug.length > 200) {
    return NextResponse.json({ message: '无效的文章标识。' }, { status: 400 })
  }

  // ─── 写入数据库（TODO：第二阶段取消注释）────────────────────
  /*
  const { db } = await import('@/lib/db')  // Prisma client

  await db.comment.create({
    data: {
      userId: session.user.id,
      articleSlug,
      content: trimmedContent,
      status: 'pending',  // 默认待审核
    },
  })
  */

  // 第一阶段：只记录日志，不存数据库
  console.log('[Comment API] New comment submitted:', {
    userId: session.user.id,
    articleSlug,
    contentLength: trimmedContent.length,
  })

  return NextResponse.json(
    {
      message: '评论已提交，审核通过后将公开显示。',
      // TODO: 返回真实的 commentId
    },
    { status: 201 },
  )
}

// GET 方法：获取某篇文章的已审核评论
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ message: '缺少 slug 参数。' }, { status: 400 })
  }

  // TODO（第二阶段）：从数据库查询已审核评论
  /*
  const { db } = await import('@/lib/db')
  const comments = await db.comment.findMany({
    where: {
      articleSlug: slug,
      status: 'approved',
    },
    include: {
      user: { select: { displayName: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ comments })
  */

  // 第一阶段：返回空数组
  return NextResponse.json({ comments: [] })
}
