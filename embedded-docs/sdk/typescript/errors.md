# Errors

## Classes

### InvalidAPIKeyFormatError

Defined in: [errors.ts:26](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/errors.ts#L26)

An error for invalid API key format.

#### Extends

* `BaseError`

#### Constructors

##### Constructor

```ts
new InvalidAPIKeyFormatError(message: string): InvalidAPIKeyFormatError;
```

Defined in: [errors.ts:32](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/errors.ts#L32)

Invalid API key format error constructor.

###### Parameters

###### message

`string`

The message to display.

###### Returns

[`InvalidAPIKeyFormatError`](/sdks/cdp-sdks-v2/typescript/auth/Errors#invalidapikeyformaterror)

###### Overrides

```ts
BaseError.constructor
```

***

### InvalidWalletSecretFormatError

Defined in: [errors.ts:40](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/errors.ts#L40)

An error for invalid Wallet Secret format.

#### Extends

* `BaseError`

#### Constructors

##### Constructor

```ts
new InvalidWalletSecretFormatError(message: string): InvalidWalletSecretFormatError;
```

Defined in: [errors.ts:46](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/errors.ts#L46)

Invalid Wallet Secret format error constructor.

###### Parameters

###### message

`string`

The message to display.

###### Returns

[`InvalidWalletSecretFormatError`](/sdks/cdp-sdks-v2/typescript/auth/Errors#invalidwalletsecretformaterror)

###### Overrides

```ts
BaseError.constructor
```

***

### UndefinedWalletSecretError

Defined in: [errors.ts:54](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/errors.ts#L54)

An error for an undefined Wallet Secret.

#### Extends

* `BaseError`

#### Constructors

##### Constructor

```ts
new UndefinedWalletSecretError(message: string): UndefinedWalletSecretError;
```

Defined in: [errors.ts:60](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/auth/errors.ts#L60)

Undefined Wallet Secret error constructor.

###### Parameters

###### message

`string`

The message to display.

###### Returns

[`UndefinedWalletSecretError`](/sdks/cdp-sdks-v2/typescript/auth/Errors#undefinedwalletsecreterror)

###### Overrides

```ts
BaseError.constructor
```
