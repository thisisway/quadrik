'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useToastState, type Toast } from '@/hooks/use-toast'

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const icons = {
    success: (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500">
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-q-red">
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    default: (
      <div className="h-5 w-5 shrink-0 rounded-full bg-q-blue/20 flex items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-q-blue" />
      </div>
    ),
  }

  return (
    <div
      className={cn(
        'flex w-80 items-start gap-3 rounded-2xl border bg-white p-4 shadow-lg',
        'animate-in slide-in-from-right-5 fade-in-0 duration-200',
        toast.variant === 'error' && 'border-q-red/20',
        toast.variant === 'success' && 'border-green-200',
        (!toast.variant || toast.variant === 'default') && 'border-gray-200',
      )}
    >
      {icons[toast.variant ?? 'default']}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-q-navy">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-gray">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded p-0.5 text-gray hover:text-q-navy transition-colors"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export function Toaster() {
  const { toasts, register, dismiss } = useToastState()

  useEffect(() => {
    register()
  }, [register])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  )
}
