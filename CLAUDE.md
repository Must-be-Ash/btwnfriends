# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Web App (Next.js)
```bash
# Start development server
npm run dev -- -p 3000

# Build for production
npm run build

# Start production server (binds to 0.0.0.0:5000)
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Mobile App (React Native/Expo)
```bash
# Navigate to mobile directory first
cd mobile

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run as web app (for testing)
npm run web
```

### Smart Contract Development (Foundry)
```bash
# Build contracts
forge build

# Run contract tests
forge test

# Deploy SimplifiedEscrow to Base Sepolia testnet
forge script script/DeploySimplifiedEscrow.s.sol --rpc-url base_sepolia --broadcast

# Deploy SimplifiedEscrow to Base mainnet
forge script script/DeploySimplifiedEscrowMainnet.s.sol --rpc-url base --broadcast
```

## Repository Overview

This is "Between Friends" - a dual-platform application (Next.js web + React Native mobile) for email-based USDC transfers on Base. The app uses Coinbase Developer Platform (CDP) Embedded Wallets and implements a conditional escrow system for unknown recipients.

## Architecture

### Core Structure
- **Web Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Mobile Frontend**: React Native with Expo Router, TypeScript, NativeWind (Tailwind for React Native)
- **Backend**: Next.js API routes with MongoDB for data persistence
- **Blockchain**: Smart contracts on Base (mainnet/testnet) using Foundry
- **Wallet Integration**: CDP Embedded Wallets for gasless, email-based authentication
  - Web: `@coinbase/cdp-hooks` with `CDPHooksProvider`
  - Mobile: `@coinbase/cdp-react-native` with same hook interface
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

### SimplifiedEscrow.sol
Core escrow contract for email-based transfers (located in `src/contracts/SimplifiedEscrow.sol`):
- **Deposit**: Users deposit USDC with a hashed email (privacy-preserving)
- **Admin Release**: Admin wallet releases funds to verified recipients (gasless for recipients)
- **Refund**: Senders can reclaim funds after timeout
- **Admin Refund**: Admin can process automatic refunds for expired transfers
- **Security**: Uses OpenZeppelin's ReentrancyGuard and Ownable
- **Emergency Withdrawal**: Owner can recover stuck tokens

### Contract Addresses
Update `src/lib/cdp.ts` with deployed contract addresses:
```typescript
export const CONTRACT_ADDRESSES = {
  USDC: {
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet
    84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia
  },
  SIMPLIFIED_ESCROW: {
    8453: '0x0000000000000000000000000000000000000000', // Base Mainnet - to be deployed
    84532: '0x1C182dDa2DE61c349bc516Fa8a63a371cA4CE184', // Base Sepolia - deployed
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

### Web App Structure
```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── api/            # Backend API endpoints
│   │   ├── admin/release/      # Admin releases funds to recipients
│   │   ├── contacts/           # Contact management
│   │   ├── pending-claims/     # Pending transfer lookups
│   │   ├── recipients/lookup/  # Check if recipient exists
│   │   ├── send/              # Transfer endpoints
│   │   ├── transactions/       # Transaction history
│   │   └── users/             # User management
│   └── ...             # Application pages
├── components/          # React components organized by feature
├── contracts/           # Solidity smart contracts
│   ├── SimplifiedEscrow.sol     # Active escrow contract
│   ├── USDCEscrow.sol          # Alternative implementation
│   └── *.sol.backup            # Backup files
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
│   ├── cdp.ts                  # CDP config and transaction helpers
│   ├── db.ts                   # MongoDB connection
│   ├── email.ts                # Resend email integration
│   ├── models.ts               # Database models with Zod schemas
│   ├── simplified-escrow.ts    # Escrow contract interactions
│   ├── usdc.ts                 # USDC token interactions
│   └── utils.ts                # General utilities
└── types/              # TypeScript type definitions
```

### Mobile App Structure
```
mobile/
├── app/                # Expo Router screens
│   ├── (tabs)/        # Tab navigation screens
│   │   ├── index.tsx           # Home/Dashboard
│   │   ├── send.tsx            # Send money
│   │   ├── activity.tsx        # Transaction history
│   │   └── wallet.tsx          # Wallet management
│   ├── auth.tsx       # Authentication screen
│   ├── settings.tsx   # Settings and preferences
│   ├── export-key.tsx # Private key export
│   └── scan.tsx       # QR code scanner
├── components/         # React Native components
├── hooks/             # Custom hooks for mobile
├── lib/               # Shared utilities (API client, storage)
└── assets/            # Images, fonts, icons
```

### Key Files
- `src/lib/cdp.ts`: CDP configuration and transaction utilities
- `src/lib/db.ts`: MongoDB connection and models
- `src/lib/email.ts`: Email service integration
- `src/lib/simplified-escrow.ts`: Escrow contract interaction helpers
- `src/components/providers/CDPProvider.tsx`: CDP React provider (web)
- `next.config.js`: Next.js and PWA configuration
- `mobile/lib/api.ts`: Mobile API client with dynamic host detection

## Common Issues

### CDP Integration
- **Web**: Ensure `"use client"` directive on all CDP components
- **Mobile**: CDP React Native hooks work the same as web hooks (see `mobile/CDP_INTEGRATION_NOTE.md`)
- Verify CORS allowlist in CDP Portal matches your domain
- Use supported Node.js versions (20 or 22, not 21)
- When exporting private keys, use `currentUser.evmAccounts[0]` for EOA address (not `useEvmAddress()` which returns Smart Account)
- Private keys from CDP come as binary data and need hex conversion for display

### Mobile Development
- Mobile app connects to web backend API endpoints
- API client auto-detects localhost vs production URLs
- Test on both iOS simulator and Android emulator
- Expo Go may have limitations; use development builds for full features
- QR code scanning requires camera permissions

### Smart Contract Deployment
- Verify RPC URL and chain ID match target network
- Ensure sufficient ETH balance for deployment gas
- Update contract addresses in `src/lib/cdp.ts` after deployment
- Use correct deployment script: `DeploySimplifiedEscrow.s.sol` (not DeploySimpleEscrow)

### PWA Installation
- Manifest file must be accessible at `/manifest.json`
- Icons must be available in `/public` directory
- HTTPS required for PWA features in production

## Important Implementation Details

### CDP Smart Accounts Architecture
When using Smart Accounts (`createAccountOnLogin: "evm-smart"`):
- `currentUser.evmAccounts[0]` = EOA (Externally Owned Account) - the underlying account
- `currentUser.evmSmartAccounts[0]` = Smart Account address
- `useEvmAddress()` returns Smart Account if available, otherwise EOA
- Private key export requires EOA address: `useExportEvmAccount({ evmAccount: currentUser.evmAccounts[0] })`
- EOA owns and controls the Smart Account

### Private Key Export Security
Follow CDP security best practices from `/embedded-docs/security-export.md`:
- Always show security warning before export
- Require explicit user confirmation
- Use clipboard copy (safer than displaying)
- Clear private key from state after use
- Convert binary key data to hex: `'0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')`
- Never log private keys to console

### Context7 MCP Integration
Use Context7 MCP for fetching up-to-date library documentation:
- `mcp__context7__resolve-library-id`: Convert library name to Context7 ID
- `mcp__context7__get-library-docs`: Fetch documentation with library ID
- Always use when experiencing CDP errors or needing latest API reference

## Mobile App Architecture

### Platform-Specific Differences
The mobile app shares the same backend API and smart contracts but has platform-specific considerations:

**Shared with Web:**
- Same CDP hooks API (`@coinbase/cdp-hooks` interface)
- Same transaction flow (USDC transfers, escrow deposits)
- Same backend API endpoints
- Smart Account architecture (EOA + Smart Account)

**Mobile-Specific:**
- Uses `@coinbase/cdp-react-native` instead of `@coinbase/cdp-hooks`
- Expo Router for navigation instead of Next.js App Router
- NativeWind for styling (Tailwind CSS for React Native)
- Native camera access for QR code scanning
- Secure storage with `expo-secure-store`
- Biometric authentication with `expo-local-authentication`

### API Communication
Mobile app communicates with the Next.js backend API:
- Development: Auto-detects `localhost:5000` or local network IP
- Production: Uses deployed backend URL from environment variables
- All API routes are prefixed with `/api/`
- Authentication uses same JWT tokens as web app

### Key Mobile Packages
```json
{
  "@coinbase/cdp-react-native": "^0.0.1",
  "expo": "~54.0.10",
  "expo-router": "^6.0.9",
  "nativewind": "^4.2.1",
  "expo-camera": "^17.0.8",
  "expo-secure-store": "^15.0.7",
  "expo-local-authentication": "^17.0.7"
}
```

## API Endpoints Reference

### User Management
- `POST /api/users` - Create or update user profile
- `GET /api/users/lookup-by-address?address=0x...` - Find user by wallet address

### Transfers
- `GET /api/recipients/lookup?email=...` - Check if recipient exists
- `POST /api/send` - Initiate direct transfer or escrow deposit
- `POST /api/send/complete` - Mark transfer as complete
- `POST /api/send/sponsored` - Request sponsored gas for transfer
- `POST /api/admin/release` - Admin releases escrow funds to recipient
- `POST /api/refund` - Sender refunds expired escrow transfer

### Transactions & History
- `GET /api/transactions?userId=...` - Get transaction history
- `GET /api/pending-claims?recipientEmail=...` - Get pending claims for user

### Contacts
- `GET /api/contacts?userId=...` - Get user's contacts
- `POST /api/contacts` - Add/update contact
- `POST /api/contacts/favorite` - Toggle favorite status
- `POST /api/contacts/sync-device` - Sync device contacts