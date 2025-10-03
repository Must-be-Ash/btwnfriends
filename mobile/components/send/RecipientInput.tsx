import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { AmountInput } from './AmountInput';
import { ContactSearch } from '../contacts/ContactSearch';
import { ContactAvatar } from '../ui/ContactAvatar';
import { SendButton3D } from '../ui/SendButton3D';
import { useApi } from '../../lib/use-api';

interface RecipientInfo {
  email: string;
  exists: boolean;
  displayName?: string;
  walletAddress?: string;
  transferType: 'direct' | 'escrow';
}

interface SelectedContact {
  contactEmail: string;
  displayName: string;
}

interface TransferData {
  recipient: RecipientInfo;
  amount: string;
}

interface RecipientInputProps {
  onShowConfirmation: (transferData: TransferData) => void;
  userBalance: string;
  isLoadingBalance: boolean;
  ownerUserId: string;
  preSelectedContact?: {contactEmail: string; displayName: string} | null;
  preFilledAmount?: string;
  preselectedRecipient?: RecipientInfo | null;
  currentStep: Step;
  onStepChange: (step: Step) => void;
}

type Step = 'select_contact' | 'enter_amount';

export function RecipientInput({
  onShowConfirmation,
  userBalance,
  isLoadingBalance,
  ownerUserId,
  preSelectedContact,
  preFilledAmount,
  preselectedRecipient,
  currentStep,
  onStepChange
}: RecipientInputProps) {
  const { api, isReady: isApiReady } = useApi();
  const [selectedContact, setSelectedContact] = useState<SelectedContact | null>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState<RecipientInfo | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    if (preselectedRecipient && preSelectedContact) {
      // Coming back from confirmation - restore state directly without API call
      setSelectedContact(preSelectedContact);
      setRecipient(preselectedRecipient);
      onStepChange('enter_amount');
    } else if (preSelectedContact && !selectedContact) {
      // Fresh selection - need to look up recipient
      handleContactSelect(preSelectedContact);
    }
  }, [preSelectedContact, preselectedRecipient]);

  useEffect(() => {
    if (preFilledAmount) {
      setAmount(preFilledAmount);
    }
  }, [preFilledAmount]);

  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount);
      const numBalance = parseFloat(userBalance);
      
      if (isNaN(numAmount) || numAmount <= 0) {
        setAmountError('Amount must be greater than $0');
      } else if (numAmount > numBalance) {
        setAmountError('Amount exceeds your balance');
      } else {
        setAmountError('');
      }
    } else {
      setAmountError('');
    }
  }, [amount, userBalance]);

  const handleContactSelect = async (contact: SelectedContact) => {
    if (!isApiReady) {
      console.error('API not ready - waiting for authentication');
      setLookupError('Please wait, authenticating...');
      return;
    }

    setSelectedContact(contact);
    setLookupError('');
    setIsLookingUp(true);

    // Change step immediately so user sees amount entry screen
    onStepChange('enter_amount');

    try {
      console.log('🔍 MOBILE: Looking up recipient:', contact.contactEmail);
      const response = await api.post('/api/recipients/lookup', {
        email: contact.contactEmail
      });

      console.log('🔍 MOBILE: Lookup response:', JSON.stringify(response.data, null, 2));
      const recipientInfo = response.data?.recipient;

      if (!recipientInfo || !recipientInfo.email) {
        console.error('🔍 MOBILE: Invalid recipient data - recipientInfo:', recipientInfo);
        throw new Error('Invalid recipient data received');
      }

      console.log('🔍 MOBILE: Setting recipient info:', recipientInfo);
      setRecipient(recipientInfo);
    } catch (error: any) {
      console.error('🔍 MOBILE: Recipient lookup error:', error);
      console.error('🔍 MOBILE: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setLookupError('Failed to lookup recipient. Please try again.');
      // Go back to contact selection on error
      onStepChange('select_contact');
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleAmountConfirm = () => {
    if (!amount || amountError || !recipient) return;
    onShowConfirmation({ recipient, amount });
  };

  const canProceedAmount = amount && !amountError && !isLoadingBalance;

  return (
    <View>
      {currentStep === 'select_contact' && (
        <View>
          <View className="bg-[#3B3B3B] rounded-2xl p-4 border border-white/30 shadow-2xl">
            <Text className="text-lg font-semibold text-white mb-3">Recipient</Text>

            <ContactSearch
              ownerUserId={ownerUserId}
              onContactSelect={handleContactSelect}
              placeholder="Search contacts..."
            />

            {lookupError && (
              <View className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                <View className="flex flex-row items-start">
                  <AlertCircle size={20} color="#fca5a5" className="mt-0.5" />
                  <Text className="ml-2 text-sm text-red-300">{lookupError}</Text>
                </View>
              </View>
            )}

            {isLookingUp && (
              <View className="mt-4 flex items-center justify-center py-8">
                <View className="flex flex-row items-center">
                  <ActivityIndicator size="small" color="rgba(184,184,184,1)" />
                  <Text className="ml-3 text-white/70">Looking up recipient...</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {currentStep === 'enter_amount' && selectedContact && recipient && (
        <View>
          <View className="bg-[#3B3B3B] rounded-2xl p-4 border border-white/30 shadow-2xl mb-4">
            <Text className="text-lg font-semibold text-white mb-3">Sending to</Text>

            <View className="flex flex-row items-center gap-4">
              <ContactAvatar
                contact={{
                  displayName: selectedContact.displayName,
                  contactEmail: selectedContact.contactEmail
                }}
                size="lg"
              />
              <View className="flex-1">
                <Text className="font-semibold text-white text-lg">{selectedContact.displayName}</Text>
                <Text className="text-white/70 text-sm">{selectedContact.contactEmail}</Text>
              </View>
            </View>
          </View>

          <View className="bg-[#3B3B3B] rounded-2xl p-4 border border-white/30 shadow-2xl mb-6">
            <AmountInput
              amount={amount}
              onAmountChange={setAmount}
              userBalance={userBalance}
              isLoadingBalance={isLoadingBalance}
              error={amountError}
            />
          </View>

          <SendButton3D
            onPress={handleAmountConfirm}
            disabled={!canProceedAmount}
          >
            Send {amount ? `$${amount}` : 'Amount'}
          </SendButton3D>
        </View>
      )}
    </View>
  );
}
