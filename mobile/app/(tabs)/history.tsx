import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrentUser } from '@coinbase/cdp-hooks';
import { TransactionItem } from '../../components/history/TransactionItem';
import { TransactionFilters } from '../../components/history/TransactionFilters';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { useApi } from '../../lib/use-api';

interface Transaction {
  _id: string;
  type: 'sent' | 'received' | 'refund';
  counterpartyEmail: string;
  amount: string;
  txHash?: string;
  transferId?: string;
  status: 'confirmed' | 'pending' | 'failed' | 'claimed' | 'unclaimed';
  createdAt: string;
  message?: string;
}

type FilterType = 'all' | 'sent' | 'received' | 'pending';
type FilterStatus = 'all' | 'confirmed' | 'pending' | 'failed';

export default function HistoryScreen() {
  const { currentUser } = useCurrentUser();
  const { api, isReady: isApiReady } = useApi();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);

  const requestIdRef = useRef(0);

  const fetchTransactions = useCallback(async (reset: boolean = false) => {
    if (!currentUser?.userId || !isApiReady) return;

    const currentRequestId = ++requestIdRef.current;
    const newOffset = reset ? 0 : offset;
    const limit = 20;

    try {
      if (reset) {
        setIsLoading(true);
        setOffset(0);
      } else {
        setIsLoadingMore(true);
      }
      
      setError(null);

      const params = new URLSearchParams({
        userId: currentUser.userId,
        limit: limit.toString(),
        offset: newOffset.toString(),
        type: filterType,
        status: filterStatus,
        search: searchQuery
      });

      const response = await api.get(`/api/transactions?${params.toString()}`);

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (response.data.success) {
        if (reset) {
          setTransactions(response.data.transactions);
        } else {
          setTransactions(prev => [...prev, ...response.data.transactions]);
        }
        setHasMore(response.data.hasMore);
        setOffset(prev => (reset ? 0 : prev) + response.data.transactions.length);
      } else {
        throw new Error(response.data.error || 'Failed to fetch transactions');
      }
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    }
  }, [currentUser?.userId, filterType, filterStatus, searchQuery, offset, api, isApiReady]);

  useEffect(() => {
    if (isApiReady) {
      fetchTransactions(true);
    }
  }, [currentUser?.userId, filterType, filterStatus, searchQuery, isApiReady]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setOffset(0);
    fetchTransactions(true);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchTransactions(false);
    }
  };

  const handleFilterChange = (type: FilterType, status: FilterStatus, search: string) => {
    setFilterType(type);
    setFilterStatus(status);
    setSearchQuery(search);
    setOffset(0);
  };

  if (!currentUser?.userId) {
    return <LoadingScreen message="Loading user..." />;
  }

  if (isLoading && transactions.length === 0) {
    return <LoadingScreen message="Loading transactions..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#222222]" edges={['top']}>
      <View className="px-4 pt-8 pb-4">
        <TransactionFilters
          currentType={filterType}
          currentStatus={filterStatus}
          currentSearch={searchQuery}
          onFilterChange={handleFilterChange}
        />
      </View>

      {error && (
        <View className="px-4 py-3 bg-[#5A4A4A] border border-[#8B6B6B] mx-4 rounded-lg mb-4">
          <Text className="text-[#CC8888] text-center">{error}</Text>
        </View>
      )}

      {transactions.length === 0 && !isLoading ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-semibold text-white mb-2">No Transactions</Text>
          <Text className="text-[#B8B8B8] text-center">
            {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
              ? 'No transactions match your filters'
              : 'Your transaction history will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="px-4 mb-3">
              <TransactionItem transaction={item} />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#B8B8B8"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View className="py-4">
                <ActivityIndicator color="#B8B8B8" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
