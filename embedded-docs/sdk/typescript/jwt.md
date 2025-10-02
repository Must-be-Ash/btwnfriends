# JWT

## Interfaces

### JwtOptions

Defined in: [utils/jwt.ts:20](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L20)

JwtOptions contains configuration for JWT generation.

This interface holds all necessary parameters for generating a JWT token
for authenticating with Coinbase's REST APIs. It supports both EC (ES256)
and Ed25519 (EdDSA) keys.

#### Properties

##### apiKeyId

```ts
apiKeyId: string;
```

Defined in: [utils/jwt.ts:28](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L28)

The API key ID

Examples:
'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
'organizations/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/apiKeys/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

##### apiKeySecret

```ts
apiKeySecret: string;
```

Defined in: [utils/jwt.ts:37](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L37)

The API key secret

Examples:
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx==' (Edwards key (Ed25519))
'-----BEGIN EC PRIVATE KEY-----\n...\n...\n...==\n-----END EC PRIVATE KEY-----\n' (EC key (ES256))

##### requestMethod?

```ts
optional requestMethod: null | string;
```

Defined in: [utils/jwt.ts:42](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L42)

The HTTP method for the request (e.g. 'GET', 'POST'), or null for JWTs intended for websocket connections

##### requestHost?

```ts
optional requestHost: null | string;
```

Defined in: [utils/jwt.ts:47](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L47)

The host for the request (e.g. 'api.cdp.coinbase.com'), or null for JWTs intended for websocket connections

##### requestPath?

```ts
optional requestPath: null | string;
```

Defined in: [utils/jwt.ts:52](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L52)

The path for the request (e.g. '/platform/v1/wallets'), or null for JWTs intended for websocket connections

##### expiresIn?

```ts
optional expiresIn: number;
```

Defined in: [utils/jwt.ts:57](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L57)

Optional expiration time in seconds (defaults to 120)

##### audience?

```ts
optional audience: string[];
```

Defined in: [utils/jwt.ts:62](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L62)

Optional audience claim for the JWT

***

### WalletJwtOptions

Defined in: [utils/jwt.ts:71](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L71)

WalletJwtOptions contains configuration for Wallet Auth JWT generation.

This interface holds all necessary parameters for generating a Wallet Auth JWT
for authenticating with endpoints that require wallet authentication.

#### Properties

##### walletSecret

```ts
walletSecret: string;
```

Defined in: [utils/jwt.ts:75](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L75)

* The Wallet Secret

##### requestMethod

```ts
requestMethod: string;
```

Defined in: [utils/jwt.ts:80](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L80)

* The HTTP method for the request (e.g. 'GET', 'POST')

##### requestHost

```ts
requestHost: string;
```

Defined in: [utils/jwt.ts:85](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L85)

* The host for the request (e.g. 'api.cdp.coinbase.com')

##### requestPath

```ts
requestPath: string;
```

Defined in: [utils/jwt.ts:90](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L90)

* The path for the request (e.g. '/platform/v1/wallets/{wallet_id}/addresses')

##### requestData

```ts
requestData: Record<string, any>;
```

Defined in: [utils/jwt.ts:96](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L96)

* The request data for the request (e.g. `{ "wallet_id": "1234567890" }`)

## Functions

### generateJwt()

```ts
function generateJwt(options: JwtOptions): Promise<string>;
```

Defined in: [utils/jwt.ts:109](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L109)

Generates a JWT (also known as a Bearer token) for authenticating with Coinbase's REST APIs.
Supports both EC (ES256) and Ed25519 (EdDSA) keys. Also supports JWTs meant for
websocket connections by allowing requestMethod, requestHost, and requestPath to all be
null, in which case the 'uris' claim is omitted from the JWT.

#### Parameters

##### options

[`JwtOptions`](/sdks/cdp-sdks-v2/typescript/auth/JWT#jwtoptions)

The configuration options for generating the JWT

#### Returns

`Promise`\<`string`>

The generated JWT (Bearer token) string

#### Throws

If required parameters are missing, invalid, or if JWT signing fails

***

### generateWalletJwt()

```ts
function generateWalletJwt(options: WalletJwtOptions): Promise<string>;
```

Defined in: [utils/jwt.ts:187](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/utils/jwt.ts#L187)

Generates a wallet authentication JWT for the given API endpoint URL.
Used for authenticating with specific endpoints that require wallet authentication.

#### Parameters

##### options

[`WalletJwtOptions`](/sdks/cdp-sdks-v2/typescript/auth/JWT#walletjwtoptions)

The configuration options for generating the JWT

#### Returns

`Promise`\<`string`>

The generated JWT (Bearer token) string

#### Throws

If the Wallet Secret is not defined.

#### Throws

If the private key is not in the correct format or signing fails.
