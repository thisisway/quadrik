'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PlayerHome() {
  const router = useRouter()
  useEffect(() => { router.replace('/player/bookings') }, [router])
  return null
}
