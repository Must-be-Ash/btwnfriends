# Between Friends - Payment App

## Overview
Between Friends is a cryptocurrency payment platform enabling email-based USDC transfers using Coinbase Developer Platform (CDP) Embedded Wallets. Available as both a Next.js web app and React Native mobile app (iOS) sharing the same backend.

## Project Structure
- **Web Frontend**: Next.js 14 with React, TypeScript, and Tailwind CSS
- **Mobile App**: React Native with Expo (iOS) - feature parity with web app
- **Backend**: Next.js API routes (shared by both platforms)
- **Database**: MongoDB for user data and transaction history
- **Blockchain**: Base Network (Sepolia testnet for development)
- **Authentication**: Coinbase CDP Embedded Wallets with email OTP
- **Smart Contracts**: SimplifiedEscrow contract for escrow functionality

## Technology Stack

### Web App
- Next.js 14.2.31
- React 18.2.0
- TypeScript 5.5.3
- Tailwind CSS for styling
- Framer Motion for animations
- Next-PWA for Progressive Web App features

### Mobile App (iOS)
- Expo SDK 52
- React Native
- TypeScript 5.5.3
- Expo Router for navigation
- Lucide React Native for icons
- React Native Reanimated for animations

### Shared
- Coinbase CDP SDK (@coinbase/cdp-react, @coinbase/cdp-hooks)
- Viem for blockchain interactions
- MongoDB 6.3.0

## Configuration Requirements

### Required Environment Variables (Web App)
Configure these in the Secrets tab:

