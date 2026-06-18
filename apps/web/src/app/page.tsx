'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'

export default function RootPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    router.replace(user ? '/app' : '/login')
  }, [user, isLoading, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-q-navy border-t-transparent" />
    </div>
  )
}
