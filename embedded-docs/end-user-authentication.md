# End User Authentication

## Overview

Embedded Wallets provide secure, user-friendly authentication methods that eliminate the complexity of traditional crypto wallets. Users can access their wallets through familiar authentication patterns like email one-time passwords (OTP), without ever dealing with seed phrases or browser extensions.

<Tip>
  Looking for the technical implementation? Check out our [Quickstart Guide](/embedded-wallets/quickstart) for step-by-step integration instructions.
</Tip>

## Authentication methods

### Email OTP

Email OTP is the primary authentication method for Embedded Wallets, providing a secure and familiar experience for users.

<AccordionGroup>
  <Accordion title="How email OTP works">
    1. **User enters email**: The user provides their email address in your application
    2. **OTP sent**: A 6-digit one-time password is sent to their email
    3. **User verifies**: The user enters the OTP in your application
    4. **Wallet access**: Upon successful verification, the wallet is created or accessed
  </Accordion>

  <Accordion title="Security features">
    * **Time-limited codes**: OTPs expire after 10 minutes for security
    * **Rate limiting**: Protection against brute force attempts
    * **Secure delivery**: Emails sent through Coinbase's trusted infrastructure
    * **Device binding**: Wallets are cryptographically bound to the user's device
  </Accordion>

  <Accordion title="User experience benefits">
    * **No passwords to remember**: Users don't need to create or manage passwords
    * **Instant onboarding**: New users can create a wallet in seconds
    * **Familiar process**: Similar to authentication flows users already know
    * **Cross-device support**: Users can access their wallet from up to 5 devices
  </Accordion>
</AccordionGroup>

### SMS OTP

SMS-based one-time passwords are available as an additional authentication method, providing users with more flexibility in how they access their wallets. This is currently available only for United States based phone numbers.

<AccordionGroup>
  <Accordion title="How SMS OTP works">
    1. **User enters phone number**: The user provides their phone number in your application
    2. **OTP sent**: A 6-digit one-time password is sent to their phone number
    3. **User verifies**: The user enters the OTP in your application
    4. **Wallet access**: Upon successful verification, the wallet is created or accessed
  </Accordion>

  <Accordion title="Security features">
    * **Time-limited codes**: OTPs expire after 5 minutes for security
    * **Rate limiting**: Protection against brute force attempts
    * **Secure delivery**: Text messages sent through Coinbase's trusted infrastructure
    * **Device binding**: Wallets are cryptographically bound to the user's device
  </Accordion>

  <Accordion title="User experience benefits">
    * **No passwords to remember**: Users don't need to create or manage passwords
    * **Instant onboarding**: New users can create a wallet in seconds
    * **Familiar process**: Similar to authentication flows users already know
    * **Cross-device support**: Users can access their wallet from up to 5 devices
  </Accordion>
</AccordionGroup>

<Warning>
  **SMS security considerations:**

  * SMS authentication is inherently vulnerable to SIM swapping attacks, where attackers can take over a user's phone number.
  * You should weigh the convenience of logging in with SMS with the potential for a user's wallet to be taken control of.
</Warning>

## Implementation approaches

There are three ways to implement authentication in your application:

1. **`AuthButton` component from `@coinbase/cdp-react`**: Pre-built UI component (fastest integration)
2. **React hooks from `@coinbase/cdp-hooks`**: For custom React UIs with state management
3. **Direct methods from `@coinbase/cdp-core`**: For vanilla JavaScript/TypeScript or non-React frameworks

<Warning>
  **Important authentication considerations:**

  * Always check if a user is already signed in before starting a new authentication flow. Attempting to call `verifyEmailOTP` or 'verifySMSOTP\` while a user is already authenticated will result in an error and may leave the application in an inconsistent state.
  * To sign out users, use the `signOut()` method from `@coinbase/cdp-core` or the `AuthButton` component which handles sign out automatically.
</Warning>

### AuthButton component (simplest)

For the fastest integration, `@coinbase/cdp-react` provides a pre-built `AuthButton` component that handles the entire authentication flow with a single line of code.

