import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignInWithEmail, useVerifyEmailOTP } from '@coinbase/cdp-hooks';

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
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmail({ email });
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-6 justify-center">
        <Text className="text-4xl font-bold text-gray-900 mb-2">
          {step === 'email' ? 'Welcome' : 'Enter Code'}
        </Text>
        <Text className="text-gray-600 mb-8">
          {step === 'email' 
            ? 'Send USDC to friends with just their email' 
            : `We sent a code to ${email}`}
        </Text>

        {error ? (
          <View className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
            <Text className="text-danger-700">{error}</Text>
          </View>
        ) : null}

        {step === 'email' ? (
          <>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-4 text-base mb-4"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TouchableOpacity
              className="bg-primary-500 rounded-lg py-4 items-center"
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">Continue</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-4 text-center text-2xl tracking-widest mb-4"
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              editable={!loading}
            />
            <TouchableOpacity
              className="bg-primary-500 rounded-lg py-4 items-center mb-3"
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">Verify</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3 items-center"
              onPress={() => setStep('email')}
              disabled={loading}
            >
              <Text className="text-gray-600">Change email</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
