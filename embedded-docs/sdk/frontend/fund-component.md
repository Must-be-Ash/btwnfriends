# Fund Component

## Overview

The `Fund` component provides a comprehensive solution for implementing cryptocurrency purchasing flows using fiat currency. It is designed to be highly customizable and composable, allowing developers to create tailored onramp experiences while maintaining a consistent and secure purchasing process.

The core features include:

* Support for multiple payment methods (e.g., debit card, bank transfer)
* Real-time exchange rate fetching and display
* Preset amount inputs for quick selection
* Multi-view interface (form, error, transaction status)
* Composable UI that gives developers full control over layout and styling
* Integrated transaction monitoring and status updates
* Centralized state management for the purchasing process

## Architecture

The component is built using a composition pattern that allows for maximum flexibility while providing sensible defaults when customization is not needed.

### Composition model

The `Fund` component is composed of several subcomponents that work together to create the complete purchasing experience. This approach allows developers to customize the UI structure while maintaining the underlying functionality.

The main components are:

* `Fund`: The root wrapper component that provides the `FundContext` and handles state management
* `FundTitle`: Renders the title for the fund interface (defaults to "Deposit \[cryptoCurrency]")
* `FundForm`: Manages the multi-view form interface for amount input + payment selection, error screens, and transaction status
* `FundFooter`: The "Secured by Coinbase" footer component

### Fund

The `Fund` component accepts a `children` prop that can be either React nodes or a render function. When using a render function, it receives the current `FundState` as an argument, providing access to all state values without needing to use the `useFundContext` hook directly.

**Example of `children` as a render function:**

```tsx lines
function MyFundPage() {
  return (
    <Fund
      country="US"
      subdivision="NY"
      cryptoCurrency="eth"
      fiatCurrency="usd"
      fetchBuyQuote={fetchBuyQuote}
      fetchBuyOptions={fetchBuyOptions}
      network="base"
    >
      {(state) => (
        <>
          <h1>
            {state.transactionStatus.statusName === "transactionSuccess" ? "Purchase Complete" : "Buy Crypto"}
          </h1>
          <FundTitle />
          <FundForm />
          <FundFooter />
        </>
      )}
    </Fund>
  );
}
```

### State management (FundProvider and FundContext)

The entire purchasing flow's state is managed by `FundProvider` and accessed via the `useFundContext` hook. This context contains:

* `country`, `subdivision`: User's location for regulatory compliance
* `cryptoCurrency`, `fiatCurrency`: Selected currencies for the transaction
* `network`: The blockchain network for the purchase
* `cryptoAmount`, `fiatAmount`: The amounts being purchased/spent
* `selectedInputType`: Whether the user is entering crypto or fiat amounts
* `selectedPaymentMethod`: The chosen payment method
* `exchangeRate`: Current exchange rate between currencies
* `transactionStatus`: Current status of the transaction (init, error, transactionSuccess, etc.)
* `error`: Any error that occurred during the process
* `paymentMethods`: Available payment methods based on user location

### FundForm

The `FundForm` component is the core of the purchasing interface, managing the display of different views based on the state. It handles three main views:

* `form`: The main input interface for amount selection and payment method
* `error`: Error display when something goes wrong
* `transaction-status`: Shows the status of an ongoing or completed transaction

`FundForm` provides a `children` render prop that receives an object containing the current `view` and the `Content` component. This allows for wrapping the form content or injecting additional components based on the current state and view.

```tsx lines
<FundForm>
  {({ view, Content }) => (
    <div className={`fund-view-${view}`}>
      {view === "form" && <p>Enter amount and select payment method</p>}
      {Content}
      {view === "error" && <p>Contact support at help@example.com</p>}
    </div>
  )}
</FundForm>
```

### FundTitle

The `FundTitle` component displays a contextual title for the fund interface. By default, it shows "Deposit \[cryptoCurrency]" but can be customized by providing children. It accepts an `as` prop to render as different HTML elements (default is `h2`).

### Transaction lifecycle

The Fund component monitors and reflects a complete transaction lifecycle with the following statuses:

* `init`: Initial state, ready for user input
* `exit`: User has exited the flow
* `error`: An error occurred during the process
* `transactionSuccess`: Transaction completed successfully
* `transactionPending`: Transaction is being processed

These statuses can be monitored using the `onStatus`, `onError`, and `onSuccess` callbacks provided to the Fund component.

## Example: Basic usage

**Implement a simple cryptocurrency purchase interface:**

```tsx lines
import {
  FundModal,
  type FetchBuyOptions,
  type FetchBuyQuote,
} from '@coinbase/cdp-react';

function BuyCrypto() {
  const fetchBuyQuote: FetchBuyQuote = async (params) => {
    // Call your backend API to get a quote
    const response = await fetch('/api/buy-quote', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  };

  const fetchBuyOptions: FetchBuyOptions = async (params) => {
    // Call your backend API to get available payment methods
    const response = await fetch('/api/buy-options', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  };

  return (
    <FundModal
      country="US"
      subdivision="NY"
      cryptoCurrency="eth"
      fiatCurrency="usd"
      fetchBuyQuote={fetchBuyQuote}
      fetchBuyOptions={fetchBuyOptions}
      network="base"
      presetAmountInputs={[25, 50, 100]}
      onSuccess={(data) => console.log('Purchase successful:', data)}
      onError={(error) => console.error('Purchase failed:', error)}
    />
  );
}
```

