import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function OrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/account')
  }
  return <>{children}</>
}
