# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Common Development Tasks
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Smart Contract Development (Foundry)
```bash
# Build contracts
forge build

# Run contract tests
forge test

# Deploy to Base Sepolia testnet
forge script script/DeploySimpleEscrow.s.sol --rpc-url base_sepolia --broadcast

# Deploy to Base mainnet
forge script script/DeploySimpleEscrowMainnet.s.sol --rpc-url base --broadcast
```

## Repository Overview

This is "Between Friends" - a Next.js web application for email-based USDC transfers on Base. The app uses Coinbase Developer Platform (CDP) Embedded Wallets and implements a conditional escrow system for unknown recipients.

## Architecture

### Core Structure
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with MongoDB for data persistence
- **Blockchain**: Smart contracts on Base (mainnet/testnet) using Foundry
- **Wallet Integration**: CDP Embedded Wallets for gasless, email-based authentication
- **PWA**: Progressive Web App with offline support and install prompts

### Key Technologies
- **CDP Embedded Wallets**: `@coinbase/cdp-react`, `@coinbase/cdp-hooks`, `@coinbase/cdp-core`
- **Blockchain**: Viem for Ethereum interactions, USDC ERC-20 token
- **Email**: Resend for transactional emails
- **Database**: MongoDB with Zod schemas
- **UI**: Framer Motion animations, Lucide React icons
- **PWA**: next-pwa with Workbox caching strategies

## Environment Configuration

### Required Environment Variables
```bash
# CDP Configuration (required)
NEXT_PUBLIC_CDP_PROJECT_ID=your-project-id
NEXT_PUBLIC_BASE_RPC_URL=https://sepolia.base.org  # or https://mainnet.base.org

# Database
MONGODB_URI=your-mongodb-connection-string

# Email Service
RESEND_API_KEY=your-resend-api-key

# Admin Configuration
ADMIN_WALLET_PRIVATE_KEY=your-admin-private-key
JWT_SECRET=your-jwt-secret
```

### Network Configuration
- **Development**: Base Sepolia testnet (chainId: 84532)
- **Production**: Base mainnet (chainId: 8453)
- Network auto-detection based on `NODE_ENV`

## Smart Contracts

### SimpleEscrow.sol
Core escrow contract for email-based transfers:
- **Deposit**: Users deposit USDC with a hashed secret (email + token)
- **Admin Release**: Admin wallet releases funds to verified recipients (gasless for recipients)
- **Refund**: Senders can reclaim funds after timeout
- **Security**: Uses OpenZeppelin's ReentrancyGuard and Ownable

### Contract Addresses
Update `src/lib/cdp.ts` with deployed contract addresses:
```typescript
export const CONTRACT_ADDRESSES = {
  USDC: {
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet
    84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia
  },
  SIMPLE_ESCROW: {
    8453: 'YOUR_MAINNET_ADDRESS',
    84532: 'YOUR_TESTNET_ADDRESS',
  }
}
```

## Application Flow

### Transfer Types
1. **Known Recipients**: Direct USDC transfer to existing user's wallet
2. **Unknown Recipients**: Escrow-based transfer with email claim link

### User Authentication
- CDP Embedded Wallets with email OTP (no seed phrases)
- Automatic wallet creation on first sign-in
- Persistent authentication state across sessions

### Key Components
- **CDPProvider**: Wraps app with CDP React context
- **Dashboard**: Main user interface with balance, actions, transactions
- **SendFlow**: Multi-step transfer process with recipient lookup
- **ClaimFlow**: Recipient claiming process for escrow transfers
- **PWA Components**: Install prompts, network status, update notifications

## Development Patterns

### Component Structure
```tsx
"use client"; // Required for CDP components

export function MyComponent() {
  const isSignedIn = useIsSignedIn();
  const evmAddress = useEvmAddress();
  // Component logic
}
```

### Transaction Handling
```typescript
// Use CDP hooks for transactions
const sendEvmTransaction = useSendEvmTransaction();

// Prepare EIP-1559 transactions for Base
const transaction: TransactionRequest = {
  to: '0x...',
  value: BigInt(0),
  data: '0x...',
  type: "eip1559"
};
```

### API Route Patterns
```typescript
// src/app/api/*/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  await connectDB();
  // API logic
  return NextResponse.json({ success: true });
}
```

## Database Models

### User Model
```typescript
interface User {
  email: string;
  evmAddress: string;
  displayName?: string;
  createdAt: Date;
  lastActive: Date;
}
```

### Transfer Model
```typescript
interface Transfer {
  transferId: string;
  senderEmail: string;
  recipientEmail: string;
  amount: string;
  status: 'pending' | 'claimed' | 'refunded';
  claimToken?: string;
  expiryDate: Date;
  transactionHash?: string;
}
```

## Security Considerations

### Smart Contract Security
- All contracts use OpenZeppelin battle-tested libraries
- ReentrancyGuard prevents reentrancy attacks
- Ownable pattern for admin functions
- Emergency withdrawal function for stuck funds

### Application Security
- Input validation with Zod schemas
- JWT tokens for API authentication
- Rate limiting on sensitive endpoints
- CORS configuration in CDP Portal
- Security headers in next.config.js

### Private Key Management
- Admin private key stored securely (environment variable)
- CDP handles user private keys in TEE
- No private keys exposed in frontend code

## Testing

### Smart Contract Tests
```bash
# Run all contract tests
forge test

# Run specific test file
forge test --match-path test/SimpleEscrow.t.sol

# Run with verbose output
forge test -vvv
```

### Test Structure
- Unit tests in `test/` directory
- Integration tests for full escrow flow
- Test contracts extend `forge-std/Test.sol`

## Deployment

### Smart Contract Deployment
1. Update `foundry.toml` with correct RPC endpoints
2. Set environment variables for private keys
3. Deploy using forge scripts in `script/` directory
4. Update contract addresses in `src/lib/cdp.ts`

### Application Deployment
1. Set all required environment variables
2. Build application: `npm run build`
3. Deploy to hosting provider (Vercel recommended)
4. Configure domain and SSL
5. Test CDP CORS configuration

## PWA Features

### Caching Strategy
- Static assets cached with `CacheFirst`
- API responses cached with `NetworkFirst`
- Google Fonts cached for performance
- Runtime caching configured in `next.config.js`

### Offline Support
- Service worker handles offline scenarios
- Cached data available when network unavailable
- Network status indicator for users
- Update notifications for new versions

## File Organization

### Source Structure
```
src/
├── app/                 # Next.js App Router pages and API routes
├── components/          # React components organized by feature
├── contracts/           # Solidity smart contracts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
└── types/              # TypeScript type definitions
```

### Key Files
- `src/lib/cdp.ts`: CDP configuration and utilities
- `src/lib/db.ts`: MongoDB connection and models
- `src/lib/email.ts`: Email service integration
- `src/components/providers/CDPProvider.tsx`: CDP React provider
- `next.config.js`: Next.js and PWA configuration

## Common Issues

### CDP Integration
- Ensure `"use client"` directive on all CDP components
- Verify CORS allowlist in CDP Portal matches your domain
- Use supported Node.js versions (20 or 22, not 21)

### Smart Contract Deployment
- Verify RPC URL and chain ID match target network
- Ensure sufficient ETH balance for deployment gas
- Update contract addresses after deployment

### PWA Installation
- Manifest file must be accessible at `/manifest.json`
- Icons must be available in `/public` directory
- HTTPS required for PWA features in production