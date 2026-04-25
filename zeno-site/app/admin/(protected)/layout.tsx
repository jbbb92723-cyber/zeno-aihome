import { redirect } from 'next/navigation'
import { isAdminUser } from '@/lib/admin'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdmin = await isAdminUser()
  if (!isAdmin) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-[#1C1A17] text-[#E8E2DA]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
