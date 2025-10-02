# HTTP

## Interfaces

### GetAuthHeadersOptions

Defined in: [utils/http.ts:11](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L11)

Options for generating authentication headers for API requests.

#### Properties

##### apiKeyId

```ts
apiKeyId: string;
```

Defined in: [utils/http.ts:19](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L19)

The API key ID

Examples:
'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
'organizations/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/apiKeys/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

##### apiKeySecret

```ts
apiKeySecret: string;
```

Defined in: [utils/http.ts:28](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L28)

The API key secret

Examples:
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx==' (Edwards key (Ed25519))
'-----BEGIN EC PRIVATE KEY-----\n...\n...\n...==\n-----END EC PRIVATE KEY-----\n' (EC key (ES256))

##### requestMethod

```ts
requestMethod: string;
```

Defined in: [utils/http.ts:33](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L33)

The HTTP method for the request (e.g. 'GET', 'POST')

##### requestHost

```ts
requestHost: string;
```

Defined in: [utils/http.ts:38](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L38)

The host for the request (e.g. 'api.cdp.coinbase.com')

##### requestPath

```ts
requestPath: string;
```

Defined in: [utils/http.ts:43](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L43)

The path for the request (e.g. '/platform/v1/wallets')

##### requestBody?

```ts
optional requestBody: unknown;
```

Defined in: [utils/http.ts:48](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L48)

Optional request body data

##### walletSecret?

```ts
optional walletSecret: string;
```

Defined in: [utils/http.ts:53](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L53)

The Wallet Secret for wallet authentication

##### source?

```ts
optional source: string;
```

Defined in: [utils/http.ts:58](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L58)

The source identifier for the request

##### sourceVersion?

```ts
optional sourceVersion: string;
```

Defined in: [utils/http.ts:63](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L63)

The version of the source making the request

##### expiresIn?

```ts
optional expiresIn: number;
```

Defined in: [utils/http.ts:68](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L68)

Optional expiration time in seconds (defaults to 120)

##### audience?

```ts
optional audience: string[];
```

Defined in: [utils/http.ts:73](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L73)

Optional audience claim for the JWT

## Functions

### getAuthHeaders()

```ts
function getAuthHeaders(options: GetAuthHeadersOptions): Promise<Record<string, string>>;
```

Defined in: [utils/http.ts:82](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L82)

Gets authentication headers for a request.

#### Parameters

##### options

[`GetAuthHeadersOptions`](/sdks/cdp-sdks-v2/typescript/auth/HTTP#getauthheadersoptions)

The configuration options for generating auth headers

#### Returns

`Promise`\<`Record`\<`string`, `string`>>

Object containing the authentication headers

***

### getCorrelationData()

```ts
function getCorrelationData(source?: string, sourceVersion?: string): string;
```

Defined in: [utils/http.ts:145](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/http.ts#L145)

Returns encoded correlation data including the SDK version and language.

#### Parameters

##### source?

`string`

The source identifier for the request

##### sourceVersion?

`string`

The version of the source making the request

#### Returns

`string`

Encoded correlation data as a query string
