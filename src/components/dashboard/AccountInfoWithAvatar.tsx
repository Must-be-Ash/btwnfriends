"use client";

import { truncateText, copyToClipboard } from '@/lib/utils'
import { useState } from 'react'
import { LogOut } from 'lucide-react'

interface UserProfile {
  userId: string
  email: string
  displayName: string
  profileSetupComplete: boolean
  walletAddress?: string
}

interface CDPUser {
  userId: string
  email?: string
}

interface AccountInfoWithAvatarProps {
  user: UserProfile | null
  walletAddress: string
  showLogoutMenu: boolean
  setShowLogoutMenu: (show: boolean) => void
  handleLogout: () => void
  menuRef: React.RefObject<HTMLDivElement>
  currentUser: CDPUser | null
}

export function AccountInfoWithAvatar({ 
  user, 
  walletAddress, 
  showLogoutMenu, 
  setShowLogoutMenu, 
  handleLogout, 
  menuRef,
  currentUser 
}: AccountInfoWithAvatarProps) {
  const [copiedAddress, setCopiedAddress] = useState(false)

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(walletAddress)
    if (success) {
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  return (
    <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Account Info</h3>
        
        {/* User Avatar */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
            aria-label="User menu"
          >
            <span className="text-white font-semibold">
              {(user?.displayName || currentUser?.userId || 'U').charAt(0).toUpperCase()}
            </span>
          </button>

          {/* Logout Menu */}
          {showLogoutMenu && (
            <div className="absolute right-0 top-12 w-48 backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border border-white/30 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.displayName || 'User'}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded-xl mx-1 mt-1"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* User Info */}
        <div>
          <p className="text-sm text-white/70">Display Name</p>
          <p className="font-medium text-white">{user?.displayName || 'Loading...'}</p>
        </div>

        <div>
          <p className="text-sm text-white/70">Email</p>
          <p className="font-medium text-white">{user?.email || 'Loading...'}</p>
        </div>

        {/* Wallet Address */}
        <div>
          <p className="text-sm text-white/70">Wallet Address</p>
          <div className="flex items-center space-x-2">
            <p className="font-mono text-sm text-white">{truncateText(walletAddress, 20)}</p>
            <button
              onClick={handleCopyAddress}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Copy wallet address"
            >
              {copiedAddress ? (
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}