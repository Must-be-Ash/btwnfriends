"use client";

import { useCurrentUser } from '@coinbase/cdp-hooks'
import { getCDPNetworkName, prepareUSDCTransferCall, prepareUSDCApprovalCall, prepareEscrowDepositCall, PAYMASTER_CONFIG } from '@/lib/cdp'

export function useSmartAccount() {
  const { currentUser } = useCurrentUser()

  // Get the smart account address (primary address if smart account exists)
  const smartAccount = currentUser?.evmSmartAccounts?.[0]
  const hasSmartAccount = !!smartAccount

  // Get network name for CDP
  const network = getCDPNetworkName()

  /**
   * Check if gas sponsoring is available
   */
  const isGasSponsoringAvailable = () => {
    return PAYMASTER_CONFIG.enabled || hasSmartAccount
  }

  /**
   * Get gas sponsoring status message
   */
  const getGasSponsoringStatus = () => {
    if (!hasSmartAccount) {
      return { available: false, message: 'Smart account required for gas sponsoring' }
    }
    if (PAYMASTER_CONFIG.enabled) {
      return { available: true, message: 'Gas sponsoring enabled via CDP Paymaster' }
    }
    return { available: true, message: 'Gas sponsoring enabled via CDP default paymaster' }
  }

  /**
   * Handle smart account errors with user-friendly messages
   */
  const getErrorMessage = (error: unknown): string => {
    const errorMsg = (error as Error)?.message || String(error)

    if (errorMsg.includes('insufficient funds')) {
      return 'Insufficient funds for gas fees. Please try gas-sponsored transaction.'
    }
    if (errorMsg.includes('paymaster')) {
      return 'Gas sponsoring temporarily unavailable. Please try again.'
    }
    if (errorMsg.includes('user operation')) {
      return 'Transaction failed. Please check your balance and try again.'
    }
    if (errorMsg.includes('smart account')) {
      return 'Smart account not available. Please refresh and try again.'
    }

    return errorMsg
  }

  return {
    // Smart account info
    smartAccount,
    hasSmartAccount,
    network,

    // Utility methods for call preparation
    prepareUSDCTransferCall,
    prepareUSDCApprovalCall,
    prepareEscrowDepositCall,

    // Gas sponsoring utilities
    isGasSponsoringAvailable,
    getGasSponsoringStatus,
    getErrorMessage,

    // Paymaster config
    paymasterEnabled: PAYMASTER_CONFIG.enabled,
    paymasterUrl: PAYMASTER_CONFIG.url,
  }
}
