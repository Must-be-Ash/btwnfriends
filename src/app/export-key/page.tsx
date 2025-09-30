"use client";

// Force dynamic rendering for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsSignedIn, useCurrentUser, useExportEvmAccount } from '@coinbase/cdp-hooks'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { NavigationDock } from '@/components/navigation/NavigationDock'
import { ArrowLeft, AlertTriangle, Copy, CheckCircle } from 'lucide-react'

export default function ExportKeyPage() {
  const router = useRouter()
  const { isSignedIn } = useIsSignedIn()
  const { currentUser } = useCurrentUser()
  const { exportEvmAccount } = useExportEvmAccount()

  const [step, setStep] = useState<'warning' | 'exporting' | 'exported'>('warning')
  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the EOA address (not smart account)
  const eoaAddress = currentUser?.evmAccounts?.[0]

  // Redirect if not signed in (use useEffect to avoid SSR issues)
  useEffect(() => {
    if (isSignedIn === false) {
      router.push('/')
    }
  }, [isSignedIn, router])

  // Show loading states
  if (isSignedIn === false) {
    return <LoadingScreen message="Redirecting..." />
  }

  if (!currentUser || !eoaAddress) {
    return <LoadingScreen message="Loading wallet..." />
  }

  const handleConfirmExport = useCallback(async () => {
    if (!eoaAddress) return

    setStep('exporting')
    setError(null)

    try {
      const { privateKey: exportedKey } = await exportEvmAccount({
        evmAccount: eoaAddress
      })

      // Convert to hex string if it's binary data
      let formattedKey = exportedKey
      if (typeof exportedKey === 'string' && exportedKey.length === 32) {
        // If it's a 32-byte string, convert to hex
        const bytes = new Uint8Array(exportedKey.split('').map(c => c.charCodeAt(0)))
        formattedKey = '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
      }

      setPrivateKey(formattedKey)
      setStep('exported')
    } catch (err) {
      console.error('Failed to export private key:', err)
      setError(err instanceof Error ? err.message : 'Failed to export private key')
      setStep('warning')
    }
  }, [eoaAddress, exportEvmAccount])

  const handleCopyKey = useCallback(async () => {
    if (!privateKey) return

    try {
      await navigator.clipboard.writeText(privateKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }, [privateKey])

  const handleDone = useCallback(() => {
    // Clear private key from state
    setPrivateKey(null)
    router.push('/')
  }, [router])

  if (step === 'exporting') {
    return <LoadingScreen message="Exporting private key..." />
  }

  if (step === 'exported' && privateKey) {
    return (
      <div className="min-h-screen bg-[#222222]">
        {/* Main Content with glassmorphism container */}
        <div className="px-4 pt-10 pb-6">
          <div className="max-w-md mx-auto md:backdrop-blur-xl md:bg-[#4A4A4A]/30 md:border md:border-white/20 md:rounded-3xl md:p-6 md:shadow-2xl space-y-6">

            {/* Back Button */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div></div>
            </div>

            {/* Content Card */}
            <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
              <h1 className="text-2xl font-bold text-white mb-2">Your Private Key</h1>
              <p className="text-gray-400 text-sm mb-6">Keep this secure and never share it</p>

              <div className="mb-6">
                <div className="relative">
                  <textarea
                    value={privateKey}
                    readOnly
                    className="w-full h-32 bg-[#1A1A1A] border border-[#4A4A4A] rounded-xl p-4 pr-14 text-white font-mono text-xs resize-none focus:outline-none break-all whitespace-pre-wrap"
                    spellCheck={false}
                  />
                  <button
                    onClick={handleCopyKey}
                    className="absolute top-3 right-3 p-2 bg-[#3B3B3B] hover:bg-[#4A4A4A] rounded-lg transition-colors"
                    aria-label="Copy private key"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-white/70" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-green-500 text-sm mt-2">Copied to clipboard</p>
                )}
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-gray-300 text-sm">
                  Anyone with this key has complete control of your wallet. Store it securely and clear your clipboard.
                </p>
              </div>

              <button
                onClick={handleDone}
                className="w-full py-4 px-6 bg-[#5CB0FF] text-white rounded-xl font-semibold hover:bg-[#4A9DE8] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Dock */}
        <NavigationDock />

        {/* Bottom spacing for mobile navigation */}
        <div className="h-32 md:h-16"></div>
      </div>
    )
  }

  // Warning step
  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Main Content with glassmorphism container */}
      <div className="px-4 pt-10 pb-6">
        <div className="max-w-md mx-auto md:backdrop-blur-xl md:bg-[#4A4A4A]/30 md:border md:border-white/20 md:rounded-3xl md:p-6 md:shadow-2xl space-y-6">

          {/* Back Button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div></div>
          </div>

          {/* Content Card */}
          <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Export Private Key</h1>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
              <p className="text-gray-300 text-sm mb-4">
                Your private key provides <strong className="text-white">complete control</strong> over your wallet and funds.
              </p>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Never share with anyone</li>
                <li>• Store securely</li>
                <li>• If compromised, transfer funds immediately</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/')}
                className="py-4 px-6 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExport}
                className="py-4 px-6 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dock */}
      <NavigationDock />

      {/* Bottom spacing for mobile navigation */}
      <div className="h-32 md:h-16"></div>
    </div>
  )
}
