import type { Metadata } from 'next'
import { auth } from '@/auth'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import { PRODUCTS, formatYuan } from '@/data/products'
import PurchaseButton from './PurchaseButton'

export const metadata: Metadata = {
  title: '创作会员 · Zeno',
  description: '解锁 Zeno 全部内容资产：选题库、AI 提示词包、创作模板——传统行业内容人的系统工具箱。',
}

export default async function PricingPage() {
  const session = await auth()

  return (
    <>
      <PageHero
        label="会员计划"
        title="系统化创作，需要好工具"
        subtitle="选题库、AI 提示词、文章模板、发布清单——给传统行业内容人的完整工具箱。"
      />

      <Container size="content" className="py-12 pb-section">

        {/* 方案卡片 */}
        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto mb-16">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className={`relative border p-6 flex flex-col gap-5 ${
                product.badge
                  ? 'border-stone bg-surface-warm'
                  : 'border-border bg-surface'
              }`}
            >
              {product.badge && (
                <span className="absolute -top-px right-4 bg-stone text-white text-[0.6rem] uppercase tracking-widest font-semibold px-2 py-0.5">
                  {product.badge}
                </span>
              )}

              <div>
                <p className="page-label mb-2">{product.tagline}</p>
                <h2 className="text-xl font-semibold text-ink">{product.name}</h2>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-ink">{formatYuan(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-ink-faint line-through">{formatYuan(product.originalPrice)}</span>
                )}
              </div>

              <ul className="space-y-2 flex-1">
                {product.description.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="mt-0.5 text-stone shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <PurchaseButton
                productId={product.id}
                label={`购买 ${product.name}`}
                isLoggedIn={!!session?.user}
              />
            </div>
          ))}
        </div>

        {/* 常见问题 */}
        <div className="max-w-xl mx-auto border-t border-border pt-10">
          <h3 className="text-base font-semibold text-ink mb-6">常见问题</h3>
          <div className="space-y-6">
            {FAQ.map((item, i) => (
              <div key={i}>
                <p className="text-sm font-medium text-ink mb-1.5">{item.q}</p>
                <p className="text-sm text-ink-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </Container>
    </>
  )
}

const FAQ = [
  {
    q: '支付方式是什么？',
    a: '目前仅支持微信或支付宝扫码手动转账。下单后页面会显示收款码，付款完成后点击"我已付款"提交通知，我会在 24 小时内人工确认并开通权益。',
  },
  {
    q: '开通后权益什么时候生效？',
    a: '人工确认付款后立即生效，通常在 12 小时内。如超过 24 小时未开通，请通过联系页联系我。',
  },
  {
    q: '是否支持退款？',
    a: '开通后 7 天内、且内容资源未大量下载的情况下，可申请退款。请联系我说明原因，协商处理。',
  },
  {
    q: '有什么渠道可以咨询？',
    a: '微信扫描联系页的二维码，或通过联系页发送邮件联系我。',
  },
]
