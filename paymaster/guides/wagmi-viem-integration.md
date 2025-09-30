# Integrating Base Paymaster for Gasless Transactions in a Wagmi Project

This guide covers the steps to add Base Paymaster support for gasless transactions in an existing Wagmi project. It focuses on configuring `wagmi.ts`, adding Base-specific information, configuring the Coinbase Developer Platform (CDP), and implementing Wagmi's experimental hooks for onchain actions.

## Initial setup: Configure CDP Account

[Create](https://coinbase.com/developer-platform) a new CDP account or [sign in](https://portal.cdp.coinbase.com) to your existing account.

### Obtain Paymaster & Bundler Endpoint

In your CDP dashboard, navigate to [**Onchain Tools > Paymaster**](https://portal.cdp.coinbase.com/products/bundler-and-paymaster). Then click the `Configuration` tab.

Select the chain, `Base` or `Base Sepolia`, you'd like to sponsor transactions on. Then copy the RPC URL in the **Paymaster & Bundler endpoint** section.

<Warning>
  Security

  This guide uses environment variables to store the Paymaster & Bundler endpoint obtained from cdp.portal.coinbase.com. The most secure way to do this is by using a proxy. For the purposes of this guide, the endpoint is hardcoded into our project file. For production, we highly recommend using a [proxy service](https://www.smartwallet.dev/guides/paymasters).
</Warning>

Add this key to your `.env` file as `NEXT_PUBLIC_CDP_PAYMASTER` or set up a [proxy service](https://www.smartwallet.dev/guides/paymasters) for production applications.

### Whitelist Contracts

In the **Contract allowlist** section, add the smart contract addresses you want to interact with using the Base Paymaster. Give each contract a name and be sure to include the specific functions as well as the contract address. Then click `Add`.

<Warning>
  WalletConnect Project ID

  Base Wallet (FKA Coinbase Smart Wallet) requires a WalletConnect project ID to work. If you don't have one, please obtain one (free) from [their website](https://cloud.reown.com/).
</Warning>

## Add Base to Wagmi configuration

Open your project's `wagmi.ts` to configure your project to support the Base network, WalletConnect, and Coinbase Wallet connectors:

**`wagmi.ts:`**

```typescript lines wrap
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(),
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
```

## Implement Wagmi Hooks

For the onchain actions (minting, etc.) of your application, use Wagmi’s [experimental hooks](https://wagmi.sh/react/api/hooks/useCallsStatus#:~:text=Utilities-,Experimental,-useCallsStatus) to manage wallet connection, check for paymaster capabilities, and execute onchain actions with you whitelisted contracts.

* [**`useCapabilities`**](https://wagmi.sh/react/api/hooks/useCapabilities): Retrieves the capabilities supported by the connected wallet, such as `paymasterService` for gasless transactions.
* [**`useWriteContracts`**](https://wagmi.sh/react/api/hooks/useWriteContracts): Executes onchain write actions, here used to call the `mintTo` function on the NFT contract.

Here's an example for a onchain action to mint an NFT:

**`mint/page.tsx`**

```tsx [expandable] lines wrap
'use client';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useMemo } from 'react';
import { coinbaseWallet } from 'wagmi/connectors';
import { abi, contractAddress } from '../utils';
import { useCapabilities, useWriteContracts } from 'wagmi/experimental';

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isMinting, setIsMinting] = useState(false);

  // Configure `useWriteContracts` to call the mint function on the contract
  const { writeContracts } = useWriteContracts({
    mutation: { onSuccess: () => console.log('Mint successful') },
  });

  const handleMint = async () => {
    setIsMinting(true);
    try {
      writeContracts({
        contracts: [
          {
            address: contractAddress,
            abi,
            functionName: 'mintTo',
            args: [address],
          },
        ],
        capabilities,
      });
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setIsMinting(false);
    }
  };

  // Check for paymaster capabilities with `useCapabilities`
  const { data: availableCapabilities } = useCapabilities({
    account: address,
  });
  const capabilities = useMemo(() => {
    if (!availableCapabilities || !address) return {};
    const capabilitiesForChain = availableCapabilities[address.chainId];
    if (
      capabilitiesForChain['paymasterService'] &&
      capabilitiesForChain['paymasterService'].supported
    ) {
      return {
        paymasterService: {
          url: `https://api.developer.coinbase.com/rpc/v1/base/<YOUR_PAYMASTER_URL>`, //For production use proxy
        },
      };
    }
    return {};
  }, [availableCapabilities, address]);

  return (
    <div>
      <p>
        {isConnected ? `Connected wallet: ${address}` : 'No wallet connected'}
      </p>
      <button
        onClick={
          isConnected
            ? handleMint
            : () => connect({ connector: coinbaseWallet() })
        }
      >
        {isMinting ? 'Minting...' : isConnected ? 'Mint NFT' : 'Connect Wallet'}
      </button>
      {isConnected && <button onClick={() => disconnect()}>Disconnect</button>}
    </div>
  );
}
```

By following these steps, you have integrated the Base Paymaster into your Wagmi project, allowing for gasless onchain interactions.

## Troubleshooting

If you run into any errors with this tutorial, please check out our [troubleshooting guide](/paymaster/reference-troubleshooting/troubleshooting).
