# Policies Types

## Interfaces

### CreatePolicyOptions

Defined in: [src/client/policies/policies.types.ts:53](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L53)

Options for creating a Policy.

#### Properties

##### idempotencyKey?

```ts
optional idempotencyKey: string;
```

Defined in: [src/client/policies/policies.types.ts:58](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L58)

The idempotency key to ensure the request is processed exactly once.
Used to safely retry requests without accidentally performing the same operation twice.

##### policy

```ts
policy: {
  description?: string;
  rules: (
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        ethValue: string;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "ethValue";
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmAddress";
      }
        | {
        changeCents: number;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "netUSDChange";
      }
        | {
        abi:   | "erc20"
           | "erc721"
           | "erc1155"
           | readonly (
           | {
         }
           | {
         }
           | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
        conditions: {
           function: string;
           params?: ...[];
        }[];
        type: "evmData";
     })[];
     operation: "signEvmTransaction";
   }
     | {
     action: "reject" | "accept";
     operation: "signEvmHash";
   }
     | {
     action: "reject" | "accept";
     criteria: {
        match: string;
        type: "evmMessage";
     }[];
     operation: "signEvmMessage";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        conditions: (
           | {
           addresses: ...[];
           operator: ... | ...;
           path: string;
         }
           | {
           operator: ... | ... | ... | ... | ...;
           path: string;
           value: string;
         }
           | {
           match: string;
           path: string;
        })[];
        type: "evmTypedDataField";
        types: {
           primaryType: string;
           types: Record<string, {
              name: ...;
              type: ...;
           }[]>;
        };
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmTypedDataVerifyingContract";
     })[];
     operation: "signEvmTypedData";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        ethValue: string;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "ethValue";
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmAddress";
      }
        | {
        networks: (
           | "base-sepolia"
           | "base"
           | "arbitrum"
           | "optimism"
           | "polygon"
           | "avalanche"
           | "ethereum"
          | "ethereum-sepolia")[];
        operator: "in" | "not in";
        type: "evmNetwork";
      }
        | {
        changeCents: number;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "netUSDChange";
      }
        | {
        abi:   | "erc20"
           | "erc721"
           | "erc1155"
           | readonly (
           | {
         }
           | {
         }
           | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
        conditions: {
           function: string;
           params?: ...[];
        }[];
        type: "evmData";
     })[];
     operation: "sendEvmTransaction";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        ethValue: string;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "ethValue";
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmAddress";
      }
        | {
        networks: (
           | "base-sepolia"
           | "base"
           | "arbitrum"
           | "optimism"
           | "zora"
           | "polygon"
           | "bnb"
           | "avalanche"
           | "ethereum"
          | "ethereum-sepolia")[];
        operator: "in" | "not in";
        type: "evmNetwork";
      }
        | {
        changeCents: number;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "netUSDChange";
      }
        | {
        abi:   | "erc20"
           | "erc721"
           | "erc1155"
           | readonly (
           | {
         }
           | {
         }
           | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
        conditions: {
           function: string;
           params?: ...[];
        }[];
        type: "evmData";
     })[];
     operation: "prepareUserOperation";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        ethValue: string;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "ethValue";
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmAddress";
      }
        | {
        changeCents: number;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "netUSDChange";
      }
        | {
        abi:   | "erc20"
           | "erc721"
           | "erc1155"
           | readonly (
           | {
         }
           | {
         }
           | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
        conditions: {
           function: string;
           params?: ...[];
        }[];
        type: "evmData";
     })[];
     operation: "sendUserOperation";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "solAddress";
      }
        | {
        operator: ">" | ">=" | "<" | "<=" | "==";
        solValue: string;
        type: "solValue";
      }
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "splAddress";
      }
        | {
        operator: ">" | ">=" | "<" | "<=" | "==";
        splValue: string;
        type: "splValue";
      }
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "mintAddress";
      }
        | {
        conditions: {
           instruction: string;
           params?: ...[];
        }[];
        idls: (
           | "SystemProgram"
           | "TokenProgram"
           | "AssociatedTokenProgram"
           | objectOutputType<{
           address: ...;
           instructions: ...;
        }, ZodTypeAny, "passthrough">)[];
        type: "solData";
      }
        | {
        operator: "in" | "not in";
        programIds: string[];
        type: "programId";
     })[];
     operation: "signSolTransaction";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "solAddress";
      }
        | {
        operator: ">" | ">=" | "<" | "<=" | "==";
        solValue: string;
        type: "solValue";
      }
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "splAddress";
      }
        | {
        operator: ">" | ">=" | "<" | "<=" | "==";
        splValue: string;
        type: "splValue";
      }
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "mintAddress";
      }
        | {
        conditions: {
           instruction: string;
           params?: ...[];
        }[];
        idls: (
           | "SystemProgram"
           | "TokenProgram"
           | "AssociatedTokenProgram"
           | objectOutputType<{
           address: ...;
           instructions: ...;
        }, ZodTypeAny, "passthrough">)[];
        type: "solData";
      }
        | {
        operator: "in" | "not in";
        programIds: string[];
        type: "programId";
      }
        | {
        networks: ("solana-devnet" | "solana")[];
        operator: "in" | "not in";
        type: "solNetwork";
     })[];
     operation: "sendSolTransaction";
   }
     | {
     action: "reject" | "accept";
     criteria: {
        match: string;
        type: "solMessage";
     }[];
     operation: "signSolMessage";
  })[];
  scope: "project" | "account";
};
```

