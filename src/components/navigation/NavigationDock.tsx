"use client";

import { Dock } from '@/components/ui/dock-two'
import { Home, Send, QrCode, History } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function NavigationDock() {
  const router = useRouter()

  const navigationItems = [
    {
      icon: Home,
      label: "Dashboard",
      onClick: () => router.push('/')
    },
    {
      icon: Send,
      label: "Send Money",
      onClick: () => router.push('/send')
    },
    {
      icon: QrCode,
      label: "Receive",
      onClick: () => router.push('/receive')
    },
    {
      icon: History,
      label: "History",
      onClick: () => router.push('/history')
    }
  ]

  return <Dock items={navigationItems} />
}