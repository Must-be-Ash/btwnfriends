/**
 * Safe localStorage wrapper that handles mobile browser limitations
 * Provides fallbacks for when localStorage is not available (private browsing, mobile issues, etc.)
 */

// In-memory fallback storage for when localStorage is not available
let memoryStorage: { [key: string]: string } = {}

/**
 * Safely check if localStorage is available
 * This can fail in private browsing mode or mobile browsers
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__'
    if (typeof window === 'undefined') return false

    localStorage.setItem(test, 'test')
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Safely check if sessionStorage is available
 * This can fail in private browsing mode or mobile browsers
 */
function isSessionStorageAvailable(): boolean {
  try {
    const test = '__sessionStorage_test__'
    if (typeof window === 'undefined') return false

    window.sessionStorage.setItem(test, 'test')
    window.sessionStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Safely get an item from storage
 * Falls back to sessionStorage, then memory storage if localStorage is not available
 */
export function getStorageItem(key: string): string | null {
  try {
    if (isLocalStorageAvailable()) {
      return localStorage.getItem(key)
    } else if (isSessionStorageAvailable()) {
      return window.sessionStorage.getItem(key)
    } else {
      // Fallback to memory storage
      return memoryStorage[key] || null
    }
  } catch (error) {
    console.warn(`Failed to get storage item ${key}:`, error)
    return memoryStorage[key] || null
  }
}

/**
 * Safely set an item in storage
 * Falls back to sessionStorage, then memory storage if localStorage is not available
 */
export function setStorageItem(key: string, value: string): void {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, value)
      // Also store in memory as backup
      memoryStorage[key] = value
    } else if (isSessionStorageAvailable()) {
      window.sessionStorage.setItem(key, value)
      // Also store in memory as backup
      memoryStorage[key] = value
    } else {
      // Use memory storage only
      memoryStorage[key] = value
    }
  } catch (error) {
    console.warn(`Failed to set storage item ${key}:`, error)
    // Always try memory storage as last resort
    memoryStorage[key] = value
  }
}

/**
 * Safely remove an item from storage
 */
export function removeStorageItem(key: string): void {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(key)
    }
    if (isSessionStorageAvailable()) {
      window.sessionStorage.removeItem(key)
    }
    // Always remove from memory storage too
    delete memoryStorage[key]
  } catch (error) {
    console.warn(`Failed to remove storage item ${key}:`, error)
    delete memoryStorage[key]
  }
}

/**
 * Clear all storage (localStorage, sessionStorage, and memory fallback)
 */
export function clearStorage(): void {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.clear()
    }
    if (isSessionStorageAvailable()) {
      window.sessionStorage.clear()
    }
    memoryStorage = {}
  } catch (error) {
    console.warn('Failed to clear storage:', error)
    memoryStorage = {}
  }
}