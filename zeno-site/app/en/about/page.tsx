import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Zeno',
  description: 'Who I am, what I write about, and why I look beyond renovation.',
}

const sections = [
  {
    title: 'Who I am',
    content:
      "I\u2019m Zeno \u2014 a renovation practitioner based in Nanning, China. I\u2019ve spent over 16 years on job sites, managing projects, reading blueprints, and solving problems that don\u2019t fit neatly into textbooks. I\u2019m not an influencer or a media company. I\u2019m one person building a long-term writing practice.",
  },
  {
    title: 'From renovation sites to broader life questions',
    content:
      "Renovation taught me to see things as they are \u2014 not as they\u2019re marketed. A home is not a showroom. A budget is not a wish list. Over time, I started writing about what I noticed: how people make decisions under pressure, how aesthetics shape daily living, and how long-term thinking applies to more than just buildings. The job site turned out to be a surprisingly good classroom for life.",
  },
  {
    title: 'Why I write beyond renovation',
    content:
      "Because the patterns I see on job sites appear everywhere \u2014 in business, in technology adoption, in how people handle uncertainty. Writing helps me think clearly, and sharing those observations connects me with others who think similarly. I\u2019m not trying to build a content empire. I\u2019m trying to say what I honestly think, and see if it resonates.",
  },
  {
    title: 'What I believe',
    content:
      "Long-term thinking is not patience \u2014 it\u2019s a strategy. Real aesthetics come from restraint, not decoration. AI should serve practitioners, not replace their judgment. Good writing comes from lived experience, not templates. A home should be built for how you actually live, not for how it photographs.",
  },
  {
    title: "What I don\u2019t believe in",
    content:
      "Quick fixes. Viral-first content strategies. Gatekeeping knowledge behind unnecessary paywalls. Pretending AI will solve everything. Treating people as traffic. Motivational slogans disguised as wisdom. Fake case studies. Copying whatever is trending.",
  },
  {
    title: 'Current focus',
    content:
      "Building this site as a long-term writing home. Exploring how AI tools can genuinely help traditional industry professionals. Developing practical tools (prompt utilities, checklists, budget planners). Writing in both Chinese and English to connect with a broader audience. The Chinese site has 50+ in-depth articles; the English section is growing selectively.",
  },
]

export default function EnAboutPage() {
  return (
    <>
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">About</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">About Zeno</h1>
          <p className="text-base text-ink-muted leading-[1.7] mt-4 max-w-2xl">
            Renovation practitioner, writer, and long-term thinker based in China.
          </p>
        </Container>
      </div>

      <Container size="reading" className="py-14 sm:py-16">
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-base font-semibold text-ink mb-3">{s.title}</h2>
              <p className="text-sm text-ink-muted leading-relaxed">{s.content}</p>
            </section>
          ))}

          {/* Contact */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-base font-semibold text-ink mb-3">Contact</h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              For international readers, the best way to reach me is by email.
            </p>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>Email: zenoaihome@qq.com</li>
            </ul>
          </section>

          {/* CTAs */}
          <div className="pt-8 border-t border-border flex flex-wrap gap-3">
            <Link
              href="/en/tools"
              className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
            >
              Explore tools
            </Link>
            <Link
              href="/en/blog"
              className="text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
            >
              Read selected essays
            </Link>
          </div>
        </div>
      </Container>
    </>
  )
}
