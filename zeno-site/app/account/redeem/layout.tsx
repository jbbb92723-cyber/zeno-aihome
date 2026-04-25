import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '兑换码',
  robots: { index: false },
}

export default async function RedeemLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/account/redeem')
  }
  return <>{children}</>
}
