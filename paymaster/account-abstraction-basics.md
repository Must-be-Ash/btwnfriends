# Account Abstraction Basics

### What is Account Abstraction (ERC-4337)?

Account Abstraction gives onchain accounts logic, meaning expanded feature sets (such as batched transactions) and improved security with Passkeys. In this model, operations are packaged as "userOperations" and processed through several specialized roles:

### What are the key components of Account Abstraction?

* **User:** Initiates an operation by signing a userOperation, similar to signing a transaction with a private key.
* **Bundler:** Collects userOperations, bundles them together, and submits them to the network through a central contract, acting like a traditional externally owned account (EOA).
* **Entrypoint (Contract):** Receives bundled operations, calculates the gas required, and manages interactions between the Smart Account and the Paymaster. It orchestrates the transaction flow.
* **Paymaster:** A smart contract that covers the gas fees on behalf of the Smart Account, allowing users to interact with the blockchain without holding ETH.
* **Smart Account:** A smart account wallet that validates signatures and executes transactions once all the necessary checks (such as gas fee payments) are complete.

### Do I need the address of the Paymaster in order to sponsor transactions?

No, you don't need the Paymaster contract address in order to sponsor transactions using the Paymaster tool from Coinbase Developer Platform. CDP Paymaster streamlines integration by merging Paymaster and Bundler into a single, unified endpoint—much like an API endpoint—so you simply use your Paymaster endpoint to send transaction requests.

* Example:

  ```javascript
  const hash = await bundlerClient.sendUserOperation({
    calls: [{
      abi: WagmiAbi,
      functionName: 'mint',
      to: '0xfBA3912Ca0d4d858C843e2EE08967fC04f3B79c2',
    }],
  });
  ```

### What version is supported for the entrypoint?

v0.6

### How does a userOperation get onchain?

1. **User Operation:** A user signs a userOperation, which includes all necessary details to perform an action including the sender, nonce, initCode and callData.
2. **Gas estimation:** Gas is estimated based on the userOperation by calling the bundler RPC method `eth_estimateUserOperationGas`.
3. **Bundler Submission:** The bundler collects and submits these operations to the Entrypoint. RPC method: `eth_sendUserOperation`
4. **Entrypoint Processing:** The Entrypoint calculates the required gas by simulating the execution of the userOperation and examining the gas consumption during the simulation. This is done via the `simulateHandleOp` function. After simulation, the Entrypoint coordinates with the Paymaster (if applicable) to cover fees, and forwards the operation to the Smart Account.
5. **Smart Account Execution:** The Smart Account validates the operation and executes the intended action on the blockchain.

### What happens if a userOperation specifies gas limits that are too low?

UserOperations require gas limits to pay for the computational resources needed to execute it onchain. When the gas limit set for the operation is too low, meaning the transaction ran out of computational resources before completing, it will run out of gas and revert onchain during execution.

* See Alchemy's breakdown for [more details](https://www.alchemy.com/blog/erc-4337-gas-estimation).

### What are the gas components of a userOperation?

* **preVerificationGas:** The amount of gas to pay the bundler for pre-verification execution and calldata. This covers intrinsic bundle gas, calldata costs, and any entry-point overhead not metered onchain—it can spike during L1 fee surges and will cause the bundler to reject the op if set too low.

<Tip>
  Add a multiplier to avoid exclusions

  Consider applying a multiplier (e.g., 1.5×) to your estimated value during periods of high congestion to avoid exclusions.
</Tip>

* **verificationGasLimit:** The amount of gas allocated for the verification step, including smart wallet authentication checks and paymaster authorization logic. This value is generally static once you've determined the worst-case auth cost.

* **callGasLimit:** The gas allocated for the main execution phase of the userOp (e.g., Morpho contract call). Like the `verificationGasLimit`, this is typically a fixed limit based on your expected execution workload.

* **maxFeePerGas**
  The maximum fee (base fee + priority fee) per gas unit that you're willing to pay, equivalent to EIP-1559's `max_fee_per_gas`. Setting this too low may exclude your ops from being included in blocks.

* **maxPriorityFeePerGas**
  The maximum priority (tip) fee per gas unit, equivalent to EIP-1559's `max_priority_fee_per_gas`. Adjust this to help your ops compete for inclusion without overpaying.

### Which SDKs can I use to interact with my Paymaster and Bundler?

The best way to interact with the Paymaster is via frontend React libraries like [OnchainKit](https://docs.base.org/onchainkit/getting-started) that provide easy to use Components and work seamlessly with our Paymaster.

* Additional SDKs like [Viem](https://viem.sh/) and [Permissionless](https://docs.pimlico.io/permissionless) simplify the process of creating a smart wallet, constructing a userOperation, and sending it onchain using a bundler client and Paymaster.
* For additional help, check out our [Paymaster Examples](https://github.com/coinbase/paymaster-bundler-examples) repository, which includes Implementations across a wide range of clients and SDKs.

### Can I sponsor transactions for any wallet?

Today, gas sponsorship only works with contract-based accounts (e.g., the [Coinbase Smart Wallet](https://www.coinbase.com/wallet/smart-wallet), not with traditional Externally Owned Accounts (EOAs). With [Ethereum's Pectra upgrade, EIP-7702](https://www.coinbase.com/learn/crypto-basics/ethereum-pectra-upgrade) will allow EOAs to function as smart contract accounts – enabling gas sponsorship for their transactions as well.

### What's the difference between an EOA and a Smart Wallet?

| Feature           | Externally Owned Account (EOA)                                         | Smart Wallets (contract accounts)                                                                            |
| :---------------- | :--------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Control**       | Governed solely by a private key (seed phrase or hardware wallet)      | Governed by onchain contract code                                                                            |
| **Creation**      | Instantly "exists" when a private key is generated (no onchain deploy) | Created by deploying a smart contract (requires gas/ETH)                                                     |
| **Functionality** | Basic ETH transfers & interactions with onchain applications           | Programmable: transaction batching, pay fees in tokens, custom auth logic, etc.                              |
| **Gas & Fees**    | Must hold ETH to pay gas                                               | Can implement gas abstractions: fee sponsorship, stable-coin payments, batching transactions, and many more! |
| **Security**      | Relies on single-key management                                        | Supports multi-sig, 2FA, social or account-recovery schemes                                                  |
| **Recovery**      | No built-in recovery if key is lost                                    | Can include social recovery or guardian-based recovery                                                       |
