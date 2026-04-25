/**
 * lib/i18n/getDictionary.ts
 *
 * 统一字典加载入口
 */

import type { Locale } from './config'
import zh from './dictionaries/zh'
import en from './dictionaries/en'

/** Dictionary shape based on zh (canonical), en must be structurally compatible */
export type Dictionary = typeof zh

const dictionaries: Record<Locale, typeof zh | typeof en> = { zh, en }

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.zh
}
