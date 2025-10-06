import { useMemo, useEffect, useState } from 'react';
import { useGetAccessToken, useIsSignedIn } from '@coinbase/cdp-hooks';
import { createAuthenticatedApi } from './api';
import type { AxiosInstance } from 'axios';

/**
 * Hook to get an authenticated API client with CDP access token
 * This hook automatically includes the user's CDP access token in all requests
 *
 * @example
 * const { api, isReady } = useApi();
 * if (isReady) {
 *   const response = await api.get('/api/transactions');
 * }
 */
export function useApi(): { api: AxiosInstance; isReady: boolean } {
  const { getAccessToken } = useGetAccessToken();
  const { isSignedIn } = useIsSignedIn();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Fetch access token when user signs in
  useEffect(() => {
    if (!isSignedIn) {
      console.log('[useApi] User not signed in, clearing token');
      setAccessToken(null);
      setIsReady(false);
      return;
    }

    const fetchToken = async () => {
      try {
        console.log('[useApi] Fetching access token...');
        const token = await getAccessToken();

        if (token) {
          console.log('[useApi] ✓ Access token received:', token.substring(0, 20) + '...');
          setAccessToken(token);
          setIsReady(true);
        } else {
          console.warn('[useApi] ⚠️ No access token returned from CDP');
          setAccessToken(null);
          setIsReady(false);
        }
      } catch (error) {
        console.error('[useApi] ❌ Failed to get access token:', error);
        setAccessToken(null);
        setIsReady(false);
      }
    };

    fetchToken();
  }, [getAccessToken, isSignedIn]);

  // Create authenticated API client with current access token
  const authenticatedApi = useMemo(() => {
    return createAuthenticatedApi(accessToken);
  }, [accessToken]);

  return { api: authenticatedApi, isReady };
}