Defined in: [src/client/policies/policies.types.ts:63](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L63)

The policy definition to create.
Contains the scope, description, and rules for the policy.

###### description?

```ts
optional description: string;
```

An optional human-readable description for the policy.
Limited to 50 characters of alphanumeric characters, spaces, commas, and periods.

###### rules

```ts
rules: (
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     ethValue: string;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "ethValue";
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmAddress";
   }
     | {
     changeCents: number;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "netUSDChange";
   }
     | {
     abi:   | "erc20"
        | "erc721"
        | "erc1155"
        | readonly (
        | {
      }
        | {
      }
        | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
     conditions: {
        function: string;
        params?: ...[];
     }[];
     type: "evmData";
  })[];
  operation: "signEvmTransaction";
}
  | {
  action: "reject" | "accept";
  operation: "signEvmHash";
}
  | {
  action: "reject" | "accept";
  criteria: {
     match: string;
     type: "evmMessage";
  }[];
  operation: "signEvmMessage";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     conditions: (
        | {
        addresses: ...[];
        operator: ... | ...;
        path: string;
      }
        | {
        operator: ... | ... | ... | ... | ...;
        path: string;
        value: string;
      }
        | {
        match: string;
        path: string;
     })[];
     type: "evmTypedDataField";
     types: {
        primaryType: string;
        types: Record<string, {
           name: ...;
           type: ...;
        }[]>;
     };
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmTypedDataVerifyingContract";
  })[];
  operation: "signEvmTypedData";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     ethValue: string;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "ethValue";
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmAddress";
   }
     | {
     networks: (
        | "base-sepolia"
        | "base"
        | "arbitrum"
        | "optimism"
        | "polygon"
        | "avalanche"
        | "ethereum"
       | "ethereum-sepolia")[];
     operator: "in" | "not in";
     type: "evmNetwork";
   }
     | {
     changeCents: number;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "netUSDChange";
   }
     | {
     abi:   | "erc20"
        | "erc721"
        | "erc1155"
        | readonly (
        | {
      }
        | {
      }
        | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
     conditions: {
        function: string;
        params?: ...[];
     }[];
     type: "evmData";
  })[];
  operation: "sendEvmTransaction";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     ethValue: string;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "ethValue";
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmAddress";
   }
     | {
     networks: (
        | "base-sepolia"
        | "base"
        | "arbitrum"
        | "optimism"
        | "zora"
        | "polygon"
        | "bnb"
        | "avalanche"
        | "ethereum"
       | "ethereum-sepolia")[];
     operator: "in" | "not in";
     type: "evmNetwork";
   }
     | {
     changeCents: number;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "netUSDChange";
   }
     | {
     abi:   | "erc20"
        | "erc721"
        | "erc1155"
        | readonly (
        | {
      }
        | {
      }
        | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
     conditions: {
        function: string;
        params?: ...[];
     }[];
     type: "evmData";
  })[];
  operation: "prepareUserOperation";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     ethValue: string;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "ethValue";
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmAddress";
   }
     | {
     changeCents: number;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "netUSDChange";
   }
     | {
     abi:   | "erc20"
        | "erc721"
        | "erc1155"
        | readonly (
        | {
      }
        | {
      }
        | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
     conditions: {
        function: string;
        params?: ...[];
     }[];
     type: "evmData";
  })[];
  operation: "sendUserOperation";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "solAddress";
   }
     | {
     operator: ">" | ">=" | "<" | "<=" | "==";
     solValue: string;
     type: "solValue";
   }
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "splAddress";
   }
     | {
     operator: ">" | ">=" | "<" | "<=" | "==";
     splValue: string;
     type: "splValue";
   }
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "mintAddress";
   }
     | {
     conditions: {
        instruction: string;
        params?: ...[];
     }[];
     idls: (
        | "SystemProgram"
        | "TokenProgram"
        | "AssociatedTokenProgram"
        | objectOutputType<{
        address: ...;
        instructions: ...;
     }, ZodTypeAny, "passthrough">)[];
     type: "solData";
   }
     | {
     operator: "in" | "not in";
     programIds: string[];
     type: "programId";
  })[];
  operation: "signSolTransaction";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "solAddress";
   }
     | {
     operator: ">" | ">=" | "<" | "<=" | "==";
     solValue: string;
     type: "solValue";
   }
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "splAddress";
   }
     | {
     operator: ">" | ">=" | "<" | "<=" | "==";
     splValue: string;
     type: "splValue";
   }
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "mintAddress";
   }
     | {
     conditions: {
        instruction: string;
        params?: ...[];
     }[];
     idls: (
        | "SystemProgram"
        | "TokenProgram"
        | "AssociatedTokenProgram"
        | objectOutputType<{
        address: ...;
        instructions: ...;
     }, ZodTypeAny, "passthrough">)[];
     type: "solData";
   }
     | {
     operator: "in" | "not in";
     programIds: string[];
     type: "programId";
   }
     | {
     networks: ("solana-devnet" | "solana")[];
     operator: "in" | "not in";
     type: "solNetwork";
  })[];
  operation: "sendSolTransaction";
}
  | {
  action: "reject" | "accept";
  criteria: {
     match: string;
     type: "solMessage";
  }[];
  operation: "signSolMessage";
})[];
```

