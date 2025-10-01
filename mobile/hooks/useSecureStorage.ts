import { useCallback } from 'react';
import { secureStorage, type StorageKey } from '../lib/secure-storage';

export function useSecureStorage() {
  const setItem = useCallback(async (key: StorageKey, value: string) => {
    return await secureStorage.setItem(key, value);
  }, []);

  const getItem = useCallback(async (key: StorageKey) => {
    return await secureStorage.getItem(key);
  }, []);

  const removeItem = useCallback(async (key: StorageKey) => {
    return await secureStorage.removeItem(key);
  }, []);

  const setObject = useCallback(async <T,>(key: StorageKey, value: T) => {
    return await secureStorage.setObject(key, value);
  }, []);

  const getObject = useCallback(async <T,>(key: StorageKey) => {
    return await secureStorage.getObject<T>(key);
  }, []);

  const clear = useCallback(async () => {
    return await secureStorage.clear();
  }, []);

  const setAuthToken = useCallback(async (token: string) => {
    return await secureStorage.setAuthToken(token);
  }, []);

  const getAuthToken = useCallback(async () => {
    return await secureStorage.getAuthToken();
  }, []);

  const removeAuthToken = useCallback(async () => {
    return await secureStorage.removeAuthToken();
  }, []);

  const setWalletAddress = useCallback(async (address: string) => {
    return await secureStorage.setWalletAddress(address);
  }, []);

  const getWalletAddress = useCallback(async () => {
    return await secureStorage.getWalletAddress();
  }, []);

  return {
    setItem,
    getItem,
    removeItem,
    setObject,
    getObject,
    clear,
    setAuthToken,
    getAuthToken,
    removeAuthToken,
    setWalletAddress,
    getWalletAddress,
  };
}
