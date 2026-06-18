import type React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-q-navy/10 text-q-navy',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-q-yellow/30 text-q-navy',
        danger: 'bg-q-red/10 text-q-red',
        info: 'bg-q-blue/10 text-q-blue',
        orange: 'bg-q-orange/15 text-q-orange',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