Array of rules that comprise the policy.
Limited to a maximum of 10 rules per policy.

###### scope

```ts
scope: "project" | "account" = PolicyScopeEnum;
```

The scope of the policy.
"project" applies to the entire project, "account" applies to specific accounts.

***

### DeletePolicyOptions

Defined in: [src/client/policies/policies.types.ts:80](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L80)

Options for deleting a Policy.

#### Properties

##### id

```ts
id: string;
```

Defined in: [src/client/policies/policies.types.ts:85](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L85)

The unique identifier of the policy to delete.
This is a UUID that's generated when the policy is created.

##### idempotencyKey?

```ts
optional idempotencyKey: string;
```

Defined in: [src/client/policies/policies.types.ts:90](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L90)

The idempotency key to ensure the request is processed exactly once.
Used to safely retry requests without accidentally performing the same operation twice.

***

### GetPolicyByIdOptions

Defined in: [src/client/policies/policies.types.ts:69](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L69)

Options for retrieving a Policy by ID.

#### Properties

##### id

```ts
id: string;
```

Defined in: [src/client/policies/policies.types.ts:74](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L74)

The unique identifier of the policy to retrieve.
This is a UUID that's generated when the policy is created.

***

### ListPoliciesOptions

Defined in: [src/client/policies/policies.types.ts:26](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L26)

