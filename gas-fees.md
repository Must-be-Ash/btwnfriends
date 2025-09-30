Let's use the wallet i have in my .env (which we are using to cover gas for releasing the funds when a new user 
  joins) to send the new user 0.000011ETH (about $0.05) on Base when they join so they have a bit of fund to cover gas
   needed for their first transactions. This way we can sponsour gas without making things too technical. it's a work 
  around since CDP embedded wallets are EOA wallets and we can't use paymaster right now.\
  PUBLIC_WALLET_ADDRESS
  PRIVATE_WALLET_KEY

│ ╭─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ Plan: Automatic ETH Funding for New Users                                                                           │ │
│ │                                                                                                                     │ │
│ │ Overview                                                                                                            │ │
│ │                                                                                                                     │ │
│ │ Implement automatic ETH funding (0.000011 ETH ≈ $0.05) for new users when they register to cover initial gas costs  │ │
│ │ for transactions. This will use the existing admin wallet infrastructure.                                           │ │
│ │                                                                                                                     │ │
│ │ Implementation Plan                                                                                                 │ │
│ │                                                                                                                     │ │
│ │ 1. Create ETH Funding Utility (src/lib/eth-funding.ts)                                                              │ │
│ │                                                                                                                     │ │
│ │ - Create wallet client using existing admin wallet private key                                                      │ │
│ │ - Implement sendEthToNewUser() function with proper gas estimation                                                  │ │
│ │ - Add error handling for insufficient funds, network errors                                                         │ │
│ │ - Include transaction receipt validation                                                                            │ │
│ │                                                                                                                     │ │
│ │ 2. Modify User Registration Flow (src/app/api/users/route.ts)                                                       │ │
│ │                                                                                                                     │ │
│ │ - Add ETH funding call after successful user creation                                                               │ │
│ │ - Handle funding failures gracefully (log error, don't fail registration)                                           │ │
│ │ - Return funding status in response for monitoring                                                                  │ │
│ │ - Add funding tracking to database                                                                                  │ │
│ │                                                                                                                     │ │
│ │ 3. Database Schema Updates (src/lib/models.ts)                                                                      │ │
│ │                                                                                                                     │ │
│ │ - Add ethFundingTxHash and ethFundingStatus fields to User model                                                    │ │
│ │ - Track funding attempts and success/failure status                                                                 │ │
│ │ - Add ethFundingAt timestamp for monitoring                                                                         │ │
│ │                                                                                                                     │ │
│ │ 4. Security & Rate Limiting                                                                                         │ │
│ │                                                                                                                     │ │
│ │ - Add rate limiting to prevent abuse (max 1 funding per email/wallet)                                               │ │
│ │ - Validate wallet addresses before funding                                                                          │ │
│ │ - Add admin wallet balance monitoring                                                                               │ │
│ │ - Implement retry logic for failed transactions                                                                     │ │
│ │                                                                                                                     │ │
│ │ 5. Environment Configuration                                                                                        │ │
│ │                                                                                                                     │ │
│ │ - Use existing PRIVATE_WALLET_KEY from .env                                                                         │ │
│ │ - Add optional ETH_FUNDING_AMOUNT configuration                                                                     │ │
│ │ - Add network-specific funding logic (testnet vs mainnet)                                                           │ │
│ │                                                                                                                     │ │
│ │ Key Features                                                                                                        │ │
│ │                                                                                                                     │ │
│ │ - Non-blocking: User registration succeeds even if ETH funding fails                                                │ │
│ │ - Idempotent: Won't fund the same user twice                                                                        │ │
│ │ - Monitored: Track all funding attempts and balances                                                                │ │
│ │ - Secure: Rate limited and validated                                                                                │ │
│ │ - Network-aware: Different amounts for testnet vs mainnet                                                           │ │
│ │                                                                                                                     │ │
│ │ Files to Modify                                                                                                     │ │
│ │                                                                                                                     │ │
│ │ 1. src/lib/eth-funding.ts (new file)                                                                                │ │
│ │ 2. src/app/api/users/route.ts (modify POST endpoint)                                                                │ │
│ │ 3. src/lib/models.ts (add User fields)                                                                              │ │
│ │ 4. src/lib/cdp.ts (add funding utilities)                                                                           │ │
│ │                                                                                                                     │ │
│ │ Benefits                                                                                                            │ │
│ │                                                                                                                     │ │
│ │ - Users can immediately perform transactions without manual ETH acquisition                                         │ │
│ │ - Seamless onboarding experience                                                                                    │ │
│ │ - Leverages existing admin wallet infrastructure                                                                    │ │
│ │ - Minimal changes to current architecture   