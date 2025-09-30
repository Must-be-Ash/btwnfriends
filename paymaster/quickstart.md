# Quickstart- Set up your Paymaster on your application

This Paymaster quickstart tutorial explains how to set up a basic app and sponsor transactions using [OnchainKit](https://onchainkit.xyz/) and Coinbase Smart Wallet.

## Getting an endpoint on Base Sepolia

> **How to Get a Paymaster & Bundler endpoint on Base testnet (Sepolia) from CDP**

1. [Create](https://coinbase.com/developer-platform) a new CDP account or [sign in](https://portal.cdp.coinbase.com) to your existing account.
2. Navigate to [Paymaster](https://portal.cdp.coinbase.com/products/bundler-and-paymaster).
3. Add the following address to the allowlist under **Configuration**—this is the address of the contract we are calling:

   ```
   0x67c97D1FB8184F038592b2109F854dfb09C77C75
   ```
4. Switch to Base testnet (Sepolia) in the top right of the configuration.
5. Copy your endpoint to use later.

<Accordion title="Expand for images and click to enlarge">
  <img src="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config.png?fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=a834cc544f4f4358fbe129d5c766c8c0" width="2976" height="1442" data-path="paymaster/images/pb-paymaster-config.png" srcset="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config.png?w=280&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=85d43e0044f95297a3a4d43b46c0757b 280w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config.png?w=560&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=a6cf251d4f3d67a268fcb870149ac396 560w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config.png?w=840&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=4c26f1f85112290558062b2594599c83 840w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config.png?w=1100&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=2d4bc0fe2a31d0884199b7e3f2cfb2d3 1100w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config.png?w=1650&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=7f2f93011b4ddb9540c71afca84bc3f7 1650w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config.png?w=2500&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=d518e5ec90b80da81ad77ffcb3473087 2500w" data-optimize="true" data-opv="2" />
</Accordion>

## Setting up an app template

Clone the repo

```js lines wrap
git clone https://github.com/coinbase/onchain-app-template.git
cd onchain-app-template
```

You can find the API key on the Coinbase Developer Portal's [OnchainKit page](https://portal.cdp.coinbase.com/products/onchainkit). If you don't have an account, you will need to create one.
You can find your Wallet Connector project ID at Wallet Connect.
Add the following to your `.env` file

```js lines wrap
NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT=ADD_YOUR_PAYMASTER_URL_HERE
NEXT_PUBLIC_CDP_API_KEY=ADD_YOUR_ONCHAINKIT_KEY_HERE
NEXT_PUBLIC_WC_PROJECT_ID=ADD_YOUR_PROJECT_ID_HERE
```

Install dependencies - run these in your terminal in the root of the project

```js lines wrap
# Install bun in case you don't have it
bun curl -fsSL <https://bun.sh/install> | bash

# Install packages
bun i
```

### Add your paymaster to the transact button

Navigate to `/src/components/OnchainProviders.tsx` and modify the OnchainKitProvider's `config` object to include the paymaster URL.

```js lines wrap

 <OnchainKitProvider 
    apiKey={NEXT_PUBLIC_CDP_API_KEY} 
    chain={baseSepolia} 
    config={{ paymaster: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT }}
    >
   {children}
 </OnchainKitProvider>


```

Navigate to `/src/components/TransactionWrapper.tsx` and modify the Transaction component to use the `isSponsored` prop.

```js lines wrap
      <Transaction
        isSponsored
        address={address}
        contracts={contracts}
        className="w-[450px]"
        chainId={BASE_SEPOLIA_CHAIN_ID}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton
          className="mt-0 mr-auto ml-auto w-[450px] max-w-full text-[white]"
          text="Collect"
        />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
```

### Start the app locally

```js lines wrap
bun run dev
```

### Open the app in your browser and sign in with a smart wallet

Navigate to [http://localhost:3000](http://localhost:3000)

Click connect and sign in with your smart wallet or create a new one.

### Initiate the transaction

Click the "Collect" button and your paymaster will sponsor. Note only Smart Wallets can have sponsored transactions so EOA accounts will not get sponsorship.

That's it! You've successfully set up your paymaster on your application.

## Other Examples

Additional documentation and information on Coinbase Smart Wallet is at [smartwallet.dev](https://smartwallet.dev/).

Check out how to build onchain applications with ease using [OnchainKit](https://onchainkit.xyz/)!
