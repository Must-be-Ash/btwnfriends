# Quickstart

## Overview

Build a dapp using Coinbase Developer Platform (CDP) embedded wallet in under 5 minutes! This guide shows you how to integrate our wallet infrastructure directly into your React application using our [`cdp-create-app`](https://www.npmjs.com/package/@coinbase/create-cdp-app) package.

<Tip>
  Check out the [CDP Web SDK reference](/sdks/cdp-sdks-v2/react) for comprehensive method signatures, types, and examples.
</Tip>

<Accordion title="What is an embedded wallet?">
  An **embedded wallet** is a self-custodial crypto wallet built directly into your app. Unlike traditional wallets (like MetaMask) that require browser extensions and seed phrases, embedded wallets let users sign in with familiar auth methods such as email, mobile SMS, and OAuth while maintaining full control of their assets.

  Key benefits:

  * **No downloads**: Works instantly in any browser
  * **Email sign-in**: No seed phrases to manage, but users retain full control
  * **You control the UX**: Seamlessly integrated into your app
</Accordion>

## Prerequisites

* A free [CDP Portal](https://portal.cdp.coinbase.com) account and project
* [Node.js 22+](https://nodejs.org/en/download)
* A node package manager installed (i.e., `npm`, `pnpm`, or `yarn`)
* Basic familiarity with React and TypeScript

Let's get started by scaffolding a new React app with the necessary dependencies.

<Tip>
  Need to get started quickly and not using the demo app?

  Install the SDK packages directly in your existing React app, then follow the [React Hooks](/embedded-wallets/react-hooks) or [React Components](/embedded-wallets/react-components) guides to set up the provider.

  <CodeGroup>
    ```bash npm
    # With npm
    npm install @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
    ```

    ```bash pnpm
    # With pnpm
    pnpm add @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
    ```

    ```bash yarn
    # With yarn
    yarn add @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
    ```
  </CodeGroup>
</Tip>

## 1. Add your domain

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

## 2. Create the demo app

<Steps titleSize="p">
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
    Follow the prompts to configure your app with an embedded wallet. Name your project, select `React` as a template, and enter your CDP Project ID that you copied in the previous step.

    ```console
    Ok to proceed? (y) y

    > npx
    > create-cdp-app

    ✔ Project name: … cdp-app-react
    ✔ Select a template: › React
    ✔ CDP Project ID (Find your project ID at https://portal.cdp.coinbase.com/projects/overview): … 8c21e60b-c8af-4286-a0d3-111111111111
    ✔ Confirm you have whitelisted 'http://localhost:3000' by typing 'y' … y
    ```
  </Step>

  <Step title="Run your app">
    Navigate to your project directory, install dependencies, and start the development server:

    <CodeGroup>
      ```bash npm
      cd cdp-app-react
      npm install
      npm run dev
      ```

      ```bash pnpm
      cd cdp-app-react
      pnpm install
      pnpm dev
      ```

      ```bash yarn
      cd cdp-app-react
      yarn install
      yarn dev
      ```
    </CodeGroup>
  </Step>
</Steps>

On successful startup, you should see similar to the following:

```console
  VITE v7.0.5  ready in 268 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 3. Demo your new wallet

Now that your embedded wallet is configured and your app is running, let's try it out.

<Steps titleSize="p">
  <Step title="Sign in">
    Head to [http://localhost:3000](http://localhost:3000) and click the **Sign In** button.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-1-signin.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=15b39a6df64d31e905119071b1609dd3" alt="CDP React Demo Sign In" width="514" height="191" data-path="images/embedded-wallet-1-signin.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-1-signin.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=d8f063dfbd51e3a0ba9f27ecabd31ded 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-1-signin.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=339199becb55abe5ebb1da36756b6d6f 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-1-signin.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=7be29fbbc0978abc83dd021e654c7cec 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-1-signin.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=4cc0fd25c6f325d8773e47b5adc1eac9 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-1-signin.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=3e1e27104ec457625b14b639fdfa1e37 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-1-signin.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=4b09a1f0ecef22b9abe88b279243c4c3 2500w" data-optimize="true" data-opv="2" />
    </Frame>
  </Step>

  <Step title="Enter your email">
    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-2-continue-with-email.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=914d4bba39e13b4a6fd62b48d223c2da" alt="CDP React Demo Email" width="558" height="404" data-path="images/embedded-wallet-2-continue-with-email.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-2-continue-with-email.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=01bfecbc8027debd7ec9fc9585cd9768 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-2-continue-with-email.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=53897076c8e213f2143aba617f2beead 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-2-continue-with-email.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=e7d2781e0da8849f6e506ce4b5e87821 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-2-continue-with-email.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=e07d0693910b18219e5247f8512b6a3f 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-2-continue-with-email.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=9776d64ed143ef96084ddeaeaae15efe 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-2-continue-with-email.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=bd9ba5874e11149ececf09cedf7c979b 2500w" data-optimize="true" data-opv="2" />
    </Frame>
  </Step>

  <Step title="Verify">
    Enter the verification code sent to your e-mail.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-3-verify.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=117d13429767fefb1a4f1af2e8bd3e00" alt="CDP React Demo Verify" width="564" height="386" data-path="images/embedded-wallet-3-verify.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-3-verify.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=900d502d5681ff1cfb39fd020e38a49b 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-3-verify.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=4ecbd52115bb9ba02e7e96bbabaf4a22 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-3-verify.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=94eda78d844af01786d1ebbcb71e2f5c 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-3-verify.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=cdc58415a56926f499b0d7224a4f3b1d 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-3-verify.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=823ae895b52016755f23c26b91d8c257 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-3-verify.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=72987959088152d549fdeab8280ffa58 2500w" data-optimize="true" data-opv="2" />
    </Frame>
  </Step>

  <Step title="View your new wallet">
    Congrats! Your new embedded wallet has been created, authenticated, and is ready to use on the [Base Sepolia](https://sepolia.basescan.org/) network.

    <Accordion title="What is Base?">
      **Base** is a fast, low-cost blockchain built by Coinbase. **Base Sepolia** is its test network where you can experiment with fake money (testnet ETH) before deploying to production.
    </Accordion>

    From the demo app, you can copy-and-paste your wallet address from the top-right corner. You can also monitor your wallet balance and (eventually -- keep reading!) send transactions. You should see similar to the following:

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-4-post-signin.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=3187618dc9c025f2241928ea6c700291" alt="CDP React Demo Transaction" width="574" height="533" data-path="images/embedded-wallet-4-post-signin.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-4-post-signin.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=3183101bccc5f1cc69a5559261692838 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-4-post-signin.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=da6a7aeeae0fc5711460af59f03ccb0e 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-4-post-signin.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=ab766db7f8f06e3630391cd7a327977f 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-4-post-signin.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=d9a619d186a91a9c8ce74fa38199358e 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-4-post-signin.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=fccf9a5ba4ed18cdc3d1eb8e47f0c8e3 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-4-post-signin.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=e7e1bcc118c602ce07396cdeddf317e6 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    Find record of your new wallet on Base Sepolia explorer using the URL: `https://sepolia.basescan.org/address/YOUR-WALLET-ADDRESS`.
  </Step>

  <Step title="Fund your wallet with testnet ETH">
    Before you can send transactions, you'll need to fund your wallet with testnet ETH. Follow the link to request testnet funds from a Base [Faucet](/faucets/introduction/welcome).

    <Accordion title="What is a transaction?">
      A blockchain transaction transfers cryptocurrency between wallets. Unlike bank transfers, they're:

      * **Public**: Visible on the blockchain
      * **Permanent**: Cannot be reversed
      * **Fast**: Usually complete in seconds
      * **Fee-based**: Require "gas" fees to process
    </Accordion>

    <Accordion title="What are testnet funds?">
      **Testnet funds** are fake cryptocurrency for testing. You get them free from a **faucet** (a service that "drips" test ETH to developers). Testnet funds are "play money" you can use for experimenting, without risking real money.
    </Accordion>

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-demo-faucet.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=4b3c944138d0b4d411d894f06b3e35fb" alt="CDP React Demo Fund Wallet" width="572" height="679" data-path="images/embedded-wallet-demo-faucet.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-demo-faucet.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=aec3a8a60aa090d5a105e61f9f3b08c8 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-demo-faucet.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=a369cbe6bc76f150cccfa486d8dfaea3 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-demo-faucet.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=45a7c6eb07a51b6893f7622595c24caa 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-demo-faucet.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=ec93686e8a1652646f74cf6de0f6b10e 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-demo-faucet.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=cd4ebc4d37fb8babe85b431f4f7020a0 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-demo-faucet.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=76fe57430ae1267cadefae5a70571a4d 2500w" data-optimize="true" data-opv="2" />
    </Frame>
  </Step>

  <Step title="Send your first transaction">
    Now that your wallet has testnet ETH, you can send your first transaction! The demo app allows you to send 0.000001 ETH to yourself as a test.

    Click **Send Transaction** to initiate the transfer. Once complete, you'll see a transaction hash that you can look up on the blockchain explorer.

    <Frame>
      <img src="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-5-post-tx.png?fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=f6174bd35409bfc41981ec6e894c5263" alt="CDP React Demo Transaction" width="1037" height="195" data-path="images/embedded-wallet-5-post-tx.png" srcset="https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-5-post-tx.png?w=280&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=65432c0ef2030f6825b7d89f93a09725 280w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-5-post-tx.png?w=560&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=9c4f5ecb8109e091503ac3c3e40faf3f 560w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-5-post-tx.png?w=840&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=fc616405180bd611173e5bb7227b3997 840w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-5-post-tx.png?w=1100&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=ca1180605ce91716e59e8c2761a41e3b 1100w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-5-post-tx.png?w=1650&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=aecdcdfdef9a9b6e2338fa0e295ddc90 1650w, https://mintcdn.com/coinbase-prod/54QcwrnR3tmkrVsF/images/embedded-wallet-5-post-tx.png?w=2500&fit=max&auto=format&n=54QcwrnR3tmkrVsF&q=85&s=41bfe47d3111099acbc6181c34b60b26 2500w" data-optimize="true" data-opv="2" />
    </Frame>

    🎉 You've successfully created an embedded wallet and sent your first transaction! Try adding some [React Hooks](/embedded-wallets/react-hooks) or additional [components](/embedded-wallets/react-components) to expand your app.
  </Step>
</Steps>

## How it works

Want to customize your app or understand how CDP makes wallets so simple? Let's look at the key components that power your new embedded wallet.

The demo app is built with React and [Vite](https://vite.dev/), organized into these main files:

```
src/
├── App.tsx              # Main app component with authentication state
├── SignInScreen.tsx     # Sign-in UI component
├── SignedInScreen.tsx   # Post-authentication UI with balance tracking
├── Header.tsx           # Header with wallet address and auth button
├── Transaction.tsx      # Transaction sending component
├── UserBalance.tsx      # Balance display component
├── Loading.tsx          # Loading state component
├── Icons.tsx            # Icon components
├── config.ts            # CDP configuration
├── theme.ts             # Custom theme configuration
├── main.tsx             # Entry point
└── index.css            # Styles
```

<Tip>
  You can explore the package for this demo in more detail at [npmjs.com](https://www.npmjs.com/package/@coinbase/create-cdp-app?activeTab=code).
</Tip>

### Entry point + provider setup

`src/main.tsx` demonstrates how to wrap your app with the `CDPReactProvider` to enable CDP functionality throughout the component tree.

```tsx src/main.tsx
import { CDPReactProvider } from "@coinbase/cdp-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { APP_CONFIG, CDP_CONFIG } from "./config.ts";
import { theme } from "./theme.ts";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CDPReactProvider config={CDP_CONFIG} app={APP_CONFIG} theme={theme}>
      <App />
    </CDPReactProvider>
  </StrictMode>,
);
```

<Accordion title="More on CDPReactProvider">
  The `CDPReactProvider` shares wallet functionality with your entire app, so any component can check if a user is signed in, get a wallet address, or send transactions.

  Without the Provider wrapping your app, none of your components would be able to use CDP's wallet features.
</Accordion>

With just this single provider, your entire app gains:

* **Embedded wallets**: No MetaMask or browser extensions required
* **Email authentication**: Users sign in like any Web2 app
* **Self-custodial recovery**: Users maintain full control of their assets without managing seed phrases
* **Built-in theme support**: Match your brand with the `theme` prop

The `CDP_CONFIG` contains your **Project ID** from setup, stored securely in an environment variable (`VITE_CDP_PROJECT_ID`).

The `APP_CONFIG` contains metadata about your application:

* **name**: Your app's display name shown in the wallet UI
* **logoUrl**: URL to your app's logo displayed during authentication

Here's the complete `src/config.ts` file:

```tsx src/config.ts
import { type Config } from "@coinbase/cdp-core";
import { type AppConfig } from "@coinbase/cdp-react";

export const CDP_CONFIG: Config = { projectId: import.meta.env.VITE_CDP_PROJECT_ID };

export const APP_CONFIG: AppConfig = {
  name: "CDP React StarterKit",
  logoUrl: "http://localhost:3000/logo.svg",
};
```

<Tip>
  **Using Next.js?** Check out our [Next.js integration guide](/embedded-wallets/nextjs) for`"use client"` requirements and common gotchas.
</Tip>

### Auth state management

`src/App.tsx` demonstrates how CDP simplifies wallet state management with two simple hooks:

<Accordion title="What are React hooks?">
  React hooks are functions that start with `use` (like `useIsInitialized`). They let your components:

  * Remember information (state)
  * Connect to external systems (like CDP)
  * React to changes (like when a user signs in)

  Your app uses these hooks to decide what to render on screen.
</Accordion>

```tsx src/App.tsx
import { useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";

import Loading from "./Loading";
import SignedInScreen from "./SignedInScreen";
import SignInScreen from "./SignInScreen";

function App() {
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();

  return (
    <div className="app flex-col-container flex-grow">
      {!isInitialized && <Loading />}
      {isInitialized && (
        <>
          {!isSignedIn && <SignInScreen />}
          {isSignedIn && <SignedInScreen />}
        </>
      )}
    </div>
  );
}

export default App;
```

CDP provides these powerful hooks:

* `useIsInitialized()`: Know when CDP is ready (no manual provider checks!)
* `useIsSignedIn()`: Instant auth status (no complex wallet connection state)

Unlike traditional Web3 apps that manage wallet providers, connection states, account changes, and network switches, CDP handles everything behind the scenes. Your app just checks if the user is signed in.

### Sign-in interface

`src/SignInScreen.tsx` showcases the power of CDP's embedded wallets - just one component handles everything:

```tsx src/SignInScreen.tsx
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

function SignInScreen() {
  return (
    <main className="card card--login">
      <h1 className="sr-only">Sign in</h1>
      <p className="card-title">Welcome!</p>
      <p>Please sign in to continue.</p>
      <AuthButton />
    </main>
  );
}

export default SignInScreen;
```

The `AuthButton` component handles:

* **Email authentication**: No seed phrases to manage - users maintain full control
* **Wallet creation**: Automatically creates a self-custodial wallet on first sign-in
* **Session management**: Handles tokens and persistence
* **UI/UX**: Professional auth flow with email verification

Compare this to traditional Web3 auth that requires wallet detection, connection flows, network switching, and error handling. CDP reduces hundreds of lines of code to a single component.

### The authenticated experience

`src/SignedInScreen.tsx` shows how CDP makes blockchain interactions as simple as Web2 development.

First, we get the user's wallet address with a single hook:

```tsx src/SignedInScreen.tsx
import { useEvmAddress, useIsSignedIn } from "@coinbase/cdp-hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPublicClient, http, formatEther } from "viem";
import { baseSepolia } from "viem/chains";
```

CDP provides instant access to:

* `useEvmAddress()`: The user's wallet address (no wallet connection flow needed)
* `useIsSignedIn()`: Auth status, which works just like any Web2 auth system (no complex wallet connection state)

Notice what's missing? No wallet provider setup, no connection management, no account change listeners. CDP handles it all.

<Accordion title="What is an Ethereum address?">
  An Ethereum address is a unique string of letters and numbers (like `0x742d35Cc6634C0532925a3b844Bc9e7595f7E123`) that identifies your wallet on the Ethereum network.

  Think of it like an email address: people can send cryptocurrency to it just like they'd send messages to your inbox. Your Ethereum address is public and shareable, but only you can access the funds sent to it.
</Accordion>

<Accordion title="What is EVM?">
  EVM stands for **Ethereum Virtual Machine**. It acts as the operating system that runs smart contracts and processes transactions on Ethereum and Ethereum-compatible blockchains.

  The EVM runs programs (smart contracts) on the blockchain. Many blockchains like Base, Polygon, and Avalanche are "EVM-compatible," meaning they use the same system as Ethereum. This is why:

  * The same wallet address works across all EVM chains
  * You can use the same tools and code
  * Developers can easily deploy to multiple chains

  When you see "EVM" in function names like `useEvmAddress()` or `sendEvmTransaction()`, it means these work with any EVM-compatible blockchain, not just Ethereum.
</Accordion>

We use viem to read blockchain data, while the user maintains full control of their self-custodial wallet:

```tsx src/SignedInScreen.tsx
// Create a read-only client for Base Sepolia
const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

function SignedInScreen() {
  const isSignedIn = useIsSignedIn();
  const evmAddress = useEvmAddress();  // Get the user's self-custodial wallet address
  const [balance, setBalance] = useState<bigint | undefined>(undefined);
```

The `useEvmAddress()` hook gives us access to the user's self-custodial wallet address. This address is created using CDP's embedded wallet infrastructure, providing users with full control of their assets without the complexity of traditional wallet management.

<Accordion title="What are seed phrases and private keys?">
  Traditional wallets require users to manage:

  * **Private key**: A long secret code that controls the wallet
  * **Seed phrase**: 12-24 words to recover the private key

  Embedded Wallets eliminate this complexity - users sign in with a simple auth method like email, and their wallet is ready to use. Users maintain full control and can export their private keys when needed using the `useExportEvmAccount` hook.
</Accordion>

For balance tracking, we query the blockchain using the user's wallet address:

```tsx src/SignedInScreen.tsx
  const getBalance = useCallback(async () => {
    if (!evmAddress) return;
    
    // Query the blockchain for the user's wallet balance
    const balance = await client.getBalance({
      address: evmAddress,  // The user's self-custodial wallet address
    });
    setBalance(balance);
  }, [evmAddress]);

  // Refresh balance on mount and every 500ms
  useEffect(() => {
    getBalance();
    const interval = setInterval(getBalance, 500);
    return () => clearInterval(interval);
  }, [getBalance]);
```

Finally, we compose the authenticated UI with CDP components:

```tsx src/SignedInScreen.tsx
  return (
    <>
      <Header />  {/* Contains CDP's AuthButton for sign out */}
      <main className="main flex-col-container flex-grow">
        <div className="main-inner flex-col-container">
          <div className="card card--user-balance">
            <UserBalance balance={formattedBalance} />
          </div>
          <div className="card card--transaction">
            {isSignedIn && evmAddress && (
              <Transaction 
                balance={formattedBalance} 
                onSuccess={getBalance}  // Refresh after CDP transaction
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
```

Key CDP integration points:

* The `Transaction` component uses CDP's `useSendEvmTransaction` hook for seamless transactions
* The `Header` includes CDP's `AuthButton` for session management
* Users maintain full control of their self-custodial wallets while enjoying a simplified experience

### Sending transactions

`src/Transaction.tsx` demonstrates how to send ETH using CDP's transaction hooks.

First, we set up the component with CDP hooks and state management:

```tsx src/Transaction.tsx
import { useSendEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";
import { Button } from "@coinbase/cdp-react/components/Button";
import { LoadingSkeleton } from "@coinbase/cdp-react/components/LoadingSkeleton";
import { type MouseEvent, useCallback, useMemo, useState } from "react";

interface Props {
  balance?: string;
  onSuccess?: () => void;
}

function Transaction(props: Props) {
  const { balance, onSuccess } = props;
  const { sendEvmTransaction } = useSendEvmTransaction();  
  const { evmAddress } = useEvmAddress();                 
  const [isPending, setIsPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
```

Key CDP hooks:

* `useSendEvmTransaction()`: Sends transactions from the user's self-custodial wallet
* `useEvmAddress()`: Gets the current user's wallet address

Next, we check if the user has funds to send:

```tsx src/Transaction.tsx
  const hasBalance = useMemo(() => {
    return balance && balance !== "0";
  }, [balance]);
```

Then we create the transaction handler using CDP's `sendEvmTransaction`:

```tsx src/Transaction.tsx
  const handleSendTransaction = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!evmAddress) return;

      e.preventDefault();
      setIsPending(true);

      const { transactionHash } = await sendEvmTransaction({
        transaction: {
          to: evmAddress,              // Send to yourself for testing
          value: 1000000000000n,       // 0.000001 ETH in wei
          gas: 21000n,                 // Standard ETH transfer gas limit
          chainId: 84532,              // Base Sepolia testnet
          type: "eip1559",             // Modern gas fee model
        },
        evmAccount: evmAddress,        // Your self-custodial wallet address
        network: "base-sepolia",       // Target network
      });

      setTransactionHash(transactionHash);
      setIsPending(false);
      onSuccess?.();
    },
    [evmAddress, sendEvmTransaction, onSuccess],
  );
```

<Accordion title="Understanding the transaction code">
  **Why we use wei**: Wei is the smallest unit of ETH. Like how a dollar has 100 cents, 1 ETH has 1,000,000,000,000,000,000 wei (that's 18 zeros!). We use wei to avoid rounding errors when dealing with tiny amounts.

  **`gas`**: The computational fee for processing your transaction. More complex operations = more gas. The actual cost depends on network congestion (like surge pricing).

  **`chainId`**: A unique identifier for each blockchain network (e.g., 1 for Ethereum mainnet, [84532](https://chainlist.org/chain/84532) for Base Sepolia). This prevents transactions from one network being replayed on another.

  **The `n` suffix**: JavaScript's BigInt notation for handling numbers larger than `Number.MAX_SAFE_INTEGER` (2^53 - 1). Essential for blockchain math where we deal with 18-decimal precision!
</Accordion>

<Accordion title="What is EIP-1559?">
  [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) is a transaction type that is a major upgrade to how gas fees work in Ethereum (and EVM-compatible chains like Base). It was introduced to make transaction fees more predictable and to reduce fee volatility.

  Before EIP-1559, users would "bid" gas prices manually, with transactions stuck or overpaid (whoever paid more had a higher chance of being mined faster).

  With EIP-1559, each block has a base fee that is algorithmically adjusted depending on network demand, with users adding a priority fee (tip) to incentivize miners/validators. Overpaid gas (beyond what's needed) is refunded.
</Accordion>

The CDP SDK handles:

* Seamless transaction signing from your self-custodial wallet
* Broadcasting to the network
* Gas price estimation (though you can override)
* Secure key operations while maintaining user control

<Accordion title="What is transaction signing?">
  Signing a transaction proves you authorized the payment:

  1. Your private key creates a unique digital signature
  2. This signature proves you own the wallet
  3. The network verifies the signature before processing

  With CDP, this happens automatically when you call `sendEvmTransaction` so you don't need to understand the cryptography behind it!
</Accordion>

Finally, the UI renders different content based on the transaction state:

```tsx src/Transaction.tsx
  return (
    <>
      {transactionHash ? (
        // Success state
        <>
          <h2>Transaction sent</h2>
          <a href={`https://sepolia.basescan.org/tx/${transactionHash}`}>
            {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
          </a>
          <Button onClick={() => setTransactionHash(null)}>
            Send another transaction
          </Button>
        </>
      ) : (
        // Pre-transaction state (ready to send or needs funds)
        <>
          {hasBalance ? (
            <Button onClick={handleSendTransaction} isPending={isPending}>
              Send Transaction
            </Button>
          ) : (
            <p>Get testnet ETH from the faucet first!</p>
          )}
        </>
      )}
    </>
  );
```

The component intelligently handles different states:

* Loading skeletons while fetching balance
* Empty wallet state with faucet link
* Ready state with send button
* Success state with transaction hash and option to send another

### Wallet management header

`src/Header.tsx` provides a clean interface for users to view their wallet address and manage their session.

```tsx src/Header.tsx
function Header() {
  const evmAddress = useEvmAddress();  // Get the user's wallet address
  const [isCopied, setIsCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(evmAddress);
    setIsCopied(true);
    // Reset after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <header>
      <h1>CDP React StarterKit</h1>
      <div className="user-info">
        {/* Copy wallet address button */}
        <button onClick={copyAddress}>
          {isCopied ? <IconCheck /> : <IconCopy />}
          <span>{evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}</span>
        </button>
        
        {/* Sign out button */}
        <AuthButton />
      </div>
    </header>
  );
}
```

Key features:

* **Wallet display**: Shows truncated address (e.g., `0x1234...5678`)
* **Copy to clipboard**: One-click copying with visual feedback
* **Session management**: Sign out via CDP's `AuthButton`

### Balance display

`src/UserBalance.tsx` displays the user's ETH balance with a helpful faucet link.

```tsx src/UserBalance.tsx
function UserBalance({ balance }: { balance?: string }) {
  return (
    <>
      <h2 className="card-title">Available balance</h2>
      <p className="user-balance">
        {balance === undefined && <LoadingSkeleton />}
        {balance !== undefined && (
          <span className="flex-row-container">
            <img src="/eth.svg" alt="" className="balance-icon" />
            <span>{balance}</span>
          </span>
        )}
      </p>
      <p>
        Get testnet ETH from{" "}
        <a href="https://portal.cdp.coinbase.com/products/faucet">
          Base Sepolia Faucet
        </a>
      </p>
    </>
  );
}
```

Key features:

* Shows ETH balance with an icon
* Loading skeleton while fetching balance
* Direct link to the faucet for getting testnet funds

### Theme customization

The demo app provides extensive theming capabilities through CSS variables and the CDP theme system, allowing you to fully customize the look and feel to match your brand.

```tsx src/theme.ts
export const theme: Partial<Theme> = {
  "colors-bg-default": "var(--cdp-example-card-bg-color)",
  "colors-bg-overlay": "var(--cdp-example-bg-overlay-color)",
  "colors-bg-skeleton": "var(--cdp-example-bg-skeleton-color)",
  "colors-bg-primary": "var(--cdp-example-accent-color)",
  "colors-bg-secondary": "var(--cdp-example-bg-low-contrast-color)",
  "colors-fg-default": "var(--cdp-example-text-color)",
  "colors-fg-muted": "var(--cdp-example-text-secondary-color)",
  "colors-fg-primary": "var(--cdp-example-accent-color)",
  "colors-fg-onPrimary": "var(--cdp-example-accent-foreground-color)",
  "colors-fg-onSecondary": "var(--cdp-example-text-color)",
  "colors-line-default": "var(--cdp-example-card-border-color)",
  "colors-line-heavy": "var(--cdp-example-text-secondary-color)",
  "colors-line-primary": "var(--cdp-example-accent-color)",
  "font-family-sans": "var(--cdp-example-font-family)",
  "font-size-base": "var(--cdp-example-base-font-size)",
  // ... maps to CSS variables defined in index.css
};
```

The app includes:

* **Dark mode support**: Enables light and dark themes
* **Customizable colors**: Primary accent, backgrounds, text, borders, and more
* **Typography control**: Font family and base font size
* **Responsive breakpoints**: Different styles for mobile, tablet, and desktop
* **Component theming**: Style CDP components like buttons, inputs, and modals

All theme values are defined as CSS variables in `index.css`, making it easy to rebrand the entire app by updating a few color values.

For more information on theme customization, see the [theme customization documentation](/embedded-wallets/react-components#3-customize-theme-optional).

## What to read next

* [`create-cdp-app`](https://www.npmjs.com/package/@coinbase/create-cdp-app): View the `npm` package directly
* [**CDP Web SDK Documentation**](/sdks/cdp-sdks-v2/react): Comprehensive API reference for the CDP Web SDK
* [**End User Authentication**](/embedded-wallets/end-user-authentication): Deep dive into authentication methods, error handling, and advanced patterns
* [**Embedded Wallet - React Hooks**](/embedded-wallets/react-hooks): Learn about available hooks like `useSignInWithEmail`, `useEvmAddress`, and `useSendEvmTransaction`
* [**Embedded Wallet - React Components**](/embedded-wallets/react-components): Explore pre-built components for authentication, wallet management, and transactions
* [**Embedded Wallet - React Native**](/embedded-wallets/react-native): Build mobile apps with Coinbase Developer Platform (CDP) embedded wallets
* [**Embedded Wallet - Wagmi Integration**](/embedded-wallets/wagmi): Use CDP wallets with the popular wagmi library for Ethereum development
* [**Security & Export**](/embedded-wallets/security-export): Learn about private key export security considerations and implementation
