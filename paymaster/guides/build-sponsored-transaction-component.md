# Build a Sponsored Transaction Component

## Overview

Gasless transactions are the future of user onboarding. When users interact with your app for the first time, they shouldn't need to pay gas just to get started. By using a Paymaster with Smart Wallets on Base, you can sponsor gas fees for onchain interactions—creating a frictionless, seamless experience for your users. In this guide, you'll learn how to build a reusable component that makes sponsored transactions possible, from allowlisting your contract to wiring up the frontend with Wagmi, Viem, and OnchainKit.

## Prerequisites

Before you get started, make sure you have the following ready:

* A deployed contract (on Base Mainnet or Base Sepolia)
* Viem v2.23.12
* Wagmi v2.14.15
* A Coinbase Developer Platform (CDP) account
* OnchainKit

<Note>
  Please use the specified versions of Wagmi and Viem for full compatibility with Base Wallet.
</Note>

## Allowlist Your Contract

To sponsor gas for your application, you first need to allowlist the contract and function you want to support.

1. Go to [https://portal.cdp.coinbase.com/](https://portal.cdp.coinbase.com/)
2. Navigate to **Onchain Tools > Paymaster** in the left-hand sidebar.
3. Under the **Configuration** tab, click **Enable Paymaster**, then select **Add**.
4. Input your contract address. For this example, we'll use:

```
0x27B535E9D8FDBCa81741e9a812Dd72656B125831
```

5. Specify the function signature: `startGame(uint256)`
6. Click **Save** to finalize the configuration.

## Set Up Your Constants File

Let's set up a file to store important contract data.

Create a file at `app/utils/constants.ts`:

```ts
// app/utils/constants.ts

export const GUESS_GAME_ADDRESS = '0x27B535E9D8FDBCa81741e9a812Dd72656B125831' as `0x${string}`;
export const PLAY_FEE = '0.00005';
export const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_PROXY_SERVER_URL;
```

This file holds your contract address, entry fee, and the Paymaster URL that enables gas sponsorship.

## Add the Contract ABI

We'll need the contract ABI to encode the correct function calls.

1. Create a new directory: `app/utils/abis`
2. Add a file called `GuessGameABI.ts` inside it.
3. Paste the ABI you retrieved from a block explorer like Basescan or Blockscout.

```ts
// app/utils/abis/GuessGameABI.ts

export const GuessGameABI = [
  {
    inputs: [{ internalType: 'uint256', name: '_playFee', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  // ...additional entries...
] as const;
```

<Tip>
  You can find verified contract ABIs on [Basescan](https://basescan.org/). Navigate to the contract address, go to the **Contract** tab, and copy the ABI.
</Tip>

## Build the Sponsored Transaction Component

Let's build a reusable `PlayButton` component that triggers a sponsored transaction using Wagmi + Viem.

Create a new file: `app/components/PlayButton.tsx`

Import the necessary modules:

```ts
import { useAccount, useSwitchChain } from 'wagmi';
import { useState } from 'react';
import { GuessGameABI } from '../utils/abis/GuessGameABI';
import { base } from 'viem/chains';
import { parseEther, encodeFunctionData } from 'viem';
import { useSendCalls } from 'wagmi/experimental';
import {
  GUESS_GAME_ADDRESS,
  PAYMASTER_URL,
  PLAY_FEE,
} from '../utils/constants';
```

Set up your state and wallet connection:

```tsx
export function PlayButton({ onSuccess, finalScore }: PlayButtonProps) {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
```

Now implement the transaction logic using Wagmi's `sendCalls`:

```ts
  const handlePlay = async () => {
    if (!account.isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!account.chainId || account.chainId !== base.id) {
      useSwitchChain({ chainId: base.id });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = encodeFunctionData({
        abi: GuessGameABI,
        functionName: 'startGame',
      });

      await sendCalls({
        calls: [
          {
            to: GUESS_GAME_ADDRESS,
            data,
            value: parseEther(PLAY_FEE),
          },
        ],
        capabilities: {
          paymasterService: {
            url: PAYMASTER_URL,
          },
        },
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
```

Render the button UI:

```tsx
  return (
    <div className='w-full'>
      {error && <p className='text-red-500'>{error}</p>}
      {success && <p className='text-green-500'>Game started successfully! 🎮</p>}

      <button
        onClick={handlePlay}
        disabled={isLoading || !account.isConnected}
        className='w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
      >
        {isLoading ? (
          <span className='flex items-center'>
            <span className='animate-spin h-5 w-5 border-b-2 border-white mr-2'></span>
            Starting Game...
          </span>
        ) : !account.isConnected ? (
          'Connect Wallet'
        ) : finalScore !== undefined ? (
          'Play Again'
        ) : (
          'Start Game'
        )}
      </button>
    </div>
  );
}
```

## You're Ready!

You've now created a gasless transaction component that connects to your smart contract, handles wallet logic, and leverages the Coinbase Paymaster to sponsor transactions.

Use this setup as a foundation for other gasless interactions in your dapp. Adjust the contract address, ABI, and function calls to match your specific needs.

**Next step:** Add logic to display user progress or game state once a transaction is confirmed.

Happy building! 🚀
