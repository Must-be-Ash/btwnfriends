/**
 * Simple in-memory rate limiter using sliding window algorithm
 * Tracks requests per user per time window
 */

interface RateLimitEntry {
  timestamps: number[]
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry>
  private windowMs: number
  private maxRequests: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(maxRequests: number, windowMs: number) {
    this.requests = new Map()
    this.maxRequests = maxRequests
    this.windowMs = windowMs

    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Check if a request is allowed for the given key (usually userId)
   * Returns true if allowed, false if rate limit exceeded
   */
  check(key: string): boolean {
    const now = Date.now()
    const entry = this.requests.get(key)

    if (!entry) {
      // First request from this user
      this.requests.set(key, { timestamps: [now] })
      return true
    }

    // Remove timestamps outside the current window
    entry.timestamps = entry.timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    )

    if (entry.timestamps.length < this.maxRequests) {
      // Under the limit, allow request
      entry.timestamps.push(now)
      return true
    }

    // Rate limit exceeded
    return false
  }

  /**
   * Get remaining requests for a key
   */
  remaining(key: string): number {
    const now = Date.now()
    const entry = this.requests.get(key)

    if (!entry) {
      return this.maxRequests
    }

    // Count recent requests within window
    const recentRequests = entry.timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    ).length

    return Math.max(0, this.maxRequests - recentRequests)
  }

  /**
   * Get time until rate limit resets (in milliseconds)
   */
  resetTime(key: string): number {
    const now = Date.now()
    const entry = this.requests.get(key)

    if (!entry || entry.timestamps.length === 0) {
      return 0
    }

    // Find oldest timestamp within window
    const oldestTimestamp = Math.min(...entry.timestamps)
    const resetAt = oldestTimestamp + this.windowMs

    return Math.max(0, resetAt - now)
  }

  /**
   * Remove entries older than the window
   */
  private cleanup(): void {
    const now = Date.now()

    for (const [key, entry] of this.requests.entries()) {
      // Remove timestamps outside window
      entry.timestamps = entry.timestamps.filter(
        timestamp => now - timestamp < this.windowMs
      )

      // Remove entry if no recent timestamps
      if (entry.timestamps.length === 0) {
        this.requests.delete(key)
      }
    }

    console.log(`🧹 Rate limiter cleanup: ${this.requests.size} active users`)
  }

  /**
   * Clear all entries (useful for testing)
   */
  reset(): void {
    this.requests.clear()
  }

  /**
   * Cleanup interval on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// Wallet address lookup rate limiter: 10 requests per hour per user
export const walletLookupLimiter = new RateLimiter(
  10,                  // maxRequests
  60 * 60 * 1000      // windowMs (1 hour)
)

/**
 * Check if a wallet address lookup is allowed for the user
 * Returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkWalletLookupRateLimit(userId: string): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const allowed = walletLookupLimiter.check(userId)
  const remaining = walletLookupLimiter.remaining(userId)
  const resetTime = walletLookupLimiter.resetTime(userId)

  return { allowed, remaining, resetTime }
}
