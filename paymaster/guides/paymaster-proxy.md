# Creating a Paymaster Proxy for Secured Sponsored Transactions

One of the biggest UX enhancements unlocked by Smart Wallet is the ability for app developers to sponsor their users' transactions. If your app supports Smart Wallet, you can start sponsoring your users' transactions by using [standardized paymaster service communication](https://erc7677.xyz) enabled by [new wallet RPC methods](https://eip5792.xyz).

The code below is also in our [Wagmi Smart Wallet template](https://github.com/wilsoncusack/wagmi-scw/).

**About The Hooks Used Below**

The `useWriteContracts` and `useCapabilities` hooks used below rely on new wallet RPC and are not yet supported in most wallets.
It is recommended to have a fallback function if your app supports wallets other than Smart Wallet.

## Using Wagmi/Viem in a Next.js app

### Choose a paymaster service provider

As a prerequisite, you'll need to obtain a paymaster service URL from a paymaster service provider.

We recommend the [Coinbase Developer Platform](https://www.coinbase.com/developer-platform) paymaster,
currently offering up to \$15k in gas credits as part of the Base Gasless Campaign.
Once you have signed up for Coinbase Developer Platform, you get your Paymaster service URL by navigating to Onchain Tools > Paymaster as shown below:

<Frame>
  <img src="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/PaymasterCDP.png?fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=3809d864692e6edd875740bbd1181f24" width="1800" height="1502" data-path="paymaster/images/PaymasterCDP.png" srcset="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/PaymasterCDP.png?w=280&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=ce347f5649b75c158769be4a956cb039 280w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/PaymasterCDP.png?w=560&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=810440270346ff85e2bbc1f90f6cbcae 560w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/PaymasterCDP.png?w=840&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=732b9c114a3ed695eeea36589d4f1be5 840w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/PaymasterCDP.png?w=1100&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=287e772c3462cd9114da381c5953ee63 1100w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/PaymasterCDP.png?w=1650&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=c9fc57cbdd2b80dd7f9bf23948db9223 1650w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/PaymasterCDP.png?w=2500&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=2d16645fe7a178b102e5c4762335fbb0 2500w" data-optimize="true" data-opv="2" />
</Frame>

Once you choose a paymaster service provider and obtain a paymaster service URL, you can proceed to integration.

**ERC-7677-Compliant Paymaster Providers**

To be compatible with Smart Wallet, the paymaster provider you choose must be [ERC-7677-compliant](https://www.erc7677.xyz/ecosystem/paymasters).

### Validate UserOperation

The policies on many paymaster services are quite simple and limited. As your API will be exposed on the web,
you want to make sure in cannot abused: called to sponsor transaction you do not want to fund. The checks below
are a bit tedious, but highly recommended to be safe. See "Trust and Validation" [here](https://hackmd.io/@AhweV9sISeevhvrtVPCGDw/BynRsX7Ca#Trust-and-Validation)
for more on this.

The goal of this section is to write a `willSponsor` function to add some extra validation if needed.

<Info>
  \[Simplifying willSponsor with Allowlisting]

  `willSponsor` can be simplified or removed entirely if your paymaster service supports allowlisting which
  contracts and function calls should be sponsored. [Coinbase Developer Platform](https://www.coinbase.com/developer-platform) supports this.
</Info>

The code below is built specifically for Smart Wallet. It would need to be updated to support other smart accounts.

```ts twoslash [utils.ts] [expandable] lines wrap
// @errors: 2305
// @noErrors
import { UserOperation } from "viem/account-abstraction";
import { entryPoint06Address } from "viem/account-abstraction";
import {
  Address,
  BlockTag,
  Hex,
  decodeAbiParameters,
  decodeFunctionData,
} from "viem";
import { baseSepolia } from "viem/chains";
import { client } from "./config";
import {
  coinbaseSmartWalletABI,
  coinbaseSmartWalletProxyBytecode,
  coinbaseSmartWalletV1Implementation,
  erc1967ProxyImplementationSlot,
  magicSpendAddress,
} from "./constants";
import { myNFTABI, myNFTAddress } from "@/ABIs/myNFT";

// @noErrors 

export async function willSponsor({
  chainId,
  entrypoint,
  userOp,
}: { chainId: number; entrypoint: string; userOp: UserOperation<'0.6'> }) {
  // check chain id
  if (chainId !== baseSepolia.id) return false;
  // check entrypoint
  // not strictly needed given below check on implementation address, but leaving as example
  if (entrypoint.toLowerCase() !== entryPoint06Address.toLowerCase())
    return false;

  try {
    // check the userOp.sender is a proxy with the expected bytecode
    const code = await client.getBytecode({ address: userOp.sender });
    if (code != coinbaseSmartWalletProxyBytecode) return false;

    // check that userOp.sender proxies to expected implementation
    const implementation = await client.request<{
      Parameters: [Address, Hex, BlockTag];
      ReturnType: Hex;
    }>({
      method: "eth_getStorageAt",
      params: [userOp.sender, erc1967ProxyImplementationSlot, "latest"],
    });
    const implementationAddress = decodeAbiParameters(
      [{ type: "address" }],
      implementation,
    )[0];
    if (implementationAddress != coinbaseSmartWalletV1Implementation)
      return false;

    // check that userOp.callData is making a call we want to sponsor
    const calldata = decodeFunctionData({
      abi: coinbaseSmartWalletABI,
      data: userOp.callData,
    });

    // keys.coinbase.com always uses executeBatch
    if (calldata.functionName !== "executeBatch") return false;
    if (!calldata.args || calldata.args.length == 0) return false;

    const calls = calldata.args[0] as {
      target: Address;
      value: bigint;
      data: Hex;
    }[];
    // modify if want to allow batch calls to your contract
    if (calls.length > 2) return false;

    let callToCheckIndex = 0;
    if (calls.length > 1) {
      // if there is more than one call, check if the first is a magic spend call
      if (calls[0].target.toLowerCase() !== magicSpendAddress.toLowerCase())
        return false;
      callToCheckIndex = 1;
    }

    if (
      calls[callToCheckIndex].target.toLowerCase() !==
      myNFTAddress.toLowerCase()
    )
      return false;

    const innerCalldata = decodeFunctionData({
      abi: myNFTABI,
      data: calls[callToCheckIndex].data,
    });
    if (innerCalldata.functionName !== "safeMint") return false;

    return true;
  } catch (e) {
    console.error(`willSponsor check failed: ${e}`);
    return false;
  }
}
```

```ts twoslash [constants.ts] filename="constants.ts" [expandable] lines wrap
export const coinbaseSmartWalletProxyBytecode =
  "0x363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3";
export const coinbaseSmartWalletV1Implementation =
  "0x000100abaad02f1cfC8Bbe32bD5a564817339E72";
export const magicSpendAddress = "0x011A61C07DbF256A68256B1cB51A5e246730aB92";
export const erc1967ProxyImplementationSlot =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

export const coinbaseSmartWalletABI = [
  {
    type: "function",
    name: "executeBatch",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        internalType: "struct CoinbaseSmartWallet.Call[]",
        components: [
          {
            name: "target",
            type: "address",
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "data",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
];
```

```ts twoslash [myNFT.ts] filename="myNFT.ts" lines wrap
export const myNFTABI = [
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "to", type: "address" }],
    name: "safeMint",
    outputs: [],
  },
] as const;

export const myNFTAddress = "0x119Ea671030FBf79AB93b436D2E20af6ea469a19";
```

```ts twoslash [config.ts] filename="config.ts" lines wrap
import { createClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { entryPoint06Address, createPaymasterClient, createBundlerClient } from "viem/account-abstraction";

export const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const paymasterService = process.env.PAYMASTER_SERVICE_URL!;

export const paymasterClient = createPaymasterClient({
  transport: http(paymasterService),
});

export const bundlerClient = createBundlerClient({
  chain: baseSepolia,
  paymaster: paymasterClient, 
  transport: http(paymasterService),
})
```

<Info>
  Protect Your Paymaster Service URL

  As you can see in the Paymaster transaction [component](https://github.com/wilsoncusack/wagmi-scw/blob/main/src/components/TransactWithPaymaster.tsx),
  we use a proxy to protect the paymaster service URL, because it is exposed on the client side.
</Info>

For local development, you can use the same URL for the paymaster service and the proxy.

We also created a [minimalist proxy API](https://github.com/wilsoncusack/wagmi-scw/blob/main/src/app/api/paymaster/route.ts)
which you can use as the `paymasterServiceUrl` in the [`TransactWithPaymaster` component](https://github.com/wilsoncusack/wagmi-scw/blob/main/src/components/TransactWithPaymaster.tsx).

### Send EIP-5792 requests with a paymaster service capability

Once you have your paymaster service set up, you can now pass its URL along to Wagmi's `useWriteContracts` hook.

<Tip>
  Using Your Proxy URL

  If you set up a proxy in your app's backend as recommended in step (2) above, you'll want to pass in the proxy URL you created.
</Tip>

```ts twoslash [page.tsx] filename="page.tsx" [expandable] lines wrap
// @noErrors
import { useAccount } from "wagmi";
import { useCapabilities, useWriteContracts } from "wagmi/experimental";
import { useMemo, useState } from "react";
import { CallStatus } from "./CallStatus";
import { myNFTABI, myNFTAddress } from "./myNFT";

export function App() {
  const account = useAccount();
  const [id, setId] = useState<string | undefined>(undefined);
  const { writeContracts } = useWriteContracts({
    mutation: { onSuccess: (id) => setId(id) },
  });
  const { data: availableCapabilities } = useCapabilities({
    account: account.address,
  });
  const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return {};
    const capabilitiesForChain = availableCapabilities[account.chainId];
    if (
      capabilitiesForChain["paymasterService"] &&
      capabilitiesForChain["paymasterService"].supported
    ) {
      return {
        const paymasterServiceUrl = process.env.NEXT_PUBLIC_PAYMASTER_PROXY_SERVER_URL
        paymasterService: {
          url: paymasterServiceUrl // You can also use the minimalist proxy we created: `${document.location.origin}/api/paymaster`
        },
      };
    }
    return {};
  }, [availableCapabilities, account.chainId]);

  return (
    <div>
      <h2>Transact With Paymaster</h2>
      <p>{JSON.stringify(capabilities)}</p>
      <div>
        <button
          onClick={() => {
            writeContracts({
              contracts: [
                {
                  address: myNFTAddress,
                  abi: myNFTABI,
                  functionName: "safeMint",
                  args: [account.address],
                },
              ],
              capabilities,
            });
          }}
        >
          Mint
        </button>
        {id && <CallStatus id={id} />}
      </div>
    </div>
  );
}
```

```ts twoslash [myNFT.ts] filename="myNFT.ts" lines wrap
export const myNFTABI = [
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "to", type: "address" }],
    name: "safeMint",
    outputs: [],
  },
] as const;

export const myNFTAddress = "0x119Ea671030FBf79AB93b436D2E20af6ea469a19";

```

**How to find this code in the repository?**

The code above is a simplified version of the code in the
[template](https://github.com/wilsoncusack/wagmi-scw/).

In the template, we create a [`TransactWithPaymaster`](https://github.com/wilsoncusack/wagmi-scw/blob/main/src/components/TransactWithPaymaster.tsx) component that uses the `useWriteContracts` hook to send a transaction with a paymaster.

The [`TransactWithPaymaster`](https://github.com/wilsoncusack/wagmi-scw/blob/main/src/components/TransactWithPaymaster.tsx) component is used in the [`page.tsx`](https://github.com/wilsoncusack/wagmi-scw/blob/main/src/app/page.tsx) file.

That's it! Smart Wallet will handle the rest. If your paymaster service is able to sponsor the transaction,
in the UI Smart Wallet will indicate to your user that the transaction is sponsored.
