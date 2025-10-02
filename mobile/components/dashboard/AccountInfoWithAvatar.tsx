import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LogOut, Key, Copy, Check, Settings } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  profileSetupComplete: boolean;
  walletAddress?: string;
}

interface CDPUser {
  userId: string;
  email?: string;
}

interface AccountInfoWithAvatarProps {
  user: UserProfile | null;
  walletAddress: string;
  handleLogout: () => void;
  currentUser: CDPUser | null;
}

function truncateText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function AccountInfoWithAvatar({
  user,
  walletAddress,
  handleLogout,
  currentUser
}: AccountInfoWithAvatarProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showMenu) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showMenu]);

  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleExportKeys = () => {
    setShowMenu(false);
    router.push('/export-key');
  };

  const handleLogoutPress = () => {
    setShowMenu(false);
    handleLogout();
  };

  return (
    <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-white">Account Info</Text>

        {/* User Avatar */}
        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
          accessibilityLabel="User menu"
        >
          <Settings size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* User Menu Bottom Drawer */}
      <Modal
        visible={showMenu}
        transparent
        animationType="none"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              opacity: fadeAnim,
            }}
          />
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
            style={{ flex: 1 }}
          />
          <Animated.View
            style={{
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0]
                })
              }],
              paddingBottom: 34
            }}
            className="bg-white rounded-t-3xl shadow-2xl overflow-hidden"
          >
            <View className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base font-semibold text-gray-900">
                {user?.displayName || 'User'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleExportKeys}
              className="flex-row items-center px-6 py-4 active:bg-gray-100"
            >
              <Key size={20} color="#6B7280" />
              <Text className="ml-4 text-base text-gray-700">Export Private Key</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogoutPress}
              className="flex-row items-center px-6 py-4 active:bg-gray-100"
            >
              <LogOut size={20} color="#EF4444" />
              <Text className="ml-4 text-base text-red-600">Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <View className="gap-4">
        <View>
          <Text className="text-sm text-white/70 mb-1">Display Name</Text>
          <Text className="font-medium text-white">{user?.displayName || 'Loading...'}</Text>
        </View>

        <View>
          <Text className="text-sm text-white/70 mb-1">Email</Text>
          <Text className="font-medium text-white">{user?.email || 'Loading...'}</Text>
        </View>

        <View>
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-sm text-white/70">Wallet Address</Text>
            <TouchableOpacity onPress={handleCopyAddress} className="active:opacity-70">
              {copiedAddress ? (
                <View className="flex-row items-center">
                  <Check size={14} color="#4ADE80" />
                  <Text className="text-green-400 text-xs ml-1">Copied</Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Copy size={14} color="rgba(255,255,255,0.6)" />
                  <Text className="text-white/60 text-xs ml-1">Copy</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Text className="font-mono text-sm text-white">
            {walletAddress ? truncateText(walletAddress, 24) : 'Loading...'}
          </Text>
        </View>
      </View>
    </View>
  );
}
