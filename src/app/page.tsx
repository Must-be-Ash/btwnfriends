import { Suspense } from 'react'
import { MainPage } from '@/components/pages/MainPage'
import { LoadingScreen } from '@/components/shared/LoadingScreen'

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
      <MainPage />
    </Suspense>
  )
}