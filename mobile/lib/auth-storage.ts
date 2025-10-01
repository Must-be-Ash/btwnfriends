import { secureStorage, STORAGE_KEYS } from './secure-storage';

export interface UserSession {
  userId: string;
  email: string;
  walletAddress?: string;
  createdAt: string;
}

export const authStorage = {
  async saveSession(session: UserSession, authToken?: string): Promise<void> {
    try {
      await secureStorage.setSessionData(session);
      await secureStorage.setUserId(session.userId);
      
      if (session.walletAddress) {
        await secureStorage.setWalletAddress(session.walletAddress);
      }
      
      if (authToken) {
        await secureStorage.setAuthToken(authToken);
      }
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  },

  async getSession(): Promise<UserSession | null> {
    try {
      return await secureStorage.getSessionData<UserSession>();
    } catch (error) {
      console.error('Error retrieving session:', error);
      return null;
    }
  },

  async clearSession(): Promise<void> {
    try {
      await secureStorage.removeAuthToken();
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.SESSION_DATA);
      await secureStorage.removeItem(STORAGE_KEYS.USER_ID);
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await secureStorage.getAuthToken();
    return !!token;
  },

  async getWalletAddress(): Promise<string | null> {
    return await secureStorage.getWalletAddress();
  },

  async getUserId(): Promise<string | null> {
    return await secureStorage.getUserId();
  },
};
