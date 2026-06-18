import { useState, useCallback } from 'react'

export type ToastVariant = 'default' | 'success' | 'error'

export interface Toast {
  id: string
  title: string
  description?: string | undefined
  variant?: ToastVariant | undefined
}

let externalSetToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null

export function registerToastSetter(setter: React.Dispatch<React.SetStateAction<Toast[]>>) {
  externalSetToasts = setter
}

export function toast(title: string, opts?: { description?: string; variant?: ToastVariant }) {
  if (!externalSetToasts) return
  const id = Math.random().toString(36).slice(2)
  externalSetToasts((prev) => [...prev, { id, title, ...opts }])
  setTimeout(() => {
    externalSetToasts?.((prev) => prev.filter((t) => t.id !== id))
  }, 4000)
}

export function useToastState() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const register = useCallback(() => {
    registerToastSetter(setToasts)
  }, [])
  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])
  return { toasts, register, dismiss }
}
