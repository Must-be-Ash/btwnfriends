import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignInWithEmail, useVerifyEmailOTP } from '@coinbase/cdp-hooks';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [flowId, setFlowId] = useState<string>('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmail({ email: email.toLowerCase().trim() });
      setFlowId(result.flowId);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyEmailOTP({ flowId, otp });
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#222222]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md mx-auto">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-[#CCCCCC] text-center mb-2">
              Between Friends
            </Text>
            <View className="flex-row justify-center items-center">
              <Text className="text-[#B8B8B8]">your </Text>
              <Text className="text-[#5CB0FF] italic" style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}>
                Pal
              </Text>
              <Text className="text-[#B8B8B8]"> shouldn&apos;t be taxing you</Text>
            </View>
          </View>

          {/* Auth Card */}
          <View
            className="rounded-3xl p-8 border border-[#4A4A4A]"
            style={{
              backgroundColor: 'rgba(42, 42, 42, 0.8)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 24,
              elevation: 8,
            }}
          >
            {step === 'email' ? (
              <View className="gap-6">
                <View>
                  <Text className="text-sm font-medium text-[#B8B8B8] mb-3">
                    Email address
                  </Text>
                  <TextInput
                    className={`w-full px-4 py-3 rounded-xl bg-[#333333] text-white ${
                      error ? 'border-2 border-[#CC6666]' : 'border-2 border-[#5A5A5A]'
                    }`}
                    placeholder="your@email.com"
                    placeholderTextColor="#999999"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                  {error && (
                    <Text className="mt-2 text-sm text-[#CC6666]">{error}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleSendOTP}
                  disabled={loading || !email.trim()}
                  activeOpacity={0.8}
                  className="overflow-hidden rounded-xl"
                >
                  <LinearGradient
                    colors={
                      loading || !email.trim()
                        ? ['#2a2a2a', '#1f1f1f', '#151515', '#0a0a0a']
                        : ['#5a5a5a', '#4a4a4a', '#3a3a3a', '#2a2a2a', '#1a1a1a', '#0f0f0f']
                    }
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: loading || !email.trim() ? 4 : 8 },
                      shadowOpacity: loading || !email.trim() ? 0.2 : 0.4,
                      shadowRadius: loading || !email.trim() ? 12 : 24,
                      elevation: loading || !email.trim() ? 2 : 8,
                    }}
                  >
                    <View className="py-4 px-6">
                      {loading ? (
                        <View className="flex-row items-center justify-center">
                          <ActivityIndicator color="#B8B8B8" className="mr-2" />
                          <Text className="text-white font-semibold text-lg">Sending code...</Text>
                        </View>
                      ) : (
                        <Text className="text-white font-semibold text-lg text-center">Login</Text>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <Text className="text-xs text-[#999999] text-center">
                  By continuing, you agree to our{' '}
                  <Text className="font-bold text-[#B8B8B8] underline" onPress={() => openLink('https://btwnfriends.com/tos')}>
                    Terms of Service
                  </Text>
                  {' & '}
                  <Text className="font-bold text-[#B8B8B8] underline" onPress={() => openLink('https://btwnfriends.com/privacy')}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            ) : (
              <View className="gap-6">
                <View>
                  <Text className="text-xl font-semibold text-[#CCCCCC] mb-2">
                    Check your email
                  </Text>
                  <Text className="text-[#B8B8B8]">
                    We sent a 6-digit code to <Text className="font-medium text-white">{email}</Text>
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-medium text-[#B8B8B8] mb-3">
                    Verification code
                  </Text>
                  <TextInput
                    className={`w-full px-4 py-3 rounded-xl bg-[#333333] text-white text-center text-2xl tracking-widest ${
                      error ? 'border-2 border-[#CC6666]' : 'border-2 border-[#5A5A5A]'
                    }`}
                    placeholder="000000"
                    placeholderTextColor="#999999"
                    value={otp}
                    onChangeText={(text) => {
                      setOtp(text.replace(/[^0-9]/g, ''));
                      setError('');
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                    editable={!loading}
                  />
                  {error && (
                    <Text className="mt-2 text-sm text-[#CC6666] text-center">{error}</Text>
                  )}
                </View>

                <View className="gap-3">
                  <TouchableOpacity
                    onPress={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    activeOpacity={0.8}
                    className="overflow-hidden rounded-xl"
                  >
                    <LinearGradient
                      colors={
                        loading || otp.length !== 6
                          ? ['#2a2a2a', '#1f1f1f', '#151515', '#0a0a0a']
                          : ['#5a5a5a', '#4a4a4a', '#3a3a3a', '#2a2a2a', '#1a1a1a', '#0f0f0f']
                      }
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: loading || otp.length !== 6 ? 4 : 8 },
                        shadowOpacity: loading || otp.length !== 6 ? 0.2 : 0.4,
                        shadowRadius: loading || otp.length !== 6 ? 12 : 24,
                        elevation: loading || otp.length !== 6 ? 2 : 8,
                      }}
                    >
                      <View className="py-4 px-6">
                        {loading ? (
                          <View className="flex-row items-center justify-center">
                            <ActivityIndicator color="#B8B8B8" className="mr-2" />
                            <Text className="text-white font-semibold text-lg">Verifying...</Text>
                          </View>
                        ) : (
                          <Text className="text-white font-semibold text-lg text-center">Verify</Text>
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setStep('email')}
                    disabled={loading}
                    className="py-4 px-6 border-2 border-[#5A5A5A] rounded-xl bg-[#333333]"
                  >
                    <Text className="text-[#CCCCCC] font-medium text-center">Back</Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text className="text-sm text-[#999999] text-center">
                    Didn&apos;t receive the code?{' '}
                    <Text
                      className="text-[#B8B8B8] font-medium"
                      onPress={() => !loading && setStep('email')}
                    >
                      Try a different email
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <View className="mt-6">
            <Text
              className="text-sm font-medium text-center text-[#B8B8B8]"
              onPress={() => openLink('https://portal.cdp.coinbase.com')}
            >
              Powered by Coinbase Developer Platform
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
