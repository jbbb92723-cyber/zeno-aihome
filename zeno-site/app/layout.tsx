import type { Metadata } from 'next'
import { Inter, Noto_Sans_SC } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Zeno 赞诺｜Zeno AI Home — 从装修出发，聊居住、美学、人性与长期主义',
    template: '%s · Zeno 赞诺',
  },
  description:
    '我是 Zeno。做过装修，盯过工地，也在持续学习 AI。这里从装修出发，聊居住、美学、人性、成长与 AI 时代的长期主义。',
  keywords: ['装修', '居住', '审美', '长期主义', 'AI', '工地', '人性'],
  authors: [{ name: 'Zeno' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'Zeno 赞诺',
    title: 'Zeno 赞诺 — 从装修出发，聊居住、美学、人性与长期主义',
    description:
      '我是 Zeno。做过装修，盯过工地，也在持续学习 AI。这里从装修出发，聊居住、美学、人性、成长与 AI 时代的长期主义。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno 赞诺 — 从装修出发，聊居住、美学、人性与长期主义',
    description:
      '从装修出发，聊居住、美学、人性、成长与 AI 时代的长期主义。',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSansSC.variable}`}>
      <body className="bg-canvas text-ink font-sans antialiased">
        <Header />
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  )
}
