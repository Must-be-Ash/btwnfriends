import { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { RecipientInput } from '../../components/send/RecipientInput';
import { SendConfirmation } from '../../components/send/SendConfirmation';
import { SendSuccess } from '../../components/send/SendSuccess';
import { getUSDCBalance } from '../../lib/usdc';

interface RecipientInfo {
  email: string;
  exists: boolean;
  displayName?: string;
  walletAddress?: string;
  transferType: 'direct' | 'escrow';
}

interface TransferData {
  recipient: RecipientInfo;
  amount: string;
}

type Step = 'select_contact' | 'enter_amount';
type CurrentStep = 'input' | 'confirmation' | 'success';

export default function SendScreen() {
  const [currentStep, setCurrentStep] = useState<CurrentStep>('input');
  const [recipientInputStep, setRecipientInputStep] = useState<Step>('select_contact');
  const [pendingTransferData, setPendingTransferData] = useState<TransferData | null>(null);
  const [txHash, setTxHash] = useState<string>('');
  const [balance, setBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const { currentUser } = useCurrentUser();
  const evmAddress = useEvmAddress();
  const router = useRouter();

  const fetchBalance = async () => {
    if (!evmAddress?.evmAddress) return;

    try {
      setIsLoadingBalance(true);
      const balanceValue = await getUSDCBalance(evmAddress.evmAddress);
      setBalance(balanceValue);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('0');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleShowConfirmation = (transferData: TransferData) => {
    setPendingTransferData(transferData);
    setCurrentStep('confirmation');
  };

  const handleConfirmationBack = () => {
    setCurrentStep('input');
    setPendingTransferData(null);
  };

  const handleSuccess = (hash: string) => {
    setTxHash(hash);
    setCurrentStep('success');
  };

  const handleStartOver = () => {
    setCurrentStep('input');
    setRecipientInputStep('select_contact');
    setPendingTransferData(null);
    setTxHash('');
  };

  const handleGoToDashboard = () => {
    router.push('/');
  };

  useEffect(() => {
    fetchBalance();
  }, [evmAddress?.evmAddress]);

  const handleTopBackButton = () => {
    if (recipientInputStep === 'enter_amount') {
      setRecipientInputStep('select_contact');
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-[#222222]">
      <ScrollView className="flex-1">
        <View className="px-4 pt-10 pb-6">
          <View className="max-w-md mx-auto space-y-6">
            {currentStep !== 'confirmation' && (
              <View className="flex flex-row items-center justify-between mb-8">
                <TouchableOpacity
                  onPress={handleTopBackButton}
                  className="flex flex-row items-center gap-2"
                >
                  <ArrowLeft size={16} color="rgba(255,255,255,0.7)" />
                  <Text className="text-white/70">Back</Text>
                </TouchableOpacity>
                <View />
              </View>
            )}

            {currentStep === 'input' && currentUser?.userId && (
              <RecipientInput
                onShowConfirmation={handleShowConfirmation}
                userBalance={balance}
                isLoadingBalance={isLoadingBalance}
                ownerUserId={currentUser.userId}
                preSelectedContact={null}
                preFilledAmount=""
                currentStep={recipientInputStep}
                onStepChange={setRecipientInputStep}
              />
            )}

            {currentStep === 'confirmation' && pendingTransferData && currentUser && (
              <SendConfirmation
                transferData={pendingTransferData}
                currentUser={currentUser}
                onSuccess={handleSuccess}
                onBack={handleConfirmationBack}
              />
            )}

            {currentStep === 'success' && txHash && pendingTransferData && (
              <SendSuccess
                transferData={pendingTransferData}
                txHash={txHash}
                onSendAnother={handleStartOver}
                onGoToDashboard={handleGoToDashboard}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
