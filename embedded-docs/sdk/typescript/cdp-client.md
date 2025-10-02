# CDP Client

## Classes

### CdpClient

Defined in: [cdp.ts:25](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L25)

The main client for interacting with the CDP API.

#### Constructors

##### Constructor

```ts
new CdpClient(options?: CdpClientOptions): CdpClient;
```

Defined in: [cdp.ts:73](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L73)

The CdpClient is the main class for interacting with the CDP API.

There are a few required parameters that are configured in the [CDP Portal](https://portal.cdp.coinbase.com/projects/api-keys):

* **CDP Secret API Key** (`apiKeyId` & `apiKeySecret`): These are used to authenticate requests to the entire suite of
  APIs offered on Coinbase Developer Platform.
  [Read more about CDP API keys](https://docs.cdp.coinbase.com/get-started/docs/cdp-api-keys).
* **Wallet Secret** (`walletSecret`): This secret is used specifically to authenticate requests to `POST`, and `DELETE`
  endpoints in the EVM and Solana Account APIs.

These parameters can be set as environment variables:

```
CDP_API_KEY_ID=your-api-key-id
CDP_API_KEY_SECRET=your-api-key-secret
CDP_WALLET_SECRET=your-wallet-secret
```

Or passed as options to the constructor:

```typescript
const cdp = new CdpClient({
  apiKeyId: "your-api-key-id",
  apiKeySecret: "your-api-key-secret",
  walletSecret: "your-wallet-secret",
});
```

The CdpClient is namespaced by chain type: `evm` or `solana`.

As an example, to create a new EVM account, use `cdp.evm.createAccount()`.

To create a new Solana account, use `cdp.solana.createAccount()`.

###### Parameters

###### options?

[`CdpClientOptions`](/sdks/cdp-sdks-v2/typescript/client/cdp-client#cdpclientoptions) = `{}`

Configuration options for the CdpClient.

###### Returns

[`CdpClient`](/sdks/cdp-sdks-v2/typescript/client/cdp-client#cdpclient)

#### Properties

##### endUser

```ts
endUser: CDPEndUserClient;
```

Defined in: [cdp.ts:36](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L36)

Namespace containing all end user methods.

##### evm

```ts
evm: EvmClient;
```

Defined in: [cdp.ts:27](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L27)

Namespace containing all EVM methods.

##### policies

```ts
policies: PoliciesClient;
```

Defined in: [cdp.ts:33](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L33)

Namespace containing all Policies methods.

##### solana

```ts
solana: SolanaClient;
```

Defined in: [cdp.ts:30](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L30)

Namespace containing all Solana methods.

## Interfaces

### CdpClientOptions

Defined in: [cdp.ts:9](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L9)

#### Properties

##### apiKeyId?

```ts
optional apiKeyId: string;
```

Defined in: [cdp.ts:11](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L11)

The API key ID.

##### apiKeySecret?

```ts
optional apiKeySecret: string;
```

Defined in: [cdp.ts:13](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L13)

The API key secret.

##### basePath?

```ts
optional basePath: string;
```

Defined in: [cdp.ts:19](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L19)

The host URL to connect to.

##### debugging?

```ts
optional debugging: boolean;
```

Defined in: [cdp.ts:17](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L17)

Whether to enable debugging.

##### walletSecret?

```ts
optional walletSecret: string;
```

Defined in: [cdp.ts:15](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/cdp.ts#L15)

The wallet secret.
