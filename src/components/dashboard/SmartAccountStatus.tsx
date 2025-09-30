"use client";

import { useCurrentUser } from '@coinbase/cdp-hooks'
import { useSmartAccount } from '@/hooks/useSmartAccount'

export function SmartAccountStatus() {
  const { currentUser } = useCurrentUser()
  const {
    hasSmartAccount,
    smartAccount,
    network,
    getGasSponsoringStatus,
    paymasterEnabled
  } = useSmartAccount()

  const gasSponsoringStatus = getGasSponsoringStatus()

  if (!currentUser) {
    return null
  }

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#4A4A4A] shadow-2xl">
     
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Wallet Status</h3>
        {hasSmartAccount && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse"></div>
            <span className="text-sm text-[#4CAF50] font-medium">Smart Account Active</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* EOA Address */}
        <div className="flex items-center justify-between">
          <span className="text-[#B8B8B8] text-sm">Owner Wallet</span>
          <div className="flex items-center space-x-2">
            <span className="text-white font-mono text-sm">
              {currentUser.evmAccounts?.[0] ? 
                `${currentUser.evmAccounts[0].slice(0, 6)}...${currentUser.evmAccounts[0].slice(-4)}` : 
                'Not available'
              }
            </span>
            <div className="w-6 h-6 rounded-full bg-[#6B6B6B] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Smart Account Address */}
        {hasSmartAccount && (
          <div className="flex items-center justify-between">
            <span className="text-[#B8B8B8] text-sm">Smart Account</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-mono text-sm">
                {smartAccount ? 
                  `${smartAccount.slice(0, 6)}...${smartAccount.slice(-4)}` : 
                  'Not available'
                }
              </span>
              <div className="w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Network */}
        <div className="flex items-center justify-between">
          <span className="text-[#B8B8B8] text-sm">Network</span>
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm capitalize">{network}</span>
            <div className="w-6 h-6 rounded-full bg-[#5CB0FF] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Gas Sponsoring Status */}
        {hasSmartAccount && (
          <div className={`mt-4 p-3 rounded-xl border ${
            gasSponsoringStatus.available
              ? 'bg-[#2A4A2A] border-[#4A6B4A]'
              : 'bg-[#4A2A2A] border-[#6B3B3B]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  gasSponsoringStatus.available
                    ? 'bg-[#4CAF50]/20'
                    : 'bg-[#F44336]/20'
                }`}>
                  {gasSponsoringStatus.available ? (
                    <svg className="w-4 h-4 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-[#F44336]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className={`font-medium ${
                    gasSponsoringStatus.available ? 'text-[#4CAF50]' : 'text-[#F44336]'
                  }`}>
                    Gas Sponsoring {gasSponsoringStatus.available ? 'Enabled' : 'Unavailable'}
                  </div>
                  <div className="text-sm text-[#B8B8B8]">
                    {gasSponsoringStatus.message}
                  </div>
                </div>
              </div>

              {paymasterEnabled && gasSponsoringStatus.available && (
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5CB0FF]"></div>
                  <span className="text-xs text-[#5CB0FF] font-medium">CDP</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
