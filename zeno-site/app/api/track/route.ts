import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const Schema = z.object({
  event:    z.string().min(1).max(64),
  path:     z.string().max(512).nullish(),
  referrer: z.string().max(512).nullish(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 })

    const session = await auth()
    const ua = req.headers.get('user-agent') ?? undefined

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta: any = parsed.data.metadata ?? undefined
    await prisma.analyticsEvent.create({
      data: {
        event:     parsed.data.event,
        userId:    session?.user?.id ?? null,
        path:      parsed.data.path     ?? null,
        referrer:  parsed.data.referrer ?? null,
        metadata:  meta,
        userAgent: ua ?? null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
