# Accounts

## Type Aliases

### EvmAccount

```ts
type EvmAccount = {
  address: Address;
  policies?: string[];
  sign: (parameters: {
     hash: Hash;
  }) => Promise<Hex>;
  signMessage: (parameters: {
     message: SignableMessage;
  }) => Promise<Hex>;
  signTransaction: (transaction: TransactionSerializable) => Promise<Hex>;
  signTypedData: <typedData, primaryType>(parameters: TypedDataDefinition<typedData, primaryType>) => Promise<Hex>;
};
```

Defined in: [src/accounts/evm/types.ts:73](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L73)

Base type for any Ethereum account with signing capabilities.
For example, this could be an EVM ServerAccount, or a viem LocalAccount.

#### Properties

##### address

```ts
address: Address;
```

Defined in: [src/accounts/evm/types.ts:75](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L75)

The address of the signer.

##### policies?

```ts
optional policies: string[];
```

Defined in: [src/accounts/evm/types.ts:90](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L90)

A list of Policy ID's that apply to the account.

##### sign()

```ts
sign: (parameters: {
  hash: Hash;
}) => Promise<Hex>;
```

Defined in: [src/accounts/evm/types.ts:77](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L77)

Signs a message hash and returns the signature as a hex string.

###### Parameters

###### parameters

###### hash

`Hash`

###### Returns

`Promise`\<`Hex`>

##### signMessage()

```ts
signMessage: (parameters: {
  message: SignableMessage;
}) => Promise<Hex>;
```

Defined in: [src/accounts/evm/types.ts:79](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L79)

Signs a message and returns the signature as a hex string.

###### Parameters

###### parameters

###### message

`SignableMessage`

###### Returns

`Promise`\<`Hex`>

##### signTransaction()

```ts
signTransaction: (transaction: TransactionSerializable) => Promise<Hex>;
```

Defined in: [src/accounts/evm/types.ts:81](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L81)

Signs a transaction and returns the signed transaction as a hex string.

###### Parameters

###### transaction

`TransactionSerializable`

###### Returns

`Promise`\<`Hex`>

##### signTypedData()

```ts
signTypedData: <typedData, primaryType>(parameters: TypedDataDefinition<typedData, primaryType>) => Promise<Hex>;
```

Defined in: [src/accounts/evm/types.ts:83](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L83)

Signs a typed data and returns the signature as a hex string.

###### Type Parameters

###### typedData

`typedData` *extends* `TypedData` | `Record`\<`string`, `unknown`>

###### primaryType

`primaryType` *extends* keyof `typedData` | `"EIP712Domain"` = keyof `typedData`

###### Parameters

###### parameters

`TypedDataDefinition`\<`typedData`, `primaryType`>

###### Returns

`Promise`\<`Hex`>

***

### EvmServerAccount

```ts
type EvmServerAccount = Prettify<EvmAccount & AccountActions & {
  name?: string;
  type: "evm-server";
  useNetwork: <Network>(network: Network) => Promise<NetworkScopedEvmServerAccount<Network>>;
}>;
```

Defined in: [src/accounts/evm/types.ts:121](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L121)

Server-managed ethereum account

***

### EvmSmartAccount

```ts
type EvmSmartAccount = Prettify<EvmSmartAccountProperties & SmartAccountActions>;
```

Defined in: [src/accounts/evm/types.ts:181](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L181)

Ethereum smart account which supports account abstraction features like user operations, batch transactions, and paymaster.

***

### EvmSmartAccountProperties

```ts
type EvmSmartAccountProperties = {
  address: Address;
  name?: string;
  owners: EvmAccount[];
  policies: string[] | undefined;
  type: "evm-smart";
  useNetwork: <Network>(network: Network) => Promise<NetworkScopedEvmSmartAccount<Network>>;
};
```

Defined in: [src/accounts/evm/types.ts:148](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L148)

#### Properties

##### address

```ts
address: Address;
```

Defined in: [src/accounts/evm/types.ts:150](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L150)

The smart account's address.

##### name?

```ts
optional name: string;
```

Defined in: [src/accounts/evm/types.ts:152](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L152)

The name of the smart account.

##### owners

```ts
owners: EvmAccount[];
```

Defined in: [src/accounts/evm/types.ts:154](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L154)

Array of accounts that own and can sign for the smart account (currently only supports one owner but will be extended to support multiple owners in the future).

##### policies

```ts
policies: string[] | undefined;
```

Defined in: [src/accounts/evm/types.ts:158](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L158)

The list of policy IDs that apply to the smart account. This will include both the project-level policy and the account-level policy, if one exists.

##### type

```ts
type: "evm-smart";
```

Defined in: [src/accounts/evm/types.ts:156](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L156)

Identifier for the smart account type.

##### useNetwork()

```ts
useNetwork: <Network>(network: Network) => Promise<NetworkScopedEvmSmartAccount<Network>>;
```

Defined in: [src/accounts/evm/types.ts:173](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/accounts/evm/types.ts#L173)

A function that returns a network-scoped smart account.

###### Type Parameters

###### Network

`Network` *extends* `KnownEvmNetworks`

###### Parameters

###### network

`Network`

The network name or RPC URL

###### Returns

`Promise`\<`NetworkScopedEvmSmartAccount`\<`Network`>>

###### Example

```ts
// For known networks, type is inferred automatically:
const baseAccount = await smartAccount.useNetwork("base");

// For custom RPC URLs with type hints (requires casting):
const typedAccount = await smartAccount.useNetwork<"base">("https://mainnet.base.org" as "base");

// For custom RPC URLs without type hints (only sendTransaction, transfer and waitForTransactionReceipt methods available):
const customAccount = await smartAccount.useNetwork("https://mainnet.base.org");
```
