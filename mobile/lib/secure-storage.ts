import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  WALLET_ADDRESS: 'wallet_address',
  USER_PREFERENCES: 'user_preferences',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  SESSION_DATA: 'session_data',
} as const;

const SECURE_STORE_OPTIONS = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

class SecureStorage {
  async setItem(key: StorageKey, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        console.error('SECURITY WARNING: SecureStore not available on web. Tokens should not be stored in localStorage!');
        console.warn('For web builds, use HttpOnly cookies or session storage instead.');
        return;
      }
      await SecureStore.setItemAsync(key, value, SECURE_STORE_OPTIONS);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  }

  async getItem(key: StorageKey): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        console.error('SECURITY WARNING: SecureStore not available on web.');
        return null;
      }
      return await SecureStore.getItemAsync(key, SECURE_STORE_OPTIONS);
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: StorageKey): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        return;
      }
      await SecureStore.deleteItemAsync(key, SECURE_STORE_OPTIONS);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  async setObject<T>(key: StorageKey, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing object ${key}:`, error);
      throw error;
    }
  }

  async getObject<T>(key: StorageKey): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving object ${key}:`, error);
      return null;
    }
  }

  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        return;
      }
      
      const keys = Object.values(STORAGE_KEYS) as StorageKey[];
      await Promise.all(keys.map(key => this.removeItem(key)));
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  }

  async setAuthToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async removeAuthToken(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async setRefreshToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  async setUserId(userId: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_ID, userId);
  }

  async getUserId(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.USER_ID);
  }

  async setWalletAddress(address: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
  }

  async getWalletAddress(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.WALLET_ADDRESS);
  }

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
  }

  async getBiometricEnabled(): Promise<boolean> {
    const value = await this.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
    return value === 'true';
  }

  async setSessionData<T>(data: T): Promise<void> {
    await this.setObject(STORAGE_KEYS.SESSION_DATA, data);
  }

  async getSessionData<T>(): Promise<T | null> {
    return await this.getObject<T>(STORAGE_KEYS.SESSION_DATA);
  }

  async setUserPreferences<T>(preferences: T): Promise<void> {
    await this.setObject(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  async getUserPreferences<T>(): Promise<T | null> {
    return await this.getObject<T>(STORAGE_KEYS.USER_PREFERENCES);
  }
}

export const secureStorage = new SecureStorage();
export { STORAGE_KEYS };