#### Properties

##### pageSize?

```ts
optional pageSize: number;
```

Defined in: [src/client/policies/policies.types.ts:28](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L28)

The page size to paginate through the accounts.

##### pageToken?

```ts
optional pageToken: string;
```

Defined in: [src/client/policies/policies.types.ts:30](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L30)

The page token to paginate through the accounts.

##### scope?

```ts
optional scope: "project" | "account";
```

Defined in: [src/client/policies/policies.types.ts:34](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L34)

The scope of the policies to return. If `project`, the response will include exactly one policy, which is the project-level policy. If `account`, the response will include all account-level policies for the developer's CDP Project.

***

### ListPoliciesResult

Defined in: [src/client/policies/policies.types.ts:40](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L40)

The result of listing policies.

#### Properties

##### nextPageToken?

```ts
optional nextPageToken: string;
```

Defined in: [src/client/policies/policies.types.ts:47](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L47)

The next page token to paginate through the policies.
If undefined, there are no more policies to paginate through.

##### policies

```ts
policies: Policy[];
```

Defined in: [src/client/policies/policies.types.ts:42](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L42)

The list of policies matching the query parameters.

***

### UpdatePolicyOptions

Defined in: [src/client/policies/policies.types.ts:96](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L96)

Options for updating a Policy.

#### Properties

##### id

```ts
id: string;
```

Defined in: [src/client/policies/policies.types.ts:101](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L101)

The unique identifier of the policy to update.
This is a UUID that's generated when the policy is created.

##### idempotencyKey?

```ts
optional idempotencyKey: string;
```

Defined in: [src/client/policies/policies.types.ts:111](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L111)

The idempotency key to ensure the request is processed exactly once.
Used to safely retry requests without accidentally performing the same operation twice.

##### policy

