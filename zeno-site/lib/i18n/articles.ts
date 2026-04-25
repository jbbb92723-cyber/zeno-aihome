/**
 * lib/i18n/articles.ts
 *
 * 双语文章注册表
 *
 * 设计原则：
 * - 原始 data/articles.ts 保持不变（向后兼容，中文站零影响）
 * - 本文件为每篇文章注册英文 slug + 英文内容
 * - getLocalizedArticle(articleId, locale) 返回合并后的本地化文章
 * - 如果英文内容不存在，fallback 到中文摘要 + "English version coming soon"
 */

import { articles, type Article } from '@/data/articles'
import type { Locale } from './config'

// ── 本地化内容类型 ────────────────────────────────────

export interface LocalizedContent {
  slug:      string
  title:     string
  excerpt:   string
  content:   string
  coverAlt?: string
  category:  string
  tags:      string[]
}

export interface ArticleTranslation {
  /** 对应 data/articles.ts 中的 article.id */
  articleId: string
  en: LocalizedContent
}

// ── 英文翻译注册表 ────────────────────────────────────

const translations: ArticleTranslation[] = [
  {
    articleId: '01',
    en: {
      slug: 'why-i-dont-just-teach-renovation',
      title: "Why I Don't Just Teach People How to Renovate",
      excerpt: "After years in renovation, I've become certain: if I only talk about how to fix up a house, I'd be cutting away everything that actually matters. Renovation is the entry point — but judgment, trade-offs, and how you want to live are the real conversation.",
      category: 'Growth & Long-Term Thinking',
      tags: ['renovation', 'content creation', 'personal growth', 'AI', 'long-term thinking'],
      coverAlt: 'Why I Don\'t Just Teach People How to Renovate — cover image',
      content: `I'm not just a renovation guy.

A friend I've known for years recently asked me: "So what exactly do you do now? Renovation? Content? AI?"

I used to answer that question fast. Now I pause. Because any single label leaves out the part that matters most.

I did come from renovation. In the early years, my work was concrete: running job sites, tracking milestones, cross-referencing drawings, explaining to clients why their budget was overrunning, going back and forth with contractors about whether that 5mm gap needed fixing. Back then I thought renovation was mainly about experience and craftsmanship — whoever was more meticulous and steady would win. It took me a while to realize that the technical problems were actually the easiest to solve. The hard part was always people: judgment, trade-offs, relationships.

One case stuck with me. A couple preparing for their wedding. During the design review, both said "whatever works." Then on the day of the electrical walkthrough, they blew up — one wanted an open kitchen, the other insisted on enclosed; one thought a breakfast bar added warmth, the other worried about grease and maintenance. What they were really arguing about wasn't *how to renovate*. It was *how they wanted to live*.

That was the first time I clearly understood: renovation looks like spatial transformation on the surface. Underneath, it's a negotiation about life philosophy.

Another time, a client came with a stack of reference photos: beautiful lighting, textures, proportions — everything looked "premium." But after a few questions, I learned: elderly parents living full-time, two preschool children, frequent cooking, regular work-from-home. That look could absolutely be built. But three months after moving in, real life would tear it apart. Aesthetics isn't about copying something beautiful into your home. It's about making daily life smoother and more spacious.

The longer I've done this, the more certain I am: if I only do "teach people renovation," I'd be cutting away the things that actually matter. When clients come to me, they ask about budgets, layouts, materials. But what they're really anxious about is something else: *Am I being led around by information? How do I judge who's trustworthy? Am I making decisions for my life, or for appearances?* These questions can't be answered by renovation tips alone.

So I started writing. The early stuff was rough. Friends advised me: "Just focus on construction details — that's where the traffic is." They weren't wrong. But I knew I wanted to write about more than that. I wanted to translate what I saw on job sites — the human dynamics, the collaboration, the accountability, the real cost of decisions — into something more universal. I wanted to pull aesthetics back from "looks good" to "right for you." And I wanted to address things that seem unrelated to renovation but are connected to every decision we make: long-term thinking, attention, practical judgment.

These past two years, I've been seriously learning AI. Not because it's trending, and not because I want to "pivot to tech." I realized it could help me organize experience more systematically. Before, after a client conversation, notes were scattered across WeChat, voice memos, paper, and memory. Now I structure them into organized notes and use AI to compare versions, generate risk checklists, and track follow-ups. Before, writing an article meant digging through dozens of fragments. Now I can connect the threads faster and keep what's truly worth sharing.

But I'm also increasingly clear that AI can't solve the core part. It won't stand on-site and take responsibility for you. It won't judge what a family should prioritize right now. It won't make the hard call in a conflict. Tools can improve efficiency. They can't replace values.

This is how I position myself now: starting from renovation, but not staying there. Writing about spaces and people. About methods and their costs. About what to do today and how to walk the long road.

If you came here just looking for a "how to avoid renovation mistakes" checklist, I'll give you that too. But if you're willing to go one step further — to see *why I judge the way I do* — we might build something longer-lasting. I'll keep putting practical templates and checklists in the resource library. Take what works at your own pace.`,
    },
  },
  {
    articleId: '02',
    en: {
      slug: 'your-home-is-not-a-showroom',
      title: 'Your Home Is Not a Showroom',
      excerpt: "Showroom aesthetics satisfy instantly — you see a photo and think 'I could have this too.' But real life doesn't follow camera angles. The real beauty of a home often comes from 'I don't have to fight my environment here.'",
      category: 'Livable Renovation',
      tags: ['living', 'aesthetics', 'renovation', 'livable design', 'real home'],
      coverAlt: 'Your Home Is Not a Showroom — cover image',
      content: `In my years doing renovation, I've heard many versions of "the ideal home": clean, premium, Instagram-ready, impressive to guests.

I understand all of these desires. I even share some of them. The problem is when people confuse "looking like a home" with "feeling like a home."

A client once showed me over twenty reference photos. Almost every one was stunning: airy living rooms, unified color palettes, virtually no sign of daily life. She said she wanted her home to "always look like this." I didn't push back immediately. I just asked a few questions about her daily routine: What time do you get home on weekdays? Who cooks? Where do the kids do homework on weekends? Do your parents stay over? She paused. She hadn't really thought about any of it. We ended up scrapping the plan and starting over — fewer "photo-worthy" features, more "effortless to use" details. Six months later she sent me a message: "The house finally feels like we're *living* in it, not visiting."

The showroom mindset is seductive because it delivers satisfaction immediately. You see an image and instantly imagine yourself in it. Your next decision tilts toward visual impact over long-term experience.

But real life doesn't cooperate with camera angles. The dishes that didn't get washed after dinner, the textbooks spread across the table, the package sitting by the front door, the relatives who drop by unannounced on a weekend — these aren't signs of chaos. This is what a home actually looks like.

When I design now, I keep reminding myself and my clients: answer "how will you live" before answering "how should it look."

Layout isn't about drawing beautiful floor plans — it's about whether your most-walked daily paths flow naturally. Storage isn't about maximizing cabinet space — it's about whether the retrieval frequency matches the placement. Materials aren't about expense — it's about whether you're willing to maintain them long-term. Lighting isn't just about brightness — it's about whether different times of day can help you decompress.

Aesthetics absolutely matters. I've never argued against it. In fact, I increasingly believe aesthetics deserves to be taken seriously. But aesthetics shouldn't stop at "does this match a style." It should serve your daily rhythms, even your emotional state. The real beauty of a space often comes from "I don't have to try hard here" — not from "visitors think it's impressive."

Job sites taught me this truth early. No matter how perfect the drawings, what determines success during construction and daily use is always people.

Some people skip critical checkpoints to save hassle, then pay more in rework. Some force complex finishes for appearances, then buckle under the maintenance burden. Others invest in one more round of discussion upfront and end up saving themselves months of conflict.

What renovation ultimately tests isn't who shops better — it's who's more willing to face reality.

These past two years I've been bringing AI into my workflow — helping organize household requirements, compare design options, generate delivery checklists. It helps us see more comprehensively and miss less. But it can't replace on-site judgment, and it certainly can't answer "what kind of life do you actually want to live." Only you can answer that.

So "your home is not a showroom" isn't a counter-trend slogan. It's a practical reminder: don't sacrifice living for display. Don't sacrifice long-term use for short-term gratification.

Starting from renovation, what we ultimately return to is living itself — the state of the people inside, the quality of relationships within those walls.

If you're making choices right now, try replacing "how do I want this home to look" with "how do I want us to live in this home." The answer takes longer to arrive, but it's usually closer to what you actually want.`,
    },
  },
  {
    articleId: '05',
    en: {
      slug: 'long-term-thinking-is-not-endurance',
      title: "Long-Term Thinking Isn't About Endurance",
      excerpt: "When most people hear 'long-term thinking,' they picture grinding it out. But real long-term thinking isn't endurance — it's design. Making today's choices in ways that don't mortgage tomorrow.",
      category: 'Growth & Long-Term Thinking',
      tags: ['long-term thinking', 'growth', 'judgment', 'aesthetics', 'pace'],
      coverAlt: "Long-Term Thinking Isn't About Endurance — cover image",
      content: `When most people hear "long-term thinking," the first image that comes to mind is grinding it out. As if gritting your teeth, suppressing your feelings, and delaying gratification is what makes it long-term.

I used to think this way too. Then I took a few hits — on job sites and in life — and gradually understood: real long-term thinking isn't endurance. It's design.

In renovation, there's a common trap: cutting corners on critical steps to save money now, telling yourself "it should be fine" or "we'll fix it later."

Skip one layer of waterproofing because "it's probably okay." Lazy routing on electrical because "we can always redo it." Choose materials based only on unit price, ignoring maintenance cycles and replacement costs.

Every one of these decisions looks "smart" in the moment. But give it time, and the rework, internal friction, and relationship damage show up together. This taught me that short-term vs. long-term isn't about time. It's about cost structure.

The same logic applies to personal growth.

We're constantly hijacked by immediate feedback: a trending topic, a viral post, a quick win. Each one whispers "grab it now." The problem is, if you keep spending attention, credibility, and energy the same way, what's left is just exhaustion.

Long-term thinking doesn't ask you to give up the present. It asks you to make fewer choices in the present that damage your future.

I now judge whether something is worth doing with three questions:

First — is this building a reusable capability?

Second — will it damage my most important relationships or my rhythm?

Third — looking back in three months, will I be grateful I did this today?

If I can't answer two of the three, I usually don't rush in.

Aesthetics is part of long-term thinking too.

Many people think aesthetics means expensive or trendy. To me, it's more like a capacity for order: can you arrange your space, time, and attention in a way that's more comfortable and stable?

A truly aesthetic home isn't one where every corner is curated. It's one where the people living in it don't have to constantly fight their environment. A truly aesthetic person isn't perpetually productive. They know when to push and when to slow down.

Client relationships confirmed this for me. In the short term, extravagant promises can win trust fast. Over the long term, only honest communication, on-schedule delivery, and willingness to own mistakes keep the relationship growing.

Human nature isn't complicated. What people ultimately remember isn't how many impressive things you said — it's whether you followed through when it mattered.

I'm learning AI seriously for the same reason. Not to chase novelty, but to reduce repetitive labor and give more time back to judgment and creation. I use AI as leverage, not as a crutch. What compounds over the long run is always your cognitive framework, your work habits, and your credibility.

Looking back at the most effective changes I've made in recent years, none came from a sudden epiphany. Most came from getting small actions right, over and over: writing clear notes, making specific commitments, completing honest reviews, keeping attention on what truly matters.

So if you ask me what long-term thinking really is, my answer is plain:

It's not suffering. Not delayed gratification. Not motivational speeches.

It's making today's choices in a way that doesn't bankrupt tomorrow.

From renovation to writing, from job sites to AI, this is what I keep verifying.

If you're looking for your own long-term rhythm, start with one small action: write down what you're most anxious about right now, then write down the one step that would help you most in three months. Do that step first.`,
    },
  },  {
    articleId: '04',
    en: {
      slug: 'why-i-started-taking-ai-seriously',
      title: 'Why I Started Taking AI Seriously',
      excerpt: "I was skeptical of AI at first. What changed my mind wasn't the hype — it was the pain of spending most of my time on moving and repeating information instead of thinking and creating.",
      category: 'AI for Practitioners',
      tags: ['AI', 'workflow', 'efficiency', 'traditional industry', 'tools'],
      coverAlt: 'Why I Started Taking AI Seriously — cover image',
      content: `When I first encountered AI, I was skeptical.

Every day my feed was filled with "this tool just disrupted everything" — after a while, the fatigue sets in. I don't come from a tech background. I've never believed in the "one prompt solves all" narrative. For me, any tool has to answer one question: does it actually help me do my real work better?

What got me to take AI seriously wasn't the hype. It was the pain.

During that period I was juggling renovation consultations, project reviews, and content writing. Information was scattered everywhere: client chats on one platform, site notes in a notebook, random ideas in voice memos, article outlines in yet another doc. Every day felt busy, but most of the time went to moving and repeating things — not to judgment and creation.

I took some wrong turns first.

Early on, I bookmarked dozens of "magic prompts." They looked impressive but rarely fit my situation. They could produce complete sentences, but nothing sounded like me. They could generate advice, but nothing matched my context. Eventually I realized the problem wasn't the tool — it was that I was treating it as an answer machine instead of a thinking partner.

The turning point came when I started breaking my workflow apart.

I split a complete task into stages: information gathering, structural organization, risk identification, expression and output, review and retention. Then I brought AI into only the stages where it actually helped.

After a client consultation, I'd write my own core assessment first, then ask AI to run a "missed items check." When writing an article, I'd lock down the perspective and experience first, then use AI to sharpen the structure and readability. After a project wrapped, I'd feed the records into the system and generate a "reusable next time" checklist.

The efficiency gains were secondary. What mattered more was that my thinking became steadier.

People often ask me what the biggest change from learning AI has been.

It's not "faster." It's "clearer."

I used to carry a lot of experience in my head, but it was scattered. Now I can more easily turn experience into method, and method into reusable assets. For someone who came from job sites and fieldwork, this matters especially. We're naturally practice-oriented, but without systematization, experience struggles to compound.

Of course, the boundaries have to be clear too.

AI won't go on-site for you. It won't bear the consequences of a bad call. It won't build trust with an anxious client on your behalf. It's good at processing information, not at holding relationships. Good at generating options, not at making value judgments.

So my stance on AI is simple: use it when it helps, don't worship it. Let it boost efficiency, but never outsource your thinking.

When I say "taking AI seriously," what I really mean is taking my own growth seriously. In traditional industries, we've always lived on experience — and we always will. But the way we organize experience is changing. Whoever can structure their knowledge, clarify their expression, and systematize their tools will have more agency.

This isn't career-change anxiety. It's not tech worship. It's a long-term professional discipline.

Starting from renovation, I saw spaces and people. Looking further ahead, I see systems and eras. AI isn't a destination for me — it's a new tool on a longer road. What stays constant is the through line: in a complex reality, make choices that are as clear-eyed, responsible, and durably effective as possible.

If you're in a traditional industry and want to put AI to practical use, start with one small workflow. You don't need to go big all at once. I'll keep sharing the workflow templates I've tested in the resource library — take what works and adapt it to your own rhythm.`,
    },
  },
]

