import axios from 'axios';
import Constants from 'expo-constants';
import { secureStorage, STORAGE_KEYS } from './secure-storage';

// Smart API URL detection for React Native environments
const getAPIUrl = () => {
  // 1. Check for explicit environment variable override (highest priority)
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl !== 'http://localhost:3000') {
    return envUrl;
  }

  // 2. Check app.json extra config
  const configUrl = Constants.expoConfig?.extra?.apiUrl;
  if (configUrl && configUrl !== 'http://localhost:3000') {
    return configUrl;
  }

  // 3. In development, attempt to use the Expo dev server host for LAN/tunnel connections
  if (__DEV__ && Constants.expoConfig?.hostUri) {
    const hostUri = Constants.expoConfig.hostUri;
    
    // Handle different Expo connection types:
    // - LAN: "192.168.x.x:19000" -> use the IP
    // - Tunnel: "tunnel-url.exp.direct:80" -> needs manual config
    // - Localhost: "localhost:19000" -> use localhost
    
    // Extract just the host part (before the port)
    const host = hostUri.split(':').shift() || 'localhost';
    
    // Don't use tunnel URLs automatically (they need backend proxy setup)
    if (host.includes('.exp.direct') || host.includes('tunnel') || host.includes('ngrok')) {
      console.warn('Tunnel detected. Please set EXPO_PUBLIC_API_URL to your backend URL in .env');
      return 'http://localhost:3000'; // Will fail on device, user needs to configure
    }
    
    // For LAN connections, construct the backend URL
    if (host !== 'localhost') {
      const backendUrl = `http://${host}:3000`;
      console.log(`Development mode: Using LAN backend at ${backendUrl}`);
      return backendUrl;
    }
  }

  // 4. Fallback to localhost (only works in iOS simulator/Android emulator)
  console.warn('Using localhost:3000 - this only works in simulator/emulator. For real devices, set EXPO_PUBLIC_API_URL in .env');
  return 'http://localhost:3000';
};

const API_URL = getAPIUrl();

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await secureStorage.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      
      // Handle 401 Unauthorized - clear tokens and redirect to auth
      if (error.response.status === 401) {
        await secureStorage.removeAuthToken();
        await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        // TODO: Redirect to auth screen
        console.log('Session expired. Please log in again.');
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const recipientAPI = {
  lookup: (email: string) => api.post('/api/recipients/lookup', { email }),
};

export const sendAPI = {
  send: (data: any) => api.post('/api/send', data),
  complete: (data: any) => api.post('/api/send/complete', data),
  sponsored: (data: any) => api.post('/api/send/sponsored', data),
};

export const transactionsAPI = {
  list: () => api.get('/api/transactions'),
};

export const contactsAPI = {
  list: () => api.get('/api/contacts'),
  sync: (contacts: any) => api.post('/api/contacts/sync-device', { contacts }),
  favorite: (contactId: string, favorite: boolean) => 
    api.post('/api/contacts/favorite', { contactId, favorite }),
};

export const refundAPI = {
  refund: (transferId: string) => api.post('/api/refund', { transferId }),
};

// Log the configured API URL (helpful for debugging)
console.log('API configured with base URL:', API_URL);