```ts
policy: {
  description?: string;
  rules: (
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        ethValue: string;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "ethValue";
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmAddress";
      }
        | {
        changeCents: number;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "netUSDChange";
      }
        | {
        abi:   | "erc20"
           | "erc721"
           | "erc1155"
           | readonly (
           | {
         }
           | {
         }
           | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
        conditions: {
           function: string;
           params?: ...[];
        }[];
        type: "evmData";
     })[];
     operation: "signEvmTransaction";
   }
     | {
     action: "reject" | "accept";
     operation: "signEvmHash";
   }
     | {
     action: "reject" | "accept";
     criteria: {
        match: string;
        type: "evmMessage";
     }[];
     operation: "signEvmMessage";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        conditions: (
           | {
           addresses: ...[];
           operator: ... | ...;
           path: string;
         }
           | {
           operator: ... | ... | ... | ... | ...;
           path: string;
           value: string;
         }
           | {
           match: string;
           path: string;
        })[];
        type: "evmTypedDataField";
        types: {
           primaryType: string;
           types: Record<string, {
              name: ...;
              type: ...;
           }[]>;
        };
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmTypedDataVerifyingContract";
     })[];
     operation: "signEvmTypedData";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        ethValue: string;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "ethValue";
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmAddress";
      }
        | {
        networks: (
           | "base-sepolia"
           | "base"
           | "arbitrum"
           | "optimism"
           | "polygon"
           | "avalanche"
           | "ethereum"
          | "ethereum-sepolia")[];
        operator: "in" | "not in";
        type: "evmNetwork";
      }
        | {
        changeCents: number;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "netUSDChange";
      }
        | {
        abi:   | "erc20"
           | "erc721"
           | "erc1155"
           | readonly (
           | {
         }
           | {
         }
           | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
        conditions: {
           function: string;
           params?: ...[];
        }[];
        type: "evmData";
     })[];
     operation: "sendEvmTransaction";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        ethValue: string;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "ethValue";
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmAddress";
      }
        | {
        networks: (
           | "base-sepolia"
           | "base"
           | "arbitrum"
           | "optimism"
           | "zora"
           | "polygon"
           | "bnb"
           | "avalanche"
           | "ethereum"
          | "ethereum-sepolia")[];
        operator: "in" | "not in";
        type: "evmNetwork";
      }
        | {
        changeCents: number;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "netUSDChange";
      }
        | {
        abi:   | "erc20"
           | "erc721"
           | "erc1155"
           | readonly (
           | {
         }
           | {
         }
           | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
        conditions: {
           function: string;
           params?: ...[];
        }[];
        type: "evmData";
     })[];
     operation: "prepareUserOperation";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        ethValue: string;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "ethValue";
      }
        | {
        addresses: `0x${string}`[];
        operator: "in" | "not in";
        type: "evmAddress";
      }
        | {
        changeCents: number;
        operator: ">" | ">=" | "<" | "<=" | "==";
        type: "netUSDChange";
      }
        | {
        abi:   | "erc20"
           | "erc721"
           | "erc1155"
           | readonly (
           | {
         }
           | {
         }
           | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
        conditions: {
           function: string;
           params?: ...[];
        }[];
        type: "evmData";
     })[];
     operation: "sendUserOperation";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "solAddress";
      }
        | {
        operator: ">" | ">=" | "<" | "<=" | "==";
        solValue: string;
        type: "solValue";
      }
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "splAddress";
      }
        | {
        operator: ">" | ">=" | "<" | "<=" | "==";
        splValue: string;
        type: "splValue";
      }
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "mintAddress";
      }
        | {
        conditions: {
           instruction: string;
           params?: ...[];
        }[];
        idls: (
           | "SystemProgram"
           | "TokenProgram"
           | "AssociatedTokenProgram"
           | objectOutputType<{
           address: ...;
           instructions: ...;
        }, ZodTypeAny, "passthrough">)[];
        type: "solData";
      }
        | {
        operator: "in" | "not in";
        programIds: string[];
        type: "programId";
     })[];
     operation: "signSolTransaction";
   }
     | {
     action: "reject" | "accept";
     criteria: (
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "solAddress";
      }
        | {
        operator: ">" | ">=" | "<" | "<=" | "==";
        solValue: string;
        type: "solValue";
      }
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "splAddress";
      }
        | {
        operator: ">" | ">=" | "<" | "<=" | "==";
        splValue: string;
        type: "splValue";
      }
        | {
        addresses: string[];
        operator: "in" | "not in";
        type: "mintAddress";
      }
        | {
        conditions: {
           instruction: string;
           params?: ...[];
        }[];
        idls: (
           | "SystemProgram"
           | "TokenProgram"
           | "AssociatedTokenProgram"
           | objectOutputType<{
           address: ...;
           instructions: ...;
        }, ZodTypeAny, "passthrough">)[];
        type: "solData";
      }
        | {
        operator: "in" | "not in";
        programIds: string[];
        type: "programId";
      }
        | {
        networks: ("solana-devnet" | "solana")[];
        operator: "in" | "not in";
        type: "solNetwork";
     })[];
     operation: "sendSolTransaction";
   }
     | {
     action: "reject" | "accept";
     criteria: {
        match: string;
        type: "solMessage";
     }[];
     operation: "signSolMessage";
  })[];
};
```

Defined in: [src/client/policies/policies.types.ts:106](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L106)

The updated policy definition.
Contains the description and rules for the policy.

###### description?

```ts
optional description: string;
```

An optional human-readable description for the policy.
Limited to 50 characters of alphanumeric characters, spaces, commas, and periods.

###### rules

