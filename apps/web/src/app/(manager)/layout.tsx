'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { Sidebar } from '@/components/layout/sidebar'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace('/login')
      return
    }
    // Redirect to setup if user has no club, unless already on setup
    if (!user.clubId && pathname !== '/app/setup') {
      router.replace('/app/setup')
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-q-navy border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  // Setup page renders its own full-screen layout
  if (pathname === '/app/setup') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-sand">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-60 transform transition-transform duration-200
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-q-navy hover:bg-sand transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-grad-sun">
              <div className="h-3 w-3 rounded-full border-[2.5px] border-white" />
            </div>
            <span className="font-black text-q-navy">Quadrik</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
