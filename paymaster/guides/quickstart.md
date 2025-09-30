# Submit your first sponsored smart account transaction

This Paymaster quickstart tutorial explains how to submit your first smart account transaction on Base Sepolia using [Viem](https://viem.sh/), with gas sponsorship from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/products/bundler-and-paymaster). The example below sponsors an NFT mint, but can be updated to call your smart contract instead.

## Prerequisites

```
node >= 14.0.0
npm >= 6.0.0
```

## Getting an endpoint on Base Sepolia

> **How to Get a Paymaster & Bundler endpoint on Base testnet (Sepolia) from CDP**

1. [Create](https://coinbase.com/developer-platform) a new CDP account or [sign in](https://portal.cdp.coinbase.com) to your existing account.
2. Navigate to [Paymaster](https://portal.cdp.coinbase.com/products/bundler-and-paymaster).
3. The address of the NFT contract we are calling is `0x66519FCAee1Ed65bc9e0aCc25cCD900668D3eD49`, add that to the contract allowlist and save the policy.
4. Switch to Base testnet (Sepolia) in the top right of the configuration.
5. Copy your endpoint to use later.

<Accordion title="Expand for images and click to enlarge">
  <img src="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config-highlight.png?fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=cb6cba3f85becc7b7f0d25cc9e98646e" width="3434" height="1696" data-path="paymaster/images/pb-paymaster-config-highlight.png" srcset="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config-highlight.png?w=280&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=fa4791f1a5189656e27ee8c8a184c301 280w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config-highlight.png?w=560&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=b34d0774a679751c6d0dfec2ee0db25e 560w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config-highlight.png?w=840&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=5e640c27e666c31103fd4651ba3a0732 840w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config-highlight.png?w=1100&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=d99d73c48a6bd20333b7f61d18269814 1100w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config-highlight.png?w=1650&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=a0292d4071cfb7cb757f6106194d986e 1650w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-paymaster-config-highlight.png?w=2500&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=a0ebcd6d65b6f25c480edebe398b4d0d 2500w" data-optimize="true" data-opv="2" />
</Accordion>

## Sending a transaction

**How to call the mint function of a Base Sepolia NFT contract (or contract of choice)**

### 1. Initialize your project

In your terminal, create a directory called `paymaster-tutorial` and initialize a project using [npm](https://www.npmjs.com/).

```js lines wrap
mkdir paymaster-tutorial
cd paymaster-tutorial
npm init es6
```

### 2. Download dependencies

2. Install `viem`.

```js lines wrap
npm install viem
```

### 3. Create smart account using a private key

The example below uses Coinbase smart wallet, but any smart account will work.
a. Create a new private key with [Foundry](https://book.getfoundry.sh/reference/cast/cast-wallet-new).
b. Install Foundry: `curl -L https://foundry.paradigm.xyz | bash`
c. Generate a new key pair: `cast wallet new`.
d. Update your `config.js` file with the private key and create the account.

```js lines wrap
//config.js
import { createPublicClient, http } from 'viem'
import { toCoinbaseSmartAccount } from 'viem/account-abstraction'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// Your RPC url. Make sure you're using the right network (base vs base-sepolia)
export const RPC_URL = "https://api.developer.coinbase.com/rpc/v1/base-sepolia/<your-rpc-token>"

export const client = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
})

// Creates a Coinbase smart wallet using an EOA signer
const owner = privateKeyToAccount('<your-private-key>')
export const account = await toCoinbaseSmartAccount({
  client,
  owners: [owner]
}) 
```

### 4. Add your smart contract's ABI

Create a file called `example-app-abi.js` to store our NFT contract's abi and address. You will have to update this to your smart contract's ABI.

```js lines wrap
//example-app-abi.js
export const abi = [
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint16", name: "item", type: "uint16" },
    ],
    name: "mintTo",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
];
```

### 5. Create the Bundler and Paymaster clients, submit transaction

Create a new file called `index.js`

```ts [expandable] lines wrap
//index.js
import { http } from "viem";
import { baseSepolia } from "viem/chains";
import { createBundlerClient } from "viem/account-abstraction";
import { account, client, RPC_URL } from "./config.js";
import { abi } from "./example-app-abi.js";

// Logs your deterministic public address generated by your private key
console.log(`Minting nft to ${account.address}`)

// The bundler is a special node that gets your UserOperation on chain
const bundlerClient = createBundlerClient({
  account,
  client,
  transport: http(RPC_URL),
  chain: baseSepolia,
});

// The call for your app. You will have change this depending on your dapp's abi
const nftContractAddress = "0x66519FCAee1Ed65bc9e0aCc25cCD900668D3eD49"
const mintTo = {
  abi: abi,
  functionName: "mintTo",
  to: nftContractAddress,
  args: [account.address, 1],
};
const calls = [mintTo]

// Pads the preVerificationGas (or any other gas limits you might want) to ensure your UserOperation lands onchain
account.userOperation = {
  estimateGas: async (userOperation) => {
    const estimate = await bundlerClient.estimateUserOperationGas(userOperation);
    // adjust preVerification upward 
    estimate.preVerificationGas = estimate.preVerificationGas * 2n;
    return estimate;
  },
};

// Sign and send the UserOperation
try {
  const userOpHash = await bundlerClient.sendUserOperation({
    account,
    calls,
    paymaster: true
  });

  const receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  console.log("✅ Transaction successfully sponsored!");
  console.log(`⛽ View sponsored UserOperation on blockscout: https://base-sepolia.blockscout.com/op/${receipt.userOpHash}`);
  console.log(`🔍 View NFT mint on basescan: https://sepolia.basescan.org/address/${account.address}`);
  process.exit()
} catch (error) {
  console.log("Error sending transaction: ", error);
  process.exit(1)
}
```

In your terminal you can run this script using the below command from the correct directory

```js lines wrap
node index.js
```

## Next steps

Modify your allowlist and gas policy to ensure you only sponsor what you want!

## Other examples

Coinbase Smart wallet examples can be found on our other quickstart guide or on [smartwallet.dev](https://smartwallet.dev/).

Examples for integrations with other common SDKs can be found here [paymaster-bundler-examples](https://github.com/coinbase/paymaster-bundler-examples/tree/master/examples).

## Troubleshooting

If you run into any errors with this tutorial, please check out our [troubleshooting guide](/paymaster/reference-troubleshooting/troubleshooting).
