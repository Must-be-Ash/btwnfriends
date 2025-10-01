import { View, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useEvmAddress, useCurrentUser, useSignOut } from '@coinbase/cdp-hooks';
import { useRouter } from 'expo-router';
import { useApi } from '../../lib/use-api';
import { getUSDCBalance } from '../../lib/usdc';
import {
  BalanceCard,
  QuickActions,
  RecentTransactions,
  AccountInfoWithAvatar,
  SmartAccountStatus
} from '../../components/dashboard';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
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

  const fetchTransactions = useCallback(async () => {
    if (!currentUser?.userId || !isApiReady) return;

    try {
      setIsLoadingTransactions(true);
      const response = await api.get(`/api/transactions?userId=${encodeURIComponent(currentUser.userId)}`);
      setTransactions(response.data?.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [currentUser?.userId, api, isApiReady]);

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
    fetchTransactions();
    fetchUserProfile();
  }, [fetchBalance, fetchTransactions, fetchUserProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchBalance(),
      fetchTransactions(),
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
    <ScrollView 
      className="flex-1 bg-[#1A1A1A]"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 pt-6 pb-8 gap-4">
        <BalanceCard 
          balance={balance}
          isLoading={isLoadingBalance}
          onRefresh={fetchBalance}
        />
        
        <QuickActions />

        <RecentTransactions 
          transactions={transactions}
          isLoading={isLoadingTransactions}
        />
        
        <AccountInfoWithAvatar
          user={user}
          walletAddress={evmAddress?.evmAddress || ''}
          handleLogout={handleLogout}
          currentUser={currentUser}
        />
        
        <SmartAccountStatus />
      </View>
    </ScrollView>
  );
}
