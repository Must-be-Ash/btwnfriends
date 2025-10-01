import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface AmountInputProps {
  amount: string;
  onAmountChange: (value: string) => void;
  userBalance: string;
  isLoadingBalance: boolean;
  error?: string;
}

export function AmountInput({ amount, onAmountChange, userBalance, isLoadingBalance, error }: AmountInputProps) {
  const handleAmountChange = (value: string) => {
    if (value === '') {
      onAmountChange('');
      return;
    }

    const regex = /^\d*\.?\d{0,6}$/;
    if (regex.test(value)) {
      onAmountChange(value);
    }
  };

  const handleQuickAmount = (quickAmount: string) => {
    onAmountChange(quickAmount);
  };

  const handleMaxAmount = () => {
    const maxAmount = Math.max(0, parseFloat(userBalance));
    onAmountChange(maxAmount.toFixed(2));
  };

  const numBalance = parseFloat(userBalance);
  const quickAmounts = ['5', '10', '25', '50'];

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-lg font-semibold text-white mb-4">Amount to Send</Text>
        
        <View className="bg-white/10 rounded-xl p-4 border border-white/20">
          <View className="flex flex-row items-center">
            <TextInput
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="decimal-pad"
              className="flex-1 text-3xl font-semibold text-white"
            />
          </View>
        </View>

        {error && (
          <Text className="text-red-400 text-sm mt-2">{error}</Text>
        )}
      </View>

      <View className="flex flex-row items-center justify-between">
        {isLoadingBalance ? (
          <View className="flex flex-row items-center">
            <Text className="text-white/70 text-sm">Available balance: </Text>
            <ActivityIndicator size="small" color="rgba(184,184,184,1)" />
            <Text className="ml-1 text-white/70 text-sm">Loading...</Text>
          </View>
        ) : (
          <Text className="text-white/70 text-sm">
            Available balance: <Text className="font-medium text-white">${userBalance} USDC</Text>
          </Text>
        )}
        
        {!isLoadingBalance && parseFloat(userBalance) > 0 && (
          <TouchableOpacity onPress={handleMaxAmount}>
            <Text className="text-[#F2F2F2] font-medium">Use Max</Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        <Text className="text-sm font-medium text-white/70 mb-2">Quick Amounts</Text>
        <View className="flex flex-row gap-2">
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              onPress={() => handleQuickAmount(quickAmount)}
              className={`flex-1 py-3 rounded-xl border ${
                amount === quickAmount
                  ? 'bg-white/20 border-white/40'
                  : 'bg-white/10 border-white/20'
              }`}
              activeOpacity={0.7}
            >
              <Text className="text-white text-center font-medium">${quickAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
