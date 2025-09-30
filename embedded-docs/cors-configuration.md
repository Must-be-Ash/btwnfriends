# Embedded Wallet Security

## Overview

Embedded wallets require proper Cross-Origin Resource Sharing (CORS) configuration to ensure only your authorized domains can access Coinbase Developer Platform (CDP) APIs. This guide shows you how to set up Cross-Origin Resource Sharing to protect your users while maintaining a seamless experience.

By properly configuring CORS, you create a secure boundary that ensures only your authorized applications can access our embedded wallet APIs, preventing malicious websites from exploiting your wallet integration and protecting your users from cross-site scripting attacks.

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a browser security mechanism that controls access between different web origins. An origin is defined by the combination of protocol (http/https), domain, and port.

By default, browsers enforce the **same-origin policy**, blocking requests between different origins for security. CORS provides a way to safely relax this restriction:

* **Without CORS**: Your website at `https://myapp.com` cannot access APIs at `https://api.cdp.coinbase.com`
* **With CORS**: The API server explicitly allows specific origins, enabling secure cross-origin communication

Learn more about CORS fundamentals in the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Why does CORS exist?

CORS exists to protect users from malicious websites that try to access data they shouldn't. Without it, a malicious site could:

* Load a page you're logged into (like your bank)
* Make unauthorized requests to that site on your behalf
* Read sensitive data from the response

By enforcing CORS, browsers make sure that only trusted websites (explicitly allowed by the server) can access certain resources.

## Example

Let's walk through a practical example:

1. A DApp at `https://app.developer.com` wants to send a POST request to `https://api.cdp.coinbase.com/embedded-wallet-api/projects/{projectId}` (e.g., to create a wallet).
2. When Coinbase Developer Platform (CDP) receives the request, it will look up the list of `Allowed Origins` for the given project ID.
3. CDP queries its database and sees that the developer has configured `https://app.developer.com` as an allowed origin for the project.
4. CDP responds to the API with the following header set, allowing the response to return successfully:

```
Access-Control-Allow-Origin: https://app.developer.com
```

## How to configure CORS

1. Visit the [CORS configuration page](https://portal.cdp.coinbase.com/products/embedded) in the CDP Portal:

<Frame>
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod-embedded-wallets/images/cors-config.png" alt="CORS configuration page in CDP Portal" />
</Frame>

2. Click **Add origin**

3. Enter your allowed origin (e.g., `https://yourdapp.com` or `http://localhost:3000` for development):

<Accordion title="Origin format requirements">
  * Origins must be of the form `<scheme>://<host>:<port>`
    * `<scheme>` must be either `http` or `https`
    * `<host>` must be a valid hostname
    * `:<port>` is optional for ports 80 (http) and 443 (https), but required for all other ports (e.g., `http://localhost:3000`)
  * Maximum of 50 origins allowed per project
</Accordion>

<Frame>
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod-embedded-wallets/images/cors-config-add-origin.png" alt="Add origin dialog in CDP Portal" />
</Frame>

4. Click **Add origin** to save. Your allowed origins will appear in the dashboard, and changes will take effect immediately:

<Frame>
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/coinbase-prod-embedded-wallets/images/cors-config-allowed-origins.png" alt="Allowed origins list" />
</Frame>

<Tip>
  Add all domains where your app will run: development, staging, and production.
</Tip>

## What to read next

* **[Quickstart Guide](/embedded-wallets/quickstart)**: Build your first embedded wallet app in under 10 minutes
* **[React Hooks Reference](/embedded-wallets/react-hooks)**: Learn about available hooks like `useSignInWithEmail`, `useEvmAddress`, and `useSendEvmTransaction`
* **[React Components Guide](/embedded-wallets/react-components)**: Explore pre-built components for authentication, wallet management, and transactions