## Example: Custom layout with page title

**Customize the layout and add a page-level title:**

```tsx lines
import {
  Fund,
  FundFooter,
  FundForm,
  FundTitle,
  useFundContext,
  type FetchBuyOptions,
  type FetchBuyQuote,
} from '@coinbase/cdp-react';

function CustomFundPage() {
  const fetchBuyQuote: FetchBuyQuote = async (params) => {
    // Call your backend API to get a quote
    const response = await fetch('/api/buy-quote', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  };

  const fetchBuyOptions: FetchBuyOptions = async (params) => {
    // Call your backend API to get available payment methods
    const response = await fetch('/api/buy-options', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  };

  return (
    <Fund
      country="US"
      subdivision="NY"
      cryptoCurrency="btc"
      fiatCurrency="usd"
      fetchBuyQuote={fetchBuyQuote}
      fetchBuyOptions={fetchBuyOptions}
      network="base"
    >
      <CustomFundContent />
    </Fund>
  );
}

function CustomFundContent() {
  const { state } = useFundContext();
  const titleId = useId();

  return (
    <>
      <div className="page-header">
        <h1>Cryptocurrency Purchase Portal</h1>
        <p>
          Current rate: 1 {state.cryptoCurrency} =
          {state.exchangeRate ? (1 / state.exchangeRate).toLocaleString() : "..."}{" "}
          {state.fiatCurrency}
        </p>
      </div>

      <FundTitle as="h2" id={titleId}>
        Buy {state.cryptoCurrency}
      </FundTitle>

      <FundForm aria-labelledby={titleId}>
        {({ view, Content }) => (
          <>
            {view === "form" && (
              <p className="help-text">
                Select an amount and payment method to continue
              </p>
            )}
            {Content}
            {view === "error" && (
              <div className="error-help">
                <p>Need help? Contact support@example.com</p>
              </div>
            )}
          </>
        )}
      </FundForm>

      <FundFooter />
    </>
  );
}
```

## Example: Monitoring transaction lifecycle

**Track and respond to transaction status changes:**

```tsx lines
import {
  Fund,
  type FundProps,
} from '@coinbase/cdp-react';

function MonitoredFundFlow() {

  const handleStatus: FundProps["onStatus"] = (status) => {
    console.log('Transaction status:', status.statusName);
  };

  const handleSuccess: FundProps["onSuccess"] = (data) => {
    console.log('Purchase successful:', data);
  };

  const handleError: FundProps["onError"] = (error) => {
    console.error('Purchase error:', error);
  };

  return (
    <Fund
      country="US"
      subdivision="CA"
      cryptoCurrency="eth"
      fiatCurrency="usd"
      fetchBuyQuote={fetchBuyQuote}
      fetchBuyOptions={fetchBuyOptions}
      network="ethereum"
      onStatus={handleStatus}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## API Reference

### Required Props

* `country`: ISO 3166-1 alpha-2 country code (e.g. "US") - typically obtained via IP geolocation and/or user selection
* `cryptoCurrency`: The cryptocurrency to purchase (e.g., "eth", "btc")
* `fiatCurrency`: The fiat currency to use for payment (e.g., "usd", "eur")
* `network`: The blockchain network for the purchase
* `fetchBuyQuote`: Async function to fetch exchange rate quotes
* `fetchBuyOptions`: Async function to fetch available payment methods

### Optional Props

* `subdivision`: ISO 3166-2 subdivision code (e.g., "NY" for New York) - typically obtained via IP geolocation and/or user selection
* `presetAmountInputs`: Array of preset fiat amounts for quick selection
* `inputType`: Initial input type ("fiat" or "crypto")
* `openIn`: Where to open the payment window ("tab" or "popup")
* `redirectUrl`: URL to redirect the user to after a successful transaction (note: the domain must be whitelisted in the [CDP Portal Onramp section](https://portal.cdp.coinbase.com/products/onramp))
* `submitLabel`: Custom label for the submit button
* `title`: Custom title for the fund interface
* `locale`: Locale for formatting (defaults to "en-US")
* `cryptoDecimalPlaces`: Number of decimal places for crypto amounts
* `fiatDecimalPlaces`: Number of decimal places for fiat amounts
* `onStatus`: Callback for transaction status changes
* `onSuccess`: Callback for successful transactions
* `onError`: Callback for transaction errors
* `children`: React nodes or render function receiving FundState

## Notes

* Exchange rates are fetched in real-time to ensure accurate pricing
* Payment processing is handled by Coinbase's secure infrastructure
* The component handles regulatory requirements based on user location
