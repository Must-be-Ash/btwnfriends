import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X } from 'lucide-react-native';

interface TestnetWarningModalProps {
  visible: boolean;
  onClose: () => void;
}

export function TestnetWarningModal({ visible, onClose }: TestnetWarningModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center px-4 bg-black/60">
        <View
          className="w-full max-w-md rounded-3xl p-8 border border-[#4A4A4A]"
          style={{
            backgroundColor: 'rgba(42, 42, 42, 0.8)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color="#999999" />
          </TouchableOpacity>

          <View className="items-center gap-4">
            <Text className="text-2xl font-bold text-[#CCCCCC]">
              Heads Up!
            </Text>

            <View className="gap-3">
              <Text className="text-[#B8B8B8] text-center">
                This app runs on <Text className="text-white font-medium">Sepolia</Text> and uses <Text className="text-white font-medium">testnet USDC</Text>.
              </Text>
              <Text className="text-[#B8B8B8] text-center">
                It does <Text className="text-white font-medium">not handle real funds</Text> and is for demonstration purposes only, showcasing CDP's embedded wallets and stablecoin payments.
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-full mt-6 px-6 py-3 bg-[#5CB0FF] rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-white font-medium text-center">
                Got it!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
