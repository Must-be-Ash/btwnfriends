"use client";

import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { getStorageItem, setStorageItem } from '@/lib/storage'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return
      }
      
      // Check for iOS standalone mode
      if ((window.navigator as unknown as { standalone?: boolean }).standalone === true) {
        setIsInstalled(true)
        return
      }

      // Check storage to see if user previously dismissed
      const dismissed = getStorageItem('pwa-install-dismissed')
      if (dismissed) {
        const dismissedDate = new Date(dismissed)
        const now = new Date()
        const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 3600 * 24)
        
        // Show again after 7 days
        if (daysSinceDismissed < 7) {
          return
        }
      }
    }

    checkInstalled()

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay to avoid being too aggressive
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true)
        }
      }, 5000)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support the install prompt
      showManualInstallInstructions()
      return
    }

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setShowPrompt(false)
      } else {
        console.log('User dismissed the install prompt')
        handleDismiss()
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error showing install prompt:', error)
      showManualInstallInstructions()
    }
  }

  const showManualInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    
    let instructions = ''
    if (isIOS) {
      instructions = 'Tap the Share button and select "Add to Home Screen"'
    } else if (isAndroid) {
      instructions = 'Tap the menu button and select "Add to Home Screen" or "Install App"'
    } else {
      instructions = 'Look for the install button in your browser\'s address bar'
    }

    alert(`To install Between Friends:\n\n${instructions}`)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setStorageItem('pwa-install-dismissed', new Date().toISOString())
  }

  // Don't show if already installed or if prompt shouldn't be shown
  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-[#2A2A2A] border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">
              Install Between Friends
            </h3>
            <p className="text-white/70 text-xs mb-3 leading-relaxed">
              Get instant access and work offline. Install our app for the best experience.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Download className="w-3 h-3" />
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/50 hover:text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}