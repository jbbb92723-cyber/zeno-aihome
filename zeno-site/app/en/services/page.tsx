import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Services — Zeno',
  description:
    'Zeno helps clients make clearer renovation decisions and build AI-assisted content systems for traditional industries.',
  alternates: {
    canonical: 'https://zenoaihome.com/en/services',
    languages: {
      'zh-CN': 'https://zenoaihome.com/services',
      en: 'https://zenoaihome.com/en/services',
    },
  },
}

const services = [
  {
    title: 'Renovation Budget Review',
    desc: 'A line-by-line review of your renovation budget to identify hidden risks, inflated items, and missing contingencies.',
  },
  {
    title: 'Quotation Review',
    desc: 'Compare contractor quotes against industry benchmarks. Spot scope gaps, vague line items, and payment structure issues.',
  },
  {
    title: 'Real-Life Renovation Consulting',
    desc: 'One-on-one sessions focused on practical decisions: layout trade-offs, material selection, contractor communication, and timeline planning.',
  },
  {
    title: 'AI Content System Consulting',
    desc: 'Help traditional industry practitioners build structured content workflows using AI — from experience capture to publishing.',
  },
]

export default function EnServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        title="Services"
        subtitle="Zeno helps clients make clearer renovation decisions and build AI-assisted content systems for traditional industries."
      />

      <Container size="content" className="py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="border border-border p-6 hover:border-stone/40 transition-colors"
            >
              <h3 className="text-[0.9375rem] font-semibold text-ink mb-2">{s.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors"
          >
            Contact Zeno
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-stone border border-stone/30 px-5 py-2.5 hover:bg-stone-pale/50 transition-colors"
          >
            View Chinese Services →
          </Link>
        </div>
      </Container>
    </>
  )
}
