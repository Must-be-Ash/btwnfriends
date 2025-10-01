# Quickstart

## Overview

Use React Native to build mobile apps with Coinbase Developer Platform (CDP) embedded wallets in under 5 minutes!

Your React Native apps can leverage **EVM Externally Owned Accounts (EOA)**, **EVM Smart Accounts**, and **Solana Accounts**, bringing different blockchain compatibility directly to iOS and Android users.

Get up and running fast by integrating our wallet infrastructure into your React Native project with [`create-cdp-app`](https://www.npmjs.com/package/@coinbase/create-cdp-app).

<Tip>
  All [CDP React hooks](/embedded-wallets/react-hooks) are compatible with React Native. Check out the [CDP React SDK reference](/sdks/cdp-sdks-v2/frontend) for comprehensive method signatures, types, and examples.
</Tip>

<Accordion title="What makes React Native embedded wallets special?">
  React Native embedded wallets bring the same powerful CDP wallet infrastructure to mobile apps with:

  * **Native mobile performance**: Optimized for iOS and Android
  * **Familiar mobile UX**: Email and social login flows users expect
  * **Cross-platform support**: Write once, run on iOS and Android
  * **Expo compatibility**: Works seamlessly with managed and bare Expo workflows
</Accordion>

## Prerequisites

* A free [CDP Portal](https://portal.cdp.coinbase.com) account.
* [Node.js 22+](https://nodejs.org/en/download).
* A node package manager installed (i.e., `npm` or `pnpm`).
* Installed [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/).
* Installed [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/).

### Minimum Version Requirements

|                |                                |
| -------------- | ------------------------------ |
| Xcode          | 16.1                           |
| iOS            | 15.1                           |
| Android Studio | Latest stable                  |
| Android SDK    | API 24 (min) / API 35 (target) |
| Android        | 7.0 (API 24)                   |

Let's get started by scaffolding a new React Native app with the necessary dependencies.

## 1. Create the React Native app

<Steps titleSize="p">
  <Step title="Copy your Project ID">
    Navigate to [CDP Portal](https://portal.cdp.coinbase.com) and select your project from the top-left dropdown. Clicking the gear icon will take you to your project details:

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=0e8e8caa3e297490d37a0ad28de61dea" alt="CDP Project ID in project settings" data-og-width="609" width="609" data-og-height="331" height="331" data-path="images/embedded-wallet-project-id.png" data-optimize="true" data-opv="2" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=0e333461b889852e445a88dfc4f238c5 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=bfe8e86552a859956560bc6178290d75 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=5f56a8d66a922cb16e63b5b14feff7db 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=ee49d8374ca8dac4c4529c7e7f63b3d5 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=db5d86377e48ba2374501618feec5b2f 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=6203e01aa49f6190d150436d2275f4d6 2500w" />
    </Frame>

    Copy the **Project ID** value. You will use this in the next step when configuring your demo app.
  </Step>

  <Step title="Create a new React Native app">
    Use the latest version of `create-cdp-app` to create a new React Native app:

    <CodeGroup>
      ```bash npm
      npm create @coinbase/cdp-app@latest
      ```

      ```bash pnpm
      pnpm create @coinbase/cdp-app@latest
      ```

      ```bash yarn
      yarn create @coinbase/cdp-app@latest
      ```
    </CodeGroup>
  </Step>

  <Step title="Configure your app">
    Follow the prompts to configure your app with an embedded wallet. Name your project, select `React Native with Expo` as a template, and enter your CDP Project ID that you copied in the previous step.

    <Tip>
      1. Make sure to select `React Native with Expo` as a template.

      2. In this example we are using [Smart Accounts](/embedded-wallets/smart-accounts) to create a smart account for new users on sign in.
         This allows us to pay for transaction fees on behalf of the user.
    </Tip>

    ```console
    Ok to proceed? (y) y

    > npx
    > create-cdp-app

    ✔ App Name: … my-react-native-app
    ✔ Template: › React Native with Expo
    ✔ CDP Project ID (Find your project ID at https://portal.cdp.coinbase.com/projects/overview): … <YOUR_PROJECT_ID>
    ✔ Account Type: › EVM Smart Accounts
    ```

    <Note>
      This example uses EVM Smart accounts, but we also support EVM EOA accounts and Solana accounts for React Native.
    </Note>
  </Step>

  <Step title="Run your app">
    Navigate to your project directory and start the development server:

    <Tip>
      Be prepared to wait a few minutes the first time you run the app for the dev server and simulator to boot up.
    </Tip>

    <CodeGroup>
      ```bash npm
      cd my-react-native-app
      npm install
      npm run ios # or npm run android
      ```

      ```bash pnpm
      cd my-react-native-app
      pnpm install
      pnpm run ios # or pnpm run android
      ```

      ```bash yarn
      cd my-react-native-app
      yarn install
      yarn run ios # or yarn run android
      ```
    </CodeGroup>
  </Step>
</Steps>

On successful startup, you should see your React Native app running on the iOS simulator or Android emulator.

Open up the App.tsx file and start editing to see your changes live.

<Frame>
  <img src="https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-login.png?fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=c14c728275325db07ba94c7463577612" alt="React Native login screen" data-og-width="1136" width="1136" data-og-height="2168" height="2168" data-path="images/rn-login.png" data-optimize="true" data-opv="2" srcset="https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-login.png?w=280&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=5236bdffa9e230798017e07fbf7523e0 280w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-login.png?w=560&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=50ecda76b75397147d29cd5d18c67bcf 560w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-login.png?w=840&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=b13e337f7015fe38e8f15c2876f912ba 840w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-login.png?w=1100&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=e307eed132ee969b1a9795ad2fba5529 1100w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-login.png?w=1650&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=874c2d4c0df15ed0cc2709765d488b77 1650w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-login.png?w=2500&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=7985c315aeae6325ca2874932e9bef59 2500w" />
</Frame>

## 2. Sign in and send your first transaction

Now that your embedded wallet is configured and your app is running, let's try it out.

<Steps titleSize="p">
  <Step title="Authenticate with email or SMS">
    Choose between email or SMS to receive a verification code.

    <Tip>
      SMS authentication is currently available only for United States based phone numbers.
    </Tip>

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-auth-method.png?fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=043e4cc6edc9f481d73e7e280d78bf4f" alt="React Native authentication method screen" data-og-width="1136" width="1136" data-og-height="2168" height="2168" data-path="images/rn-auth-method.png" data-optimize="true" data-opv="2" srcset="https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-auth-method.png?w=280&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=9a93b80daff6b1187859f10f03134404 280w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-auth-method.png?w=560&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=b46f6cb685a656979b865b2d011eb345 560w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-auth-method.png?w=840&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=6bca52bcfb2ccc2ca465efd23b334465 840w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-auth-method.png?w=1100&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=54292bbde67fe2ebb63e1ddb90757f29 1100w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-auth-method.png?w=1650&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=0830368075773b303bd2953d8151f2b7 1650w, https://mintcdn.com/coinbase-prod/f8KFwdFfYbYjwgfx/images/rn-auth-method.png?w=2500&fit=max&auto=format&n=f8KFwdFfYbYjwgfx&q=85&s=304a7f7c3c0e01808859bad7899cd3ae 2500w" />
    </Frame>
  </Step>

  <Step title="Verify">
    Enter the verification code sent to your email or phone number.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-otp.png?fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=af386d799836fc29f9d0631b9e8f5fc0" alt="React Native OTP screen" data-og-width="1136" width="1136" data-og-height="2168" height="2168" data-path="images/rn-otp.png" data-optimize="true" data-opv="2" srcset="https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-otp.png?w=280&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=56b24bc5cc1cd99d392c6d35c59d8cc8 280w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-otp.png?w=560&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=027fd2ead3ad88a4221b00a32fa1bf03 560w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-otp.png?w=840&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=271a1cf52d57fdb9a41fe58dbe48352f 840w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-otp.png?w=1100&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=3b49dab4cc485cc83b83e45e4c3cf6d4 1100w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-otp.png?w=1650&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=5016d6ce08c4a377ea6fec7bf1e19cbc 1650w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-otp.png?w=2500&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=a8399caff1a077fad27c55a45e203758 2500w" />
    </Frame>
  </Step>

  <Step title="View your new wallet">
    Congrats! Your new embedded wallet has been created, authenticated, and is ready to use on all EVM compatible networks.

    <Tip>
      We're using [Smart Accounts](/embedded-wallets/smart-accounts) in this example.
      If you're not using Smart Accounts, you will see a slightly different transaction screen, with a link to get testnet ETH instead of USDC.
    </Tip>

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-wallet-created.png?fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=7236614b4fa7ff5a2dd2c423248bbd5b" alt="React Native post login screen" data-og-width="1136" width="1136" data-og-height="2168" height="2168" data-path="images/rn-wallet-created.png" data-optimize="true" data-opv="2" srcset="https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-wallet-created.png?w=280&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=21626bf80a0f385d8dc6f6362f66af97 280w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-wallet-created.png?w=560&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=1f7b63c3a3c8e26461c1876568118e9d 560w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-wallet-created.png?w=840&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=d182aeb4f8612e5b72fe2e642617abd8 840w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-wallet-created.png?w=1100&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=11643c6a452e856a0b28e6f72ed3f8ca 1100w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-wallet-created.png?w=1650&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=c4bb8dd9210ab6d8853f5f87678dc5d8 1650w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-wallet-created.png?w=2500&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=dc94ac350c1db2eeba05e7e48facd461 2500w" />
    </Frame>
  </Step>

  <Step title="Send your first transaction">
    The demo app uses the wallet to send itself some testnet tokens on Base Sepolia.

    Get some testnet funds by tapping the **Get funds from faucet** button which will give you a link to the [CDP Portal Faucet](https://portal.cdp.coinbase.com/products/faucet) prefilled with your wallet address and token.
    Once you claim the funds, the balance shown in the app will update automatically. Finally, tap **Transfer** to initiate the transfer. Once complete, you'll see a transaction hash and a button to copy a link to the blockchain explorer.

    <Tip>
      If you used the same configuration [from above](/embedded-wallets/react-native/quickstart#create-the-react-native-app), you will have a Smart Account who's transaction fees will
      be automatically paid for by a feature called [Gas Sponsorship](/embedded-wallets/smart-accounts#gas-sponsorship-with-paymaster).
    </Tip>

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-tx-sent.png?fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=1f571f3b51297d2c6c760c6be0ddd928" alt="React Native wallet demo showing transaction flow" data-og-width="1136" width="1136" data-og-height="2168" height="2168" data-path="images/rn-tx-sent.png" data-optimize="true" data-opv="2" srcset="https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-tx-sent.png?w=280&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=d70635fb3b667531900c69e7d0e67d9f 280w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-tx-sent.png?w=560&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=9eab12b6b81d290c6e5d23254c3d2e40 560w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-tx-sent.png?w=840&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=2dc90ca4278dc449ba489235499dd335 840w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-tx-sent.png?w=1100&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=f8b1508da343af34d9e343f0c40a8104 1100w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-tx-sent.png?w=1650&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=de19e0a2f17bf76a78a556971a7a376d 1650w, https://mintcdn.com/coinbase-prod/3Y_tnAyDPLW__h7K/images/rn-tx-sent.png?w=2500&fit=max&auto=format&n=3Y_tnAyDPLW__h7K&q=85&s=18cf39fc3525e073848b06c956e083d6 2500w" />
    </Frame>

    🎉 You've successfully created an embedded wallet and sent your first transaction on mobile!
  </Step>
</Steps>

## What to read next

* **[React Hooks](/embedded-wallets/react-hooks)**: Explore all available CDP hooks
* **[End User Authentication](/embedded-wallets/end-user-authentication)**: Learn about available user authentication methods
* **[Smart Accounts](/embedded-wallets/smart-accounts)**: Learn about Smart Accounts and how to use them
