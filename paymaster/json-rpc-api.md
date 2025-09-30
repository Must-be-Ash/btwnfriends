# Paymaster JSON-RPC Methods

## Constructing Requests

**Option 1**: You can use the JSON-RPC playground on the [Paymaster page](https://portal.cdp.coinbase.com/products/bundler-and-paymaster) to easily create sample JSON-RPC requests.

**Option 2**: Alternatively, you can construct your own requests by following the below steps:

1. Go to the JSON-RPC playground on the [Paymaster page](https://portal.cdp.coinbase.com/products/bundler-and-paymaster).
2. Ensure the correct network in your RPC URL (either `base` or `base-sepolia`).
3. Open a terminal and make your requests based on the supported methods in this API reference page.

<Info>
  **Authentication**

  For information on how to authenticate requests to our JSON-RPC APIs, please visit the **Client API Keys** section of our [Authentication page](/get-started/authentication/cdp-api-keys#client-api-keys).
</Info>

## Bundler Namespace

### `eth_supportedEntryPoints`

This endpoint retrieves an array of supported entry points. Currently, the only supported entrypoint is v0.6 `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`.

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 30.

#### Request/Response

<CodeGroup>
  ```json jsonRequest lines wrap 
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "eth_supportedEntryPoints"
  }
  ```

  ```json jsonResponse lines wrap
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": ["0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"]
  }
  ```
</CodeGroup>

### `eth_getUserOperationByHash`

This endpoint returns a `UserOperation` based on the hash returned from [eth\_sendUserOperation](#eth_senduseroperation).

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 30.

#### Parameters

| Name | Type  | Req | Description                               |
| :--- | :---- | :-: | :---------------------------------------- |
| hash | array |  Y  | The hash of the UserOperation to retrieve |

#### Returns

| Type                 | Description                                                                                    |
| :------------------- | :--------------------------------------------------------------------------------------------- |
| sender               | Account initiating the UserOperation                                                           |
| nonce                | Nonce                                                                                          |
| initCode             | initCode (needed if the account needs to be created)                                           |
| preVerificationGas   | Amount of gas to pay for to compensate the bundler for pre-verification execution and calldata |
| maxFeePerGas         | Maximum fee per gas to pay for the execution of this operation                                 |
| maxPriorityFeePerGas | Maximum priority fee per gas                                                                   |
| signature            | Signature from the account                                                                     |
| verificationGasLimit | Amount of gas to allocate for the verification step                                            |
| callGasLimit         | Amount of gas to allocate the main execution call                                              |
| paymasterAndData     | Hex string signed by the paymaster for a sponsored transaction                                 |
| blockNumber          | Block number in which UserOperation is included                                                |
| blockHash            | Block hash in which UserOperation is included                                                  |
| transactionHash      | Transaction hash of the UserOperation                                                          |

#### Request/Response

<CodeGroup>
  ```json jsonRequest lines wrap
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "eth_getUserOperationByHash",
    "params": [
      "0x77c0b560eb0b042902abc5613f768d2a6b2d67481247e9663bf4d68dec0ca122"
    ]
  }
  ```

  ```json jsonResponse lines wrap [expandable]
  {
    "jsonrpc": "2.0",
     "id": 1,
    "result": {
              sender, // string
              nonce, // string
              initCode, // string
              callData, // string
              callGasLimit, // string
              verificationGasLimit, // string
              preVerificationGas, // string
              maxFeePerGas, // string
              maxPriorityFeePerGas, // string
         signature, // string
       paymasterAndData, // string
        blockNumber, // integer
        blockHash, // string
        transactionHash, // string
      }
  }
  ```
</CodeGroup>

### `eth_getUserOperationReceipt`

This endpoint returns a receipt based on the hash returned from [eth\_sendUserOperation](#eth_senduseroperation).

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 30.

#### Parameters

| Name | Type  | Req | Description                               |
| :--- | :---- | :-: | :---------------------------------------- |
| hash | array |  Y  | The hash of the UserOperation to retrieve |

#### Returns

| Type          | Description                                                                                          |
| :------------ | :--------------------------------------------------------------------------------------------------- |
| userOpHash    | Hash of the UserOperation                                                                            |
| entryPoint    | Entrypoint that the UserOperation was sent to                                                        |
| sender        | Account initiating the UserOperation                                                                 |
| nonce         | Nonce                                                                                                |
| paymaster     | Paymaster used in the UserOperation                                                                  |
| actualGasCost | Actual gas consumed by this UserOperation                                                            |
| actualGasUsed | Total gas used by this UserOperation                                                                 |
| success       | Whether the execution completed successfully                                                         |
| reason        | If reverted, the reason the execution failed                                                         |
| logs          | Logs generated by this UserOperation (not including logs of other UserOperations in the same bundle) |
| receipt       | TransactionReceipt object for the entire bundle                                                      |

<CodeGroup>
  ```json jsonRequest lines wrap
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "eth_getUserOperationReceipt",
    "params": [
      "0x77c0b560eb0b042902abc5613f768d2a6b2d67481247e9663bf4d68dec0ca122"
    ]
  }
  ```

  ```json jsonResponse lines wrap [expandable]
  {
    "id": 1,
    "jsonrpc": "2.0",
    "result": {
      "userOpHash": "0x13574b2256b73bdc33fb121052f64b3803161e5ec602a6dc9e56177ba387e700",
      "entryPoint": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      "sender": "0x023fEF87894773DF227587d9B29af8D17b4dBB5A",
      "nonce": "0x1",
      "paymaster": null,
      "actualGasCost": "0x6f75ef8d",
      "actualGasUsed": "0x329af",
      "success": true,
      "reason": "",
      "logs": [
        {
          "address": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
          "topics": [
            "0xbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972"
          ],
          "data": "0x",
          "blockNumber": "0x27fb22e",
          "transactionHash": "0x0f9b0e5868beaf345d8d55895c8037ae85adb91c422c00badcdcae8a0bf247a1",
          "transactionIndex": "0x4",
          "blockHash": "0x965e08190b1093c078bde81f67362203834784e34cf499d516f1a7b9c7a7b29e",
          "logIndex": "0x13",
          "removed": false
        }
      ],
      "receipt": {
        "blockHash": "0x965e08190b1093c078bde81f67362203834784e34cf499d516f1a7b9c7a7b29e",
        "blockNumber": "0x27fb22e",
        "from": "0x425d190ef5F561aFc8728593cA13EAf2FD9E3380",
        "to": "0x25aD59adbe00C2d80c86d01e2E05e1294DA84823",
        "cumulativeGasUsed": "0xe13e1",
        "gasUsed": "0x329af",
        "contractAddress": null,
        "logs": [null],
        "logsBloom": "0x000000010000000000000000800000000000000000000008000000000200000000080000020000020002080100010000001080000000000000100210000000000000000000000008000000000000808010000000000000000001000000000000000000000e000000000000000000080000002200000000408880000000000040000020000000000001000000080000002040000000040000000000000008000020000000000100000040000000000000000000000000000000000220000000400000000000000000000100000010000044000000800020000a100000010020000000000040000081000000000000000000000000000000400000000000100000",
        "status": 1,
        "type": "0x2",
        "transactionHash": "0x0f9b0e5868beaf345d8d55895c8037ae85adb91c422c00badcdcae8a0bf247a1",
        "transactionIndex": "0x4",
        "effectiveGasPrice": "0x6f75ef8d"
      }
    }
  }
  ```
</CodeGroup>

### `eth_sendUserOperation`

This endpoint sends a `UserOperation` for inclusion in the Bundler's private mempool. The signature must be a valid signature from the smart account.

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 500.

#### Parameters

| Name          | Type                                                                               | Req | Description                                                                                |
| :------------ | :--------------------------------------------------------------------------------- | :-: | :----------------------------------------------------------------------------------------- |
| UserOperation | [UserOperation](https://www.erc4337.io/docs/understanding-ERC-4337/user-operation) |  Y  | The UserOperation. You may add a `paymasterAndData` field if the transaction is sponsored. |
| entryPoint    | string                                                                             |  Y  | EntryPoint address that the UserOperation is intended for.                                 |

<CodeGroup>
  ```json jsonRequest lines wrap 
  {
    "jsonrpc": "2.0",
     "id": 1,
    "method": "eth_sendUserOperation",
    "params": [
              {
              sender, // address
              nonce, // uint256
              initCode, // string
              callData, // string
              callGasLimit, // string
              verificationGasLimit, // string
              preVerificationGas, // string
              maxFeePerGas, // string
              maxPriorityFeePerGas, // string
         signature, // string
       paymasterAndData, // string
          }, "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
    ]
  }
  ```

  ```json jsonResponse lines wrap [expandable]
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x1234...5678"
  }
  ```

  ```json jsonError lines wrap
  {
    "jsonrpc": "2.0",
    "id": 1,
    "error": {
      "message": "AA21 didn't pay prefund",
      "code": -32500
    }
  }
  ```
</CodeGroup>

### `eth_estimateUserOperationGas`

This endpoint will estimate the gas values for a UserOperation. The signature field is ignored and can be a dummy value, but is recommended to be of the same size as an actual signature for an accurate estimate.

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 500.

#### Parameters

| Name          | Type                                                                               | Req | Description                                                                                                               |
| :------------ | :--------------------------------------------------------------------------------- | :-: | :------------------------------------------------------------------------------------------------------------------------ |
| UserOperation | [UserOperation](https://www.erc4337.io/docs/understanding-ERC-4337/user-operation) |  Y  | The UserOperation. You can use a dummy signature but the signature must be the correct size for an accurate gas estimate. |
| entryPoint    | string                                                                             |  Y  | EntryPoint address that the UserOperation is intended for.                                                                |

#### Returns

| Type                 | Description                                                                         |
| :------------------- | :---------------------------------------------------------------------------------- |
| preVerificationGas   | Amount of gas to compensate the bundler for pre-verification execution and calldata |
| verificationGasLimit | Amount of gas to allocate for the verification step                                 |
| callGasLimit         | Amount of gas to allocate the main execution call                                   |

<CodeGroup>
  ```json jsonRequest lines wrap
  {
    "jsonrpc": "2.0",
     "id": 1,
    "method": "eth_estimateUserOperationGas",
    "params": [
              {
              sender, // address
              nonce, // uint256
              initCode, // string
              callData, // string
              callGasLimit, // string
              verificationGasLimit, // string
              preVerificationGas, // string
              maxFeePerGas, // string
              maxPriorityFeePerGas, // string
         signature, // string
       paymasterAndData, // string
          }, "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
    ]
  }
  ```

  ```json jsonResponse lines wrap [expandable]
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
      "preVerificationGas": "0x...",
      "verificationGasLimit": "0x...",
      "callGasLimit": "0x..."
    }
  }
  ```

  ```json jsonError lines wrap
  {
    "jsonrpc": "2.0",
    "id": 1,
    "error": {
      "message": "Error reason here.",
      "code": -32601
    }
  }
  ```
</CodeGroup>

## Paymaster Namespace

### `pm_getPaymasterStubData`

<Tip>
  See the [ERC-7677 docs](https://www.erc7677.xyz/reference/paymasters/getPaymasterStubData) for parameters and returns.
</Tip>

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 30.

#### EntryPoint v0.6

<CodeGroup>
  ```json jsonRequest lines wrap
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "pm_getPaymasterStubData",
    "params": [
      {
        "sender": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
        "nonce": "0x2a",
        "initCode": "0x",
        "callData": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
        "callGasLimit": "0x0",
        "verificationGasLimit": "0x0",
        "preVerificationGas": "0x0",
        "maxFeePerGas": "0x0",
        "maxPriorityFeePerGas": "0x0"
      },
      "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      "0x14A34",
      {
        "policyId": "631528b0-d444-4a9b-a575-40dd3aa4a13a"
      }
    ]
  }
  ```

  ```json jsonResponse lines wrap [expandable]
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
      "paymasterAndData": "0xe3dc822D77f23984723871310CAAA32100000000000000000000000000000000000000000000000000000101010101010000000000000000000000000000000000000000000000000000000000000000cd91f19f0f19ce862d7bec7b7d9b95457145afc6f639c28fd0360f488937bfa41e6eedcd3a46054fd95fcd0e3ef6b0bc0a615c4d975eef55c8a3517257904d5b1c",
      "sponsor": {
        "name": "My App",
        "icon": "https://upload.wikimedia.org/wikipedia/en/c/cc/Wojak_cropped.jpg"
      }
    }
  }
  ```
</CodeGroup>

### `pm_getPaymasterData`

<Info>
  See the [ERC-7677 docs](https://www.erc7677.xyz/reference/paymasters/getPaymasterData) for parameters and returns.
</Info>

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 30.

#### EntryPoint v0.6

<CodeGroup>
  ```json jsonRequest lines wrap
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "pm_getPaymasterData",
    "params": [
      {
        "sender": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
        "nonce": "0x2a",
        "initCode": "0x",
        "callData": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
        "callGasLimit": "0x0",
        "verificationGasLimit": "0x0",
        "preVerificationGas": "0x0",
        "maxFeePerGas": "0x0",
        "maxPriorityFeePerGas": "0x0"
      },
      "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      "0x14A34",
      {
        "policyId": "631528b0-d444-4a9b-a575-40dd3aa4a13a"
      }
    ]
  }
  ```

  ```json jsonResponse lines wrap [expandable]
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
      "paymasterAndData": "0xe3dc822D77f23984723871310CAAA32100000000000000000000000000000000000000000000000000000101010101010000000000000000000000000000000000000000000000000000000000000000cd91f19f0f19ce862d7bec7b7d9b95457145afc6f639c28fd0360f488937bfa41e6eedcd3a46054fd95fcd0e3ef6b0bc0a615c4d975eef55c8a3517257904d5b1c"
    }
  }
  ```
</CodeGroup>

### `pm_sponsorUserOperation`

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 500.

### `pm_getAcceptedPaymentTokens`

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 30.

### `pm_getAddressSponsorshipInfo`

The [API credit](/node/introduction/welcome#rate-limits) value of this method is 30.
