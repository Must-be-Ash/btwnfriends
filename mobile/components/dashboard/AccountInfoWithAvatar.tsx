import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LogOut, Key, Settings, Copy, Check } from 'lucide-react-native';
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

  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSettings = () => {
    setShowMenu(false);
    router.push('/settings');
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
          <Text className="text-white font-semibold">
            {(user?.displayName || currentUser?.userId || 'U').charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* User Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
          className="flex-1 bg-black/50 justify-center items-center"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white rounded-2xl shadow-2xl w-64 overflow-hidden"
          >
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="text-sm font-medium text-gray-900">
                {user?.displayName || 'User'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSettings}
              className="flex-row items-center px-4 py-3 active:bg-gray-100"
            >
              <Settings size={18} color="#6B7280" />
              <Text className="ml-3 text-sm text-gray-700">Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleExportKeys}
              className="flex-row items-center px-4 py-3 active:bg-gray-100"
            >
              <Key size={18} color="#6B7280" />
              <Text className="ml-3 text-sm text-gray-700">Export Private Key</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogoutPress}
              className="flex-row items-center px-4 py-3 active:bg-gray-100 border-t border-gray-200"
            >
              <LogOut size={18} color="#EF4444" />
              <Text className="ml-3 text-sm text-red-600">Logout</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
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
