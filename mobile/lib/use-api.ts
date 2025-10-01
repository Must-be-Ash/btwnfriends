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
      setAccessToken(null);
      setIsReady(false);
      return;
    }

    const fetchToken = async () => {
      try {
        const token = await getAccessToken();
        setAccessToken(token);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to get access token:', error);
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
