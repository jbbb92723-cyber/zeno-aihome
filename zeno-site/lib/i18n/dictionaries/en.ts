/**
 * lib/i18n/dictionaries/en.ts
 *
 * English UI dictionary
 */

const en = {
  // ── Global ────────────────────────────────
  siteName: 'Zeno',
  siteDescription: 'From renovation sites to real living — on design, human nature, growth, and long-term thinking in the age of AI.',
  locale: 'en',

  // ── Navigation ────────────────────────────
  nav: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    topics: 'Topics',
    resources: 'Resources',
    services: 'Services',
    tools: 'Tools',
    contact: 'Contact',
    login: 'Log in',
    switchLang: '中文',
  },

  // ── Home ──────────────────────────────────
  home: {
    heroLabel: 'Zeno',
    heroTitle: 'From renovation sites\nto real living.',
    heroDesc: "I'm Zeno — 16 years in home renovation, now writing about livable design, human judgment, and building a thoughtful life in the age of AI. Not just how to renovate, but how to think clearly when the stakes are real.",
    ctaBlog: 'Read the blog',
    ctaAbout: 'About me',
    ctaResources: 'Free resources',
    ctaServices: 'Work with me',
    sectionDirections: 'What I write about',
    sectionDirectionsHeading: 'Five threads, all grounded in real experience',
    sectionDirectionsNote: '',
    sectionRecent: 'Recent writing',
    sectionRecentHeading: 'Selected for substance, not traffic',
    sectionRecentNote: '',
    viewAll: 'View all →',
    viewAllArticles: 'View all articles →',
    sectionTopics: 'Deep dives',
    sectionTopicsHeading: 'Ongoing questions, honest answers',
    readMore: 'Read more',
  },

  // ── Blog ──────────────────────────────────
  blog: {
    pageLabel: 'Blog',
    pageTitle: 'Writing',
    pageSubtitle: 'From renovation to real living — on design, human nature, growth, and AI. Prioritized for substance over clicks.',
    allCategories: 'All',
    noArticles: 'No articles in this category yet.',
    readMore: 'Read more',
  },

  // ── Article detail ────────────────────────
  article: {
    breadcrumbHome: 'Home',
    breadcrumbBlog: 'Blog',
    authorName: 'Zeno',
    authorDesc: 'From renovation sites to real living — on design, human nature, growth, and long-term thinking.',
    relatedArticles: 'You might also like',
  },

  // ── Writing areas ─────────────────────────
  writingAreas: [
    { title: 'Livable Renovation', desc: 'Budgets, materials, contractors, and the judgment calls that actually matter when you live in the result.' },
    { title: 'Design & Daily Life', desc: 'Aesthetics that serve real routines — not photo ops, but spaces that let you breathe.' },
    { title: 'Human Nature & Judgment', desc: 'What renovation sites reveal about trust, communication, and how people handle pressure.' },
    { title: 'Growth & Long-Term Thinking', desc: 'Choosing durability over impulse — in renovations, careers, and life decisions.' },
    { title: 'AI for Real-World Practitioners', desc: 'How traditional industry professionals can build content systems, tools, and digital leverage.' },
  ],

  // ── Categories ────────────────────────────
  categories: {
    '居住与装修': 'Livable Renovation',
    '美学与生活': 'Design & Daily Life',
    '人性与判断': 'Human Nature & Judgment',
    '成长与长期主义': 'Growth & Long-Term Thinking',
    'AI 与新生产力': 'AI for Practitioners',
  } as Record<string, string>,

  // ── Footer ────────────────────────────────
  footer: {
    navigate: 'Navigate',
    contact: 'Contact',
    rights: '© {year} Zeno. All rights reserved.',
  },
} as const

export default en
