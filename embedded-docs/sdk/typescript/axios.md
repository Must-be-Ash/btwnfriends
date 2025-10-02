# Axios

## Interfaces

### AuthInterceptorOptions

Defined in: [hooks/axios/withAuth.ts:10](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/hooks/axios/withAuth.ts#L10)

#### Properties

##### apiKeyId

```ts
apiKeyId: string;
```

Defined in: [hooks/axios/withAuth.ts:18](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/hooks/axios/withAuth.ts#L18)

The API key ID

Examples:
'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
'organizations/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/apiKeys/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

##### apiKeySecret

```ts
apiKeySecret: string;
```

Defined in: [hooks/axios/withAuth.ts:27](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/hooks/axios/withAuth.ts#L27)

The API key secret

Examples:
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx==' (Edwards key (Ed25519))
'-----BEGIN EC PRIVATE KEY-----\n...\n...\n...==\n-----END EC PRIVATE KEY-----\n' (EC key (ES256))

##### walletSecret?

```ts
optional walletSecret: string;
```

Defined in: [hooks/axios/withAuth.ts:30](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/hooks/axios/withAuth.ts#L30)

The Wallet Secret

##### source?

```ts
optional source: string;
```

Defined in: [hooks/axios/withAuth.ts:33](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/hooks/axios/withAuth.ts#L33)

The source of the request

##### sourceVersion?

```ts
optional sourceVersion: string;
```

Defined in: [hooks/axios/withAuth.ts:36](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/hooks/axios/withAuth.ts#L36)

The version of the source of the request

##### expiresIn?

```ts
optional expiresIn: number;
```

Defined in: [hooks/axios/withAuth.ts:39](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/hooks/axios/withAuth.ts#L39)

Optional expiration time in seconds (defaults to 120)

##### debug?

```ts
optional debug: boolean;
```

Defined in: [hooks/axios/withAuth.ts:42](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/hooks/axios/withAuth.ts#L42)

Whether to log request/response details

## Functions

### withAuth()

```ts
function withAuth(axiosClient: AxiosInstance, options: AuthInterceptorOptions): AxiosInstance;
```

Defined in: [hooks/axios/withAuth.ts:52](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/hooks/axios/withAuth.ts#L52)

Axios interceptor for adding the JWT to the Authorization header.

#### Parameters

##### axiosClient

`AxiosInstance`

The Axios client instance to add the interceptor to

##### options

[`AuthInterceptorOptions`](/sdks/cdp-sdks-v2/typescript/auth/Axios#authinterceptoroptions)

Options for the request including API keys and debug flag

#### Returns

`AxiosInstance`

The modified request configuration with the Authorization header added
