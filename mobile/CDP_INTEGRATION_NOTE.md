# CDP React Native Integration Note

## Current Implementation

This app uses **@coinbase/cdp-hooks** for wallet integration on React Native, following the official CDP React Native quickstart documentation.

### Official CDP React Native Support

According to [CDP React Native Quickstart](https://docs.cdp.coinbase.com/embedded-wallets/react-native/quickstart):

> "All CDP React hooks are compatible with React Native. Check out the CDP React SDK reference for comprehensive method signatures, types, and examples."

The `CDPHooksProvider` from `@coinbase/cdp-hooks` works directly on React Native without requiring additional native wrappers.

### Alternative: Mobile Wallet Protocol

Base also documents an alternative approach using **Mobile Wallet Protocol** with wagmi:
- Package: `@mobile-wallet-protocol/client`  
- Provider: `EIP1193Provider` or wagmi connector
- Docs: https://docs.base.org/base-account/quickstart/mobile-integration

This is a different integration path that doesn't use CDP SDK directly.

### Our Approach

We're using the **CDP SDK approach** because:
1. ✅ Matches the user's original requirements (CDP embedded wallets)
2. ✅ Supported by official CDP React Native documentation
3. ✅ Allows reusing the same hooks as the web app
4. ✅ Simpler integration (no need to switch SDKs)

### Testing Required

To validate this works:
1. Run `npm run ios` or `npm run android`
2. Test email/OTP authentication flow
3. Verify wallet creation and Smart Account initialization
4. Test transactions and backend API connectivity

If CDP hooks fail to initialize on device, we can:
- Switch to Mobile Wallet Protocol approach
- Investigate if additional native modules are needed
- Contact Coinbase support for React Native-specific guidance

## Current Status

- ✅ CDP provider configured with Smart Accounts
- ✅ Authentication screens implemented
- ✅ API client with dynamic host detection
- ⏳ Needs device/simulator testing to validate

The implementation follows official CDP documentation. If issues arise during testing, we have a clear fallback path using Mobile Wallet Protocol.
