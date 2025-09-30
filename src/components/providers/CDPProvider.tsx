"use client";

import { CDPHooksProvider } from '@coinbase/cdp-hooks'
import { CDP_CONFIG } from '@/lib/cdp'

interface CDPProviderProps {
  children: React.ReactNode
}

export function CDPProvider({ children }: CDPProviderProps) {
  return (
    <CDPHooksProvider
      config={CDP_CONFIG}
    >
      {children}
    </CDPHooksProvider>
  )
}