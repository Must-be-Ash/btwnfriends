'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div className={cn(
      'min-h-screen bg-gray-50',
      // Mobile-first responsive design
      'w-full',
      // Desktop max width
      'lg:max-w-md lg:mx-auto lg:border-x lg:border-gray-200 lg:shadow-sm',
      className
    )}>
      {children}
    </div>
  )
}