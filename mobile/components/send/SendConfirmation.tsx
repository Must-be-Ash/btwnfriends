import { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useGetAccessToken, useSendUserOperation, useCurrentUser } from '@coinbase/cdp-hooks';
import { keccak256, toBytes } from 'viem';
import { AlertCircle } from 'lucide-react-native';
import { SendButton3D } from '../ui/SendButton3D';
import { Button3D } from '../ui/Button3D';
import { formatUSDCWithSymbol } from '../../lib/utils';
import { getCDPNetworkName, prepareUSDCTransferCall, prepareUSDCApprovalCall, prepareEscrowDepositCall, SmartAccountCall } from '../../lib/cdp';
import { api } from '../../lib/api';

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

interface CDPUser {
  userId: string;
  email?: string;
  evmSmartAccounts?: string[];
}

interface SendConfirmationProps {
  transferData: TransferData;
  currentUser: CDPUser;
  onSuccess: (txHash: string) => void;
  onBack: () => void;
}

export function SendConfirmation({ transferData, currentUser, onSuccess, onBack }: SendConfirmationProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  
  const { recipient, amount } = transferData;
  const isDirect = recipient.transferType === 'direct';
  
  const { currentUser: cdpUser } = useCurrentUser();
  const { sendUserOperation } = useSendUserOperation();
  
  const smartAccount = cdpUser?.evmSmartAccounts?.[0];

  const handleConfirmSend = async () => {
    if (isProcessing || !smartAccount) return;

    setIsProcessing(true);
    setError(null);
    setCurrentStep('Preparing transaction...');

    try {
      if (isDirect) {
        await handleDirectTransfer();
      } else {
        await handleEscrowTransfer();
      }
    } catch (error) {
      console.error('Send failed:', error);
      setError(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectTransfer = async () => {
    if (!smartAccount || !recipient.walletAddress) {
      throw new Error('Missing smart account or recipient wallet address');
    }

    setCurrentStep('Sending USDC...');

    const transferCall = prepareUSDCTransferCall(recipient.walletAddress, amount);

    const result = await sendUserOperation({
      evmSmartAccount: smartAccount as `0x${string}`,
      network: getCDPNetworkName(),
      calls: [transferCall],
      useCdpPaymaster: true
    });

    await recordTransactionHistory(result.userOperationHash, 'direct');
    onSuccess(result.userOperationHash);
  };

  const handleEscrowTransfer = async () => {
    if (!smartAccount) {
      throw new Error('Smart account not available');
    }

    setCurrentStep('Creating escrow deposit...');

    const approvalResponse = await api.post('/api/send', {
      userId: currentUser.userId,
      senderAddress: smartAccount,
      recipientEmail: recipient.email,
      amount: amount,
      smartAccountMode: true
    });

    const transferId = approvalResponse.data?.transfer?.transferId;
    const escrowAddress = approvalResponse.data?.escrowAddress;
    
    if (!transferId) {
      throw new Error('No transfer ID received from server');
    }

    const recipientEmailHash = keccak256(toBytes(recipient.email.toLowerCase()));
    const escrowCall = prepareEscrowDepositCall(transferId, amount, recipientEmailHash, escrowAddress, 7);
    const calls: SmartAccountCall[] = [];

    if (approvalResponse.data?.requiresApproval) {
      setCurrentStep('Approving USDC for escrow...');
      const approvalCall = prepareUSDCApprovalCall(escrowAddress, amount);
      calls.push(approvalCall);
    }

    calls.push(escrowCall);

    const result = await sendUserOperation({
      evmSmartAccount: smartAccount as `0x${string}`,
      network: getCDPNetworkName(),
      calls,
      useCdpPaymaster: true
    });

    await api.put('/api/send', {
      transferId: transferId,
      txHash: result.userOperationHash,
      transferType: 'escrow'
    });

    await recordTransactionHistory(result.userOperationHash, 'escrow', transferId);
    onSuccess(result.userOperationHash);
  };

  const recordTransactionHistory = async (txHash: string, transferType: 'direct' | 'escrow', transferId?: string) => {
    try {
      await api.post('/api/send/complete', {
        userId: currentUser.userId,
        txHash: txHash,
        transferType: transferType,
        recipient: {
          email: recipient.email,
          displayName: recipient.displayName,
          exists: recipient.exists,
        },
        amount: amount,
        transferId: transferId
      });
    } catch (historyError) {
      console.error('Failed to record transaction history:', historyError);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#222222]">
      <View className="p-6 space-y-6">
        <View className="rounded-2xl p-8">
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-full mb-6 bg-[#4A4A4A] border border-[#6B6B6B] items-center justify-center">
              <Text className="text-4xl">💸</Text>
            </View>
            
            <Text className="text-xl font-semibold text-white mb-3 text-center">
              Confirm Your Transfer
            </Text>
            
            <Text className="text-[#B8B8B8] text-center">
              Ready to send money {isDirect ? 'directly' : 'via email'}
            </Text>
          </View>

          <View className="bg-[#2A2A2A] rounded-xl py-6 px-6 border border-[#4A4A4A] space-y-5">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-[#B8B8B8]">Sending</Text>
              <Text className="text-xl font-bold text-white">
                {formatUSDCWithSymbol(amount)}
              </Text>
            </View>
            
            <View className="flex flex-row justify-between items-start">
              <Text className="text-[#B8B8B8]">To</Text>
              <View className="flex-1 items-end">
                <Text className="font-medium text-white text-right">
                  {recipient.displayName || recipient.email}
                </Text>
                {recipient.displayName && (
                  <Text className="text-sm text-[#999999] mt-1 text-right">{recipient.email}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {error && (
          <View className="bg-[#4A2A2A] rounded-2xl p-6 border border-[#6B3B3B]">
            <View className="flex flex-row items-start">
              <AlertCircle size={20} color="#CC6666" className="mt-1 mr-4" />
              <View className="flex-1">
                <Text className="font-medium text-[#FFAAAA] mb-2">Transaction Failed</Text>
                <Text className="text-[#CCAAAA] text-sm">{error}</Text>
              </View>
            </View>
          </View>
        )}

        <View className="flex flex-row gap-3">
          <View className="flex-1">
            <Button3D onPress={onBack} disabled={isProcessing}>
              Back
            </Button3D>
          </View>
          <View className="flex-1">
            <SendButton3D onPress={handleConfirmSend} disabled={isProcessing}>
              {isProcessing ? 'Sending...' : `Send ${formatUSDCWithSymbol(amount)}`}
            </SendButton3D>
          </View>
        </View>

        {isProcessing && (
          <View className="items-center pt-2">
            <View className="flex flex-row items-center">
              <ActivityIndicator size="small" color="rgba(184,184,184,1)" />
              <Text className="ml-2 text-sm text-[#B8B8B8]">
                {currentStep || 'Processing transaction...'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
