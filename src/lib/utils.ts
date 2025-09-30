import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUSDC(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return '0.00'
  return numAmount.toFixed(2)
}

export function formatUSDCWithSymbol(amount: string | number): string {
  return `$${formatUSDC(amount)}`
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
}

export function formatRelativeTime(date: Date): string {
  return formatTimeAgo(date)
}

export function getBlockExplorerUrl(txHash: string): string {
  // Use environment to determine the correct Basescan URL
  const isTestnet = process.env.NODE_ENV === 'development' || 
                   process.env.NEXT_PUBLIC_BASE_RPC_URL?.includes('sepolia') ||
                   process.env.NEXT_PUBLIC_BASE_CHAIN_ID === '84532'
  
  const baseUrl = isTestnet ? 'https://sepolia.basescan.org' : 'https://basescan.org'
  return `${baseUrl}/tx/${txHash}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    const result = document.execCommand('copy')
    document.body.removeChild(textArea)
    return result
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

export function formatAddress(address: string): string {
  if (!address) return ''
  if (address.length <= 20) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0 && num <= 1000000
}

export function isValidUSDCAmount(amount: string): boolean {
  return isValidAmount(amount)
}

export function parseUSDCAmount(amount: string): number {
  const num = parseFloat(amount)
  if (isNaN(num)) return 0
  return num
}

export function truncateText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function generateSecureToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function getDisplayNameFromEmail(email: string): string {
  const parts = email.split('@')
  if (parts.length > 0) {
    const localPart = parts[0]
    // Convert to title case and replace dots/underscores with spaces
    return localPart
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }
  return email
}