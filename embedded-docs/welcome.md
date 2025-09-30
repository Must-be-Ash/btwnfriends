# Welcome to Embedded Wallets

## Overview

With Embedded Wallets, your users can access the full power of onchain through familiar authentication methods like email and social logins (no seed phrases, browser extensions, or pop-ups required).

Built on Coinbase's [trusted infrastructure](/server-wallets/v2/introduction/security), they enable users to interact with blockchain applications without the complexity of traditional wallet management.

<Frame>
  <div className="wallet-comparison-wrapper">
    <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/wallet-experience-comparison.svg?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=ae9c6742366a3d4cba73babb545aa981" alt="Comparison showing traditional wallets require 6 steps including seed phrase management, while embedded wallets only need 3 simple steps" width="1200" height="700" data-path="images/wallet-experience-comparison.svg" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/wallet-experience-comparison.svg?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=0913e4272263c6a623f614d147efc706 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/wallet-experience-comparison.svg?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=617da397d63ede4c95d6bc94cd63afc4 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/wallet-experience-comparison.svg?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=29bc864a83153a8b887c19975e58294a 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/wallet-experience-comparison.svg?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=8c8bffeacee0dfca480688906f73c968 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/wallet-experience-comparison.svg?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=6b417dcdb3ad722de5bfb4fc4613633d 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/wallet-experience-comparison.svg?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=6b29ca8bfccb8d488fb1040415a44df3 2500w" data-optimize="true" data-opv="2" />
  </div>
</Frame>

## Supported networks

Embedded Wallets support a wide range of blockchain networks:

* **All EVM-compatible networks**: Including Base, Ethereum, Arbitrum, Polygon, Optimism, and more
* **Solana**: Full support for Solana mainnet and devnet (coming soon!)
* **Testnet support**: Base Sepolia, Ethereum Sepolia, and other test networks for development

For a complete list of supported networks and features, see our [Supported Networks](/get-started/supported-networks) page.

## Key benefits

* **User-custodied security**: Users maintain complete control of their assets with the ability to export keys anytime, while you focus on building great experiences
* **Easy onboarding**: Familiar login methods (email OTP and social logins) replace complex seed phrases
* **Lightning-fast wallet creation**: New wallets are created in under 500ms, enabling instant user onboarding
* **Complete customization**: Full control over UI/UX to match your brand and user experience
* **Enterprise-grade security**: Advanced cryptographic operations and transaction signing powered by secure infrastructure
* **Everything Wallet**: Access onramp/offramp, balances, transfers, swaps, and staking without additional integrations
* **USDC Rewards**: Earn 4.1% rewards on aggregated USDC balances across all CDP Wallets

## How it works

Embedded Wallets are designed to be invisible to end-users while providing full onchain functionality:

1. **User authentication**: Users sign in with familiar methods like email OTP
2. **Invisible wallet creation**: A wallet is instantly created without seed phrases or pop-ups
3. **Seamless transactions**: Users can send, swap, stake, and interact with onchain apps while maintaining full control of their assets
4. **Developer control**: You maintain complete control over the UI/UX while users retain custody

## Use cases

* **Payment applications**: Enable instant peer-to-peer payments and merchant checkouts with built-in fiat on/off ramps
* **Gaming platforms**: Enable in-game purchases and NFT ownership without wallet friction
* **Social applications**: Let users tip, collect, and trade directly within your platform
* **Marketplaces**: Streamline checkout with built-in crypto payments and NFT trading
* **DeFi applications**: Provide access to lending, borrowing, and yield farming with simple UX

## Security and compliance

Embedded Wallets leverage CDP's advanced security infrastructure to provide true self-custody with enterprise-grade protection:

* **[Advanced security architecture](/server-wallets/v2/introduction/security)**: All cryptographic operations occur within secure, isolated environments that even Coinbase cannot access
* **[Wallet behavior governance](/server-wallets/v2/using-the-wallet-api/policies/overview)**: Define custom rules to govern transaction behavior and protect against unauthorized actions
* **Temporary Wallet Secrets**: Device-specific cryptographic keys are generated and stored locally on users' devices, never exposed to Coinbase
* **True self-custody**: Unlike traditional MPC solutions, our approach ensures faster operations while maintaining user control
* **Multi-device support**: Users can securely access their wallet from up to 5 different devices

This architecture combines the convenience of embedded wallets with the security guarantees of self-custodial solutions, ensuring your users maintain full control of their assets.

## What to read next

* **[Quickstart Guide](/embedded-wallets/quickstart)**: Get started with embedded wallets in under 10 minutes
* **[End User Authentication](/embedded-wallets/end-user-authentication)**: Learn about authentication methods and implementation patterns
* **[Security Configuration](/embedded-wallets/domains)**: Configure your embedded wallet to work with your application
* **[Security & Export](/embedded-wallets/security-export)**: Learn about private key export security considerations and implementation
