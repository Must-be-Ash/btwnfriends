/**
 * Production-safe logger that prevents PII exposure in production environments
 *
 * In development: All logs are output normally
 * In production: Only errors are logged, debug/info logs are suppressed
 */

const isProduction = process.env.NODE_ENV === 'production'

export const logger = {
  /**
   * Info-level logs - suppressed in production to prevent PII exposure
   */
  info: (...args: unknown[]) => {
    if (!isProduction) {
      console.log(...args)
    }
  },

  /**
   * Warning-level logs - suppressed in production to prevent PII exposure
   */
  warn: (...args: unknown[]) => {
    if (!isProduction) {
      console.warn(...args)
    }
  },

  /**
   * Error-level logs - always logged as errors need visibility
   * Be cautious not to include PII in error messages
   */
  error: (...args: unknown[]) => {
    console.error(...args)
  },

  /**
   * Debug-level logs - suppressed in production
   */
  debug: (...args: unknown[]) => {
    if (!isProduction) {
      console.log(...args)
    }
  }
}
