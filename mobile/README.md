# Between Friends - React Native Mobile App

This is the iOS/Android mobile app for Between Friends, built with Expo and React Native.

## Quick Start

### Prerequisites
- Node.js 20+
- iOS Simulator (Mac) or Android Emulator
- CDP Project ID from [CDP Portal](https://portal.cdp.coinbase.com)

### Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure CDP Project ID:**
   
   Update `app.json`:
   ```json
   "extra": {
     "cdpProjectId": "your-actual-cdp-project-id"
   }
   ```
   
   Or set environment variable in `.env`:
   ```
   EXPO_PUBLIC_CDP_PROJECT_ID=your-cdp-project-id
   ```

3. **Start the Next.js backend** (in root directory):
   ```bash
   npm run dev
   ```

4. **Start mobile app:**
   ```bash
   npm run ios      # iOS
   npm run android  # Android
   ```

## Architecture

### Stack
- **Framework**: Expo + React Native
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind for React Native)
- **Wallet**: CDP Embedded Wallets (Smart Accounts)
- **Backend**: Shared Next.js API (runs separately)

### Project Structure
```
mobile/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with CDP provider
│   ├── index.tsx          # Splash/entry screen
│   ├── auth.tsx           # Email/OTP authentication
│   └── (tabs)/            # Tab navigation
│       ├── index.tsx      # Home/Dashboard
│       ├── send.tsx       # Send USDC
│       ├── scan.tsx       # QR Scanner
│       ├── history.tsx    # Transactions
│       └── profile.tsx    # User profile
├── components/
│   └── providers/         # Context providers
├── lib/
│   ├── api.ts            # Backend API client
│   └── constants.ts      # Config & addresses
└── assets/               # Images & icons
```

## Key Features

### CDP Integration
- Email/OTP authentication (no seed phrases!)
- Smart Account creation for gasless transactions
- Compatible with all CDP React hooks

### Backend Connection
The mobile app connects to the Next.js backend API:
- In development: Auto-detects Expo dev server host
- In production: Configure `EXPO_PUBLIC_API_URL` in .env

### Navigation
5 main screens accessible via bottom tabs:
- **Home**: Balance, quick actions, recent activity
- **Send**: Transfer USDC to email addresses
- **Scan**: QR code scanner for payments
- **History**: Transaction history
- **Profile**: Settings and account info

## Development

### Available Scripts
```bash
npm run ios         # Start iOS simulator
npm run android     # Start Android emulator  
npm run web         # Start web version (for testing)
npm start           # Start Expo dev server
```

### Environment Variables
Create `.env` file:
```env
EXPO_PUBLIC_CDP_PROJECT_ID=your-cdp-project-id
EXPO_PUBLIC_API_URL=http://your-backend-url
EXPO_PUBLIC_BASE_RPC_URL=https://sepolia.base.org
EXPO_PUBLIC_CHAIN_ID=84532
```

### API Client
The mobile app makes HTTP requests to the Next.js backend:
- User management
- Transaction history
- Recipient lookup
- Contact syncing

## Deployment

### iOS (App Store)
1. Configure EAS Build:
   ```bash
   npx eas build:configure
   ```

2. Build for iOS:
   ```bash
   npx eas build --platform ios
   ```

3. Submit to App Store:
   ```bash
   npx eas submit --platform ios
   ```

### Android (Play Store)
1. Build for Android:
   ```bash
   npx eas build --platform android
   ```

2. Submit to Play Store:
   ```bash
   npx eas submit --platform android
   ```

## Troubleshooting

### Backend Connection Issues
- Ensure Next.js server is running on port 3000
- Check `EXPO_PUBLIC_API_URL` in `.env`
- On real device, use your computer's IP address

### CDP Authentication Errors
- Verify CDP Project ID is correct
- Check CORS settings in CDP Portal
- Ensure allowlist includes your domains

### Build Errors
- Clear cache: `npx expo start -c`
- Reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (20+)

## Next Steps
- [ ] Implement send flow screens
- [ ] Add QR scanner functionality
- [ ] Build transaction history
- [ ] Add biometric authentication
- [ ] Implement push notifications
