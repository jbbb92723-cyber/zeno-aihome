import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文章',
  description:
    '从装修出发，写居住、美学、人性、成长与 AI。优先放能代表判断力的文章，不按流量排序。',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
