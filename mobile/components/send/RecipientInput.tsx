import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { AmountInput } from './AmountInput';
import { ContactSearch } from '../contacts/ContactSearch';
import { ContactAvatar } from '../ui/ContactAvatar';
import { SendButton3D } from '../ui/SendButton3D';
import { api } from '../../lib/api';

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
  currentStep, 
  onStepChange 
}: RecipientInputProps) {
  const [selectedContact, setSelectedContact] = useState<SelectedContact | null>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState<RecipientInfo | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    if (preSelectedContact) {
      handleContactSelect(preSelectedContact);
    }
  }, [preSelectedContact]);

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
    setSelectedContact(contact);
    setLookupError('');
    setIsLookingUp(true);

    try {
      const response = await api.post('/api/recipients/lookup', {
        email: contact.contactEmail
      });

      const recipientInfo = response.data?.recipient;
      
      if (!recipientInfo || !recipientInfo.email) {
        throw new Error('Invalid recipient data received');
      }
      
      setRecipient(recipientInfo);
      onStepChange('enter_amount');
    } catch (error) {
      console.error('Recipient lookup error:', error);
      setLookupError('Failed to lookup recipient. Please try again.');
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
    <View className="space-y-6">
      {currentStep === 'select_contact' && (
        <View className="space-y-6">
          <View className="text-center">
            <Text className="text-2xl font-bold text-white mb-2 text-center">Send Money</Text>
            <Text className="text-white/70 text-center">Choose who to send money to</Text>
          </View>

          <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30">
            <Text className="text-lg font-semibold text-white mb-4">Recipient</Text>

            <ContactSearch
              ownerUserId={ownerUserId}
              onContactSelect={handleContactSelect}
              placeholder="Search contacts or enter email address..."
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
        <View className="space-y-6">
          <View className="text-center">
            <Text className="text-2xl font-bold text-white mb-2 text-center">Enter Amount</Text>
            <Text className="text-white/70 text-center">How much would you like to send?</Text>
          </View>

          <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30">
            <Text className="text-lg font-semibold text-white mb-4">Sending to</Text>
            
            <View className="flex flex-row items-center gap-4">
              <ContactAvatar 
                contact={{
                  displayName: selectedContact.displayName,
                  contactEmail: selectedContact.contactEmail
                }} 
                size="lg"
              />
              <View className="flex-1">
                <Text className="font-semibold text-white">{selectedContact.displayName}</Text>
                <Text className="text-white/70 text-sm">{selectedContact.contactEmail}</Text>
              </View>
            </View>
          </View>

          <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30">
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