```ts
rules: (
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     ethValue: string;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "ethValue";
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmAddress";
   }
     | {
     changeCents: number;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "netUSDChange";
   }
     | {
     abi:   | "erc20"
        | "erc721"
        | "erc1155"
        | readonly (
        | {
      }
        | {
      }
        | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
     conditions: {
        function: string;
        params?: ...[];
     }[];
     type: "evmData";
  })[];
  operation: "signEvmTransaction";
}
  | {
  action: "reject" | "accept";
  operation: "signEvmHash";
}
  | {
  action: "reject" | "accept";
  criteria: {
     match: string;
     type: "evmMessage";
  }[];
  operation: "signEvmMessage";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     conditions: (
        | {
        addresses: ...[];
        operator: ... | ...;
        path: string;
      }
        | {
        operator: ... | ... | ... | ... | ...;
        path: string;
        value: string;
      }
        | {
        match: string;
        path: string;
     })[];
     type: "evmTypedDataField";
     types: {
        primaryType: string;
        types: Record<string, {
           name: ...;
           type: ...;
        }[]>;
     };
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmTypedDataVerifyingContract";
  })[];
  operation: "signEvmTypedData";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     ethValue: string;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "ethValue";
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmAddress";
   }
     | {
     networks: (
        | "base-sepolia"
        | "base"
        | "arbitrum"
        | "optimism"
        | "polygon"
        | "avalanche"
        | "ethereum"
       | "ethereum-sepolia")[];
     operator: "in" | "not in";
     type: "evmNetwork";
   }
     | {
     changeCents: number;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "netUSDChange";
   }
     | {
     abi:   | "erc20"
        | "erc721"
        | "erc1155"
        | readonly (
        | {
      }
        | {
      }
        | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
     conditions: {
        function: string;
        params?: ...[];
     }[];
     type: "evmData";
  })[];
  operation: "sendEvmTransaction";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     ethValue: string;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "ethValue";
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmAddress";
   }
     | {
     networks: (
        | "base-sepolia"
        | "base"
        | "arbitrum"
        | "optimism"
        | "zora"
        | "polygon"
        | "bnb"
        | "avalanche"
        | "ethereum"
       | "ethereum-sepolia")[];
     operator: "in" | "not in";
     type: "evmNetwork";
   }
     | {
     changeCents: number;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "netUSDChange";
   }
     | {
     abi:   | "erc20"
        | "erc721"
        | "erc1155"
        | readonly (
        | {
      }
        | {
      }
        | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
     conditions: {
        function: string;
        params?: ...[];
     }[];
     type: "evmData";
  })[];
  operation: "prepareUserOperation";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     ethValue: string;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "ethValue";
   }
     | {
     addresses: `0x${string}`[];
     operator: "in" | "not in";
     type: "evmAddress";
   }
     | {
     changeCents: number;
     operator: ">" | ">=" | "<" | "<=" | "==";
     type: "netUSDChange";
   }
     | {
     abi:   | "erc20"
        | "erc721"
        | "erc1155"
        | readonly (
        | {
      }
        | {
      }
        | { payable?: boolean | undefined; constant?: boolean | undefined; gas?: number | undefined; } & ({ inputs: readonly AbiParameter[]; outputs: readonly AbiParameter[]; type: "function"; name: string; stateMutability: "pure" | ... 2 more ... | "payable"; } | { ...; } | { ...; } | { ...; }))[];
     conditions: {
        function: string;
        params?: ...[];
     }[];
     type: "evmData";
  })[];
  operation: "sendUserOperation";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "solAddress";
   }
     | {
     operator: ">" | ">=" | "<" | "<=" | "==";
     solValue: string;
     type: "solValue";
   }
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "splAddress";
   }
     | {
     operator: ">" | ">=" | "<" | "<=" | "==";
     splValue: string;
     type: "splValue";
   }
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "mintAddress";
   }
     | {
     conditions: {
        instruction: string;
        params?: ...[];
     }[];
     idls: (
        | "SystemProgram"
        | "TokenProgram"
        | "AssociatedTokenProgram"
        | objectOutputType<{
        address: ...;
        instructions: ...;
     }, ZodTypeAny, "passthrough">)[];
     type: "solData";
   }
     | {
     operator: "in" | "not in";
     programIds: string[];
     type: "programId";
  })[];
  operation: "signSolTransaction";
}
  | {
  action: "reject" | "accept";
  criteria: (
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "solAddress";
   }
     | {
     operator: ">" | ">=" | "<" | "<=" | "==";
     solValue: string;
     type: "solValue";
   }
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "splAddress";
   }
     | {
     operator: ">" | ">=" | "<" | "<=" | "==";
     splValue: string;
     type: "splValue";
   }
     | {
     addresses: string[];
     operator: "in" | "not in";
     type: "mintAddress";
   }
     | {
     conditions: {
        instruction: string;
        params?: ...[];
     }[];
     idls: (
        | "SystemProgram"
        | "TokenProgram"
        | "AssociatedTokenProgram"
        | objectOutputType<{
        address: ...;
        instructions: ...;
     }, ZodTypeAny, "passthrough">)[];
     type: "solData";
   }
     | {
     operator: "in" | "not in";
     programIds: string[];
     type: "programId";
   }
     | {
     networks: ("solana-devnet" | "solana")[];
     operator: "in" | "not in";
     type: "solNetwork";
  })[];
  operation: "sendSolTransaction";
}
  | {
  action: "reject" | "accept";
  criteria: {
     match: string;
     type: "solMessage";
  }[];
  operation: "signSolMessage";
})[];
```