// ── 查询方法 ────────────────────────────────────────────

/** 根据 id + locale 获取本地化文章 */
export function getLocalizedArticle(
  articleId: string,
  locale: Locale,
): (Article & { localizedSlug: string }) | null {
  const original = articles.find((a) => a.id === articleId)
  if (!original) return null

  if (locale === 'zh') {
    return { ...original, localizedSlug: original.slug }
  }

  const t = translations.find((t) => t.articleId === articleId)
  if (!t) {
    // Fallback: 返回中文内容 + 提示
    return {
      ...original,
      localizedSlug: original.slug,
      excerpt: original.excerpt + '\n\n*English version coming soon.*',
      content: '*This article is not yet available in English. Below is the original Chinese version.*\n\n' + original.content,
    }
  }

  return {
    ...original,
    localizedSlug: t.en.slug,
    title:     t.en.title,
    excerpt:   t.en.excerpt,
    content:   t.en.content,
    category:  t.en.category,
    tags:      t.en.tags,
    coverAlt:  t.en.coverAlt ?? original.coverAlt,
  }
}

/** 获取某语言下所有可展示的文章（按日期降序） */
export function getLocalizedArticles(locale: Locale): (Article & { localizedSlug: string })[] {
  if (locale === 'en') {
    // English: only show articles that have a real English translation
    return translations
      .map((t) => getLocalizedArticle(t.articleId, 'en'))
      .filter((a): a is NonNullable<typeof a> => a !== null)
      .sort((a, b) => b.date.localeCompare(a.date))
  }
  return articles
    .map((a) => getLocalizedArticle(a.id, locale))
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** 根据本地化 slug 查找文章（英文用英文 slug，中文用中文 slug） */
export function getArticleByLocalizedSlug(
  slug: string,
  locale: Locale,
): (Article & { localizedSlug: string }) | null {
  if (locale === 'zh') {
    const original = articles.find((a) => a.slug === slug)
    return original ? { ...original, localizedSlug: original.slug } : null
  }

  // 先在翻译表中找英文 slug
  const t = translations.find((t) => t.en.slug === slug)
  if (t) return getLocalizedArticle(t.articleId, 'en')

  // 兜底：尝试用原始 slug 匹配
  const original = articles.find((a) => a.slug === slug)
  if (original) return getLocalizedArticle(original.id, 'en')

  return null
}

/** 获取最近 N 篇本地化文章 */
export function getRecentLocalizedArticles(locale: Locale, count = 3) {
  return getLocalizedArticles(locale).slice(0, count)
}

/** 获取本地化分类列表 */
export function getLocalizedCategories(locale: Locale): string[] {
  const allArticles = getLocalizedArticles(locale)
  return Array.from(new Set(allArticles.map((a) => a.category)))
}

/** 获取对应语言的 slug（用于 hreflang 互链） */
export function getAlternateSlug(articleId: string, locale: Locale): string | null {
  const original = articles.find((a) => a.id === articleId)
  if (!original) return null

  if (locale === 'en') {
    const t = translations.find((t) => t.articleId === articleId)
    return t ? t.en.slug : null
  }

  return original.slug
}

/** 查看某篇文章是否有英文翻译 */
export function hasEnglishTranslation(articleId: string): boolean {
  return translations.some((t) => t.articleId === articleId)
}
