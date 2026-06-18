'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { cn } from '@/lib/utils'

const nav = [
  {
    label: 'Reservas',
    href: '/player/bookings',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Quadras',
    href: '/player/courts',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    label: 'Perfil',
    href: '/player/profile',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return
    if (!user) { router.replace('/login'); return }
    // Staff should use the manager portal
    if (user.role && user.role !== 'PLAYER') { router.replace('/app'); return }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-q-navy border-t-transparent" />
      </div>
    )
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-grad-sun shadow-sm">
              <div className="h-3.5 w-3.5 rounded-full border-[2.5px] border-white" />
            </div>
            <span className="font-black text-q-navy">Quadrik</span>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <Link
              href="/player/profile"
              className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grad-sun text-xs font-black text-white">
                {initials}
              </div>
              <span className="hidden text-sm font-medium text-q-navy sm:block">{user.name.split(' ')[0]}</span>
            </Link>
            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-gray hover:bg-sand hover:text-q-navy transition-colors"
              title="Sair"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">{children}</main>

      {/* Bottom nav (mobile-first) */}
      <nav className="sticky bottom-0 z-20 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl">
          {nav.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                  isActive ? 'text-q-navy' : 'text-gray hover:text-q-navy',
                )}
              >
                <span className={cn('transition-colors', isActive ? 'text-q-red' : 'text-gray-400')}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