Array of rules that comprise the policy.
Limited to a maximum of 10 rules per policy.

## Type Aliases

### PoliciesClientInterface

```ts
type PoliciesClientInterface = Omit<typeof OpenApiPoliciesMethods, 
  | "createPolicy"
  | "listPolicies"
  | "getPolicyById"
  | "deletePolicy"
  | "updatePolicy"> & {
  createPolicy: (options: CreatePolicyOptions) => Promise<Policy>;
  deletePolicy: (options: DeletePolicyOptions) => Promise<void>;
  getPolicyById: (options: GetPolicyByIdOptions) => Promise<Policy>;
  listPolicies: (options: ListPoliciesOptions) => Promise<ListPoliciesResult>;
  updatePolicy: (options: UpdatePolicyOptions) => Promise<Policy>;
};
```

Defined in: [src/client/policies/policies.types.ts:11](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/policies/policies.types.ts#L11)

The PoliciesClient type, where all OpenApiPoliciesMethods methods are wrapped.

#### Type declaration

##### createPolicy()

```ts
createPolicy: (options: CreatePolicyOptions) => Promise<Policy>;
```

###### Parameters

###### options

[`CreatePolicyOptions`](/sdks/cdp-sdks-v2/typescript/policies/Types#createpolicyoptions)

###### Returns

`Promise`\<`Policy`>

##### deletePolicy()

```ts
deletePolicy: (options: DeletePolicyOptions) => Promise<void>;
```

###### Parameters

###### options

[`DeletePolicyOptions`](/sdks/cdp-sdks-v2/typescript/policies/Types#deletepolicyoptions)

###### Returns

`Promise`\<`void`>

##### getPolicyById()

```ts
getPolicyById: (options: GetPolicyByIdOptions) => Promise<Policy>;
```

###### Parameters

###### options

[`GetPolicyByIdOptions`](/sdks/cdp-sdks-v2/typescript/policies/Types#getpolicybyidoptions)

###### Returns

`Promise`\<`Policy`>

##### listPolicies()

```ts
listPolicies: (options: ListPoliciesOptions) => Promise<ListPoliciesResult>;
```

###### Parameters

###### options

[`ListPoliciesOptions`](/sdks/cdp-sdks-v2/typescript/policies/Types#listpoliciesoptions)

###### Returns

`Promise`\<[`ListPoliciesResult`](/sdks/cdp-sdks-v2/typescript/policies/Types#listpoliciesresult)>

##### updatePolicy()

```ts
updatePolicy: (options: UpdatePolicyOptions) => Promise<Policy>;
```

###### Parameters

###### options

[`UpdatePolicyOptions`](/sdks/cdp-sdks-v2/typescript/policies/Types#updatepolicyoptions)

###### Returns

`Promise`\<`Policy`>
