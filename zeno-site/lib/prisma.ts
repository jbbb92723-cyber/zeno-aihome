/**
 * lib/prisma.ts
 *
 * Prisma Client 单例（防止开发模式热重载时重复创建连接）
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
