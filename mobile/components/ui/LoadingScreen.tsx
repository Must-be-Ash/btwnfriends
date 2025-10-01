import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-[#222222]">
      <View className="bg-[#2A2A2A]/80 border border-[#4A4A4A] rounded-3xl p-8 items-center">
        <ActivityIndicator size="large" color="#B8B8B8" className="mb-6" />
        <Text className="text-xl font-semibold text-[#CCCCCC] mb-2">Between Friends</Text>
        <Text className="text-[#B8B8B8]">{message}</Text>
      </View>
    </View>
  );
}
