import { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, AppState, AppStateStatus } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentUser, useExportEvmAccount } from '@coinbase/cdp-hooks';
import * as Clipboard from 'expo-clipboard';
import { ArrowLeft, AlertTriangle, Copy, CheckCircle, Shield, Trash2 } from 'lucide-react-native';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { biometricAuth } from '../lib/biometric-auth';

const CLIPBOARD_AUTO_CLEAR_SECONDS = 30;

export default function ExportKeyScreen() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { exportEvmAccount } = useExportEvmAccount();

  const [step, setStep] = useState<'warning' | 'exporting' | 'exported'>('warning');
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clipboardTimerRef = useRef<NodeJS.Timeout | null>(null);

  const eoaAddress = currentUser?.evmAccounts?.[0];

  useEffect(() => {
    if (!currentUser || !eoaAddress) {
      router.replace('/(tabs)');
    }
  }, [currentUser, eoaAddress, router]);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        try {
          await Clipboard.setStringAsync(' ');
          if (clipboardTimerRef.current) {
            clearTimeout(clipboardTimerRef.current);
          }
        } catch (err) {
          console.warn('Failed to clear clipboard on app background:', err);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      
      if (clipboardTimerRef.current) {
        clearTimeout(clipboardTimerRef.current);
      }

      Clipboard.setStringAsync(' ').catch(err => 
        console.warn('Failed to clear clipboard on unmount:', err)
      );
    };
  }, []);

  const handleConfirmExport = useCallback(async () => {
    if (!eoaAddress) return;

    const authenticated = await biometricAuth.authenticateIfEnabled(
      'Authenticate to export your private key'
    );

    if (!authenticated) {
      Alert.alert('Authentication Failed', 'You must authenticate to export your private key.');
      return;
    }

    setStep('exporting');
    setError(null);

    try {
      const { privateKey: exportedKey } = await exportEvmAccount({
        evmAccount: eoaAddress
      });

      if (!exportedKey || typeof exportedKey !== 'string') {
        throw new Error('Invalid private key format received');
      }

      if (!/^0x[0-9a-fA-F]{64}$/.test(exportedKey)) {
        console.warn('Unexpected private key format: length', exportedKey.length);
      }

      setPrivateKey(exportedKey);
      setStep('exported');
    } catch (err) {
      console.error('Failed to export private key:', err);
      setError(err instanceof Error ? err.message : 'Failed to export private key');
      setStep('warning');
    }
  }, [eoaAddress, exportEvmAccount]);

  const handleCopyKey = useCallback(async () => {
    if (!privateKey) return;

    try {
      await Clipboard.setStringAsync(privateKey);
      setCopied(true);
      
      if (clipboardTimerRef.current) {
        clearTimeout(clipboardTimerRef.current);
      }

      clipboardTimerRef.current = setTimeout(async () => {
        try {
          await Clipboard.setStringAsync(' ');
          console.log('Clipboard automatically cleared after 30 seconds');
        } catch (err) {
          console.warn('Failed to auto-clear clipboard:', err);
        }
      }, CLIPBOARD_AUTO_CLEAR_SECONDS * 1000);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  }, [privateKey]);

  const handleClearClipboard = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(' ');
      
      if (clipboardTimerRef.current) {
        clearTimeout(clipboardTimerRef.current);
      }

      Alert.alert('Clipboard Cleared', 'Your private key has been removed from the clipboard.');
    } catch (err) {
      console.error('Failed to clear clipboard:', err);
      Alert.alert('Error', 'Failed to clear clipboard');
    }
  }, []);

  const handleDone = useCallback(async () => {
    if (clipboardTimerRef.current) {
      clearTimeout(clipboardTimerRef.current);
    }
    
    try {
      await Clipboard.setStringAsync(' ');
    } catch (err) {
      console.warn('Failed to clear clipboard on done:', err);
    }

    setPrivateKey(null);
    router.push('/(tabs)');
  }, [router]);

  if (!currentUser || !eoaAddress) {
    return <LoadingScreen message="Redirecting..." />;
  }

  if (step === 'exporting') {
    return <LoadingScreen message="Exporting private key..." />;
  }

  if (step === 'exported' && privateKey) {
    return (
      <ScrollView className="flex-1 bg-[#222222]">
        <View className="px-4 pt-12 pb-24">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-8"
          >
            <ArrowLeft size={20} color="#B8B8B8" />
            <Text className="text-[#B8B8B8] ml-2">Back</Text>
          </TouchableOpacity>

          {/* Content Card */}
          <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
            <View className="flex-row items-center gap-3 mb-6">
              <View className="w-12 h-12 bg-green-500/20 rounded-full items-center justify-center">
                <Shield size={24} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white">Your Private Key</Text>
                <Text className="text-[#B8B8B8] text-sm mt-1">Keep this secure and never share it</Text>
              </View>
            </View>

            <View className="mb-6">
              <View className="relative">
                <TextInput
                  value={privateKey}
                  multiline
                  numberOfLines={6}
                  editable={false}
                  className="w-full bg-[#1A1A1A] border border-[#4A4A4A] rounded-xl p-4 pr-14 text-white font-mono text-xs"
                  style={{ fontFamily: 'monospace' }}
                />
                <TouchableOpacity
                  onPress={handleCopyKey}
                  className="absolute top-3 right-3 p-2 bg-[#3B3B3B] rounded-lg"
                >
                  {copied ? (
                    <CheckCircle size={20} color="#10b981" />
                  ) : (
                    <Copy size={20} color="#B8B8B8" />
                  )}
                </TouchableOpacity>
              </View>
              {copied && (
                <Text className="text-green-500 text-sm mt-2">Copied to clipboard</Text>
              )}
            </View>

            <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <Text className="text-gray-300 text-sm mb-2">
                <Text className="font-semibold text-white">Security Warning:</Text> Anyone with this key has complete control of your wallet.
              </Text>
              <Text className="text-gray-300 text-sm">
                • Screenshots may expose your key{'\n'}
                • Clipboard auto-clears in {CLIPBOARD_AUTO_CLEAR_SECONDS}s or when app backgrounds{'\n'}
                • Store in a secure location immediately{'\n'}
                • Never share with anyone
              </Text>
            </View>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleClearClipboard}
                className="w-full py-4 px-6 bg-[#3B3B3B] border border-[#4A4A4A] rounded-xl flex-row items-center justify-center gap-2"
              >
                <Trash2 size={20} color="#B8B8B8" />
                <Text className="text-[#B8B8B8] font-semibold">Clear Clipboard Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDone}
                className="w-full py-4 px-6 bg-[#5CB0FF] rounded-xl"
              >
                <Text className="text-white font-semibold text-center">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#222222]">
      <View className="px-4 pt-12 pb-24">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-8"
        >
          <ArrowLeft size={20} color="#B8B8B8" />
          <Text className="text-[#B8B8B8] ml-2">Back</Text>
        </TouchableOpacity>

        {/* Content Card */}
        <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
          <View className="flex-row items-center gap-3 mb-6">
            <View className="w-12 h-12 bg-red-500/20 rounded-full items-center justify-center">
              <AlertTriangle size={24} color="#ef4444" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">Export Private Key</Text>
            </View>
          </View>

          <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <Text className="text-gray-300 text-sm mb-4">
              Your private key provides <Text className="text-white font-semibold">complete control</Text> over your wallet and funds.
            </Text>
            <View className="space-y-2">
              <Text className="text-gray-300 text-sm">• Never share with anyone</Text>
              <Text className="text-gray-300 text-sm">• Store securely</Text>
              <Text className="text-gray-300 text-sm">• If compromised, transfer funds immediately</Text>
            </View>
          </View>

          {error && (
            <View className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
              <Text className="text-red-400 text-sm">{error}</Text>
            </View>
          )}

          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 py-4 px-6 border border-[#4A4A4A] rounded-xl"
            >
              <Text className="text-[#B8B8B8] font-semibold text-center">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirmExport}
              className="flex-1 py-4 px-6 bg-red-600 rounded-xl"
            >
              <Text className="text-white font-semibold text-center">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
