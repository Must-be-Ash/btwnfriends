# Between Friends - Payment App

## Overview
Between Friends is a cryptocurrency payment platform designed for email-based USDC transfers using Coinbase Developer Platform (CDP) Embedded Wallets. It offers a seamless experience across both a Next.js web application and a React Native mobile application (iOS), sharing a unified backend. The project aims to simplify crypto payments, making them as accessible as sending an email, with features like automatic wallet creation, direct and escrow transfers, and comprehensive transaction history.

## User Preferences
- Use TypeScript for all new code
- Follow existing code patterns and structure
- Keep dependencies up to date
- Maintain mobile-first responsive design

## System Architecture
The application comprises a Next.js web frontend, a React Native (Expo) mobile app for iOS, and a shared Next.js API backend. MongoDB serves as the database for user and transaction data. Authentication is managed via Coinbase CDP Embedded Wallets using email OTP, automatically creating wallets upon a user's first login. Blockchain interactions occur on the Base Network (Sepolia for development), utilizing Viem, with smart contracts for USDC transfers and a `SimplifiedEscrow` contract for email-based claims.

**UI/UX Decisions:**
- Both web and mobile apps aim for feature parity and a consistent user experience.
- Mobile design incorporates Expo Router for navigation, Lucide React Native for icons, and React Native Reanimated for animations.
- Web app utilizes Tailwind CSS for styling and Framer Motion for animations, supporting PWA features with Next-PWA.
- QR code scanning implemented with expo-camera (CameraView) for iOS with proper permission handling.

**Technical Implementations:**
- **Authentication Flow:** Email-based OTP verification through CDP, leading to automatic wallet creation/retrieval.
- **Transfer Flows:**
    - **Direct Transfer:** For existing users, USDC transfers are executed directly and recorded.
    - **Escrow Transfer:** For new users, USDC is approved and deposited into an escrow contract, with an email notification sent. The recipient claims funds via email verification, with gas sponsorship handled by an admin wallet.
- **Database Schema:** Key collections include `users` (profiles, wallets), `transfers` (pending escrow), `transactions` (history), and `contacts`.

**Feature Specifications:**
- **Core Features:** Email-based authentication, automatic wallet creation, direct USDC transfers, escrow transfers (email claim), transaction history, contact management, QR code scanning for payments, and PWA support.
- **Smart Contract Integration:** USDC transfers on Base Network, `SimplifiedEscrow` for claims, and optional gas sponsorship for recipients.
- **Mobile App Status (iOS):**
  - ✅ Home Dashboard with balance and quick actions
  - ✅ Send screen with recipient search, amount entry, and direct/escrow transfers
  - ✅ Receive screen with QR code and payment links
  - ✅ Transaction History with filters, search, and pagination
  - ✅ Contacts management with favorites and search
  - ✅ QR Scanner for scanning payment QR codes
  - 🔲 Export Key screen
  - 🔲 Settings/Profile screen

## External Dependencies
- **Coinbase Developer Platform (CDP):** For Embedded Wallets, authentication, and blockchain interactions (`@coinbase/cdp-react`, `@coinbase/cdp-hooks`).
- **MongoDB:** Database for storing user data, transaction history, and other application-specific information.
- **Resend:** (Optional) For sending email notifications (`RESEND_API_KEY`).
- **Base Network:** The blockchain platform for USDC transfers and smart contract deployment.
- **Viem:** For interacting with the Ethereum Virtual Machine and smart contracts.
- **Expo SDK:** For building the React Native mobile application.