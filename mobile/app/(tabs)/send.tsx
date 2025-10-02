import { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useCallback } from 'react';
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
  const params = useLocalSearchParams<{ contactEmail?: string; displayName?: string; amount?: string }>();
  
  const [currentStep, setCurrentStep] = useState<CurrentStep>('input');
  const [recipientInputStep, setRecipientInputStep] = useState<Step>('select_contact');
  const [pendingTransferData, setPendingTransferData] = useState<TransferData | null>(null);
  const [txHash, setTxHash] = useState<string>('');
  const [balance, setBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const { currentUser } = useCurrentUser();
  const evmAddress = useEvmAddress();
  const router = useRouter();

  const contactEmail = Array.isArray(params.contactEmail) ? params.contactEmail[0] : params.contactEmail;
  const displayName = Array.isArray(params.displayName) ? params.displayName[0] : params.displayName;
  const amountParam = Array.isArray(params.amount) ? params.amount[0] : params.amount;

  const preSelectedContact = contactEmail && displayName
    ? { contactEmail, displayName }
    : null;
  const preFilledAmount = amountParam || '';

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

  useFocusEffect(
    useCallback(() => {
      // Refresh balance when screen is focused
      fetchBalance();

      // Reset to initial state when screen is focused, unless coming from params
      if (!preSelectedContact && currentStep !== 'success') {
        setCurrentStep('input');
        setRecipientInputStep('select_contact');
        setPendingTransferData(null);
        setTxHash('');
      }
    }, [preSelectedContact, currentStep])
  );

  const handleTopBackButton = () => {
    if (recipientInputStep === 'enter_amount') {
      setRecipientInputStep('select_contact');
      setPendingTransferData(null);
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-[#222222]">
      <ScrollView className="flex-1">
        <View className="px-4 pt-16 pb-32">
          {currentStep !== 'confirmation' && (
            <TouchableOpacity
              onPress={handleTopBackButton}
              className="flex flex-row items-center gap-2 mb-12"
            >
              <ArrowLeft size={20} color="rgba(255,255,255,0.9)" />
              <Text className="text-white text-lg">Back</Text>
            </TouchableOpacity>
          )}

          {currentStep === 'input' && currentUser?.userId && (
            <RecipientInput
              onShowConfirmation={handleShowConfirmation}
              userBalance={balance}
              isLoadingBalance={isLoadingBalance}
              ownerUserId={currentUser.userId}
              preSelectedContact={
                pendingTransferData
                  ? { contactEmail: pendingTransferData.recipient.email, displayName: pendingTransferData.recipient.displayName || pendingTransferData.recipient.email }
                  : preSelectedContact
              }
              preFilledAmount={pendingTransferData?.amount || preFilledAmount}
              preselectedRecipient={pendingTransferData?.recipient || null}
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
      </ScrollView>
    </View>
  );
}
