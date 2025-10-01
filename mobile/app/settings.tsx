import { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import {
  ArrowLeft,
  User,
  Mail,
  Wallet,
  Shield,
  Key,
  Info,
  FileText,
  Lock,
  LogOut,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react-native';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { api } from '../lib/api';
import { authStorage } from '../lib/auth-storage';
import { biometricAuth } from '../lib/biometric-auth';

interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  walletAddress?: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const evmAddress = useEvmAddress();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const walletAddress = evmAddress?.evmAddress || '';
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  useEffect(() => {
    if (!currentUser?.userId) {
      router.replace('/(tabs)');
      return;
    }
    fetchUserProfile();
    checkBiometricAvailability();
  }, [currentUser?.userId, router]);

  const fetchUserProfile = useCallback(async () => {
    if (!currentUser?.userId) return;

    try {
      setIsLoading(true);
      const response = await api.get(`/api/users?userId=${encodeURIComponent(currentUser.userId)}`);
      const userData = response.data?.user;
      if (userData) {
        setUser(userData);
        setEditedDisplayName(userData.displayName);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.userId]);

  const checkBiometricAvailability = useCallback(async () => {
    const available = await biometricAuth.isAvailable();
    setBiometricAvailable(available);
    
    if (available) {
      const enabled = await biometricAuth.isEnabled();
      setBiometricEnabled(enabled);
    }
  }, []);

  const handleSaveDisplayName = useCallback(async () => {
    if (!user || !editedDisplayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    if (editedDisplayName.trim().length < 2) {
      Alert.alert('Error', 'Display name must be at least 2 characters');
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put('/api/users', {
        userId: user.userId,
        displayName: editedDisplayName.trim()
      });

      if (response.data?.success) {
        setUser({ ...user, displayName: editedDisplayName.trim() });
        setIsEditing(false);
        Alert.alert('Success', 'Display name updated');
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating display name:', error);
      Alert.alert('Error', 'Failed to update display name');
    } finally {
      setIsSaving(false);
    }
  }, [user, editedDisplayName]);

  const handleCancelEdit = useCallback(() => {
    setEditedDisplayName(user?.displayName || '');
    setIsEditing(false);
  }, [user]);

  const handleCopyAddress = useCallback(async () => {
    if (!walletAddress) return;
    
    await Clipboard.setStringAsync(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  }, [walletAddress]);

  const handleToggleBiometric = useCallback(async (value: boolean) => {
    await biometricAuth.setEnabled(value);
    setBiometricEnabled(value);
  }, []);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authStorage.clearSession();
              router.replace('/auth');
            } catch (error) {
              console.error('Error logging out:', error);
              router.replace('/auth');
            }
          }
        }
      ]
    );
  }, [router]);

  if (isLoading) {
    return <LoadingScreen message="Loading settings..." />;
  }

  if (!user) {
    return <LoadingScreen message="Loading..." />;
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <ScrollView className="flex-1 bg-[#222222]">
      <View className="px-4 pt-12 pb-24">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <ArrowLeft size={20} color="#B8B8B8" />
            <Text className="text-[#B8B8B8] ml-2">Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Settings</Text>
          <View className="w-12" />
        </View>

        {/* Profile Section */}
        <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl mb-4">
          <View className="flex-row items-center mb-6">
            <View className="w-16 h-16 bg-[#5CB0FF] rounded-full items-center justify-center mr-4">
              <Text className="text-white text-2xl font-bold">
                {user.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-lg">{user.displayName}</Text>
              <Text className="text-[#B8B8B8] text-sm">{user.email}</Text>
            </View>
          </View>

          <View className="border-t border-[#4A4A4A] pt-4">
            <Text className="text-white/70 text-sm mb-3">Display Name</Text>
            {isEditing ? (
              <View>
                <TextInput
                  value={editedDisplayName}
                  onChangeText={setEditedDisplayName}
                  className="bg-[#1A1A1A] border border-[#4A4A4A] rounded-xl px-4 py-3 text-white mb-3"
                  placeholder="Enter display name"
                  placeholderTextColor="#666"
                  autoFocus
                />
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    className="flex-1 py-3 border border-[#4A4A4A] rounded-xl"
                  >
                    <Text className="text-[#B8B8B8] text-center font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveDisplayName}
                    disabled={isSaving}
                    className="flex-1 py-3 bg-[#5CB0FF] rounded-xl"
                  >
                    <Text className="text-white text-center font-semibold">
                      {isSaving ? 'Saving...' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="flex-row items-center justify-between bg-[#1A1A1A] border border-[#4A4A4A] rounded-xl px-4 py-3"
              >
                <Text className="text-white">{user.displayName}</Text>
                <ChevronRight size={20} color="#B8B8B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Wallet Section */}
        <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl mb-4">
          <Text className="text-white font-semibold text-lg mb-4">Wallet</Text>
          
          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white/70 text-sm">Wallet Address</Text>
              <TouchableOpacity onPress={handleCopyAddress} className="active:opacity-70">
                {copiedAddress ? (
                  <View className="flex-row items-center">
                    <Check size={16} color="#4ADE80" />
                    <Text className="text-green-400 text-xs ml-1">Copied</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Copy size={16} color="rgba(255,255,255,0.6)" />
                    <Text className="text-white/60 text-xs ml-1">Copy</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Text className="font-mono text-sm text-white">
              {truncateAddress(walletAddress)}
            </Text>
          </View>
        </View>

        {/* Security Section */}
        <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl mb-4">
          <Text className="text-white font-semibold text-lg mb-4">Security</Text>

          {biometricAvailable && (
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-[#4A4A4A]">
              <View className="flex-row items-center flex-1">
                <Shield size={20} color="#B8B8B8" />
                <View className="ml-3 flex-1">
                  <Text className="text-white">Biometric Authentication</Text>
                  <Text className="text-[#B8B8B8] text-xs mt-1">
                    Use Face ID or Touch ID for export
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleToggleBiometric}
                trackColor={{ false: '#4A4A4A', true: '#5CB0FF' }}
                thumbColor="#ffffff"
              />
            </View>
          )}

          <TouchableOpacity
            onPress={() => router.push('/export-key')}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <Key size={20} color="#B8B8B8" />
              <Text className="text-white ml-3">Export Private Key</Text>
            </View>
            <ChevronRight size={20} color="#B8B8B8" />
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl mb-4">
          <Text className="text-white font-semibold text-lg mb-4">About</Text>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Info size={20} color="#B8B8B8" />
                <Text className="text-white ml-3">Version</Text>
              </View>
              <Text className="text-[#B8B8B8]">{appVersion}</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/tos')}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <FileText size={20} color="#B8B8B8" />
                <Text className="text-white ml-3">Terms of Service</Text>
              </View>
              <ChevronRight size={20} color="#B8B8B8" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/privacy')}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Lock size={20} color="#B8B8B8" />
                <Text className="text-white ml-3">Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color="#B8B8B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600/20 border border-red-600/50 rounded-2xl p-4 flex-row items-center justify-center"
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="text-red-500 font-semibold ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
