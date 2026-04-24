/**
 * lib/validations.ts — Zod 校验模式
 */

import { z } from 'zod'

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)/

export const emailSchema = z.string().email('请输入有效的邮箱地址').transform(v => v.trim().toLowerCase())

export const passwordSchema = z
  .string()
  .min(8, '密码至少 8 位')
  .regex(passwordRegex, '密码必须包含字母和数字')

export const codeSchema = z.string().length(6, '验证码为 6 位数字').regex(/^\d{6}$/, '验证码格式不正确')

export const registerSchema = z.object({
  email:    emailSchema,
  password: passwordSchema,
  code:     codeSchema,
})

export const sendCodeSchema = z.object({
  email: emailSchema,
  type:  z.enum(['register', 'reset_password', 'change_password']),
})

export const resetPasswordSchema = z.object({
  email:       emailSchema,
  code:        codeSchema,
  newPassword: passwordSchema,
})

export const changePasswordSchema = z.object({
  code:        codeSchema,
  newPassword: passwordSchema,
})
