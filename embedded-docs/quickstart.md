# Quickstart

export const PrerequisiteSetup = () => {
  return <>
      <h2>Prerequisites</h2>
      
      <ul>
        <li>A free <a href="https://portal.cdp.coinbase.com">CDP Portal</a> account and project</li>
        <li><a href="https://nodejs.org/en/download">Node.js 22+</a></li>
        <li>A node package manager installed (i.e., <code>npm</code>, <code>pnpm</code>, or <code>yarn</code>)</li>
        <li>Basic familiarity with React and TypeScript</li>
        <li>
          <details>
            <summary><strong>Configured your domain in CDP Portal</strong> <em>(click to expand)</em></summary>
            
            <Steps titleSize="p">
        <Step title="Access CDP Portal">
          Navigate to the <a href="https://portal.cdp.coinbase.com/products/embedded-wallets/domains">Domains Configuration</a> in CDP Portal, and click <strong>Add domain</strong> to include your local app.

          <Frame>
            <img src="/images/cors-config-add-domain.png" alt="Add domain dialog in CDP Portal" />
          </Frame>
        </Step>

        <Step title="Add your domain">
          <ul>
            <li>For local development: Use <code>http://localhost:3000</code> (or your preferred port)</li>
            <li>For production: Use your actual domain (e.g., <code>https://yourapp.com</code>)</li>
          </ul>

          <Frame>
            <img src="/images/cors-config-with-localhost.png" alt="Domain configuration with localhost" />
          </Frame>

          <Warning>
            For production apps, only add your actual production domain. Do not add <code>localhost</code> to production CDP projects as malicious apps running locally could impersonate your frontend and abuse your project credentials.
          </Warning>
        </Step>

        <Step title="Save your changes">
          Click <strong>Add domain</strong> again to save your changes. 

          <Frame>
            <img src="/images/cors-config-with-domain.png" alt="Domain configuration saved in CDP Portal" />
          </Frame>
          You should see your domain listed in the CDP Portal dashboard. The allowlist will take effect immediately upon saving.
        </Step>
      </Steps>
          </details>
        </li>
      </ul>
    </>;
};

## Overview

This guide demonstrates how to add embedded wallets to your existing React app with just a few lines of code.

<Tip>
  Check out the [CDP Web SDK reference](/sdks/cdp-sdks-v2/frontend) for comprehensive method signatures, types, and examples.
</Tip>

**Choose your path:**

<CardGroup cols={2}>
  <Card title="Integrate into your app" icon="code" href="#1-install-packages">
    Continue reading to add embedded wallets to your current React app with a few lines of code.
  </Card>

  <Card title="Check out our template app" icon="graduation-cap" href="/embedded-wallets/demo-app-tutorial">
    Build a complete demo app from scratch to learn all the features.
  </Card>
</CardGroup>

<Accordion title="What is an embedded wallet?">
  An **embedded wallet** is a self-custodial crypto wallet built directly into your app. Unlike traditional wallets (like MetaMask) that require browser extensions and seed phrases, embedded wallets let users sign in with familiar auth methods such as email, mobile SMS, and OAuth while maintaining full control of their assets.

  Key benefits:

  * **No downloads**: Works instantly in any browser
  * **Email sign-in**: No seed phrases to manage, but users retain full control
  * **You control the UX**: Seamlessly integrated into your app
</Accordion>

<PrerequisiteSetup />

## 1. Install packages

Once you've completed the prerequisites above, install the required packages:

<CodeGroup>
  ```bash npm
  npm install @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
  ```

  ```bash pnpm
  pnpm add @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
  ```

  ```bash yarn
  yarn add @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
  ```
</CodeGroup>

## 2. Wrap your app with the provider

Add the CDP provider to your root component (typically `App.tsx` or `main.tsx`). Replace `"your-project-id"` with your actual project ID from [CDP Portal](https://portal.cdp.coinbase.com).

```tsx
import { CDPReactProvider } from "@coinbase/cdp-react";

function App() {
  return (
    <CDPReactProvider 
      config={{
        projectId: "your-project-id",
        ethereum: { // if you want to create an EVM account on login
          createOnLogin: "eoa" // or "smart" for smart accounts
        },
        solana: { // if you want to create a Solana account on login
          createOnLogin: true
        }
      }}
      app={{ name: "Your App Name" }}
    >
      <YourExistingApp />
    </CDPReactProvider>
  );
}
```

## 3. Add authentication

### Option A: Use the AuthButton (recommended)

The simplest approach is to use the `AuthButton` component which handles the entire authentication flow:

```tsx
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import { useIsSignedIn } from "@coinbase/cdp-hooks";

function AuthComponent() {
  const { isSignedIn } = useIsSignedIn();

  return (
    <div>
      {isSignedIn ? (
        <div>Welcome! You're signed in.</div>
      ) : (
        <div>
          <h2>Please sign in</h2>
          <AuthButton />
        </div>
      )}
    </div>
  );
}
```

### Option B: Build custom auth UI

For custom UIs, use the authentication hooks directly:

```tsx
function CustomAuthComponent() {
    const { signInWithEmail } = useSignInWithEmail();
    const { verifyEmailOTP } = useVerifyEmailOTP();
    const { isSignedIn } = useIsSignedIn();
    const [flowId, setFlowId] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handleEmailSubmit = async () => {
        if (!email) return;
        try {
            const result = await signInWithEmail({ email });
            setFlowId(result.flowId);
        } catch (error) {
            console.error("Sign in failed:", error);
        }
    };

    const handleOtpSubmit = async () => {
        if (!flowId || !otp) return;
        try {
            const { user } = await verifyEmailOTP({ flowId, otp });
            console.log("Signed in!", user.evmAccounts?.[0]);
        } catch (error) {
            console.error("OTP verification failed:", error);
        }
    };

    if (isSignedIn) {
        return <div>Welcome! You're signed in.</div>;
    }

    return (
        <div>
            {flowId ? (
                <div>
                    <h2>Enter OTP</h2>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP code" />
                    <button onClick={handleOtpSubmit}>Verify OTP</button>
                </div>
            ) : (
                <div>
                    <h2>Sign in with Email</h2>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                    <button onClick={handleEmailSubmit}>Send OTP</button>
                </div>
            )}
        </div>
    );
}
```

## 4. Send transactions

### EVM transactions

Once authenticated, users automatically get a wallet address. Here's how to send EVM transactions:

```tsx
import { useEvmAddress } from "@coinbase/cdp-hooks";
import { SendEvmTransactionButton } from "@coinbase/cdp-react";

function SendTransaction(){
    const { evmAddress } = useEvmAddress();
    return (
        <div>
            <div>
                <h2>Send Transaction</h2>
                {evmAddress ? (
                  <SendEvmTransactionButton
                    account={evmAddress}
                    network="base-sepolia"
                    transaction={{
                        to: evmAddress,
                        value: 1000000000000n,
                        chainId: 84532,
                        type: "eip1559",
                    }}
                    onSuccess={(hash) => {
                        console.log('Transaction successful:', hash);
                        alert(`Transaction sent! Hash: ${hash}`);
                    }}
                    onError={(error) => {
                        console.error('Transaction failed:', error);
                        alert(`Transaction failed: ${error.message}`);
                    }}
                    pendingLabel="Sending transaction..."
                  />
                ) : (
                    <p>Wallet not ready yet...</p>
                )}
            </div>
        </div>
    );
}
```

That's it! Your users now have embedded wallets and can send transactions.

### Solana transactions

Here's how to send Solana transactions:

```tsx
import { useSolanaAddress } from "@coinbase/cdp-hooks";
import { SendSolanaTransactionButton } from "@coinbase/cdp-react";

function SendTransaction(){
    const { solanaAddress } = useSolanaAddress();
    return (
        <div>
            <div>
                <h2>Send Transaction</h2>
                {solanaAddress ? (
                  <SendSolanaTransactionButton
                    account={solanaAddress}
                    network="solana-devnet"
                    transaction="base64-solana-transaction"
                    pendingLabel="Sending transaction..."
                  />
                ) : (
                    <p>Wallet not ready yet...</p>
                )}
            </div>
        </div>
    );
}
```

## What to read next

<CardGroup cols={2}>
  <Card title="Demo app tutorial" icon="graduation-cap" href="/embedded-wallets/demo-app-tutorial">
    Build a complete demo app to learn all features in depth
  </Card>

  <Card title="React Hooks" icon="code" href="/embedded-wallets/react-hooks">
    Explore all available hooks for advanced functionality
  </Card>

  <Card title="React Components" icon="puzzle-piece" href="/embedded-wallets/react-components">
    Use pre-built components for faster development
  </Card>

  <Card title="Next.js Integration" icon="arrow-right" href="/embedded-wallets/nextjs">
    Learn about "use client" requirements and setup
  </Card>
</CardGroup>

<Tip>
  **Need testnet funds?** Get free Base Sepolia ETH from the [Base Faucet](https://portal.cdp.coinbase.com/products/faucet) to test transactions.
</Tip>
