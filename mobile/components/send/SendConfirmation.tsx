import { useState } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useGetAccessToken, useSendUserOperation, useCurrentUser } from '@coinbase/cdp-hooks';
import { getUserOperation } from '@coinbase/cdp-core';
import { keccak256, toBytes } from 'viem';
import { AlertCircle } from 'lucide-react-native';
import { SendButton3D } from '../ui/SendButton3D';
import { formatUSDCWithSymbol } from '../../lib/utils';
import { getCDPNetworkName, prepareUSDCTransferCall, prepareUSDCApprovalCall, prepareEscrowDepositCall, SmartAccountCall } from '../../lib/cdp';
import { createAuthenticatedApi } from '../../lib/api';

// Helper function to poll for user operation completion
async function waitForUserOperationComplete(
  userOperationHash: string,
  smartAccount: string,
  network: string,
  maxAttempts = 60,
  pollInterval = 2000
): Promise<{ transactionHash: string }> {
  for (let i = 0; i < maxAttempts; i++) {
    const userOp = await getUserOperation({
      userOperationHash: userOperationHash as `0x${string}`,
      evmSmartAccount: smartAccount as `0x${string}`,
      network: network as any
    });

    if (userOp.status === 'complete' && userOp.transactionHash) {
      return { transactionHash: userOp.transactionHash };
    }

    if (userOp.status === 'failed') {
      throw new Error('User operation failed');
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Transaction confirmation timeout');
}

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
  const { getAccessToken } = useGetAccessToken();

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

    console.log('✅ Smart Account Direct Transfer - User Operation Hash:', result.userOperationHash);

    // Wait for the operation to complete and get the real transaction hash
    setCurrentStep('Waiting for confirmation...');
    const { transactionHash } = await waitForUserOperationComplete(
      result.userOperationHash,
      smartAccount,
      getCDPNetworkName()
    );

    console.log('✅ Smart Account Direct Transfer - Transaction Hash:', transactionHash);

    await recordTransactionHistory(transactionHash, 'direct');
    onSuccess(transactionHash);
  };

  const handleEscrowTransfer = async () => {
    if (!smartAccount) {
      throw new Error('Smart account not available');
    }

    setCurrentStep('Creating escrow deposit...');

    const accessToken = await getAccessToken();
    const authenticatedApi = createAuthenticatedApi(accessToken);

    const approvalResponse = await authenticatedApi.post('/api/send', {
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

    console.log('✅ Smart Account Escrow Deposit - User Operation Hash:', result.userOperationHash);

    // Wait for the operation to complete and get the real transaction hash
    setCurrentStep('Waiting for confirmation...');
    const { transactionHash } = await waitForUserOperationComplete(
      result.userOperationHash,
      smartAccount,
      getCDPNetworkName()
    );

    console.log('✅ Smart Account Escrow Deposit - Transaction Hash:', transactionHash);

    await authenticatedApi.put('/api/send', {
      transferId: transferId,
      txHash: transactionHash,
      transferType: 'escrow'
    });

    await recordTransactionHistory(transactionHash, 'escrow', transferId);
    onSuccess(transactionHash);
  };

  const recordTransactionHistory = async (txHash: string, transferType: 'direct' | 'escrow', transferId?: string) => {
    try {
      const accessToken = await getAccessToken();
      const authenticatedApi = createAuthenticatedApi(accessToken);

      await authenticatedApi.post('/api/send/complete', {
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
    <View className="flex-1 bg-[#222222]">
      <View style={{ height: 120 }} />

      <View className="items-center pb-8">
        <View className="w-24 h-24 rounded-full bg-[#3B3B3B] border border-white/20 items-center justify-center mb-6">
          <Text className="text-5xl">💸</Text>
        </View>

        <Text className="text-2xl font-bold text-white mb-2 text-center">
          Confirm Your Transfer
        </Text>

        <Text className="text-white/70 text-center">
          Ready to send money {isDirect ? 'directly' : 'via email'}
        </Text>
      </View>

      <View className="px-4 pb-32">
        <View className="bg-[#3B3B3B] rounded-2xl p-4 border border-white/30 shadow-2xl mb-8">
          <View className="flex flex-row justify-between items-center mb-5">
            <Text className="text-white/70 text-base">Sending</Text>
            <Text className="text-2xl font-bold text-white">
              {formatUSDCWithSymbol(amount)}
            </Text>
          </View>

          <View className="h-px bg-white/10 mb-5" />

          <View className="flex flex-row justify-between items-start">
            <Text className="text-white/70 text-base">To</Text>
            <View className="flex-1 items-end">
              <Text className="font-semibold text-white text-right text-lg">
                {recipient.displayName || recipient.email}
              </Text>
              {recipient.displayName && (
                <Text className="text-sm text-white/70 mt-1 text-right">{recipient.email}</Text>
              )}
            </View>
          </View>
        </View>

        {error && (
          <View className="bg-red-500/20 rounded-2xl p-4 border border-red-400/30 mb-8">
            <View className="flex flex-row items-start">
              <AlertCircle size={20} color="#fca5a5" className="mt-1 mr-3" />
              <View className="flex-1">
                <Text className="font-semibold text-red-300 mb-1">Transaction Failed</Text>
                <Text className="text-red-300/80 text-sm">{error}</Text>
              </View>
            </View>
          </View>
        )}

        {isProcessing && (
          <View className="items-center mb-8">
            <View className="flex flex-row items-center">
              <ActivityIndicator size="small" color="rgba(184,184,184,1)" />
              <Text className="ml-3 text-white/70">
                {currentStep || 'Processing transaction...'}
              </Text>
            </View>
          </View>
        )}

        <View className="gap-3">
          <SendButton3D onPress={handleConfirmSend} disabled={isProcessing}>
            {isProcessing ? 'Sending...' : `Send ${formatUSDCWithSymbol(amount)}`}
          </SendButton3D>

          <Pressable
            onPress={isProcessing ? undefined : onBack}
            disabled={isProcessing}
            className="w-full rounded-2xl p-4"
            style={{
              backgroundColor: isProcessing ? '#3A3A3A' : '#444444',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-semibold text-lg text-center">
              Back
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
