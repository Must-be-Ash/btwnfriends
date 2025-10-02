import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useEvmAddress, useCurrentUser, useSignOut } from '@coinbase/cdp-hooks';
import { useRouter } from 'expo-router';
import { useApi } from '../../lib/use-api';
import { getUSDCBalance } from '../../lib/usdc';
import {
  BalanceCard,
  QuickActions,
  AccountInfoWithAvatar
} from '../../components/dashboard';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [user, setUser] = useState(null);

  const evmAddress = useEvmAddress();
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  const { api, isReady: isApiReady } = useApi();
  const { signOut } = useSignOut();

  const fetchBalance = useCallback(async () => {
    if (!evmAddress?.evmAddress) return;
    
    try {
      setIsLoadingBalance(true);
      const balance = await getUSDCBalance(evmAddress.evmAddress);
      setBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('0');
    } finally {
      setIsLoadingBalance(false);
    }
  }, [evmAddress?.evmAddress]);

  const fetchUserProfile = useCallback(async () => {
    if (!currentUser?.userId || !isApiReady) return;

    try {
      const response = await api.get(`/api/users?userId=${encodeURIComponent(currentUser.userId)}`);
      setUser(response.data?.user || null);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  }, [currentUser?.userId, api, isApiReady]);

  useEffect(() => {
    fetchBalance();
    fetchUserProfile();
  }, [fetchBalance, fetchUserProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchBalance(),
      fetchUserProfile()
    ]);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      // Use CDP's signOut to properly terminate the session
      await signOut();
      router.replace('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if signOut fails, navigate to auth screen
      router.replace('/auth');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#222222]" edges={['top']}>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-4 pt-8 pb-32 gap-4">
        <BalanceCard
          balance={balance}
          isLoading={isLoadingBalance}
          onRefresh={fetchBalance}
        />

        <QuickActions />

        <AccountInfoWithAvatar
          user={user}
          walletAddress={evmAddress?.evmAddress || ''}
          handleLogout={handleLogout}
          currentUser={currentUser}
        />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