<Note>
  For more CDP React components and styling options, see the [React Components documentation](/embedded-wallets/react-components).

  By default, email authentication is the only method enabled. For enabling additional methods, refer to the [AppConfig documentation](/sdks/cdp-sdks-v2/react/@coinbase/cdp-react#appconfig)
</Note>

<CodeGroup>
  ```tsx Basic setup
  import { type AppConfig, CDPReactProvider } from "@coinbase/cdp-react";
  import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
  import { type Config } from "@coinbase/cdp-core";

  const config: Config = {
    projectId: "your-project-id"
  };

  const appConfig: AppConfig = {
    name: "React Library Demo",
    logoUrl: "https://picsum.photos/64",
    // Enabled authentication methods
    authMethods: ["email", "sms"],
  };

  function App() {
    return (
      <CDPReactProvider app={appConfig} config={config}>
        <YourApp />
      </CDPReactProvider>
    );
  }
  ```

  ```tsx Simple sign-in screen
  import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

  function SignInScreen() {
    return (
      <main>
        <h1>Welcome!</h1>
        <p>Please sign in to continue.</p>
        <AuthButton />
      </main>
    );
  }
  ```

  ```tsx Complete example with auth state
  import { useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";
  import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

  function App() {
    const { isInitialized } = useIsInitialized();
    const { isSignedIn } = useIsSignedIn();

    if (!isInitialized) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <header>
          <h1>My App</h1>
          <AuthButton /> {/* Shows "Sign In" or "Sign Out" automatically */}
        </header>
        
        <main>
          {!isSignedIn && <p>Please sign in to access your wallet</p>}
          {isSignedIn && <p>Welcome! You're signed in.</p>}
        </main>
      </div>
    );
  }
  ```

  ```tsx With user info
  import { useEvmAddress } from "@coinbase/cdp-hooks";
  import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

  function Header() {
    const { evmAddress } = useEvmAddress();

    return (
      <header>
        <h1>CDP App</h1>
        <div className="user-info">
          {evmAddress && (
            <span>
              {evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}
            </span>
          )}
          <AuthButton />
        </div>
      </header>
    );
  }
  ```
</CodeGroup>

<Tip>
  The `AuthButton` component automatically:

  * Shows "Sign In" when the user is not authenticated
  * Shows "Sign Out" when the user is authenticated
  * Handles the entire Email or SMS OTP flow internally
  * Manages loading and error states
  * Follows your theme configuration

  This is the recommended approach for most applications that want a quick, production-ready authentication experience.
</Tip>

### React hooks

For React applications, `@coinbase/cdp-hooks` provides convenient hooks that handle state management and re-renders automatically.

<CodeGroup>
  ```tsx React hooks setup
  import { CDPHooksProvider } from "@coinbase/cdp-hooks";
  import { type Config } from "@coinbase/cdp-core";

  const config: Config = {
    projectId: "your-project-id"
  };

  // Wrap your app with the provider
  function App() {
    return (
      <CDPHooksProvider config={config}>
        <YourApp />
      </CDPHooksProvider>
    );
  }
  ```

  ```tsx Email OTP Authentication with hooks
  import { useSignInWithEmail, useVerifyEmailOTP } from "@coinbase/cdp-hooks";

  function SignInComponent() {
    const { signInWithEmail } = useSignInWithEmail();
    const { verifyEmailOTP } = useVerifyEmailOTP();
    const [flowId, setFlowId] = useState<string | null>(null);

    const handleEmailSubmit = async (email: string) => {
      try {
        // Start sign in flow
        const { flowId } = await signInWithEmail({ email });
        setFlowId(flowId);
        // Show OTP input UI
      } catch (error) {
        console.error("Failed to send OTP:", error);
      }
    };

    const handleOTPSubmit = async (otp: string) => {
      if (!flowId) return;
      
      try {
        // Complete sign in
        const { user, isNewUser } = await verifyEmailOTP({
          flowId,
          otp
        });
        
        console.log("Signed in user:", user);
        console.log("User EVM address:", user.evmAccounts[0]);
        console.log("Is new user:", isNewUser);
      } catch (error) {
        console.error("Sign in failed:", error);
      }
    };

    // Return your UI components...
  }
  ```

  ```tsx SMS OTP Authentication with hooks
  import { useSignInWithSms, useVerifySmsOTP } from "@coinbase/cdp-hooks";

  function SignInComponent() {
    const { signInWithSms } = useSignInWithSms();
    const { verifySmsOTP } = useVerifySmsOTP();
    const [flowId, setFlowId] = useState<string | null>(null);

    const handlePhoneNumberSubmit = async (phoneNumber: string) => {
      try {
        // Start sign in flow with E.164 formatted phone number (ex. +15554443333)
        const { flowId } = await signInWithSms({ phoneNumber });
        setFlowId(flowId);
        // Show OTP input UI
      } catch (error) {
        console.error("Failed to send OTP:", error);
      }
    };

    const handleOTPSubmit = async (otp: string) => {
      if (!flowId) return;
      
      try {
        // Complete sign in
        const { user, isNewUser } = await verifySmsOTP({
          flowId,
          otp
        });
        
        console.log("Signed in user:", user);
        console.log("User EVM address:", user.evmAccounts[0]);
        console.log("Is new user:", isNewUser);
      } catch (error) {
        console.error("Sign in failed:", error);
      }
    };

    // Return your UI components...
  }
  ```

  ```tsx Session management with hooks
  import { useCurrentUser, useIsSignedIn } from "@coinbase/cdp-hooks";

  function UserProfile() {
    const { user } = useCurrentUser();
    const { isSignedIn } = useIsSignedIn();

    if (!isSignedIn) {
      return <div>Please sign in</div>;
    }

    return (
      <div>
        <h2>Welcome!</h2>
        <p>User ID: {user?.userId}</p>
        <p>Email: {user?.authenticationMethods.email?.email}</p>
        <p>Wallet Address: {user?.evmAccounts[0]}</p>
      </div>
    );
  }
  ```

  ```tsx Complete example component
  import React, { useState } from 'react';
  import { useSignInWithEmail, useVerifyEmailOTP, useIsSignedIn } from "@coinbase/cdp-hooks";

  export function AuthenticationFlow() {
    const { signInWithEmail, loading: emailLoading } = useSignInWithEmail();
    const { verifyEmailOTP, loading: otpLoading } = useVerifyEmailOTP();
    const { isSignedIn } = useIsSignedIn();
    
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [flowId, setFlowId] = useState<string | null>(null);
    const [step, setStep] = useState<'email' | 'otp'>('email');

    if (isSignedIn) {
      return <div>You are already signed in!</div>;
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const result = await signInWithEmail({ email });
        setFlowId(result.flowId);
        setStep('otp');
      } catch (error) {
        console.error('Failed to send OTP:', error);
      }
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!flowId) return;
      
      try {
        const { user } = await verifyEmailOTP({ flowId, otp });
        console.log('Authentication successful!', user);
      } catch (error) {
        console.error('Failed to verify OTP:', error);
      }
    };

    if (step === 'email') {
      return (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={emailLoading}
          />
          <button type="submit" disabled={emailLoading}>
            {emailLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleOTPSubmit}>
        <p>Enter the code sent to {email}</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
          maxLength={6}
          required
          disabled={otpLoading}
        />
        <button type="submit" disabled={otpLoading}>
          {otpLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    );
  }
  ```
</CodeGroup>

<Note>
  The React hooks automatically handle loading states, error states, and re-renders when authentication state changes. They're the recommended approach for React applications.
</Note>

### Direct methods

The `@coinbase/cdp-core` package provides the low-level authentication primitives for maximum control over the user experience. This approach is ideal for non-React applications or when you need fine-grained control.

<CodeGroup>
  ```typescript Email OTP authentication flow
  import { initialize, signInWithEmail, verifyEmailOTP } from '@coinbase/cdp-core';

  // Step 1: Initialize the CDP SDK
  await initialize({
    projectId: 'your-project-id'
  });

  // Step 2: Initiate email authentication
  const { flowId, message } = await signInWithEmail({
    email: 'user@example.com'
  });
  console.log(message); // "OTP sent to user@example.com"

  // Step 3: Verify the OTP code
  const { user, isNewUser } = await verifyEmailOTP({
    flowId,
    otp: '123456'
  });

  // User is now authenticated and has access to their wallet
  console.log('User ID:', user.userId);
  console.log('EVM Addresses:', user.evmAccounts);
  console.log('Is new user:', isNewUser);
  ```

  ```typescript SMS OTP authentication flow
  import { initialize, signInWithSms, verifySmsOTP } from '@coinbase/cdp-core';

  // Step 1: Initialize the CDP SDK
  await initialize({
    projectId: 'your-project-id'
  });

  // Step 2: Initiate SMS authentication
  const { flowId, message } = await signInWithSms({
    // E.164 format
    phoneNumber: '+15554443333'
  });
  console.log(message); // "Authentication initiated successfully. Please check your phone for the verification code."

  // Step 3: Verify the OTP code
  const { user, isNewUser } = await verifySmsOTP({
    flowId,
    otp: '123456'
  });

  // User is now authenticated and has access to their wallet
  console.log('User ID:', user.userId);
  console.log('EVM Addresses:', user.evmAccounts);
  console.log('Is new user:', isNewUser);
  ```

  ```typescript Error handling
  import { initialize, signInWithEmail, verifyEmailOTP, APIError } from '@coinbase/cdp-core';

  try {
    await initialize({
      projectId: 'your-project-id'
    });
    
    const { flowId } = await signInWithEmail({
      email: 'user@example.com'
    });
    
    // Handle OTP verification with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const { user, isNewUser } = await verifyEmailOTP({
          flowId,
          otp: userProvidedOTP
        });
        
        // Success!
        console.log('Authentication successful:', user);
        break;
      } catch (error) {
        attempts++;
        if (error instanceof APIError) {
          console.error('API Error:', error.message);
          if (attempts >= maxAttempts) {
            console.error('Maximum attempts reached. Please request a new OTP.');
          }
        } else {
          throw error; // Re-throw unexpected errors
        }
      }
    }
  } catch (error) {
    if (error instanceof APIError) {
      // Handle specific API errors
      console.error('CDP API Error:', error.message);
      console.error('Error Type:', error.errorType);
    } else {
      console.error('Authentication failed:', error);
    }
  }
  ```

  ```typescript Session management
  import { initialize, getCurrentUser, isSignedIn, signOut, onAuthStateChange } from '@coinbase/cdp-core';

  // Initialize must be called before any other methods
  await initialize({
    projectId: 'your-project-id'
  });

  // Check if user is already signed in
  const signedIn = await isSignedIn();
  if (signedIn) {
    const user = await getCurrentUser();
    console.log('User already authenticated:', user?.userId);
    console.log('EVM Accounts:', user?.evmAccounts);
  }

  // Listen for auth state changes
  onAuthStateChange((user) => {
    if (user) {
      console.log('User signed in:', user.userId);
    } else {
      console.log('User signed out');
    }
  });

  // Sign out when needed
  await signOut();
  ```
</CodeGroup>

<Warning>
  Always handle authentication errors gracefully. Common errors include:

  * Invalid or expired OTP codes
  * Rate limiting for too many attempts
  * Network connectivity issues
  * Invalid project configuration
</Warning>

## Developer-delegated authentication

This feature is in development and coming soon. This will enable applications with existing authentication systems to integrate Embedded Wallets seamlessly with their current user authentication flow.

## Server-side validation

Some developers take additional action (fetching additional data, starting asynchronous processes) based on a user having an active session. For security reasons, it is important that you check authentication status by validating the access token Coinbase grants a user when they log in.

<CodeGroup>
  ```tsx Access token retrieval using React hooks
  import { useGetAccessToken, useIsSignedIn } from "@coinbase/cdp-hooks";
  import { useEffect, useState } from "react";

  export default function useServerSideAuth() {
    const { isSignedIn } = useIsSignedIn();
    const { getAccessToken } = useGetAccessToken();
    const [isServerSideAuthenticated, setIsServerSideAuthenticated] = useState<boolean>(false);

    // When the user signs in, we need to check if the user is authenticated on the server side.
    useEffect(() => {
      async function checkAuth() {
        if (!isSignedIn) {
          return;
        }
        // Retrieve the access token
        const accessToken = await getAccessToken();

        // Send the access token to your server to check if the user is authenticated.
        const response = await fetch("/api/check-auth", {
          method: "POST",
          body: JSON.stringify({
            accessToken,
          }),
        });
        const { isAuthenticated, endUser, error } = await response.json();
        if (isAuthenticated) {
          setIsServerSideAuthenticated(true);
          console.log("endUser", endUser);
        } else {
          setIsServerSideAuthenticated(false);
          console.log("error", error);
        }
      }
      void checkAuth();
    }, [isSignedIn, getAccessToken]);

    return isServerSideAuthenticated;
  }
  ```

  ```typescript Access token retrieval using direct methods
  import { initialize, getAccessToken, isSignedIn } from '@coinbase/cdp-core';

  // Initialize must be called before any other methods
  await initialize({
    projectId: 'your-project-id'
  });

  // Check if user is already signed in
  const signedIn = await isSignedIn();
  if (signedIn) {
    // Get the user's access token
    const accessToken = await getAccessToken();

    // Send the access token to your server to check if the user is authenticated.
    const response = await fetch('/api/check-auth', {
      method: 'POST',
      body: JSON.stringify({
        accessToken,
      }),
    });
    const { isAuthenticated, endUser, error } = await response.json();
  }
  ```

  ```typescript Validating access token server-side
  // Next.js route for /api/check-auth
  import { NextRequest, NextResponse } from 'next/server';
  import { CdpClient } from "@coinbase/cdp-sdk";

  if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
    throw new Error('CDP_API_KEY_ID and CDP_API_KEY_SECRET must be set');
  }

  const cdpClient = new CdpClient({
    apiKeyId: process.env.CDP_API_KEY_ID,
    apiKeySecret: process.env.CDP_API_KEY_SECRET,
  });

  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { accessToken } = body;

      if (!accessToken) {
        return NextResponse.json(
          { isAuthenticated: false, error: 'Missing accessToken parameter' },
          { status: 400 }
        );
      }

      const endUser = await cdpClient.endUser.validateAccessToken({
          accessToken,
      });

      // If we reach here, the token is valid
      return NextResponse.json({ isAuthenticated: true, endUser });
    } catch (error) {
      const errorMessage =
        (error as { errorMessage?: string }).errorMessage ??
        (error as { message?: string }).message ??
        "Unknown error";
      // Any error means the token is invalid or there was an authentication issue
      return NextResponse.json({ isAuthenticated: false, error: errorMessage });
    }
  }
  ```
</CodeGroup>

## Best practices

### Security recommendations

1. **Domain allowlisting**: Always configure your [allowed domains](/embedded-wallets/domains) in CDP Portal
2. **HTTPS only**: Never use embedded wallets on non-HTTPS sites in production
3. **Rate limiting**: Implement rate limiting on your authentication endpoints
4. **Session management**: Use appropriate session timeouts for your use case

### State management

1. **Always check authentication state**: Before starting any authentication flow, verify if the user is already signed in:
   ```typescript
   const user = await getCurrentUser();
   if (user) {
     // User is already authenticated
     return;
   }
   ```

2. **Implement sign out**: Provide a clear way for users to sign out:

   ```typescript
   import { signOut } from '@coinbase/cdp-core';

   // Sign out the current user
   await signOut();
   ```

   For React applications, use the `AuthButton` component which handles sign out automatically, or the `useSignOut` hook:

   ```tsx
   import { useSignOut } from '@coinbase/cdp-hooks';

   function SignOutButton() {
     const { signOut } = useSignOut();
     return <button onClick={signOut}>Sign Out</button>;
   }
   ```

3. **Avoid redundant verification**: Don't call `verifyEmailOTP` or `verifySmsOTP` when a user is already authenticated. This will result in an error and may leave your application in an inconsistent state.

### User experience tips

1. **Clear messaging**: Explain why users need to verify their email
2. **Error handling**: Provide helpful error messages for common issues
3. **Loading states**: Show progress during authentication steps
4. **Success feedback**: Confirm when authentication is complete

### Choosing the right approach

<Accordion title="When to use the AuthButton component">
  Use the AuthButton when:

  * You want the fastest possible integration
  * You're building a React application
  * You don't need custom authentication UI
  * You want a production-ready solution out of the box
  * You're prototyping or building an MVP
</Accordion>

<Accordion title="When to use React hooks">
  Use `@coinbase/cdp-hooks` when:

  * You need custom authentication UI
  * You want to control the authentication flow step-by-step
  * You need to integrate with existing form components
  * You want fine-grained control over error handling
  * You're building a custom authentication experience
</Accordion>

<Accordion title="When to use direct methods">
  Use `@coinbase/cdp-core` when:

  * Building vanilla JavaScript/TypeScript applications
  * Working with frameworks other than React (Vue, Angular, Svelte, etc.)
  * You need maximum control over the authentication flow
  * Building server-side applications
  * Creating custom authentication wrappers for any framework
</Accordion>

## What to read next

* **[React hooks](/embedded-wallets/react-hooks)**: Pre-built hooks for authentication and wallet management
* **[React components](/embedded-wallets/react-components)**: Ready-to-use UI components including `AuthButton`
* **[Security configuration](/embedded-wallets/domains)**: Configure domain allowlisting and security settings
* **[API reference](/sdks/cdp-sdks-v2/react)**: Complete documentation for the CDP Web SDK
