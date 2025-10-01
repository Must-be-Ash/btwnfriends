import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentUser, useExportEvmAccount } from '@coinbase/cdp-hooks';
import * as Clipboard from 'expo-clipboard';
import { ArrowLeft, AlertTriangle, Copy, CheckCircle, Shield } from 'lucide-react-native';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export default function ExportKeyScreen() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { exportEvmAccount } = useExportEvmAccount();

  const [step, setStep] = useState<'warning' | 'exporting' | 'exported'>('warning');
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eoaAddress = currentUser?.evmAccounts?.[0];

  const handleConfirmExport = useCallback(async () => {
    if (!eoaAddress) return;

    setStep('exporting');
    setError(null);

    try {
      const { privateKey: exportedKey } = await exportEvmAccount({
        evmAccount: eoaAddress
      });

      let formattedKey = exportedKey;
      if (typeof exportedKey === 'string' && exportedKey.length === 32) {
        const bytes = new Uint8Array(exportedKey.split('').map(c => c.charCodeAt(0)));
        formattedKey = '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      }

      setPrivateKey(formattedKey);
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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  }, [privateKey]);

  const handleDone = useCallback(() => {
    setPrivateKey(null);
    router.push('/(tabs)');
  }, [router]);

  if (!currentUser || !eoaAddress) {
    router.push('/(tabs)');
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
              <Text className="text-gray-300 text-sm">
                Anyone with this key has complete control of your wallet. Store it securely and clear your clipboard.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleDone}
              className="w-full py-4 px-6 bg-[#5CB0FF] rounded-xl"
            >
              <Text className="text-white font-semibold text-center">Done</Text>
            </TouchableOpacity>
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
