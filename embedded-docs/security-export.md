# Security & Export

## Overview

While Embedded Wallets are designed to eliminate the complexity of private key management for users, there are scenarios where developers may need to export private keys for wallet migration, user preference, or other legitimate use cases. This page covers the security considerations, implementation, and best practices for handling private key exports.

<Warning>
  Private key export is a high-risk operation that should be implemented with extreme caution. Exported private keys provide complete control over wallet funds and should never be logged, displayed, or transmitted insecurely.
</Warning>

## Prerequisites

* A [CDP Portal](https://portal.cdp.coinbase.com/) account and project
* Embedded Wallets enabled in your project with [configured domains](/embedded-wallets/domains)
* [`@coinbase/cdp-hooks`](https://www.npmjs.com/package/@coinbase/cdp-hooks) installed and configured
* User successfully authenticated with embedded wallet

## When to consider

Private key export should only be considered in these specific scenarios:

**Valid use cases:**

* **Wallet migration**: Users need to import a wallet into another wallet or application
* **User preference**: Users specifically request full custody of their private keys
* **Account recovery**: Users need to recover access when other authentication methods fail
* **General export**: Users want to export their keys for any legitimate purpose

**Invalid use cases:**

* **Debugging**: Never export keys for troubleshooting
* **Analytics**: Never export keys for analytics or logs
* **Backup storage**: Don't export keys to store as backups on your servers
* **Default behavior**: This should never be automatic or default functionality

## Best practices

<Warning>
  **Critical security principles:**

  * **Private keys provide complete wallet control**: Anyone with the private key can access all funds
  * **This is a high-risk operation**: Implement with extreme caution and clear user warnings
</Warning>

1. **Never log or store private keys in plaintext**
   * Avoid console.log, file logging, or unencrypted persistent storage
   * Clear private key variables from memory when done
   * Let the browser's garbage collector handle cleanup

2. **Require explicit user consent**
   * Don't make key export automatic or hidden
   * Show clear security warnings before export
   * Make the export process deliberate, not accidental

3. **Use secure UI patterns**
   * Clipboard copy is safer than displaying keys on screen
   * Provide clear instructions for secure handling
   * Consider offering alternatives like asset transfer when appropriate

4. **Educate users on security**
   * Explain what private keys are and why they're sensitive
   * Provide guidance on secure storage options
   * Link to general wallet security resources

### For users

For comprehensive guidance on private key security and storage best practices, refer to [Coinbase's guide on private key security](https://www.coinbase.com/learn/crypto-basics/what-is-a-private-key).

## Export scenarios

Here are common scenarios where users might need to export their private keys from embedded wallets. Each scenario should be implemented with the security measures outlined above.

**Wallet migration to external providers:**

* Users want to import their account into third-party wallet applications
* Copy the exported private key to clipboard for secure transfer
* Provide clear instructions for the import process in the destination wallet

**Hardware wallet import:**

* Users can import the private key into compatible hardware wallets
* Note: This reduces some hardware wallet security benefits since the key was previously software-based
* Recommend this primarily for users who want to upgrade their security model

**Cold storage creation:**

* Users create offline paper wallets or other cold storage solutions
* Suitable for long-term storage of funds with minimal transaction needs
* Emphasize the importance of secure physical storage

## Implementation

### 1. Add the hook

Use the `useExportEvmAccount` hook from `@coinbase/cdp-hooks`:

```tsx
import { useExportEvmAccount, useEvmAddress } from "@coinbase/cdp-hooks";
```

### 2. Implement export with security measures

```tsx
import { useExportEvmAccount, useEvmAddress } from "@coinbase/cdp-hooks";
import { useState } from "react";

function SecureExportKey() {
  const { exportEvmAccount } = useExportEvmAccount();
  const { evmAddress } = useEvmAddress();
  const [isExporting, setIsExporting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleExportRequest = () => {
    // Show security warning and confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmedExport = async () => {
    if (!evmAddress) return;

    setIsExporting(true);
    try {
      const { privateKey } = await exportEvmAccount({
        evmAccount: evmAddress
      });

      // Securely handle the private key
      // Option 1: Copy to clipboard (recommended)
      await navigator.clipboard.writeText(privateKey);
      
      // Option 2: Show in secure modal (alternative)
      // showSecureModal(privateKey);
      
      // Note: In JavaScript, strings are immutable so we can't truly clear from memory
      // The browser's garbage collector will handle cleanup
      
      alert("Private key copied to clipboard. Please store it securely and clear your clipboard.");
      
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
      setShowConfirmation(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="security-warning-modal">
        <h3>⚠️ Security Warning</h3>
        <div className="warning-content">
          <p><strong>Exporting your private key is a high-risk operation.</strong></p>
          <ul>
            <li>Anyone with your private key has complete control of your wallet</li>
            <li>Never share your private key with anyone</li>
            <li>Store it securely (see [Coinbase's guide on private key security](https://www.coinbase.com/learn/crypto-basics/what-is-a-private-key) for best practices)</li>
            <li>Clear your clipboard after copying</li>
          </ul>
          <p>Do you understand these risks and want to proceed?</p>
        </div>
        <div className="actions">
          <button 
            onClick={() => setShowConfirmation(false)}
            className="cancel-button"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirmedExport}
            disabled={isExporting}
            className="danger-button"
          >
            {isExporting ? "Exporting..." : "Yes, Export Private Key"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleExportRequest}
      className="export-button"
    >
      Export Private Key
    </button>
  );
}
```

## What to read next

* **[React Hooks](/embedded-wallets/react-hooks)** - Learn about all available hooks for embedded wallet operations
* **[CDP SDK Documentation](/sdks/cdp-sdks-v2/react)** - Complete SDK reference and API documentation
* **[Smart Accounts](/embedded-wallets/smart-accounts)** - Explore account abstraction as an alternative to private key management
* **[End User Authentication](/embedded-wallets/end-user-authentication)** - Understand authentication flows and security models
