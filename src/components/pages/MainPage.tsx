"use client";

import { useIsInitialized, useIsSignedIn } from '@coinbase/cdp-hooks'
import { AuthPage } from '@/components/auth/AuthPage'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { useSessionEnhancer } from '@/lib/session-enhancer'
import { useSessionRestore } from '@/hooks/useSessionRestore'

export function MainPage() {
  const { isInitialized } = useIsInitialized()
  const { isSignedIn } = useIsSignedIn()

  // Enhance session persistence for mobile browsers
  useSessionEnhancer()
  
  // Attempt to restore session on mobile browsers
  const { isRestoring } = useSessionRestore()

  // Show loading while CDP initializes or while restoring session
  if (!isInitialized || isRestoring) {
    return <LoadingScreen message={isRestoring ? "Restoring session..." : "Loading..."} />
  }

  // Show authentication if not signed in
  if (!isSignedIn) {
    return <AuthPage />
  }

  // Show main dashboard for authenticated users
  return <Dashboard />
}