import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy placeholder:text-gray-400',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-q-blue focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-q-red focus:ring-q-red',
        className,
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-q-red">{error}</p>}
  </div>
))
Input.displayName = 'Input'

export { Input }
