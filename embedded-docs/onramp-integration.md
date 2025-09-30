# Onramp Integration

## Overview

Embedded Wallets provides components that work with [Coinbase’s Onramp API](/onramp-&-offramp/onramp-apis/onramp-overview) to enable developers to move money from fiat to onchain economies. A user can fund their wallet with their Coinbase account or through guest checkout with a debit card.

This guide shows how to get started with the `FundModal` component.

<Note>
  Coinbase Onramp is enabled by default in **trial mode** for every CDP project. In trial mode, there are limitations to how much you can purchase.
</Note>

<Note>
  The `Fund` and `FundModal` components will cost real money unless you [enable mock buys and sends](https://docs.cdp.coinbase.com/onramp-&-offramp/developer-guidance/faq#can-i-test-my-onramp-integration-by-creating-mock-buys-and-sends%3F).
</Note>

## Quickstart

Get started in under 5 minutes with Embedded Wallet's [`create-cdp-app`](https://www.npmjs.com/package/@coinbase/create-cdp-app) package!

### Prerequisites

* A free [CDP Portal](https://portal.cdp.coinbase.com) account and project
* [Node.js 22+](https://nodejs.org/en/download)
* A node package manager installed (i.e., `npm`, `pnpm`, or `yarn`)
* Basic familiarity with Next.js and React
* A Coinbase Retail account, if you wish to fund your wallet with Coinbase

### 1. Add your domain

To begin, add your domain to the list of [allowed domains](https://portal.cdp.coinbase.com/products/embedded-wallets/domains) in CDP Portal.

<Steps titleSize="p">
  <Step title="Access CDP Portal">
    Navigate to the [Domains Configuration](https://portal.cdp.coinbase.com/products/embedded-wallets/domains) in CDP Portal, and click **Add domain** to include your local app.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-add-domain.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=d1ecf6491c979bf69553edeb1beca61a" alt="Add domain dialog in CDP Portal" width="1660" height="1120" data-path="images/cors-config-add-domain.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-add-domain.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=01f89c16b13ca66fc3c24191fa7ab7c4 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-add-domain.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=63c0b276c3ad4c5b3a37fd5e8f3a07b8 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-add-domain.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=c3437a803a7dbcdb7eb22bfe913eb433 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-add-domain.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=7a88a9292888b1be9510a7f6687e1c3c 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-add-domain.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=c4c98bc08aa2b5983e936ec3dae7f757 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-add-domain.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=cf169bd996652b42bc278609240c46ac 2500w" data-optimize="true" data-opv="2" />
    </Frame>
  </Step>

  <Step title="Add your domain">
    Use `http://localhost:3000` (the port your demo app will run locally).

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-localhost.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=ea25f70a9b4fbf5e2e4668c61377c796" alt="Domain configuration with localhost" width="1208" height="538" data-path="images/cors-config-with-localhost.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-localhost.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=8f3391c327928e2d61e1d03764d19e6f 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-localhost.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=836f9c9ae8eb54b41096e97a99c9114f 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-localhost.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=e571488132b261b5f0430c8437c029bb 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-localhost.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=c8e52b451c48a4fb3f7d2989ba74f6da 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-localhost.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=51b910dd59784947a7ecf060853fcf8a 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-localhost.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=a2c1885fc15fe4c75034805a26e2645b 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    <Warning>
      Do not do this in your CDP project intended for production use. Malicious apps running locally could impersonate your frontend and abuse your project credentials.
    </Warning>
  </Step>

  <Step title="Save your changes">
    Click **Add domain** again to save your changes.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-domain.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=a68e0385f89e0c8cef10a43139924215" alt="Domain configuration saved in CDP Portal" width="1674" height="744" data-path="images/cors-config-with-domain.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-domain.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=dd3ad1b541aa91ec1e57d24ec3670152 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-domain.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=8b01359394a6187ecc7359d98a08d6b9 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-domain.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=0082df68a31bb7f322450031bc31dc87 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-domain.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=1de79708a0de0648206db8fe9f0d9437 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-domain.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=85d18a75d410d7068bf39097a60981e6 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/cors-config-with-domain.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=989408a4e083704cf6fc01759a172801 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    You should see your local app URL listed in the CDP Portal dashboard. The allowlist will take effect immediately upon saving.
  </Step>
</Steps>

### 2. Create the demo app

<Steps titleSize="p">
  <Step title="Create a Secret API Key">
    Navigate to the [**API Keys**](https://portal.cdp.coinbase.com/projects/api-keys) tab of the **CDP Portal**. Create and download your API key. Enter an API key nickname (restrictions are optional).

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=aa3ec4e45002af328296512a25529d00" alt="Create API Key button in CDP dashboard" width="2880" height="930" data-path="onramp-&-offramp/images/Project-API-Keys.png" srcset="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=280&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=be09343e5c34775534bbced1ed5efc7e 280w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=560&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=c4e86794f840bbceb45185e2f716293b 560w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=840&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=6f834c1657af91db9ed50c731c0efabe 840w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=1100&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=95642ecfd3a96f621f06c0c6f6bd2689 1100w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=1650&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=e74d1c483b259d52e9873fa19d919cef 1650w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=2500&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=3e59da9646f2597831c53d091be47dd7 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    Secure your private/public key pair in a safe location. You will use these in step 3 when configuring your demo app.
  </Step>

  <Step title="Copy your Project ID">
    Navigate to [CDP Portal](https://portal.cdp.coinbase.com) and select your project from the top-left dropdown. Clicking the gear icon will take you to your project details:

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=0e8e8caa3e297490d37a0ad28de61dea" alt="CDP Project ID in project settings" width="609" height="331" data-path="images/embedded-wallet-project-id.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=0e333461b889852e445a88dfc4f238c5 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=bfe8e86552a859956560bc6178290d75 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=5f56a8d66a922cb16e63b5b14feff7db 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=ee49d8374ca8dac4c4529c7e7f63b3d5 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=db5d86377e48ba2374501618feec5b2f 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-project-id.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=6203e01aa49f6190d150436d2275f4d6 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    Copy the **Project ID** value. You will use this in the next step when configuring your demo app.
  </Step>

  <Step title="Create a new demo app">
    Use the latest version of `create-cdp-app` to create a new demo app using your package manager:

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
    Follow the prompts to configure your app. Name your project, select the **Next.js Full Stack App** template, and paste your project ID from CDP Portal.

    <Tip>
      The **Next.js Full Stack App** template must be selected because Onramp requires server-side code!
    </Tip>

    You can choose to disable or enable [Smart Accounts](/embedded-wallets/smart-accounts), and you should enable Onramp.

    To complete configuration, enter the API Key ID and API Key Secret key pair you created in the previous step and confirm that you have added your domain.

    ```console
    ✔ Project name: … cdp-app-nextjs
    ✔ Template: › Next.js Full Stack App
    ✔ CDP Project ID: … 8c21e60b-c8af-4286-a0d3-111111111111
    ✔ Enable Smart Accounts?: … no
    ✔ Enable Coinbase Onramp?: … yes
    ✔ CDP API Key ID: … 9b12d52e-d2be-5516-bd90-111111111111
    ✔ CDP API Key Secret: … *****************************************
    ✔ Confirm you have whitelisted 'http://localhost:3000' … yes
    ```
  </Step>

  <Step title="Run your app">
    Navigate to your project and start the development server:

    <CodeGroup>
      ```bash npm
      cd cdp-app-nextjs
      npm install
      npm run dev
      ```

      ```bash pnpm
      cd cdp-app-nextjs
      pnpm install
      pnpm dev
      ```

      ```bash yarn
      cd cdp-app-nextjs
      yarn install
      yarn dev
      ```
    </CodeGroup>

    Your app will be available at [http://localhost:3000](http://localhost:3000).
  </Step>
</Steps>

### 3. Demo your new wallet

Now that your embedded wallet is configured and your app is running, let's try it out.

<Steps titleSize="p">
  <Step title="Sign in">
    Head to [http://localhost:3000](http://localhost:3000) and click the **Sign In** button.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-1-signin.png?fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=a25201f5931ceaef6c8fba33d9df05d8" alt="The 'Sign in' button that begins the embedded wallet sign-in flow, and a welcome message." width="499" height="209" data-path="images/embedded-wallet-onramp-1-signin.png" srcset="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-1-signin.png?w=280&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=5834e0583840742ea2580decbb07d914 280w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-1-signin.png?w=560&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=870e0e916ff87be05d0d3fac5f7ed2f2 560w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-1-signin.png?w=840&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=6591a5c0c6e64d5bf43d2d295612a14a 840w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-1-signin.png?w=1100&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=6ed2877caf245a8497820519a4f92c93 1100w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-1-signin.png?w=1650&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=475d58034e5748229fbc2273d20e31d2 1650w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-1-signin.png?w=2500&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=cfe9adcae3faa1416c63231a8a8d4807 2500w" data-optimize="true" data-opv="2" />
    </Frame>
  </Step>

  <Step title="Enter your email">
    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-2-continue-with-email.png?fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=c5cf0208689bc6246e88cf3356f60e0b" alt="The first step in the embedded wallet sign-in flow, where the user can sign in using their email address or phone number." width="470" height="523" data-path="images/embedded-wallet-onramp-2-continue-with-email.png" srcset="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-2-continue-with-email.png?w=280&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=1504af5df5595bb2dd4e1f2d4865a95f 280w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-2-continue-with-email.png?w=560&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=e3a0ad5efcddd9614e7bbe9c89d7a788 560w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-2-continue-with-email.png?w=840&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=f1338195fb97f5aabe66b53ae74219e5 840w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-2-continue-with-email.png?w=1100&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=b1754a1129e67a9d1109ccfa78a7c15c 1100w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-2-continue-with-email.png?w=1650&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=a18e0e4043f5e864898dfc309d37e0b4 1650w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-2-continue-with-email.png?w=2500&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=c41eefe994bee0444f6cacd2fc2e52c6 2500w" data-optimize="true" data-opv="2" />
    </Frame>
  </Step>

  <Step title="Verify">
    Enter the verification code sent to your e-mail.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-3-verify.png?fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=e0884463a1edaf67350c517cc7a84394" alt="Step 2 of the embedded wallet sign-in flow, where the user must enter a 6-digit verification code sent to their email to complete authentication." width="466" height="405" data-path="images/embedded-wallet-onramp-3-verify.png" srcset="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-3-verify.png?w=280&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=51098ba3c638bc536a638d45fb0eedcc 280w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-3-verify.png?w=560&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=0f42188fc7cdb071c18c89b249020c82 560w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-3-verify.png?w=840&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=5be3f14a101ed4707b37a34276c00334 840w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-3-verify.png?w=1100&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=e5db1420186ca40d872d6ec078c6c25d 1100w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-3-verify.png?w=1650&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=983b4b1d55654f46e6534226abccc7d1 1650w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-3-verify.png?w=2500&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=f11af47ab47634a332fa93612a79fd9d 2500w" data-optimize="true" data-opv="2" />
    </Frame>
  </Step>

  <Step title="View your new wallet">
    Congrats! Your new embedded wallet has been created, authenticated, and is ready to use on the [Base](https://basescan.org/) network.

    <Accordion title="What is Base?">
      **Base** is a fast, low-cost blockchain built by Coinbase.
    </Accordion>

    From the demo app, you can copy-and-paste your wallet address from the top-right corner. You can also fund your wallet and monitor your balance. You should see similar to the following:

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-4-post-signin.png?fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=19522d3cebc76a613b2514ba07115202" alt="The demo app home page after a successful sign-in, displaying the user's embedded wallet balance and an option to fund it on Base by depositing ETH." width="600" height="566" data-path="images/embedded-wallet-onramp-4-post-signin.png" srcset="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-4-post-signin.png?w=280&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=606868a807b7eb217690a5a5e9571ec7 280w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-4-post-signin.png?w=560&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=8a84208b868766782bdb44830fe7e0c0 560w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-4-post-signin.png?w=840&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=2f73297993748ea94927067be8a605c6 840w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-4-post-signin.png?w=1100&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=bf07f169507347c9d6ca6d3217c6d991 1100w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-4-post-signin.png?w=1650&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=a3b0063c4327b1dd5dfe8156828c4b54 1650w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-4-post-signin.png?w=2500&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=172b3faf77d0c12c1e6e6af4f0c498ea 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    Click the **Deposit ETH** button to start funding your new wallet.
  </Step>

  <Step title="Enter deposit details">
    This opens the funding modal where you can specify how much you want to deposit. Choose a preset amount or enter your own, select your preferred payment method, and click **Deposit** to proceed to the Coinbase Onramp widget.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-5-fund.png?fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=64f52b9e16780592e60c4eb75150abaa" alt="The funding modal, where the user can deposit ETH into their embedded wallet. The modal shows various deposit amounts and has 'Coinbase' selected as the payment method, with the ability to choose other options." width="466" height="466" data-path="images/embedded-wallet-onramp-5-fund.png" srcset="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-5-fund.png?w=280&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=a86c38852ae48b707e704fe135110d69 280w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-5-fund.png?w=560&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=9027a2f8a62661b76dbaba877134aeb9 560w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-5-fund.png?w=840&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=544365cd8d056f2d576ca2b085552bd8 840w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-5-fund.png?w=1100&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=ad4fab299056cf2968a135a32fdd3e30 1100w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-5-fund.png?w=1650&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=df03f138a0625337bd47483292434bd1 1650w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-5-fund.png?w=2500&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=c8c62ae33233312297643d8a93adf3f5 2500w" data-optimize="true" data-opv="2" />
    </Frame>
  </Step>

  <Step title="Complete your purchase">
    The Coinbase Onramp widget opens for you to review the transaction details. Here, you can verify the payment method, destination address, and total cost before finalizing the purchase.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-6-widget.png?fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=fbd3f109ebe3d639c53e99b7ba25763b" alt="The Coinbase Onramp widget, where the user reviews transaction details like payment method, destination address, and total cost before confirming their purchase." width="572" height="894" data-path="images/embedded-wallet-onramp-6-widget.png" srcset="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-6-widget.png?w=280&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=c872aa88550b434045b73a8344f84aef 280w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-6-widget.png?w=560&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=295136d5821065f9a42d86a395311ba2 560w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-6-widget.png?w=840&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=3478c6531c5f973d5b274969277548da 840w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-6-widget.png?w=1100&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=ea0fd46d4cf6bf1058af25362d88d800 1100w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-6-widget.png?w=1650&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=c79864b93c266fc0eb8b580d4ae1adde 1650w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-6-widget.png?w=2500&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=7f5d369adf1cd3ea84ca7f83ea90b8bc 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    Click **Confirm & Purchase** to complete the transaction.
  </Step>

  <Step title="View your confirmation">
    Once the transaction is successful, you'll see a confirmation message. The funds are now being sent to your wallet onchain, and your balance will update shortly.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-7-success.png?fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=a69ad496efa8b3b177255369b83d22fc" alt="A success modal with a green checkmark, indicating that the ETH deposit was successful. The modal is set to close automatically." width="460" height="418" data-path="images/embedded-wallet-onramp-7-success.png" srcset="https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-7-success.png?w=280&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=5af513d40d60ef50e9130593ec18873f 280w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-7-success.png?w=560&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=d34b7b5d173f96f66f682650e23ae1d6 560w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-7-success.png?w=840&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=d1abce8e1a77c35549e3f4832672b6f9 840w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-7-success.png?w=1100&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=cd08a3a428d1a6f69f80213b690586a8 1100w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-7-success.png?w=1650&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=ce86d6fa5019f1f417aca51afd51cc11 1650w, https://mintcdn.com/coinbase-prod/v3Y15cB7MlHbYo4I/images/embedded-wallet-onramp-7-success.png?w=2500&fit=max&auto=format&n=v3Y15cB7MlHbYo4I&q=85&s=10d3ca3666d0d2816e38b2eb58b68a62 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    You can also find record of your wallet and its transaction on Base explorer using the URL: `https://basescan.org/address/YOUR-WALLET-ADDRESS`.

    <Accordion title="What is a transaction?">
      A blockchain transaction transfers cryptocurrency between wallets. Unlike bank transfers, they're:

      * **Public**: Visible on the blockchain
      * **Permanent**: Cannot be reversed
      * **Fast**: Usually complete in seconds
      * **Fee-based**: Require "gas" fees to process
    </Accordion>
  </Step>
</Steps>

## Manual setup

If you'd prefer to set integrate Onramp manually, this guide will show you how to do so.

### Prerequisites

* A free [CDP Portal](https://portal.cdp.coinbase.com) account and project
* [Node.js 22+](https://nodejs.org/en/download)
* A node package manager installed (i.e., `npm`, `pnpm`, or `yarn`)
* Basic familiarity with Next.js and React
* A CDP project with Embedded Wallets enabled
* `@coinbase/cdp-core` and `@coinbase/cdp-hooks` installed
* A Coinbase Retail account, if you wish to fund your wallet with Coinbase

### 1. Create a Secret API Key

<Steps titleSize="p">
  <Step title="Create key">
    Navigate to the [**API Keys**](https://portal.cdp.coinbase.com/projects/api-keys) tab of the **CDP Portal**. Create and download your API key. Enter an API key nickname (restrictions are optional).

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=aa3ec4e45002af328296512a25529d00" alt="Create API Key button in CDP dashboard" width="2880" height="930" data-path="onramp-&-offramp/images/Project-API-Keys.png" srcset="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=280&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=be09343e5c34775534bbced1ed5efc7e 280w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=560&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=c4e86794f840bbceb45185e2f716293b 560w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=840&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=6f834c1657af91db9ed50c731c0efabe 840w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=1100&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=95642ecfd3a96f621f06c0c6f6bd2689 1100w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=1650&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=e74d1c483b259d52e9873fa19d919cef 1650w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/onramp-&-offramp/images/Project-API-Keys.png?w=2500&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=3e59da9646f2597831c53d091be47dd7 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    Secure your private/public key pair in a safe location.
  </Step>

  <Step title="Update .env">
    Update your app's `.env` file with the **API Key ID** and **API Key Secret**.

    ```dotenv
    # CDP API Key
    CDP_API_KEY_ID=[paste your API Key ID here]
    CDP_API_KEY_SECRET=[paste your API Key Secret here]
    ```
  </Step>
</Steps>

### 2. Install `@coinbase/cdp-sdk`

The Onramp API requires authentication with a JWT. You can use [`@coinbase/cdp-sdk`](https://www.npmjs.com/package/@coinbase/cdp-sdk) to generate one.

<CodeGroup>
  ```bash npm
  # With npm
  npm install @coinbase/cdp-sdk
  ```

  ```bash pnpm
  # With pnpm
  pnpm add @coinbase/cdp-sdk
  ```

  ```bash yarn
  # With yarn
  yarn add @coinbase/cdp-sdk
  ```
</CodeGroup>

### 3. Create `lib/cdp-auth.ts`

Create a new file `lib/cdp-auth.ts` in your project root. This file exports helper functions to generate JWTs for authorizing Onramp API calls and provides the base URL for API requests.

```tsx lines expandable lib/cdp-auth.ts
import { generateJwt } from "@coinbase/cdp-sdk/auth";

interface CDPAuthConfig {
  requestMethod: string;
  requestHost: string;
  requestPath: string;
  audience?: string[];
}

/**
 * Get CDP API credentials from environment variables
 *
 * @throws Error if credentials are not configured
 */
export function getCDPCredentials() {
  const apiKeyId = process.env.CDP_API_KEY_ID;
  const apiKeySecret = process.env.CDP_API_KEY_SECRET;

  if (!apiKeyId || !apiKeySecret) {
    throw new Error("CDP API credentials not configured");
  }

  return { apiKeyId, apiKeySecret };
}

/**
 * Generate JWT token for CDP API authentication
 *
 * @param config - Configuration for JWT generation
 * @returns JWT token string
 */
export async function generateCDPJWT(config: CDPAuthConfig): Promise<string> {
  const { apiKeyId, apiKeySecret } = getCDPCredentials();

  return generateJwt({
    apiKeyId,
    apiKeySecret,
    requestMethod: config.requestMethod,
    requestHost: config.requestHost,
    requestPath: config.requestPath,
  });
}

/**
 * Base URL for ONRAMP API
 * Can change to api.cdp.coinbase.com/platform once session token endpoints are supported in v2 API
 */
export const ONRAMP_API_BASE_URL = "https://api.developer.coinbase.com";
```

This utility file provides:

* `getCDPCredentials()`: Reads your API credentials from environment variables
* `generateCDPJWT()`: Creates authenticated JWT tokens for API calls
* `ONRAMP_API_BASE_URL`: The base URL for all Onramp API requests

These functions will be imported and used in your API routes in the next step.

### 4. Set up server-side endpoints

You will need to create two server-side endpoints to interact with the Onramp API.

<Steps titleSize="p">
  <Step title="Transform response data helper">
    The `FundModal` component expects functions that return data in camel-case, so for now the data from the Onramp API needs to be transformed.

    <Note>
      The v1 version of the Onramp API returns data with kebab-case keys. In v2, data will be returned with camel-case keys.
    </Note>

    ```tsx lines expandable lib/to-camel-case.ts
    type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
      ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
      : S;

    type CamelizeKeys<T> = T extends readonly unknown[]
      ? { [K in keyof T]: CamelizeKeys<T[K]> }
      : T extends object
        ? {
            [K in keyof T as SnakeToCamelCase<K & string>]: CamelizeKeys<T[K]>;
          }
        : T;

    /**
     * Converts snake_case keys to camelCase in an object or array of objects.
     *
     * @param {T} obj - The object, array, or string to convert. (required)
     * @returns {T} The converted object, array, or string.
     */
    export const convertSnakeToCamelCase = <T>(obj: T): CamelizeKeys<T> => {
      if (Array.isArray(obj)) {
        return obj.map(item => convertSnakeToCamelCase(item)) as CamelizeKeys<T>;
      }

      if (obj !== null && typeof obj === "object") {
        return Object.keys(obj).reduce((acc, key) => {
          const camelCaseKey = toCamelCase(key);
          (acc as Record<string, unknown>)[camelCaseKey] = convertSnakeToCamelCase(
            (obj as Record<string, unknown>)[key],
          );
          return acc;
        }, {} as CamelizeKeys<T>);
      }

      return obj as CamelizeKeys<T>;
    };

    const toCamelCase = (str: string) => {
      return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    };
    ```
  </Step>

  <Step title="Get buy options">
    The [Buy Options API](/api-reference/rest-api/onramp-offramp/get-buy-config) provides the available payment methods to the `FundModal` and `Fund` components.

    ```tsx lines expandable app/api/onramp/buy-options/route.ts
    import {
      type FetchBuyOptions,
      type OnrampBuyOptionsSnakeCaseResponse,
    } from "@coinbase/cdp-react";
    import { NextRequest, NextResponse } from "next/server";

    import { generateCDPJWT, getCDPCredentials, ONRAMP_API_BASE_URL } from "@/lib/cdp-auth";
    import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

    type OnrampBuyOptionsResponseRaw = OnrampBuyOptionsSnakeCaseResponse;
    type OnrampBuyOptionsResponse = Awaited<ReturnType<FetchBuyOptions>>;

    /**
     * Fetches available buy options (payment currencies and purchasable assets) for onramp
     *
     * @param request - NextRequest object
     * @returns NextResponse object
     */
    export async function GET(request: NextRequest) {
      try {
        // Validate CDP credentials are configured
        try {
          getCDPCredentials();
        } catch (_error) {
          return NextResponse.json({ error: "CDP API credentials not configured" }, { status: 500 });
        }

        /**
         * Extract query parameters
         * Note: While the API documentation shows all parameters as optional,
         * the backend currently requires the 'country' parameter
         */
        const searchParams = request.nextUrl.searchParams;
        const country = searchParams.get("country");
        const subdivision = searchParams.get("subdivision");
        const networks = searchParams.get("networks");

        // Build query string
        const queryParams = new URLSearchParams();
        if (country) queryParams.append("country", country);
        if (subdivision) queryParams.append("subdivision", subdivision);
        if (networks) queryParams.append("networks", networks);

        const queryString = queryParams.toString();
        const apiPath = "/onramp/v1/buy/options";
        const fullPath = apiPath + (queryString ? `?${queryString}` : "");

        // Generate JWT for CDP API authentication
        const jwt = await generateCDPJWT({
          requestMethod: "GET",
          requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
          requestPath: apiPath,
        });

        // Call CDP API to get buy options
        const response = await fetch(`${ONRAMP_API_BASE_URL}${fullPath}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("CDP API error:", response.statusText);
          const errorText = await response.text();
          console.error("Error details:", errorText);

          try {
            const errorData = JSON.parse(errorText);
            return NextResponse.json(
              { error: errorData.message || "Failed to fetch buy options" },
              { status: response.status },
            );
          } catch {
            return NextResponse.json(
              { error: "Failed to fetch buy options" },
              { status: response.status },
            );
          }
        }

        const data: OnrampBuyOptionsResponseRaw = await response.json();
        const dataCamelCase: OnrampBuyOptionsResponse = convertSnakeToCamelCase(data);
        return NextResponse.json(dataCamelCase);
      } catch (error) {
        console.error("Error fetching buy options:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    }
    ```
  </Step>

  <Step title="Create buy quote">
    The [Buy Quote API](/api-reference/rest-api/onramp-offramp/create-buy-quote) provides the exchange rate as well as the purchase URL to the `Fund` and `FundModal` components.

    ```tsx lines expandable app/api/onramp/buy-quote/route.ts
    import {
      type FetchBuyQuote,
      type OnrampBuyQuoteSnakeCaseResponse,
    } from "@coinbase/cdp-react";
    import { NextRequest, NextResponse } from "next/server";

    import { generateCDPJWT, getCDPCredentials, ONRAMP_API_BASE_URL } from "@/lib/cdp-auth";
    import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

    type OnrampBuyQuoteRequest = Parameters<FetchBuyQuote>[0];
    type OnrampBuyQuoteResponseRaw = OnrampBuyQuoteSnakeCaseResponse;
    type OnrampBuyQuoteResponse = Awaited<ReturnType<FetchBuyQuote>>;

    /**
     * Creates a buy quote for onramp purchase
     *
     * @param request - Buy quote request parameters
     * @returns Buy quote with fees and onramp URL
     */
    export async function POST(request: NextRequest) {
      try {
        const body: OnrampBuyQuoteRequest = await request.json();

        // Validate CDP credentials are configured
        try {
          getCDPCredentials();
        } catch (_error) {
          return NextResponse.json({ error: "CDP API credentials not configured" }, { status: 500 });
        }

        // Validate required fields

        // Note we don't require the wallet info because this endpoint is used to get an exchange rate. Only the onramp URL requires the wallet info.

        if (
          !body.purchaseCurrency ||
          !body.paymentAmount ||
          !body.paymentCurrency ||
          !body.paymentMethod ||
          !body.country
        ) {
          return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        // Validate US subdivision requirement
        if (body.country === "US" && !body.subdivision) {
          return NextResponse.json({ error: "State/subdivision is required for US" }, { status: 400 });
        }

        // Generate JWT for CDP API authentication
        const jwt = await generateCDPJWT({
          requestMethod: "POST",
          requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
          requestPath: "/onramp/v1/buy/quote",
        });

        // Prepare request body for buy quote API
        const requestBody = {
          purchaseCurrency: body.purchaseCurrency,
          purchaseNetwork: body.purchaseNetwork, // Use the wallet's network
          paymentAmount: body.paymentAmount,
          paymentCurrency: body.paymentCurrency,
          paymentMethod: body.paymentMethod,
          country: body.country,
          subdivision: body.subdivision,
          destinationAddress: body.destinationAddress, // Include to get one-click-buy URL
        };

        // Call CDP Onramp API to get buy quote and URL
        const response = await fetch(`${ONRAMP_API_BASE_URL}/onramp/v1/buy/quote`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          console.error("CDP API error:", response.statusText);
          const errorText = await response.text();
          console.error("Error details:", errorText);

          try {
            const errorData = JSON.parse(errorText);
            return NextResponse.json(
              { error: errorData.message || "Failed to create buy quote" },
              { status: response.status },
            );
          } catch {
            return NextResponse.json(
              { error: "Failed to create buy quote" },
              { status: response.status },
            );
          }
        }

        // convert response data to camelCase until migration to API v2 which will return camelCase data
        const data: OnrampBuyQuoteResponseRaw = await response.json();
        const dataCamelCase: OnrampBuyQuoteResponse = convertSnakeToCamelCase(data);
        return NextResponse.json(dataCamelCase);
      } catch (error) {
        console.error("Error creating buy quote:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    }
    ```
  </Step>
</Steps>

### 5. `FundModal` component

Finally, you are ready to add the `FundModal` component to your app.

<Steps titleSize="p">
  <Step title="Create fetchBuyOptions and fetchBuyQuote">
    The `FundModal` component requires `fetchBuyOptions` and `fetchBuyQuote` props, which are functions that handle calling the Onramp API via your new server-side endpoints.

    ```tsx lines expandable lib/onramp-api.ts
    import {
      type FetchBuyOptions,
      type FetchBuyQuote,
    } from "@coinbase/cdp-react/components/Fund";

    /**
     * Fetches available buy options for onramp
     *
     * @param params - Query parameters for buy options
     * @returns Buy options including payment currencies and purchasable assets
     */
    export const getBuyOptions: FetchBuyOptions = async params => {
      const queryParams = new URLSearchParams();
      queryParams.append("country", params.country);
      if (params?.subdivision) queryParams.append("subdivision", params.subdivision);

      const queryString = queryParams.toString();
      const url = `/api/onramp/buy-options${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch buy options");
      }

      return await response.json();
    };

    /**
     * Creates a buy quote for onramp purchase
     *
     * @param request - Buy quote request parameters
     * @returns Buy quote with fees and onramp URL
     */
    export const createBuyQuote: FetchBuyQuote = async request => {
      const response = await fetch("/api/onramp/buy-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create buy quote");
      }

      return await response.json();
    };
    ```
  </Step>

  <Step title="Render FundModal">
    ```tsx lines expandable components/FundWallet.tsx
    "use client";

    import {
      FundModal,
      type FundModalProps,
    } from "@coinbase/cdp-react";
    import { useCallback } from "react";

    import { getBuyOptions, createBuyQuote } from "@/lib/onramp-api";

    /**
     * A component that wraps the FundModal component
     *
     * @param props - The props for the FundWallet component
     * @param props.onSuccess - The callback function to call when the onramp purchase is successful
     * @returns The FundWallet component
     */
    export default function FundWallet({ onSuccess }: { onSuccess: () => void }) {
      // Get the user's location (i.e. from IP geolocation)
      const userCountry = "US";

      // If user is in the US, the state is also required
      const userSubdivision = userCountry === "US" ? "CA" : undefined;

      // Call your buy quote endpoint
      const fetchBuyQuote: FundModalProps["fetchBuyQuote"] = useCallback(async params => {
        return createBuyQuote(params);
      }, []);

      // Call your buy options endpoint
      const fetchBuyOptions: FundModalProps["fetchBuyOptions"] = useCallback(async params => {
        return getBuyOptions(params);
      }, []);

      return (
        <FundModal
          country={userCountry}
          subdivision={userSubdivision}
          cryptoCurrency="ETH"
          fiatCurrency="USD"
          fetchBuyQuote={fetchBuyQuote}
          fetchBuyOptions={fetchBuyOptions}
          network="base"
          presetAmountInputs={[10, 25, 50]}
          onSuccess={onSuccess}
        />
      );
    }
    ```
  </Step>
</Steps>

## Reference

| Resource                                                                  | Description                               |
| ------------------------------------------------------------------------- | ----------------------------------------- |
| [Buy options API](/api-reference/rest-api/onramp-offramp/get-buy-options) | Coinbase Onramp Buy Options API reference |
| [Buy quote API](/api-reference/rest-api/onramp-offramp/create-buy-quote)  | Coinbase Onramp Buy Quote API reference   |
| [Fund README](/sdks/cdp-sdks-v2/react/@coinbase/cdp-react/FundComponent)  | Component overview and usage              |

## What to read next

* **[React Components](/embedded-wallets/react-components)**: Explore all available Embedded Wallet React components, including authentication, wallet management, and transaction components to build complete wallet experiences
* **[Onramp Overview](/onramp-&-offramp/onramp-apis/onramp-overview)**: Learn about the complete Onramp API ecosystem, including advanced features like offramp, webhooks, and transaction monitoring for comprehensive fiat-to-crypto solutions