1. **NEXT_PUBLIC_CDP_PROJECT_ID** - Get from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/access/api)
2. **DATABASE_URL** - MongoDB connection string (format: mongodb://...)

### Optional Environment Variables (Web App)
3. **RESEND_API_KEY** - For email notifications (get from resend.com)
4. **ADMIN_WALLET_PRIVATE_KEY** - For gasless claims (only if using escrow features)

### Required Environment Variables (Mobile App)
Configure in mobile/.env:

1. **EXPO_PUBLIC_CDP_PROJECT_ID** - Same as web app CDP Project ID
2. **EXPO_PUBLIC_API_URL** - Backend API URL (e.g., https://your-repl.replit.dev)
3. **EXPO_PUBLIC_WEB_URL** - Web app URL for claim links (e.g., https://your-repl.replit.dev)

### Optional Environment Variables (Mobile App)
4. **EXPO_PUBLIC_BASE_RPC_URL** - Base Sepolia RPC (defaults to https://sepolia.base.org)

### Default Configuration
The app is pre-configured for Base Sepolia testnet:
- Chain ID: 84532
- RPC URL: https://sepolia.base.org
- USDC Contract: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
- Escrow Contract: 0x1C182dDa2DE61c349bc516Fa8a63a371cA4CE184

## Getting Started

### 1. Configure Environment
1. Open the Secrets tab in Replit
2. Add your CDP Project ID
3. Add your MongoDB connection string
4. (Optional) Add email and admin wallet keys

### 2. Run the App
The app runs automatically with the configured workflow. It's accessible at port 5000.

### 3. First Time Setup
- The app will create database collections automatically
- Users authenticate via email using CDP
- Wallets are created automatically on first login

## Development

### Web App Commands
- `npm run dev` - Start development server on port 5000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### Mobile App Commands
- `cd mobile && npm start` - Start Expo development server
- `cd mobile && npm run ios` - Run on iOS simulator
- `cd mobile && npm run type-check` - Check TypeScript types

### Port Configuration
- Web Frontend: Port 5000 (configured for Replit)
- Mobile App: Expo development server (connects to web backend)
- Database: External MongoDB connection

## Features

### Core Features
1. **Email-based Authentication** - Users sign in with email (CDP handles OTP)
2. **Automatic Wallet Creation** - Wallets created on first login
3. **Direct Transfers** - Send USDC to existing users instantly
4. **Escrow Transfers** - Send to new users via email claim
5. **Transaction History** - Track all sent/received payments
6. **Contact Management** - Save frequent recipients
7. **PWA Support** - Install as mobile app

### Smart Contract Integration
- USDC transfers on Base Network
- SimplifiedEscrow for email-based claims
- Gas sponsorship for recipients (if admin wallet configured)

## Database Schema

### Collections
1. **users** - User profiles and wallet addresses
2. **transfers** - Pending escrow transfers
3. **transactions** - Transaction history
4. **contacts** - User saved contacts

## Architecture Notes

### Authentication Flow
1. User enters email
2. CDP sends OTP code
3. User verifies code
4. CDP creates/retrieves wallet
5. User authenticated with session

### Transfer Flow
**Direct Transfer** (recipient exists):
1. Check recipient exists in database
2. Prepare USDC transfer transaction
3. Execute transfer
4. Record in transaction history

**Escrow Transfer** (new recipient):
1. Approve USDC to escrow contract
2. Deposit to escrow with email hash
3. Send email notification
4. Recipient claims via email verification
5. Admin releases from escrow (gas-free for recipient)

## Security Considerations
- Environment variables stored securely in Replit Secrets
- Private keys never exposed in code
- CORS configured for production
- Smart contracts audited (see security docs in repo)
- Email verification for escrow claims

## Deployment
The app is configured for deployment on Replit. For production:
1. Update environment variables for mainnet
2. Deploy smart contracts to Base mainnet
3. Configure production MongoDB
4. Set up custom domain (optional)

## Recent Changes

### 2025-10-01: React Native Mobile App Development
- Started conversion of web app to React Native mobile app with Expo
- Completed Task 8: Dashboard components ported to mobile
  - BalanceCard: Fetches balance from blockchain via viem (on-chain)
  - QuickActions: Navigation working with Expo Router
  - RecentTransactions: API integration with /api/transactions
  - PendingClaims: API client with /api/pending-claims, clipboard working
  - AccountInfoWithAvatar: Uses /api/users endpoint, menu, logout working
  - SmartAccountStatus: Simplified (wallet address + network, smart account features deferred)
- Home screen fully integrated with all dashboard components
- Pull-to-refresh working, proper loading states and error handling
- API client configured with automatic token attachment
- TypeScript compilation: 0 errors

### 2025-09-30: Configured for Replit environment
- Set up port 5000 with 0.0.0.0 binding
- Removed X-Frame-Options header for iframe compatibility
- Added Cache-Control headers for development
- Created environment configuration template
- Configured workflow for automatic startup

## User Preferences
- Use TypeScript for all new code
- Follow existing code patterns and structure
- Keep dependencies up to date
- Maintain mobile-first responsive design

## Mobile App Architecture

### Data Flow
- **Balance**: Fetched directly from blockchain using viem (no API endpoint)
- **Profile**: Mobile → /api/users?userId=X → MongoDB
- **Transactions**: Mobile → /api/transactions → MongoDB
- **Pending Claims**: Mobile → /api/pending-claims → MongoDB

### Components Structure
```
mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   ├── _layout.tsx        # Root layout with CDP provider
│   └── login.tsx          # Authentication screen
├── components/
│   ├── dashboard/         # Dashboard components
│   │   ├── BalanceCard.tsx
│   │   ├── QuickActions.tsx
│   │   ├── RecentTransactions.tsx
│   │   ├── PendingClaims.tsx
│   │   ├── AccountInfoWithAvatar.tsx
│   │   └── SmartAccountStatus.tsx
│   └── ui/                # Shared UI components
│       ├── Button3D.tsx
│       ├── SendButton3D.tsx
│       ├── ContactAvatar.tsx
│       ├── LoadingScreen.tsx
│       ├── TextShimmer.tsx
│       └── NumberTicker.tsx
└── lib/                   # Utilities
    ├── api.ts             # API client with auth
    ├── usdc.ts            # Blockchain interactions
    ├── auth-storage.ts    # Secure storage
    └── secure-storage.ts  # SecureStore wrapper
```

### Known Limitations (Mobile)
1. **Smart Account Features**: Gas sponsoring and smart account status indicators not yet implemented (requires useSmartAccount hook port)
2. **Device Testing**: Requires proper environment variables (EXPO_PUBLIC_API_URL, EXPO_PUBLIC_WEB_URL)
3. **Polyfills**: May need crypto/Buffer polyfills for viem on physical devices

## Troubleshooting

### Web App Issues
1. **CORS Errors** - Ensure NEXT_PUBLIC_CDP_PROJECT_ID is set correctly
2. **Database Connection** - Verify DATABASE_URL format and connectivity
3. **Wallet Creation Fails** - Check CDP project configuration
4. **Transactions Fail** - Ensure users have USDC balance

### Mobile App Issues
1. **API Connection Failed** - Verify EXPO_PUBLIC_API_URL is set correctly
2. **Balance Not Loading** - Check EXPO_PUBLIC_BASE_RPC_URL or network connection
3. **Claim Links Not Working** - Ensure EXPO_PUBLIC_WEB_URL is configured

### Support Resources
- [CDP Documentation](https://docs.cdp.coinbase.com)
- [Base Network Docs](https://docs.base.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev)
