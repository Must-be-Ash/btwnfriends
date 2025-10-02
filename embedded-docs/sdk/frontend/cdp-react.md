# Overview

This package contains ready-made, customizable React UI components that wrap
the CDP frontend SDK.

## Components

* [\`SignInModal\`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinmodal) - a button that triggers a modal with the sign-in flow
* [\`SignIn\`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signin) - the forms for the sign in flow, a logo, heading, and description text
* [\`SignOutButton\`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signoutbutton) - a sign out button
* [\`AuthButton\`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#authbutton) - the `SignOutButton` when logged in, and the `SignInModal` when logged out
* [\`SendEvmTransactionButton\`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#sendevmtransactionbutton) - a button that signs and sends an EVM transaction
* [\`SendSolanaTransactionButton\`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#sendsolanatransactionbutton) - a button that signs and sends a Solana transaction
* [\`Fund\`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fund) - the fund flow
* [\`FundModal\`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundmodal) - a button that triggers a modal with the fund flow

## Quickstart

This guide will help you get started with `@coinbase/cdp-react`. You'll learn how to install the package, set up the provider, and render your first component.

### Installation

First, add the package to your project using your preferred package manager.

```bash
# With pnpm
pnpm add @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks

# With yarn
yarn add @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks

# With npm
npm install @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
```

### Gather your CDP Project information

1. Sign in or create an account on the [CDP Portal](https://portal.cdp.coinbase.com)
2. On your dashboard, select a project from the dropdown at the at the top, and copy the Project ID

### Allowlist your local app

1. Navigate to the [Embedded Wallet Configuration](https://portal.cdp.coinbase.com/products/embedded-wallets/cors)
   in CDP Portal, and click Add origin to include your local app
2. Enter the origin of your locally running app - e.g., `http://localhost:3000`
3. Click Add origin again to save your changes

### Setup Provider

Next, you need to wrap your application with the `CDPReactProvider`.

`CDPReactProvider` provides the necessary context for hooks and components to work correctly. It also provides access to config data and theming.

Update your main application file (e.g., `main.tsx` or `App.tsx`) to include the provider:

```tsx lines
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Your main App component
import { CDPReactProvider, type Config, type Theme } from '@coinbase/cdp-react';

// Config for your dapp
const config: Config = {
  projectId: "your-project-id", // Copy your Project ID here.
  appName: "My app", // the name of your application
  appLogoUrl: "https://picsum.photos/64", // logo will be displayed in select components
}

// You can customize the theme by overriding theme variables
const themeOverrides: Partial<Theme> = {
  "colors-bg-default": "black",
  "colors-bg-alternate": "#121212",
  "colors-fg-default": "white",
  "colors-fg-muted": "#999999",
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CDPReactProvider config={config} theme={themeOverrides}>
      <App />
    </CDPReactProvider>
  </React.StrictMode>,
);
```

### Render a Component

Now you can use the components from the library. Let's add the `AuthButton` component to your application. This component handles both sign-in and sign-out functionality.

```tsx lines
// In your App.tsx or any other component
import { AuthButton } from '@coinbase/cdp-react/components/AuthButton';

function App() {
  return (
    <div>
      <h1>Welcome</h1>
      <AuthButton />
    </div>
  );
}

export default App;

```

That's it! You've successfully installed `@coinbase/cdp-react`, set up the provider, and rendered your first component.

## Functions

### CDPReactProvider()

```ts
function CDPReactProvider(props): Element;
```

CDPReactProvider component.

#### Parameters

| Parameter | Type                                                                                                  | Description                              |
| --------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `props`   | [`CDPReactProviderProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#cdpreactproviderprops) | Props for the CDPReactProvider component |

#### Returns

`Element`

The CDPReactProvider component

#### Example

```tsx lines
function App() {
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <YourApp />
    </CDPReactProvider>
  );
}
```

***

### useAppConfig()

```ts
function useAppConfig(): AppConfig;
```

Hook to access the app config from a component.

#### Returns

[`AppConfig`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#appconfig)

The app config.

#### Example

```tsx lines
const MyComponent = () => {
  // Access the app config from a child component
  const appConfig = useAppConfig();
  return <div>{appConfig.appName}</div>;
}

function App() {
  return (
    <CDPReactProvider config={config}>
      <MyComponent />
    </CDPReactProvider>
  );
}
```

***

### AuthButton()

```ts
function AuthButton(props): Element;
```

A button that signs the user in or out.

This component will render the [SignInModal](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinmodal) component when the user is signed out, and a [SignOutButton](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signoutbutton) when the user is signed in.
If the SDK is initializing (i.e. the initial user state is pending), the component will render a loading skeleton.

#### Parameters

| Parameter | Type                                                                                                                            | Description                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `props`   | [`AuthButtonProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#authbuttonprops) & `HTMLAttributes`\<`HTMLDivElement`> | The props for the component. |

#### Returns

`Element`

The rendered component.

#### Example

```tsx lines
function App() {
  // Render the AuthButton component
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <AuthButton />
    </CDPReactProvider>
  );
}
```

***

### SendEvmTransactionButton()

```ts
function SendEvmTransactionButton(props): Element;
```

A button that signs and sends a transaction.

#### Parameters

| Parameter | Type                                                                                                                  | Description                                           |
| --------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `props`   | [`SendEvmTransactionButtonProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#sendevmtransactionbuttonprops) | The props for the SendEvmTransactionButton component. |

#### Returns

`Element`

The rendered component.

***

### SendSolanaTransactionButton()

```ts
function SendSolanaTransactionButton(props): Element;
```

A button that signs and sends a Solana transaction.

#### Parameters

| Parameter | Type                                                                                                                        | Description                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `props`   | [`SendSolanaTransactionButtonProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#sendsolanatransactionbuttonprops) | The props for the SendSolanaTransactionButton component. |

#### Returns

`Element`

The rendered component.

***

### SignIn()

```ts
function SignIn(props): Element;
```

A sign-in component that handles the email and OTP flow.

#### Parameters

| Parameter | Type                                                                              | Description                  |
| --------- | --------------------------------------------------------------------------------- | ---------------------------- |
| `props`   | [`SignInProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinprops) | The props for the component. |

#### Returns

`Element`

The SignIn component.

#### Examples

```tsx lines
function App() {
  // Render the SignIn component with a custom onSuccess handler
  const handleSuccess = () => {
    console.log("Sign in successful");
  }
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn onSuccess={handleSuccess} />
    </CDPReactProvider>
  );
}
```

```tsx lines
function App() {
  // Render the title, description, and auth method buttons inside the transition containers
  // This is the default UI if no children are provided.
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn>
        <SignInBackButton />
        <SignInImage />
        <SignInForm>
          {({ authMethod, step, Form }) => {
            // Pass the authMethod and step from the render function args to the title
            // and description components so the UI is rendered correctly when both states
            // are visible during the transition
            return (
              <>
                <SignInTitle step={step} authMethod={authMethod} />
                <SignInDescription step={step} authMethod={authMethod} />
                {Form}
                {state.step === "credentials" && <SignInAuthMethodButtons activeMethod={authMethod} />}
              </>
            );
          }}
        </SignInForm>
        <SignInFooter />
      </SignIn>
    </CDPReactProvider>
  );
}
```

```tsx lines
function App() {
  // Render a page title based on the current step
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn>
        {(state) => {
           return (
             <>
               <SignInBackButton />
               <SignInImage />
               <h1>
                 {state.step === "credentials" && "Welcome"}
                 {state.step === "verification" && "Almost there"}
               </h1>
               <SignInTitle />
               <SignInDescription />
               <SignInForm />
               {state.step === "credentials" && <SignInAuthMethodButtons activeMethod={state.authMethod} />}
               <SignInFooter />
             </>
           );
         }}
      </SignIn>
    </CDPReactProvider>
  );
}
```

***

### useSignInReducer()

```ts
function useSignInReducer(initialState): [SignInState, ActionDispatch<[SignInAction]>];
```

A reducer hook for the SignIn component.

#### Parameters

| Parameter      | Type                                                                              | Description                         |
| -------------- | --------------------------------------------------------------------------------- | ----------------------------------- |
| `initialState` | [`SignInState`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinstate) | The initial state of the component. |

#### Returns

\[[`SignInState`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinstate), `ActionDispatch`\<\[[`SignInAction`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinaction)]>]

The current state and dispatcher to perform actions on the state.

***

### SignOutButton()

```ts
function SignOutButton(props?): Element;
```

A button that signs the user out.

#### Parameters

| Parameter | Type                                                                                            | Description                  |
| --------- | ----------------------------------------------------------------------------------------------- | ---------------------------- |
| `props?`  | [`SignOutButtonProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signoutbuttonprops) | The props for the component. |

#### Returns

`Element`

The rendered component.

***

### SignInModal()

```ts
function SignInModal(props): Element;
```

A sign-in modal component that wraps the [SignIn](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signin) component.
In the SignIn modal, the description is hidden on the "credentials" step, and the title is hidden on the "verification" step.

#### Parameters

| Parameter | Type                                                                                        | Description                              |
| --------- | ------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `props`   | [`SignInModalProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinmodalprops) | The props for the SignInModal component. |

#### Returns

`Element`

The SignInModalcomponent.

#### Examples

```tsx lines
function App() {
  // Render the SignInModal component
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignInModal />
    </CDPReactProvider>
  );
}
```

```tsx lines
function App() {
  // Render the SignInModal component with a custom trigger button
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignInModal>
        <button className="sign-in-button">
          Sign in with email
        </button>
      </SignInModal>
    </CDPReactProvider>
  );
}
```

***

### ThemeProvider()

```ts
function ThemeProvider(props): Element;
```

Provides the theme to its child components and injects CSS variables.

#### Parameters

| Parameter | Type                                                                                            | Description                  |
| --------- | ----------------------------------------------------------------------------------------------- | ---------------------------- |
| `props`   | [`ThemeProviderProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#themeproviderprops) | The props for the component. |

#### Returns

`Element`

The theme provider component.

#### Example

```tsx lines
const AuthBasedTheme = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn: signedIn } = useIsSignedIn();
  const { evmAddress: cdpEvmAddress } = useEvmAddress();
  const isAuthenticated = signedIn && cdpEvmAddress;
  const theme = useMemo(() => (isAuthenticated ? darkTheme : {}), [isAuthenticated]);
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

function App() {
  // Change the theme based on the user's authentication status
  return (
    <CDPHooksProvider config={cdpConfig}>
      <AuthBasedTheme>
        <YourApp />
      </AuthBasedTheme>
    </CDPHooksProvider>
  );
}
```

***

### useTheme()

```ts
function useTheme(): ThemeContextValue;
```

Hook to access the theme from a component.

#### Returns

[`ThemeContextValue`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#themecontextvalue)

The theme.

#### Example

```tsx lines
function App() {
  // Style a paragraph with the secondary text color
  const { theme } = useTheme();
  return <p style={{ color: theme["colors-fg-muted"] }}>Secondary text</p>;
}
```

***

### flattenTokensObject()

```ts
function flattenTokensObject<T>(tokensObject, cssVarPrefix?): Flattened<T>;
```

Flattens a nested theme object into a single-level object with CSS variable representations.

#### Type Parameters

| Type Parameter                                                                                              |
| ----------------------------------------------------------------------------------------------------------- |
| `T` *extends* [`NestedTokenObject`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#nestedtokenobject) |

#### Parameters

| Parameter       | Type     | Default value | Description                                         |
| --------------- | -------- | ------------- | --------------------------------------------------- |
| `tokensObject`  | `T`      | `undefined`   | The nested tokens object to flatten.                |
| `cssVarPrefix?` | `string` | `"cdp-web"`   | An optional prefix for the generated CSS variables. |

#### Returns

[`Flattened`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#flattened)\<`T`>

A flattened theme object.

***

### themeToCssVariables()

```ts
function themeToCssVariables(theme): CDPWebCSSVariables;
```

Converts a theme object to a CSS variables object for the CDP web component library.

#### Parameters

| Parameter | Type                          | Description                  |
| --------- | ----------------------------- | ---------------------------- |
| `theme`   | `Record`\<`string`, `string`> | The theme object to convert. |

#### Returns

[`CDPWebCSSVariables`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#cdpwebcssvariables)

A CSS variables object.

#### Example

````tsx lines
const themeOverrides: Partial<Theme> = {
  "color-bg-primary": "red",
};

// { "--cdp-web-color-bg-primary": "red" }
const cssVariables = themeToCssVariables(themeOverrides);

***

### IconArrowLeft()

```ts
function IconArrowLeft(props): Element;
````

Arrow Left icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The Arrow Left icon.

#### Example

```tsx lines
// Icon is correctly hidden from screen readers
<p>
  <IconArrowLeft />
  Back
</p>

// Icon with screen-reader accessible label only
<p>
  <IconArrowLeft aria-label="Back" />
</p>
```

***

### IconArrowsUpDown()

```ts
function IconArrowsUpDown(props): Element;
```

Arrows Up/Down icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The Arrow Left icon.

#### Example

```tsx lines
// Icon is correctly hidden from screen readers
<p>
  <IconArrowsUpDown />
  Swap
</p>

// Icon with screen-reader accessible label only
<p>
  <IconArrowsUpDown aria-label="Swap" />
</p>
```

***

### IconCheck()

```ts
function IconCheck(props): Element;
```

Check Circle icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The Check Circle icon.

#### Example

```tsx lines
// Icon is correctly from screen readers
<p>
  <IconCheck />
  Success!
</p>

// Icon with screen-reader accessible label only
<p>
  <IconCheck aria-label="Success" />
</p>
```

***

### IconCheckCircle()

```ts
function IconCheckCircle(props): Element;
```

Check Circle icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The Check Circle icon.

#### Example

```tsx lines
// Icon is correctly from screen readers
<p>
  <IconCheckCircle />
  Success!
</p>

// Icon with screen-reader accessible label only
<p>
  <IconCheckCircle aria-label="Success" />
</p>
```

***

### IconChevronDown()

```ts
function IconChevronDown(props): Element;
```

Chevron down icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The chevron down icon.

#### Example

```tsx lines
// Icon is correctly hidden from screen readers
<p>
  <IconChevronDown />
  Expand
</p>

// Icon with screen-reader accessible label only
<p>
  <IconChevronDown aria-label="Expand" />
</p>
```

***

### IconEnvelope()

```ts
function IconEnvelope(props): Element;
```

Envelope icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The Envelope icon.

#### Example

```tsx lines
// Icon is correctly from screen readers
<p>
  <IconEnvelope />
  Email me a code
</p>

// Icon with screen-reader accessible label only
<p>
  <IconEnvelope aria-label="Email me a code" />
</p>
```

***

### IconExclamationCircle()

```ts
function IconExclamationCircle(props): Element;
```

Exclamation Circle icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The Exclamation Circle icon.

#### Example

```tsx lines
// Icon is correctly from screen readers
<p>
  <IconExclamationCircle />
  Warning!
</p>

// Icon with screen-reader accessible label only
<p>
  <IconExclamationCircle aria-label="Warning" />
</p>
```

***

### IconExclamationTriangle()

```ts
function IconExclamationTriangle(props): Element;
```

Exclamation Triangle icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The Exclamation Triangle icon.

#### Example

```tsx lines
// Icon is correctly hidden from screen readers
<p>
  <IconExclamationTriangle />
  Warning!
</p>

// Icon with screen-reader accessible label only
<p>
  <IconExclamationTriangle aria-label="Warning" />
</p>
```

***

### IconLock()

```ts
function IconLock(props): Element;
```

Lock icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The Lock icon.

#### Example

```tsx lines
// Icon is correctly from screen readers
<p>
  <IconLock />
  Locked
</p>

// Icon with screen-reader accessible label only
<p>
  <IconLock aria-label="locked" />
</p>
```

***

### IconPhone()

```ts
function IconPhone(props): Element;
```

Phone icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The chat bubble icon.

#### Example

```tsx lines
// Icon is correctly from screen readers
<p>
  <IconPhone />
  Text me a code
</p>

// Icon with screen-reader accessible label only
<p>
  <IconPhone aria-label="Text me a code" />
</p>
```

***

### IconXMark()

```ts
function IconXMark(props): Element;
```

Close icon component.

#### Parameters

| Parameter | Type                                               | Description             |
| --------- | -------------------------------------------------- | ----------------------- |
| `props`   | `Omit`\<`SVGProps`\<`SVGSVGElement`>, `"viewBox"`> | The props for the icon. |

#### Returns

`Element`

The Close icon.

#### Example

```tsx lines
// Icon is correctly from screen readers
<p>
  <IconXMark />
  Close
</p>

// Icon with screen-reader accessible label only
<p>
  <IconXMark aria-label="Close" />
</p>
```

***

### clamp()

```ts
function clamp(
   value, 
   min, 
   max): number;
```

Clamp a value between a minimum and maximum value.

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `value`   | `number` | The value to clamp. |
| `min`     | `number` | The minimum value.  |
| `max`     | `number` | The maximum value.  |

#### Returns

`number`

The clamped value.

***

### getMessageFromUnknownError()

```ts
function getMessageFromUnknownError(error, defaultMesasge?): string;
```

Get a message from an unknown error with a fallback in case one is not found.

#### Parameters

| Parameter         | Type      | Default value            | Description                                           |
| ----------------- | --------- | ------------------------ | ----------------------------------------------------- |
| `error`           | `unknown` | `undefined`              | The error to get a message from.                      |
| `defaultMesasge?` | `string`  | `"Something went wrong"` | The default message to return if no message is found. |

#### Returns

`string`

The message from the error.

***

### isApiError()

```ts
function isApiError(error): error is APIError;
```

Type guard to check if the error is an API error.

#### Parameters

| Parameter | Type      | Description         |
| --------- | --------- | ------------------- |
| `error`   | `unknown` | The error to check. |

#### Returns

`error is APIError`

* True if the error is an API error, false otherwise.

#### Example

```tsx lines
try {
  ...
}
catch (error) {
  if (isApiError(error)) {
    // Handle API error
    console.log(error.errorMessage);
  }
}
```

***

### isEmailInvalid()

```ts
function isEmailInvalid(value): boolean;
```

Check if an email address is invalid.

#### Parameters

| Parameter | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `value`   | `string` | The email address to validate. |

#### Returns

`boolean`

`true` if the email address is invalid, `false` otherwise.

#### Example

```tsx lines
if (isEmailInvalid("test@example")) {
  console.log("Invalid email address");
}
```

***

### parseValuesFromPhoneNumber()

```ts
function parseValuesFromPhoneNumber(phoneNumber, countryCode?): PhoneNumber;
```

Parse a phone number into a phone number object.

#### Parameters

| Parameter      | Type          | Description                                     |
| -------------- | ------------- | ----------------------------------------------- |
| `phoneNumber`  | `string`      | The phone number to parse.                      |
| `countryCode?` | `CountryCode` | The country code to parse the phone number for. |

#### Returns

[`PhoneNumber`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#phonenumber)

A phone number object.

***

### Fund()

```ts
function Fund(props): Element;
```

The Fund component.

#### Parameters

| Parameter | Type                                                                          | Description                      |
| --------- | ----------------------------------------------------------------------------- | -------------------------------- |
| `props`   | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops) | The props of the Fund component. |

#### Returns

`Element`

The Fund component.

#### Examples

```tsx lines
// Basic usage
const App = () => {
  const fetchBuyQuote: FundProps["fetchBuyQuote"] = async (params) => {
    // call the buy quote API
  }
  const fetchBuyOptions: FundProps["fetchBuyOptions"] = async params => {
    // call the buy options API
  }
  return (
    <Fund
      country="US"
      subdivision="NY"
      cryptoCurrency="eth"
      fiatCurrency="usd"
      fetchBuyQuote={fetchBuyQuote}
      fetchBuyOptions={fetchBuyOptions}
      network="base"
      presetAmountInputs={[10, 25, 50]}
    />
  )
}
```

```tsx lines
// Example customizing the children to render the title as a page title
// and add a custom error message
const App = () => {
  const fetchBuyQuote: FundProps["fetchBuyQuote"] = async (params) => {
    // call the buy quote API
  }
  const fetchBuyOptions: FundProps["fetchBuyOptions"] = async params => {
    // call the buy options API
  }
  const title = "Buy ETH";
  const titleId = useId();
  const submitLabel = "Purchase now";
  return (
    <Fund
      country="US"
      subdivision="NY"
      cryptoCurrency="eth"
      fiatCurrency="usd"
      fetchBuyQuote={fetchBuyQuote}
      fetchBuyOptions={fetchBuyOptions}
      network="base"
      presetAmountInputs={[10, 25, 50]}
      submitLabel={submitLabel}
      title={title}
    >
      <FundTitle as="h1" id={titleId}>{title}</FundTitle>
      <FundForm aria-labelledby={titleId} submitLabel={submitLabel}>
        {({ view, Content }) => (
          <>
            {Content}
            {view === "error" && <p>Contact support at support@example.com</p>}
          </>
        )}
      </FundForm>
      <FundFooter />
    </Fund>
  )
}
```

***

### FundFooter()

```ts
function FundFooter(props): Element;
```

The FundFooter component.

#### Parameters

| Parameter | Type                                | Description                            |
| --------- | ----------------------------------- | -------------------------------------- |
| `props`   | `HTMLAttributes`\<`HTMLDivElement`> | The props of the FundFooter component. |

#### Returns

`Element`

The FundFooter component.

***

### FundForm()

```ts
function FundForm(props): Element;
```

The FundForm component is a form that allows the user to fund their wallet.

#### Parameters

| Parameter | Type                                                                                  | Description                           |
| --------- | ------------------------------------------------------------------------------------- | ------------------------------------- |
| `props`   | [`FundFormProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundformprops) | The props for the FundForm component. |

#### Returns

`Element`

The FundForm component.

***

### FundTitle()

```ts
function FundTitle(props): Element;
```

The FundTitle component is a component that displays the title of the Fund component.

#### Parameters

| Parameter | Type                                                                                    | Description                            |
| --------- | --------------------------------------------------------------------------------------- | -------------------------------------- |
| `props`   | [`FundTitleProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundtitleprops) | The props for the FundTitle component. |

#### Returns

`Element`

The FundTitle component.

***

### useFundContext()

```ts
function useFundContext(): FundContextType;
```

Get the value of the FundContext.

#### Returns

[`FundContextType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundcontexttype)

* The value of the FundContext.

***

### FundModal()

```ts
function FundModal(props): Element;
```

A fund modal component that wraps the [Fund](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fund) component.

#### Parameters

| Parameter | Type                                                                                    | Description                            |
| --------- | --------------------------------------------------------------------------------------- | -------------------------------------- |
| `props`   | [`FundModalProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundmodalprops) | The props for the FundModal component. |

#### Returns

`Element`

The FundModal component.

#### Examples

```tsx lines
function App() {
  // Render the FundModal component
  const fetchBuyQuote: FundProps["fetchBuyQuote"] = async (params) => {
    // call the buy quote API
  }
  const fetchBuyOptions: FundProps["fetchBuyOptions"] = async params => {
    // call the buy options API
  }
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <FundModal
        country="US"
        subdivision="NY"
        cryptoCurrency="eth"
        fiatCurrency="usd"
        fetchBuyQuote={fetchBuyQuote}
        fetchBuyOptions={fetchBuyOptions}
        network="base"
        presetAmountInputs={[10, 25, 50]}
      />
    </CDPReactProvider>
  );
}
```

```tsx lines
function App() {
  // Render the FundModal component with a custom trigger button
  const fetchBuyQuote: FundProps["fetchBuyQuote"] = async (params) => {
    // call the buy quote API
  }
  const fetchBuyOptions: FundProps["fetchBuyOptions"] = async params => {
    // call the buy options API
  }
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <FundModal
        country="US"
        subdivision="NY"
        cryptoCurrency="eth"
        fiatCurrency="usd"
        fetchBuyQuote={fetchBuyQuote}
        fetchBuyOptions={fetchBuyOptions}
        network="base"
        presetAmountInputs={[10, 25, 50]}
      >
        <button className="fund-button">
          Get ETH
        </button>
      </FundModal>
    </CDPReactProvider>
  );
}
```

***

### SignInAuthMethodButtons()

```ts
function SignInAuthMethodButtons(props): null | Element;
```

The AuthMethodButtons component.

#### Parameters

| Parameter | Type                                                                                                                | Description                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `props`   | [`SignInAuthMethodButtonsProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinauthmethodbuttonsprops) | The props for the AuthMethodButtons component. |

#### Returns

`null` | `Element`

The AuthMethodButtons component.

***

### SignInBackButton()

```ts
function SignInBackButton(props): null | Element;
```

A button to go back to the previous step of the sign-in flow.

#### Parameters

| Parameter | Type                                                                                                  | Description                  |
| --------- | ----------------------------------------------------------------------------------------------------- | ---------------------------- |
| `props`   | [`SignInBackButtonProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinbackbuttonprops) | The props for the component. |

#### Returns

`null` | `Element`

The sign-in back button.

#### Example

```tsx lines
function App() {
  // Customize the back button icon and label
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn>
        <SignInBackButton aria-label="go back">
          <MyCustomIcon />
        </SignInBackButton>
        <SignInImage />
        <SignInTitle />
        <SignInDescription />
        <SignInForm />
        <SignInFooter />
      </SignIn>
    </CDPReactProvider>
  );
}
```

***

### SignInDescription()

```ts
function SignInDescription(props): Element;
```

A description for the SignIn component.

#### Parameters

| Parameter | Type                                                                                                    | Description                  |
| --------- | ------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `props`   | [`SignInDescriptionProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signindescriptionprops) | The props for the component. |

#### Returns

`Element`

The rendered component.

#### Example

```tsx lines
function App() {
  // Render a custom description in the SignIn component
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn>
        <SignInBackButton />
        <SignInImage />
        <SignInTitle />
        <SignInDescription>
          Custom Sign In Description
        </SignInDescription>
        <SignInForm />
        <SignInFooter />
      </SignIn>
    </CDPReactProvider>
  );
}
```

***

### SignInFooter()

```ts
function SignInFooter(props): Element;
```

A footer component for the sign-in flow.

#### Parameters

| Parameter | Type                                | Description                  |
| --------- | ----------------------------------- | ---------------------------- |
| `props`   | `HTMLAttributes`\<`HTMLDivElement`> | The props for the component. |

#### Returns

`Element`

The sign-in footer.

#### Example

```tsx lines
function App() {
  // Add class to the footer
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn>
        <SignInBackButton />
        <SignInImage />
        <SignInTitle />
        <SignInDescription />
        <SignInForm />
        <SignInFooter className="sign-in-footer" />
      </SignIn>
    </CDPReactProvider>
  );
}
```

***

### SignInForm()

```ts
function SignInForm(props): Element;
```

The form for the SignIn component.

#### Parameters

| Parameter | Type                                                                                      | Description          |
| --------- | ----------------------------------------------------------------------------------------- | -------------------- |
| `props`   | [`SignInFormProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinformprops) | The component props. |

#### Returns

`Element`

The rendered component.

#### Example

```tsx lines
function App() {
  // Add div wrapper and class to the form
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn>
        <SignInBackButton />
        <SignInImage />
        <SignInTitle />
        <SignInDescription />
        <div className="sign-in-form-wrapper">
          <SignInForm className="sign-in-form" />
        </div>
        <SignInFooter />
      </SignIn>
    </CDPReactProvider>
  );
}
```

***

### SignInImage()

```ts
function SignInImage(props): null | Element;
```

A logo or success icon for the SignIn component.

#### Parameters

| Parameter | Type                                                                                        | Description                  |
| --------- | ------------------------------------------------------------------------------------------- | ---------------------------- |
| `props`   | [`SignInImageProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signinimageprops) | The props for the component. |

#### Returns

`null` | `Element`

The rendered component.

#### Example

```tsx lines
function App() {
  // Use a different image from your app logo in the SignIn component
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn>
        <SignInBackButton />
        <SignInImage src="https://example.com/image.png" alt="Example Image" />
        <SignInTitle />
        <SignInDescription />
        <SignInForm />
        <SignInFooter />
      </SignIn>
    </CDPReactProvider>
  );
}
```

***

### SignInTitle()

```ts
function SignInTitle(props): Element;
```

A title for the SignIn component.

#### Parameters

| Parameter | Type                                                                                        | Description                  |
| --------- | ------------------------------------------------------------------------------------------- | ---------------------------- |
| `props`   | [`SignInTitleProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#signintitleprops) | The props for the component. |

#### Returns

`Element`

The rendered component.

#### Example

```tsx lines
function App() {
  // Render a custom title in the SignIn component
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn>
        <SignInBackButton />
        <SignInImage />
        <SignInTitle>
          Custom Sign In Title
        </SignInTitle>
        <SignInDescription />
        <SignInForm />
        <SignInFooter />
      </SignIn>
    </CDPReactProvider>
  );
}
```

***

### useSignInContext()

```ts
function useSignInContext(): object;
```

A context for the SignIn component.

#### Returns

`object`

The current state of the SignIn component.

##### state

```ts
state: SignInState;
```

##### dispatch

```ts
dispatch: Dispatch<SignInAction>;
```

#### Example

````tsx lines
function EmailComponent() {
  const { state } = useSignInContext();
  return <div>Submitted email: {state.email}</div>;
}

function App() {
  return (
    <CDPReactProvider config={config} theme={themeOverrides}>
      <SignIn>
        <SignInTitle />
        <SignInDescription />
        <EmailComponent />
        <SignInForm />
      </SignIn>
    </CDPReactProvider>
  );

## Interfaces

### AppConfig

Optional app config to add branding

#### Example

```tsx lines
const appConfig: AppConfig = {
  appName: "My App",
  appLogoUrl: "https://placehold.co/64",
};
````

#### Properties

| Property                                            | Type                      | Description                                                                                        |
| --------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------- |
| <a id="appname" /> `appName?`                       | `string`                  | The name of the app.                                                                               |
| <a id="applogourl" /> `appLogoUrl?`                 | `string`                  | The URL of the app logo. This should be at least 64 by 64px and must start with `http` or `https`. |
| <a id="showcoinbasefooter" /> `showCoinbaseFooter?` | `boolean`                 | Whether to show the "secured by Coinbase" footer. Defaults to `true`.                              |
| <a id="authmethods" /> `authMethods?`               | (`"email"` \| `"sms"`)\[] | Authentication methods to allow for the user. Defaults to `["email"]`.                             |

***

### CDPReactProviderProps

CDPReactProviderProps

#### Properties

| Property                          | Type                                                                                | Description                   |
| --------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------- |
| <a id="config" /> `config`        | [`Config`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#config-1)           | The app configuration         |
| <a id="children" /> `children`    | `ReactNode`                                                                         | The children of the component |
| <a id="classname" /> `className?` | `string`                                                                            | -                             |
| <a id="style" /> `style?`         | `CSSProperties`                                                                     | -                             |
| <a id="theme" /> `theme?`         | `Partial`\<[`Theme`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#theme-3)> | The theme values to override  |

***

### AuthButtonProps

The props for the AuthButton component.

#### Properties

| Property                                                                | Type               | Description                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="closeonsuccessdelay" /> `closeOnSuccessDelay?`                   | `null` \| `number` | The delay in milliseconds before the sign in modal is closed and the sign out button is shown after the sign in is successful. If null, the sign in modal will not be closed automatically. If 0, the sign in modal will be closed immediately. |
| <a id="onsigninsuccess" /> `onSignInSuccess?`                           | () => `void`       | A function to call when the sign in is successful.                                                                                                                                                                                              |
| <a id="onsigninsuccesstransitionend" /> `onSignInSuccessTransitionEnd?` | () => `void`       | A function to call after the sign in success, when the dialog close transition ends.                                                                                                                                                            |
| <a id="onsignoutsuccess" /> `onSignOutSuccess?`                         | () => `void`       | A function to call when the sign out is successful.                                                                                                                                                                                             |

***

### SendEvmTransactionButtonProps

The props for the SendEvmTransactionButton component.

SendEvmTransactionButtonProps

#### Extends

* `Omit`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`>, `"onError"`>

#### Properties

| Property                                | Type                                                                                                                                               | Description                                                          |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| <a id="account" /> `account`            | `` `0x${string}` ``                                                                                                                                | The account to send the transaction from.                            |
| <a id="network" /> `network`            | [`SendEvmTransactionWithEndUserAccountBodyNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendevmtransactionwithenduseraccountbodynetwork) | The network to send the transaction on.                              |
| <a id="onerror" /> `onError?`           | (`error`) => `void`                                                                                                                                | A function to call when the transaction errors.                      |
| <a id="onsuccess" /> `onSuccess?`       | (`hash`) => `void`                                                                                                                                 | A function to call when the transaction is successful.               |
| <a id="pendinglabel" /> `pendingLabel?` | `ReactNode`                                                                                                                                        | The label to show to screen readers when the transaction is pending. |
| <a id="transaction" /> `transaction`    | [`AllowedEvmTransactionType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#allowedevmtransactiontype)                                            | The transaction to send.                                             |
| <a id="variant" /> `variant?`           | [`ButtonVariant`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#buttonvariant)                                                              | The variant of the button.                                           |

***

### SendSolanaTransactionButtonProps

The props for the SendSolanaTransactionButton component.

SendSolanaTransactionButtonProps

#### Extends

* `Omit`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`>, `"onError"`>

#### Properties

| Property                                  | Type                                                                                                                                                     | Description                                                          |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| <a id="account-1" /> `account`            | `string`                                                                                                                                                 | The Solana account to send the transaction from.                     |
| <a id="network-1" /> `network`            | [`SendSolanaTransactionWithEndUserAccountBodyNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendsolanatransactionwithenduseraccountbodynetwork) | The network to send the transaction on.                              |
| <a id="onerror-1" /> `onError?`           | (`error`) => `void`                                                                                                                                      | A function to call when the transaction errors.                      |
| <a id="onsuccess-1" /> `onSuccess?`       | (`signature`) => `void`                                                                                                                                  | A function to call when the transaction is successful.               |
| <a id="pendinglabel-1" /> `pendingLabel?` | `ReactNode`                                                                                                                                              | The label to show to screen readers when the transaction is pending. |
| <a id="transaction-1" /> `transaction`    | `string`                                                                                                                                                 | The base64 encoded transaction to send.                              |
| <a id="variant-1" /> `variant?`           | [`ButtonVariant`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#buttonvariant)                                                                    | The variant of the button.                                           |

***

### SignInProps

Props for the SignIn component

#### Properties

| Property                            | Type                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="children-1" /> `children?`   | `ReactNode` \| (`state`) => `ReactNode` | The children of the component. Leave empty to use the default sign-in flow UI. If a function is provided, it will be called with the current state of the sign-in flow. The function should return a `ReactNode`. **Example** `lines <SignIn> {(state) => { // Render a page title based on the current step return ( <> <SignInBackButton /> <SignInImage /> <h1> {state.step === "credentials" && "Welcome"} {state.step === "verification" && "Almost there"} </h1> <SignInTitle /> <SignInDescription /> <SignInForm /> {state.step === "credentials" && <SignInAuthMethodButtons activeMethod={state.authMethod} />} <SignInFooter /> </> ); }} </SignIn>` |
| <a id="classname-1" /> `className?` | `string`                                | The class name to apply to the component.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <a id="onsuccess-2" /> `onSuccess?` | () => `void`                            | A function to call when the sign-in flow is successful.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

***

### SignInModalProps

Props for the SignInModal component.

#### Properties

| Property                            | Type                | Description                                                                                |
| ----------------------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| <a id="children-2" /> `children?`   | `ReactNode`         | The children to render inside the modal.                                                   |
| <a id="open" /> `open?`             | `boolean`           | Whether the modal is open. Note: if you set this, you must also set `setIsOpen`.           |
| <a id="setisopen" /> `setIsOpen?`   | (`value`) => `void` | A function to set the modal's open state. Note: if you set this, you must also set `open`. |
| <a id="onsuccess-3" /> `onSuccess?` | () => `void`        | A function to call when the sign-in flow is successful.                                    |

***

### ThemeContextValue

The value of the theme context.

#### Properties

| Property                               | Type                                                                                            |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| <a id="theme-1" /> `theme`             | [`Theme`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#theme-3)                         |
| <a id="cssvariables" /> `cssVariables` | [`CDPWebCSSVariables`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#cdpwebcssvariables) |

***

### PhoneNumber

A phone number object.

#### Properties

| Property                 | Type     | Description                                                                    |
| ------------------------ | -------- | ------------------------------------------------------------------------------ |
| <a id="value" /> `value` | `string` | The phone number in the national format (country calling code is not included) |
| <a id="e164" /> `e164`   | `string` | The phone number in international format (E.164). Typically used in API calls. |

***

### FetchBuyUrlParams

The params for the fetchBuyUrl function.

#### Properties

| Property                                 | Type     |
| ---------------------------------------- | -------- |
| <a id="paymentmethod" /> `paymentMethod` | `string` |
| <a id="paymentamount" /> `paymentAmount` | `number` |

***

### FundFormProps

The props for the FundForm component.

#### Extends

* `Omit`\<`FormHTMLAttributes`\<`HTMLFormElement`>, `"children"`>

#### Properties

| Property                                                              | Type                      |
| --------------------------------------------------------------------- | ------------------------- |
| <a id="children-3" /> `children?`                                     | (`params`) => `ReactNode` |
| <a id="openin" /> `openIn?`                                           | `"tab"` \| `"popup"`      |
| <a id="submitlabel" /> `submitLabel?`                                 | `ReactNode`               |
| <a id="onpopupopen" /> `onPopupOpen?`                                 | (`popup`) => `void`       |
| <a id="onpopupclose" /> `onPopupClose?`                               | () => `void`              |
| <a id="unmountontransactionerror" /> `unmountOnTransactionError?`     | `boolean`                 |
| <a id="unmountontransactionsuccess" /> `unmountOnTransactionSuccess?` | `boolean`                 |
| <a id="unmount" /> `unmount?`                                         | () => `void`              |

***

### FundPaymentMethod

A payment method for the fund component.

#### Properties

| Property                             | Type        |
| ------------------------------------ | ----------- |
| <a id="id" /> `id`                   | `string`    |
| <a id="name" /> `name`               | `string`    |
| <a id="description" /> `description` | `string`    |
| <a id="icon" /> `icon`               | `ReactNode` |
| <a id="minamount" /> `minAmount?`    | `number`    |
| <a id="maxamount" /> `maxAmount?`    | `number`    |

***

### FundProps

All the props for the Fund component.

#### Extends

* [`FundStateProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundstateprops).`FundLifecycleEvents`

#### Extended by

* [`FundModalProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundmodalprops)

#### Properties

| Property                                              | Type                                                                                                    | Inherited from                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| <a id="children-4" /> `children?`                     | `ReactNode` \| (`state`) => `ReactNode`                                                                 | -                                    |
| <a id="classname-2" /> `className?`                   | `string`                                                                                                | -                                    |
| <a id="fetchbuyoptions" /> `fetchBuyOptions`          | [`FetchBuyOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fetchbuyoptions-2)             | -                                    |
| <a id="fetchbuyquote" /> `fetchBuyQuote`              | [`FetchBuyQuote`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fetchbuyquote-2)                 | -                                    |
| <a id="inputtype" /> `inputType?`                     | [`InputType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#inputtype-2)                         | -                                    |
| <a id="openin-1" /> `openIn?`                         | `"tab"` \| `"popup"`                                                                                    | -                                    |
| <a id="redirecturl" /> `redirectUrl?`                 | `string`                                                                                                | -                                    |
| <a id="submitlabel-1" /> `submitLabel?`               | `ReactNode`                                                                                             | -                                    |
| <a id="title" /> `title?`                             | `ReactNode`                                                                                             | -                                    |
| <a id="country" /> `country`                          | `string`                                                                                                | `FundStateProps.country`             |
| <a id="locale" /> `locale?`                           | `string`                                                                                                | `FundStateProps.locale`              |
| <a id="cryptodecimalplaces" /> `cryptoDecimalPlaces?` | `number`                                                                                                | `FundStateProps.cryptoDecimalPlaces` |
| <a id="cryptocurrency" /> `cryptoCurrency`            | `string`                                                                                                | `FundStateProps.cryptoCurrency`      |
| <a id="fiatcurrency" /> `fiatCurrency`                | `string`                                                                                                | `FundStateProps.fiatCurrency`        |
| <a id="fiatdecimalplaces" /> `fiatDecimalPlaces?`     | `number`                                                                                                | `FundStateProps.fiatDecimalPlaces`   |
| <a id="network-2" /> `network`                        | `string`                                                                                                | `FundStateProps.network`             |
| <a id="presetamountinputs" /> `presetAmountInputs?`   | [`FundPresetAmountInputs`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundpresetamountinputs) | `FundStateProps.presetAmountInputs`  |
| <a id="subdivision" /> `subdivision?`                 | `string`                                                                                                | `FundStateProps.subdivision`         |
| <a id="destinationaddress" /> `destinationAddress`    | `string`                                                                                                | `FundStateProps.destinationAddress`  |
| <a id="onerror-2" /> `onError?`                       | (`e`) => `void`                                                                                         | `FundLifecycleEvents.onError`        |
| <a id="onstatus" /> `onStatus?`                       | (`lifecycleStatus`) => `void`                                                                           | `FundLifecycleEvents.onStatus`       |
| <a id="onsuccess-4" /> `onSuccess?`                   | (`result?`) => `void`                                                                                   | `FundLifecycleEvents.onSuccess`      |

***

### FundState

The state of the Fund component.

#### Properties

| Property                                                      | Type                                                                                                    |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| <a id="country-1" /> `country`                                | `string`                                                                                                |
| <a id="cryptoamount" /> `cryptoAmount?`                       | `number`                                                                                                |
| <a id="cryptocurrency-1" /> `cryptoCurrency`                  | `string`                                                                                                |
| <a id="cryptodecimalplaces-1" /> `cryptoDecimalPlaces?`       | `number`                                                                                                |
| <a id="exchangerate" /> `exchangeRate?`                       | `number`                                                                                                |
| <a id="exchangerateerror" /> `exchangeRateError?`             | \| `null` \| [`FundStateError`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundstateerror)    |
| <a id="isexchangeratepending" /> `isExchangeRatePending?`     | `boolean`                                                                                               |
| <a id="ispaymentmethodspending" /> `isPaymentMethodsPending?` | `boolean`                                                                                               |
| <a id="fiatamount" /> `fiatAmount?`                           | `number`                                                                                                |
| <a id="fiatcurrency-1" /> `fiatCurrency`                      | `string`                                                                                                |
| <a id="fiatdecimalplaces-1" /> `fiatDecimalPlaces?`           | `number`                                                                                                |
| <a id="locale-1" /> `locale?`                                 | `string`                                                                                                |
| <a id="network-3" /> `network`                                | `string`                                                                                                |
| <a id="paymentmethods" /> `paymentMethods?`                   | [`FundPaymentMethod`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundpaymentmethod)\[]        |
| <a id="paymentmethodserror" /> `paymentMethodsError?`         | \| `null` \| [`FundStateError`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundstateerror)    |
| <a id="presetamountinputs-1" /> `presetAmountInputs?`         | [`FundPresetAmountInputs`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundpresetamountinputs) |
| <a id="selectedinputtype" /> `selectedInputType`              | [`InputType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#inputtype-2)                         |
| <a id="selectedpaymentmethod" /> `selectedPaymentMethod?`     | [`FundPaymentMethod`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundpaymentmethod)           |
| <a id="subdivision-1" /> `subdivision?`                       | `string`                                                                                                |
| <a id="transactionstatus" /> `transactionStatus`              | [`FundLifecycleStatus`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundlifecyclestatus)       |
| <a id="destinationaddress-1" /> `destinationAddress`          | `string`                                                                                                |

***

### FundTitleProps

The props for the FundTitle component.

#### Extends

* `HTMLAttributes`\<`HTMLDivElement`>

#### Properties

| Property            | Type          |
| ------------------- | ------------- |
| <a id="as" /> `as?` | `ElementType` |

***

### OnrampError

An error that occurred during the onramp process.

#### Properties

| Property                                | Type                                                                              |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| <a id="errortype" /> `errorType`        | `"internal_error"` \| `"handled_error"` \| `"network_error"` \| `"unknown_error"` |
| <a id="code" /> `code?`                 | `string`                                                                          |
| <a id="debugmessage" /> `debugMessage?` | `string`                                                                          |

***

### FundModalProps

All the props for the Fund component.

#### Extends

* [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops)

#### Properties

| Property                                                | Type                                                                                                    | Description                                                                                | Overrides                                                                                                                                                   | Inherited from                                                                                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="children-5" /> `children?`                       | `ReactNode`                                                                                             | The children to render inside the modal.                                                   | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`children`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#children-4) | -                                                                                                                                                                               |
| <a id="open-1" /> `open?`                               | `boolean`                                                                                               | Whether the modal is open. Note: if you set this, you must also set `setIsOpen`.           | -                                                                                                                                                           | -                                                                                                                                                                               |
| <a id="setisopen-1" /> `setIsOpen?`                     | (`value`) => `void`                                                                                     | A function to set the modal's open state. Note: if you set this, you must also set `open`. | -                                                                                                                                                           | -                                                                                                                                                                               |
| <a id="classname-3" /> `className?`                     | `string`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`className`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#classname-2)                   |
| <a id="fetchbuyoptions-1" /> `fetchBuyOptions`          | [`FetchBuyOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fetchbuyoptions-2)             | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`fetchBuyOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fetchbuyoptions)         |
| <a id="fetchbuyquote-1" /> `fetchBuyQuote`              | [`FetchBuyQuote`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fetchbuyquote-2)                 | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`fetchBuyQuote`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fetchbuyquote)             |
| <a id="inputtype-1" /> `inputType?`                     | [`InputType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#inputtype-2)                         | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`inputType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#inputtype)                     |
| <a id="openin-2" /> `openIn?`                           | `"tab"` \| `"popup"`                                                                                    | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`openIn`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#openin-1)                         |
| <a id="redirecturl-1" /> `redirectUrl?`                 | `string`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`redirectUrl`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#redirecturl)                 |
| <a id="submitlabel-2" /> `submitLabel?`                 | `ReactNode`                                                                                             | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`submitLabel`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#submitlabel-1)               |
| <a id="title-1" /> `title?`                             | `ReactNode`                                                                                             | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`title`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#title)                             |
| <a id="country-2" /> `country`                          | `string`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`country`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#country)                         |
| <a id="locale-2" /> `locale?`                           | `string`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`locale`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#locale)                           |
| <a id="cryptodecimalplaces-2" /> `cryptoDecimalPlaces?` | `number`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`cryptoDecimalPlaces`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#cryptodecimalplaces) |
| <a id="cryptocurrency-2" /> `cryptoCurrency`            | `string`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`cryptoCurrency`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#cryptocurrency)           |
| <a id="fiatcurrency-2" /> `fiatCurrency`                | `string`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`fiatCurrency`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fiatcurrency)               |
| <a id="fiatdecimalplaces-2" /> `fiatDecimalPlaces?`     | `number`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`fiatDecimalPlaces`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fiatdecimalplaces)     |
| <a id="network-4" /> `network`                          | `string`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`network`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#network-2)                       |
| <a id="presetamountinputs-2" /> `presetAmountInputs?`   | [`FundPresetAmountInputs`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundpresetamountinputs) | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`presetAmountInputs`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#presetamountinputs)   |
| <a id="subdivision-2" /> `subdivision?`                 | `string`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`subdivision`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#subdivision)                 |
| <a id="destinationaddress-2" /> `destinationAddress`    | `string`                                                                                                | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`destinationAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#destinationaddress)   |
| <a id="onerror-3" /> `onError?`                         | (`e`) => `void`                                                                                         | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`onError`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onerror-2)                       |
| <a id="onstatus-1" /> `onStatus?`                       | (`lifecycleStatus`) => `void`                                                                           | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`onStatus`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onstatus)                       |
| <a id="onsuccess-5" /> `onSuccess?`                     | (`result?`) => `void`                                                                                   | -                                                                                          | -                                                                                                                                                           | [`FundProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundprops).[`onSuccess`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onsuccess-4)                   |

***

### SignInAuthMethodButtonsProps

The props for the AuthMethodButtons component.

#### Properties

| Property                                | Type                 | Description             |
| --------------------------------------- | -------------------- | ----------------------- |
| <a id="activemethod" /> `activeMethod?` | `"email"` \| `"sms"` | The active auth method. |

***

### SignInBackButtonProps

A button to go back to the previous step of the sign-in flow.

#### Extends

* `HTMLAttributes`\<`HTMLButtonElement`>

#### Properties

| Property                        | Type                                                                                  | Description                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| <a id="step" /> `step?`         | `"credentials"` \| `"verification"`                                                   | If set, will render the back button for this step of the sign in flow, regardless of the context value. |
| <a id="size" /> `size?`         | [`ButtonSize`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#buttonsize)       | The size of the button.                                                                                 |
| <a id="variant-2" /> `variant?` | [`ButtonVariant`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#buttonvariant) | The variant of the button.                                                                              |

***

### SignInDescriptionProps

The props for the SignInDescription component.

#### Extends

* `SignInTitleAndDescriptionProps`.`HTMLAttributes`\<`HTMLElement`>

#### Properties

| Property                            | Type                                | Description                                                                                       | Inherited from                              |
| ----------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| <a id="as-1" /> `as?`               | `ElementType`                       | The element type to render the description as.                                                    | -                                           |
| <a id="authmethod" /> `authMethod?` | `"email"` \| `"sms"`                | The auth method to render the title for.                                                          | `SignInTitleAndDescriptionProps.authMethod` |
| <a id="step-1" /> `step?`           | `"credentials"` \| `"verification"` | If set, will render the title for this step of the sign in flow, regardless of the context value. | `SignInTitleAndDescriptionProps.step`       |

***

### SignInFormProps

Props for the SignInForm component.

#### Extends

* `Omit`\<`HTMLAttributes`\<`HTMLElement`>, `"children"`>

#### Properties

| Property                            | Type                                | Description                                                                                      |
| ----------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| <a id="as-2" /> `as?`               | `ElementType`                       | The element type to render the form as.                                                          |
| <a id="onsuccess-6" /> `onSuccess?` | () => `void`                        | The function to call when the sign in is successful.                                             |
| <a id="step-2" /> `step?`           | `"credentials"` \| `"verification"` | If set, will render the form for this step of the sign in flow, regardless of the context value. |
| <a id="children-6" /> `children?`   | (`props`) => `ReactNode`            | The children of the component.                                                                   |

***

### SignInImageProps

Props for the SignInImage component.

#### Properties

| Property                            | Type     | Description                                                 |
| ----------------------------------- | -------- | ----------------------------------------------------------- |
| <a id="classname-4" /> `className?` | `string` | The class name to apply to the component.                   |
| <a id="alt" /> `alt?`               | `string` | The alt text for the image.                                 |
| <a id="src" /> `src?`               | `string` | The source URL for the image. Uses the app logo by default. |

***

### SignInTitleProps

The props for the SignInTitle component.

#### Extends

* `SignInTitleAndDescriptionProps`.`HTMLAttributes`\<`HTMLElement`>

#### Properties

| Property                              | Type                                | Description                                                                                       | Inherited from                              |
| ------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| <a id="as-3" /> `as?`                 | `ElementType`                       | The element type to render the title as.                                                          | -                                           |
| <a id="authmethod-1" /> `authMethod?` | `"email"` \| `"sms"`                | The auth method to render the title for.                                                          | `SignInTitleAndDescriptionProps.authMethod` |
| <a id="step-3" /> `step?`             | `"credentials"` \| `"verification"` | If set, will render the title for this step of the sign in flow, regardless of the context value. | `SignInTitleAndDescriptionProps.step`       |

***

### SignInState

The state of the SignIn component.

#### Properties

| Property                               | Type                                                                                          | Description                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| <a id="authmethod-2" /> `authMethod`   | `"email"` \| `"sms"`                                                                          | The auth method selected by the user.    |
| <a id="canresetotp" /> `canResetOTP`   | `boolean`                                                                                     | Whether the user can request a new OTP.  |
| <a id="email" /> `email`               | `string`                                                                                      | The email address of the user.           |
| <a id="error" /> `error`               | \| `null` \| `string` \| [`APIError`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#apierror) | The error message or APIError object.    |
| <a id="flowid" /> `flowId`             | `string`                                                                                      | The flow ID of the current sign-in flow. |
| <a id="ispending" /> `isPending`       | `boolean`                                                                                     | Whether the form state is pending.       |
| <a id="issuccess" /> `isSuccess`       | `boolean`                                                                                     | Whether the sign-in flow is successful.  |
| <a id="otp" /> `otp`                   | `string`                                                                                      | The OTP code entered by the user.        |
| <a id="phonenumber-1" /> `phoneNumber` | `string`                                                                                      | The phone number of the user.            |
| <a id="step-4" /> `step`               | `"credentials"` \| `"verification"`                                                           | The current step of the sign-in flow.    |

## Type Aliases

### AuthMethod

```ts
type AuthMethod = typeof AUTH_METHODS[number];
```

The auth method type.

***

### Config

```ts
type Config = AppConfig & CDPHooksConfig;
```

The CDP hooks provider config combined with the app config.

***

### SignOutButtonProps

```ts
type SignOutButtonProps = object;
```

Props for the SignOutButton component.

#### Param

The children to render inside the button.

#### Param

A function to call when the sign-out is successful.

#### Param

The variant of the button.

#### Properties

| Property                            | Type                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| <a id="children-7" /> `children?`   | `ReactNode`                                                                           |
| <a id="onsuccess-7" /> `onSuccess?` | () => `void`                                                                          |
| <a id="variant-3" /> `variant?`     | [`ButtonVariant`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#buttonvariant) |

***

### ThemeProviderProps

```ts
type ThemeProviderProps = object;
```

Props for the ThemeProvider component.

#### Properties

| Property                            | Type                                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| <a id="children-8" /> `children`    | `ReactNode`                                                                         |
| <a id="classname-5" /> `className?` | `string`                                                                            |
| <a id="style-1" /> `style?`         | `CSSProperties`                                                                     |
| <a id="theme-2" /> `theme?`         | `Partial`\<[`Theme`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#theme-3)> |

***

### SemanticColors

```ts
type SemanticColors = Flattened<{
  colors: typeof colorsSemantic;
}>;
```

Semantic colors are the base colors for the theme.

They are typically not used directly in the components, but are used to define the base colors
for the components.

#### Example

```tsx lines
const theme: Partial<SemanticColors> = {
  "colors-bg-default": "#ffffff",
  "colors-bg-alternate": "#eef0f3",
  "colors-bg-overlay": "color(from var(--cdp-web-colors-bg-alternate) srgb r g b / 0.33)",
};
```

#### See

* [colorsSemantic](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#colorssemantic) for the default token values
* [ComponentColors](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#componentcolors) for the component colors that inherit from the SemanticColors

***

### ComponentColors

```ts
type ComponentColors = Flattened<{
  colors: typeof colorsComponents;
}>;
```

Component colors are the colors for the individual UI components.
They inherit values from the SemanticColors via CSS variables.

#### Example

```tsx lines
const theme: Partial<ComponentColors> = {
  "colors-cta-primary-bg-default": "var(--cdp-web-colors-bg-primary)",
};
```

#### See

* [colorsComponents](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#colorscomponents) for the default token values
* [SemanticColors](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#semanticcolors) for the semantic colors that the component colors inherit from

***

### ColorTokens

```ts
type ColorTokens = SemanticColors & ComponentColors;
```

Defines all the colors in the theme.

To fully change the theme, you only need to define the [SemanticColors](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#semanticcolors), and the rest of the values
will inherit from them. For more granular control, individual [ComponentColors](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#componentcolors) can be overridden.

For example, the `colors-bg-primary` semantic color is used to define the background color for
a "primary" variant component. The `colors-cta-primary-bg-default` component color inherits
from the `colors-bg-primary` semantic color via CSS variables.

If you want to override the just the default background color of the primary cta, you can do so
by defining the `colors-cta-primary-bg-default` token in the theme.

#### Example

```tsx lines
// Change the primary background color to teal but make the primary cta button black
const theme: Partial<Theme> = {
  "colors-bg-primary": "teal",
  "colors-cta-primary-bg-default": "black",
};
```

***

### SemanticFonts

```ts
type SemanticFonts = Flattened<{
  font: typeof fontSemantic;
}>;
```

Semantic fonts are the base fonts for the theme.

They are typically not used directly in the components, but are used to define the base fonts
for the components. Semantic fonts are defined based on their context (i.e. body, interactive).

#### Example

```tsx lines
const theme: Partial<SemanticFonts> = {
  "font-family-interactive": "var(--cdp-web-font-family-mono)", // Change the font for interactive elements to monospace font
};
```

#### See

* [fontSemantic](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fontsemantic) for the default token values
* [ComponentFonts](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#componentfonts) for the component fonts that inherit from the SemanticFonts

***

### ComponentFonts

```ts
type ComponentFonts = Flattened<{
  font: typeof fontComponents;
}>;
```

Component fonts are the fonts for the individual UI components.
They inherit values from the SemanticFonts via CSS variables.

#### Example

```tsx lines
const theme: Partial<ComponentFonts> = {
  "font-family-cta": "var(--cdp-web-font-family-mono)", // Change the font for ctas to monospace font
};
```

#### See

* [fontComponents](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fontcomponents) for the default token values
* [SemanticFonts](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#semanticfonts) for the semantic fonts that the component fonts inherit from

***

### FontTokens

```ts
type FontTokens = SemanticFonts & ComponentFonts;
```

Defines all the fonts in the theme.

To fully change the theme, you only need to define the [SemanticFonts](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#semanticfonts), and the rest of the values
will inherit from them. For more granular control, individual [ComponentFonts](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#componentfonts) can be overridden.

For example, the `font-family-interactive` semantic font is used to define the default font
for interactive elements. The `font-family-cta` component font inherits
from the `font-family-interactive` semantic font via CSS variables.

If you want to override the just the default CTA font, you can do so
by defining the `font-family-cta` token in the theme.

#### Example

```tsx lines
const fontTokens: Partial<FontTokens> = {
  "font-family-mono": "'Source Code Pro', monospace",   // Change the default monospace font
  "font-family-cta": "var(--cdp-web-font-family-mono)", // Make buttons use the default monospace font
};
```

#### See

[font](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#font) for the default token values

***

### SemanticBorderRadius

```ts
type SemanticBorderRadius = Flattened<{
  borderRadius: typeof borderRadiusSemantic;
}>;
```

Semantic border radii are the base border radius definitions for the theme.

They are typically not used directly in the components, but are used to define the border radius
for the components. Semantic border radius values are defined in a scale (none, xs - xl, full).

The default values are derived from the base font size using calc(). This is to mimic the way
rems function but instead of using the font-size applied to the root document, it uses the
base font size provided by the theme. Rems can be used, but it's recommended to set the base font
size to a value that uses rems as well (most applications will use 16px or 1rem).

#### Example

```tsx lines
const theme: Partial<SemanticBorderRadius> = {
  "border-radius-lg": "1.5rem", // make sure to set base font size to a rem value if you use rems
  "border-radius-xl": "2rem",
};
```

#### See

* [borderRadiusSemantic](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#borderradiussemantic) for the default semantic border radius token values
* [ComponentBorderRadius](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#componentborderradius) for the component border radius values that inherit from the SemanticBorderRadius

***

### ComponentBorderRadius

```ts
type ComponentBorderRadius = Flattened<{
  borderRadius: typeof borderRadiusComponents;
}>;
```

Component border radii are the border radius values for the individual UI components.
They inherit values from the SemanticBorderRadius via CSS variables.

#### Example

```tsx lines
const theme: Partial<ComponentBorderRadius> = {
  "border-radius-cta": "var(--cdp-web-border-radius-none)", // Remove border radius for ctas only
};
```

#### See

* [borderRadiusComponents](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#borderradiuscomponents) for the default token values
* [SemanticBorderRadius](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#semanticborderradius) for the semantic border radius values that the component border radius values inherit from

***

### BorderRadiusTokens

```ts
type BorderRadiusTokens = SemanticBorderRadius & ComponentBorderRadius;
```

Defines all the border radius values in the theme.

To change the border radius scale, you can override the [SemanticBorderRadius](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#semanticborderradius) values, and the rest of the values
will inherit from them. For more granular control, individual [ComponentBorderRadius](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#componentborderradius) can be overridden.

For example, the `borderRadius-sm` semantic border radius is used to define a small amount of border radius.
The `borderRadius-input` and `borderRadius-modal` component values inherit from the `borderRadius-sm` semantic
border radius via CSS variables.

If you want to override the just the default modal border radius, you can do so
by defining the `borderRadius-modal` token in the theme.

#### See

[borderRadius](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#borderradius) for the default token values

***

### Theme

```ts
type Theme = ColorTokens & FontTokens & BorderRadiusTokens;
```

The theme is a flattened tokens object with values appropriate for web environments
(i.e. CSS properties & CSS Variables).

It DOES NOT include the namespace (`--cdp-web-`) in the keys.

***

### ButtonVariant

```ts
type ButtonVariant = 
  | "primary"
  | "secondary"
  | "linkPrimary"
  | "linkSecondary"
  | "transparentPrimary"
  | "transparentSecondary"
  | "control";
```

The variant of a button.

***

### Size

```ts
type Size = "lg" | "md" | "sm" | "xs";
```

Base sizes for the theme.

***

### ButtonSize

```ts
type ButtonSize = 
  | Size
  | "none";
```

The size of a button.

***

### InputSize

```ts
type InputSize = Size;
```

The size of a form input.

***

### Tokens

```ts
type Tokens = typeof tokens;
```

All design tokens.

***

### KebabCasePaths\<T>

```ts
type KebabCasePaths<T> = T extends Record<string, unknown> ? { [K in keyof T]: T[K] extends { value: unknown } ? K & string : T[K] extends Record<string, unknown> ? `${K & string}-${KebabCasePaths<T[K]> & string}` : K & string }[keyof T] : never;
```

A type that recursively converts a nested object to a flattened object with kebab-case keys.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Example

```ts
type MyObject = {
  a: {
    b: {
      cKey: string;
    };
  };
};

type Flattened = Flattened<MyObject>;
// { 'a-b-cKey': string }
```

***

### Flattened\<T>

```ts
type Flattened<T> = { [K in KebabCasePaths<T>]: string };
```

A flattened representation of the Tokens type, where keys are
kebab-cased paths and all values are strings.

#### Type Parameters

| Type Parameter                               |
| -------------------------------------------- |
| `T` *extends* `Record`\<`string`, `unknown`> |

#### Example

```ts
const themeOverrides: Partial<Flattened<typeof tokens>> = {
  'colors-brand-primary': string;
  'fontFamily-sans': string;
}
```

***

### TokenValue

```ts
type TokenValue = object;
```

Represents a single theme value, which can be a direct value or a reference with modifications.

#### Properties

| Property                    | Type                                                                                                                                                                                                                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="value-1" /> `value`  | `string` \| `number`                                                                                                                                                                                                                                                                                        |
| <a id="modify" /> `modify?` | \| \{ `type`: `"color-alpha"`; `value`: `number` \| `string`; } \| \{ `type`: `"color-hsl"`; `value`: \[`number`, `number`, `number`]; } \| \{ `type`: `"color-mix"`; `value`: `ReadonlyArray`\<`string` \| readonly \[`string`, `string`]>; } \| \{ `type`: `"multiply"`; `value`: `number` \| `string`; } |

***

### NestedTokenObject

```ts
type NestedTokenObject = object;
```

Represents a nested structure of theme values.

#### Index Signature

```ts
[key: string]: 
  | TokenValue
  | NestedTokenObject
```

***

### CDPWebCSSVariables

```ts
type CDPWebCSSVariables = object;
```

CSS variables for the CDP web component library.

#### Index Signature

```ts
[key: `--cdp-web-${string}`]: string
```

***

### CamelToSnakeCase\<T>

```ts
type CamelToSnakeCase<T> = T extends `${infer A}${infer B}` ? B extends Uncapitalize<B> ? `${A}${CamelToSnakeCase<B>}` : `${Uncapitalize<A>}_${CamelToSnakeCase<Uncapitalize<B>>}` : T;
```

Convert a camel case string to a snake case string

#### Type Parameters

| Type Parameter         |
| ---------------------- |
| `T` *extends* `string` |

***

### CamelToSnakeCaseNested\<T>

```ts
type CamelToSnakeCaseNested<T> = T extends readonly any[] ? T : T extends object ? { [K in keyof T as K extends string ? CamelToSnakeCase<K> : K]: CamelToSnakeCaseNested<T[K]> } : T;
```

Convert a camel case object to a snake case object

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

***

### FundAction

```ts
type FundAction = 
  | {
  type: "SET_FIELD";
  payload: { [K in keyof FundState]: { field: K; value: FundState[K] } }[keyof FundState];
}
  | {
  type: "SET_AMOUNTS";
  payload: {
     cryptoAmount: number;
     fiatAmount: number;
  };
}
  | {
  type: "FETCH_EXCHANGE_RATE";
}
  | {
  type: "SET_EXCHANGE_RATE_SUCCESS";
  payload: {
     exchangeRate: number | undefined;
  };
}
  | {
  type: "SET_EXCHANGE_RATE_ERROR";
  payload: {
     error: Partial<NonNullable<FundState["exchangeRateError"]>>;
  };
}
  | {
  type: "FETCH_PAYMENT_METHODS";
}
  | {
  type: "SET_PAYMENT_METHODS_SUCCESS";
  payload: {
     paymentMethods: FundPaymentMethod[];
  };
}
  | {
  type: "SET_PAYMENT_METHODS_ERROR";
  payload: {
     error: Partial<NonNullable<FundState["paymentMethodsError"]>>;
  };
}
  | {
  type: "SET_TRANSACTION_STATUS";
  payload: {
     transactionStatus: FundLifecycleStatus;
  };
}
  | {
  type: "SYNC_WITH_PROPS";
  payload: FundStateProps;
};
```

The actions that can be dispatched to the Fund component.

***

### FetchBuyOptions()

```ts
type FetchBuyOptions = (params) => Promise<OnrampBuyOptionsResponse>;
```

Get Buy Options function (used for building list of payment methods)

#### Parameters

| Parameter             | Type                                                |
| --------------------- | --------------------------------------------------- |
| `params`              | \{ `country`: `string`; `subdivision?`: `string`; } |
| `params.country`      | `string`                                            |
| `params.subdivision?` | `string`                                            |

#### Returns

`Promise`\<[`OnrampBuyOptionsResponse`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onrampbuyoptionsresponse)>

***

### FetchBuyQuote()

```ts
type FetchBuyQuote = (params) => Promise<OnrampBuyQuoteResponse>;
```

Get Buy Quote function (used for fetching the exchange rate and building the buy url)

#### Parameters

| Parameter                   | Type                                                                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`                    | \{ `destinationAddress`: `string`; `purchaseCurrency`: `string`; `purchaseNetwork`: `string`; `paymentAmount`: `string`; `paymentCurrency`: `string`; `paymentMethod`: `string`; `country`: `string`; `subdivision?`: `string`; } |
| `params.destinationAddress` | `string`                                                                                                                                                                                                                          |
| `params.purchaseCurrency`   | `string`                                                                                                                                                                                                                          |
| `params.purchaseNetwork`    | `string`                                                                                                                                                                                                                          |
| `params.paymentAmount`      | `string`                                                                                                                                                                                                                          |
| `params.paymentCurrency`    | `string`                                                                                                                                                                                                                          |
| `params.paymentMethod`      | `string`                                                                                                                                                                                                                          |
| `params.country`            | `string`                                                                                                                                                                                                                          |
| `params.subdivision?`       | `string`                                                                                                                                                                                                                          |

#### Returns

`Promise`\<[`OnrampBuyQuoteResponse`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onrampbuyquoteresponse)>

***

### FundContextType

```ts
type FundContextType = object;
```

The context type for the Fund component.

#### Properties

| Property                             | Type                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------- |
| <a id="state" /> `state`             | [`FundState`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundstate)                |
| <a id="dispatch" /> `dispatch`       | `Dispatch`\<[`FundAction`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#fundaction)> |
| <a id="fetchbuyurl" /> `fetchBuyUrl` | (`params`, `onError?`) => `Promise`\<`string`>                                               |

***

### FundLifecycleStatus

```ts
type FundLifecycleStatus = 
  | {
  statusName: "init";
  statusData: null;
}
  | {
  statusName: "exit";
  statusData: null;
}
  | {
  statusName: "error";
  statusData: OnrampError;
}
  | {
  statusName: "transactionSubmitted";
  statusData: null;
}
  | {
  statusName: "transactionSuccess";
  statusData:   | OnrampSuccessEventData
     | null;
}
  | {
  statusName: "transactionPending";
  statusData: null;
};
```

The lifecycle statuses of the Fund component.

***

### FundPresetAmountInputs

```ts
type FundPresetAmountInputs = readonly [number, number, number];
```

Present amounts for the fund component.

***

### FundStateError

```ts
type FundStateError = object;
```

The type for an error that may get displayed in the UI.

#### Properties

| Property                     | Type     |
| ---------------------------- | -------- |
| <a id="code-1" /> `code`     | `string` |
| <a id="message" /> `message` | `string` |

***

### FundStateProps

```ts
type FundStateProps = Pick<FundState, 
  | "country"
  | "cryptoCurrency"
  | "cryptoDecimalPlaces"
  | "fiatCurrency"
  | "fiatDecimalPlaces"
  | "locale"
  | "network"
  | "presetAmountInputs"
  | "subdivision"
| "destinationAddress">;
```

Props from the Fund component that are used in the FundState.

***

### InputType

```ts
type InputType = "crypto" | "fiat";
```

The type of input (crypto or fiat)

***

### OnrampAmount

```ts
type OnrampAmount = object;
```

Onramp Amount

#### Properties

| Property                       | Type     |
| ------------------------------ | -------- |
| <a id="value-2" /> `value`     | `string` |
| <a id="currency" /> `currency` | `string` |

***

### OnrampBuyQuoteResponse

```ts
type OnrampBuyQuoteResponse = object;
```

The response from the Onramp Buy Quote API

#### Properties

| Property                                     | Type                                                                                | Description                                                                                                                                                                                                                          |
| -------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="paymenttotal" /> `paymentTotal`       | [`OnrampAmount`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onrampamount) | Object with amount and currency of the total fiat payment required to complete the purchase, inclusive of any fees. The currency will match the `paymentCurrency` in the request if it is supported, otherwise it falls back to USD. |
| <a id="paymentsubtotal" /> `paymentSubtotal` | [`OnrampAmount`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onrampamount) | Object with amount and currency of the fiat cost of the crypto asset to be purchased, exclusive of any fees. The currency will match the `paymentCurrency`.                                                                          |
| <a id="purchaseamount" /> `purchaseAmount`   | [`OnrampAmount`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onrampamount) | Object with amount and currency of the crypto that to be purchased. The currency will match the `purchaseCurrency` in the request. The number of decimals will be based on the crypto asset.                                         |
| <a id="coinbasefee" /> `coinbaseFee`         | [`OnrampAmount`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onrampamount) | Object with amount and currency of the fee changed by the Coinbase exchange to complete the transaction. The currency will match the `paymentCurrency`.                                                                              |
| <a id="networkfee" /> `networkFee`           | [`OnrampAmount`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onrampamount) | Object with amount and currency of the network fee required to send the purchased crypto to the user's wallet. The currency will match the `paymentCurrency`.                                                                        |
| <a id="quoteid" /> `quoteId`                 | `string`                                                                            | Reference to the quote that should be passed into the initialization parameters when launching the Coinbase Onramp widget via the SDK or URL generator.                                                                              |
| <a id="onrampurl" /> `onrampUrl?`            | `string`                                                                            | Ready-to-use one-click-buy URL. Only returned when destination\_address is provided in the request.                                                                                                                                  |

***

### OnrampBuyOptionsResponse

```ts
type OnrampBuyOptionsResponse = object;
```

The response from the Onramp Buy Options API

#### Properties

| Property                                           | Type                                                                                                       | Description                                                                                                                                                                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="paymentcurrencies" /> `paymentCurrencies`   | [`OnrampPaymentCurrency`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onramppaymentcurrency)\[]   | List of supported fiat currencies that can be exchanged for crypto on Onramp in the given location. Each currency contains a list of available payment methods, with min and max transaction limits for that currency. |
| <a id="purchasecurrencies" /> `purchaseCurrencies` | [`OnrampPurchaseCurrency`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onramppurchasecurrency)\[] | List of available crypto assets that can be bought on Onramp in the given location.                                                                                                                                    |

***

### OnrampBuyOptionsSnakeCaseResponse

```ts
type OnrampBuyOptionsSnakeCaseResponse = CamelToSnakeCaseNested<OnrampBuyOptionsResponse>;
```

The response from the Onramp Buy Options API in snake case.
For the v1 API, the response is in snake case.

***

### OnrampBuyQuoteSnakeCaseResponse

```ts
type OnrampBuyQuoteSnakeCaseResponse = CamelToSnakeCaseNested<OnrampBuyQuoteResponse>;
```

The response from the Onramp Buy Quote API in snake case.
For the v1 API, the response is in snake case.

***

### OnrampNetwork

```ts
type OnrampNetwork = object;
```

Network data

#### Properties

| Property                                     | Type     |
| -------------------------------------------- | -------- |
| <a id="name-1" /> `name`                     | `string` |
| <a id="displayname" /> `displayName`         | `string` |
| <a id="chainid" /> `chainId`                 | `string` |
| <a id="contractaddress" /> `contractAddress` | `string` |
| <a id="iconurl" /> `iconUrl`                 | `string` |

***

### OnrampPaymentCurrency

```ts
type OnrampPaymentCurrency = object;
```

Payment currency data

#### Properties

| Property                   | Type                                                                                                           |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| <a id="id-1" /> `id`       | `string`                                                                                                       |
| <a id="limits" /> `limits` | [`OnrampPaymentMethodLimit`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onramppaymentmethodlimit)\[] |

***

### OnrampPaymentMethodLimit

```ts
type OnrampPaymentMethodLimit = object;
```

Payment method limit data

#### Properties

| Property             | Type     |
| -------------------- | -------- |
| <a id="id-2" /> `id` | `string` |
| <a id="min" /> `min` | `string` |
| <a id="max" /> `max` | `string` |

***

### OnrampPurchaseCurrency

```ts
type OnrampPurchaseCurrency = object;
```

Purchase currency data

#### Properties

| Property                       | Type                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| <a id="id-3" /> `id`           | `string`                                                                                 |
| <a id="name-2" /> `name`       | `string`                                                                                 |
| <a id="symbol" /> `symbol`     | `string`                                                                                 |
| <a id="iconurl-1" /> `iconUrl` | `string`                                                                                 |
| <a id="networks" /> `networks` | [`OnrampNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#onrampnetwork)\[] |

***

### OnrampSuccessEventData

```ts
type OnrampSuccessEventData = object;
```

Data that is emitted with the onramp transaction success event.

#### Properties

| Property                                 | Type     |
| ---------------------------------------- | -------- |
| <a id="assetimageurl" /> `assetImageUrl` | `string` |
| <a id="assetname" /> `assetName`         | `string` |
| <a id="assetsymbol" /> `assetSymbol`     | `string` |
| <a id="chainid-1" /> `chainId`           | `string` |

***

### SignInAction

```ts
type SignInAction = 
  | {
  type: "SET_AUTH_METHOD";
  payload: {
     authMethod: AuthMethod;
  };
}
  | {
  type: "SET_EMAIL";
  payload: {
     email: string;
  };
}
  | {
  type: "SUBMIT_EMAIL";
  payload: {
     email: string;
  };
}
  | {
  type: "SUBMIT_EMAIL_SUCCESS";
  payload: {
     flowId: string;
  };
}
  | {
  type: "SUBMIT_EMAIL_FAILURE";
  payload: {
     error:   | string
        | APIError;
  };
}
  | {
  type: "SET_PHONE_NUMBER";
  payload: {
     phoneNumber: string;
  };
}
  | {
  type: "SUBMIT_PHONE_NUMBER";
  payload: {
     phoneNumber: string;
  };
}
  | {
  type: "SUBMIT_PHONE_NUMBER_SUCCESS";
  payload: {
     flowId: string;
  };
}
  | {
  type: "SUBMIT_PHONE_NUMBER_FAILURE";
  payload: {
     error:   | string
        | APIError;
  };
}
  | {
  type: "SET_OTP";
  payload: {
     otp: string;
  };
}
  | {
  type: "SUBMIT_OTP";
  payload: {
     otp: string;
  };
}
  | {
  type: "SUBMIT_OTP_SUCCESS";
  payload: {
     otp: string;
  };
}
  | {
  type: "SUBMIT_OTP_FAILURE";
  payload: {
     error:   | string
        | APIError;
  };
}
  | {
  type: "ALLOW_RESET_OTP";
}
  | {
  type: "RESET_OTP";
}
  | {
  type: "CLEAR_ERROR";
}
  | {
  type: "RESET_STATE";
};
```

The actions that can be performed on the SignIn state.

## Variables

### AUTH\_METHODS

```ts
const AUTH_METHODS: readonly ["email", "sms"];
```

The auth methods that can be used to sign in.

***

### theme

```ts
const theme: Flattened<{
  borderRadius: {
     cta: {
        value: "{borderRadius.full}";
     };
     input: {
        value: "{borderRadius.sm}";
     };
     link: {
        value: "{borderRadius.full}";
     };
     modal: {
        value: "{borderRadius.sm}";
     };
     select: {
        trigger: {
           value: "{borderRadius.sm}";
        };
        list: {
           value: "{borderRadius.sm}";
        };
     };
     none: {
        value: 0;
     };
     xs: {
        value: "{font.size.base}";
        modify: {
           type: "multiply";
           value: 0.25;
        };
     };
     sm: {
        value: "{font.size.base}";
        modify: {
           type: "multiply";
           value: 0.5;
        };
     };
     md: {
        value: "{font.size.base}";
        modify: {
           type: "multiply";
           value: 0.75;
        };
     };
     lg: {
        value: "{font.size.base}";
        modify: {
           type: "multiply";
           value: 1;
        };
     };
     xl: {
        value: "{font.size.base}";
        modify: {
           type: "multiply";
           value: 1.5;
        };
     };
     full: {
        value: 99999;
     };
  };
  colors: {
     page: {
        bg: {
           default: {
              value: "{colors.bg.default}";
           };
        };
        border: {
           default: {
              value: "{colors.line.default}";
           };
        };
        text: {
           default: {
              value: "{colors.fg.default}";
           };
           muted: {
              value: "{colors.fg.muted}";
           };
        };
     };
     cta: {
        primary: {
           bg: {
              default: {
                 value: "{colors.bg.primary}";
              };
              hover: {
                 value: "{colors.bg.primary}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "15%"]];
                 };
              };
              pressed: {
                 value: "{colors.bg.primary}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "30%"]];
                 };
              };
           };
           border: {
              focus: {
                 value: "{colors.line.primary}";
              };
           };
           text: {
              default: {
                 value: "{colors.fg.onPrimary}";
              };
              hover: {
                 value: "{colors.fg.onPrimary}";
              };
           };
        };
        secondary: {
           bg: {
              default: {
                 value: "{colors.bg.secondary}";
              };
              hover: {
                 value: "{colors.bg.secondary}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
                 };
              };
              pressed: {
                 value: "{colors.bg.secondary}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "20%"]];
                 };
              };
           };
           border: {
              focus: {
                 value: "{colors.line.primary}";
              };
           };
           text: {
              default: {
                 value: "{colors.fg.onSecondary}";
              };
              hover: {
                 value: "{colors.fg.onSecondary}";
              };
           };
        };
     };
     link: {
        primary: {
           text: {
              default: {
                 value: "{colors.fg.primary}";
              };
              hover: {
                 value: "{colors.fg.primary}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "15%"]];
                 };
              };
              pressed: {
                 value: "{colors.fg.primary}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "30%"]];
                 };
              };
           };
        };
        secondary: {
           text: {
              default: {
                 value: "{colors.fg.default}";
              };
              hover: {
                 value: "{colors.fg.default}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
                 };
              };
              pressed: {
                 value: "{colors.fg.default}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "20%"]];
                 };
              };
           };
        };
     };
     input: {
        bg: {
           default: {
              value: "{colors.bg.default}";
           };
        };
        border: {
           default: {
              value: "{colors.line.heavy}";
           };
           focus: {
              value: "{colors.line.primary}";
           };
           error: {
              value: "{colors.line.negative}";
           };
           success: {
              value: "{colors.line.positive}";
           };
        };
        label: {
           default: {
              value: "{colors.fg.default}";
           };
        };
        placeholder: {
           default: {
              value: "{colors.fg.muted}";
           };
        };
        text: {
           default: {
              value: "{colors.fg.default}";
           };
        };
        errorText: {
           default: {
              value: "{colors.fg.negative}";
           };
        };
        successText: {
           default: {
              value: "{colors.fg.positive}";
           };
        };
     };
     select: {
        label: {
           default: {
              value: "{colors.fg.default}";
           };
        };
        trigger: {
           bg: {
              default: {
                 value: "{colors.bg.default}";
              };
              hover: {
                 value: "{colors.bg.default}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "5%"]];
                 };
              };
              pressed: {
                 value: "{colors.bg.default}";
                 modify: {
                    type: "color-mix";
                    value: readonly [readonly ["{colors.bg.contrast}", "7%"]];
                 };
              };
           };
           border: {
              default: {
                 value: "{colors.line.default}";
              };
              focus: {
                 value: "{colors.line.primary}";
              };
              error: {
                 value: "{colors.line.negative}";
              };
              success: {
                 value: "{colors.line.positive}";
              };
           };
           placeholder: {
              default: {
                 value: "{colors.fg.muted}";
              };
           };
           text: {
              default: {
                 value: "{colors.fg.default}";
              };
           };
           errorText: {
              default: {
                 value: "{colors.fg.negative}";
              };
           };
           successText: {
              default: {
                 value: "{colors.fg.positive}";
              };
           };
        };
        list: {
           bg: {
              default: {
                 value: "{colors.bg.default}";
              };
           };
           border: {
              default: {
                 value: "{colors.line.default}";
              };
              focus: {
                 value: "{colors.line.primary}";
              };
              error: {
                 value: "{colors.line.negative}";
              };
              success: {
                 value: "{colors.line.positive}";
              };
           };
           item: {
              bg: {
                 default: {
                    value: "{colors.bg.default}";
                 };
                 highlight: {
                    value: "{colors.bg.default}";
                    modify: {
                       type: "color-mix";
                       value: readonly [readonly [..., ...]];
                    };
                 };
              };
              text: {
                 default: {
                    value: "{colors.fg.default}";
                 };
                 muted: {
                    value: "{colors.fg.muted}";
                 };
                 onHighlight: {
                    value: "{colors.fg.default}";
                 };
                 mutedOnHighlight: {
                    value: "{colors.fg.muted}";
                 };
              };
           };
        };
     };
     code: {
        bg: {
           default: {
              value: "{colors.bg.alternate}";
           };
        };
        border: {
           default: {
              value: "{colors.line.heavy}";
           };
        };
        text: {
           default: {
              value: "{colors.fg.default}";
           };
        };
     };
     bg: {
        default: {
           value: "#ffffff";
        };
        alternate: {
           value: "#eef0f3";
        };
        contrast: {
           value: "{colors.fg.default}";
        };
        overlay: {
           value: "{colors.bg.alternate}";
           modify: {
              type: "color-alpha";
              value: 0.33;
           };
        };
        skeleton: {
           value: "{colors.fg.default}";
           modify: {
              type: "color-alpha";
              value: 0.1;
           };
        };
        primary: {
           value: "#0052ff";
        };
        secondary: {
           value: "#eef0f3";
        };
     };
     fg: {
        default: {
           value: "#0a0b0d";
        };
        muted: {
           value: "#5b616e";
        };
        primary: {
           value: "#0052ff";
        };
        onPrimary: {
           value: "#ffffff";
        };
        onSecondary: {
           value: "#0a0b0d";
        };
        positive: {
           value: "#098551";
        };
        negative: {
           value: "#cf202f";
        };
        warning: {
           value: "#ed702f";
        };
     };
     line: {
        default: {
           value: "#dcdfe4";
        };
        heavy: {
           value: "#9397a0";
        };
        primary: {
           value: "{colors.fg.primary}";
        };
        positive: {
           value: "{colors.fg.positive}";
        };
        negative: {
           value: "{colors.fg.negative}";
        };
     };
  };
  font: {
     family: {
        page: {
           value: "{font.family.body}";
        };
        cta: {
           value: "{font.family.interactive}";
        };
        link: {
           value: "{font.family.interactive}";
        };
        input: {
           value: "{font.family.interactive}";
        };
        select: {
           value: "{font.family.interactive}";
        };
        code: {
           value: "{font.family.mono}";
        };
        mono: {
           value: "\"DM Mono\", monospace";
        };
        sans: {
           value: "\"Rethink Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"";
        };
        body: {
           value: "{font.family.sans}";
        };
        interactive: {
           value: "{font.family.sans}";
        };
     };
     size: {
        base: {
           value: 16;
        };
     };
  };
}>;
```

The theme is a flattened tokens object with values appropriate for web environments
(i.e. CSS properties & CSS Variables).

It DOES NOT include the namespace (`--cdp-web-`) in the keys.

#### Example

```tsx lines
const theme: Partial<Theme> = {
  "colors-bg-primary": "#0052ff",
  "colors-cta-primary-bg-default": "var(--cdp-web-colors-bg-primary)",
  "font-size-base": "16px",
};
```

***

### colorsBase

```ts
const colorsBase: object;
```

All colors used in the CDP web component library default theme.

#### Type declaration

##### blue500

```ts
readonly blue500: "#0052ff" = "#0052ff";
```

##### blue550

```ts
readonly blue550: "#014cec" = "#014cec";
```

##### black

```ts
readonly black: "#0a0b0d" = "#0a0b0d";
```

##### white

```ts
readonly white: "#ffffff" = "#ffffff";
```

##### gray50

```ts
readonly gray50: "#f9fafb" = "#f9fafb";
```

##### gray100

```ts
readonly gray100: "#eef0f3" = "#eef0f3";
```

##### gray200

```ts
readonly gray200: "#dcdfe4" = "#dcdfe4";
```

##### gray500

```ts
readonly gray500: "#9397a0" = "#9397a0";
```

##### gray700

```ts
readonly gray700: "#5b616e" = "#5b616e";
```

##### gray900

```ts
readonly gray900: "#1a1d21" = "#1a1d21";
```

##### red500

```ts
readonly red500: "#cf202f" = "#cf202f";
```

##### green500

```ts
readonly green500: "#098551" = "#098551";
```

##### amber500

```ts
readonly amber500: "#ed702f" = "#ed702f";
```

***

### colorsSemantic

```ts
const colorsSemantic: object;
```

These are the default values for the semantic color tokens.

Semantic colors are the base colors for the theme.
They are typically not used directly in the components, but are used to define the base colors
for the components.

#### Type declaration

##### bg

```ts
readonly bg: object;
```

###### Type declaration

###### bg.default

```ts
readonly default: object;
```

###### Type declaration

###### bg.default.value

```ts
readonly value: "#ffffff" = colorsBase.white;
```

###### bg.alternate

```ts
readonly alternate: object;
```

###### Type declaration

###### bg.alternate.value

```ts
readonly value: "#eef0f3" = colorsBase.gray100;
```

###### bg.contrast

```ts
readonly contrast: object;
```

###### Type declaration

###### bg.contrast.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### bg.overlay

```ts
readonly overlay: object;
```

###### Type declaration

###### bg.overlay.value

```ts
readonly value: "{colors.bg.alternate}" = "{colors.bg.alternate}";
```

###### bg.overlay.modify

```ts
readonly modify: object;
```

###### Type declaration

###### bg.overlay.modify.type

```ts
readonly type: "color-alpha" = "color-alpha";
```

###### bg.overlay.modify.value

```ts
readonly value: 0.33 = 0.33;
```

###### bg.skeleton

```ts
readonly skeleton: object;
```

###### Type declaration

###### bg.skeleton.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### bg.skeleton.modify

```ts
readonly modify: object;
```

###### Type declaration

###### bg.skeleton.modify.type

```ts
readonly type: "color-alpha" = "color-alpha";
```

###### bg.skeleton.modify.value

```ts
readonly value: 0.1 = 0.1;
```

###### bg.primary

```ts
readonly primary: object;
```

###### Type declaration

###### bg.primary.value

```ts
readonly value: "#0052ff" = colorsBase.blue500;
```

###### bg.secondary

```ts
readonly secondary: object;
```

###### Type declaration

###### bg.secondary.value

```ts
readonly value: "#eef0f3" = colorsBase.gray100;
```

##### fg

```ts
readonly fg: object;
```

###### Type declaration

###### fg.default

```ts
readonly default: object;
```

###### Type declaration

###### fg.default.value

```ts
readonly value: "#0a0b0d" = colorsBase.black;
```

###### fg.muted

```ts
readonly muted: object;
```

###### Type declaration

###### fg.muted.value

```ts
readonly value: "#5b616e" = colorsBase.gray700;
```

###### fg.primary

```ts
readonly primary: object;
```

###### Type declaration

###### fg.primary.value

```ts
readonly value: "#0052ff" = colorsBase.blue500;
```

###### fg.onPrimary

```ts
readonly onPrimary: object;
```

###### Type declaration

###### fg.onPrimary.value

```ts
readonly value: "#ffffff" = colorsBase.white;
```

###### fg.onSecondary

```ts
readonly onSecondary: object;
```

###### Type declaration

###### fg.onSecondary.value

```ts
readonly value: "#0a0b0d" = colorsBase.black;
```

###### fg.positive

```ts
readonly positive: object;
```

###### Type declaration

###### fg.positive.value

```ts
readonly value: "#098551" = colorsBase.green500;
```

###### fg.negative

```ts
readonly negative: object;
```

###### Type declaration

###### fg.negative.value

```ts
readonly value: "#cf202f" = colorsBase.red500;
```

###### fg.warning

```ts
readonly warning: object;
```

###### Type declaration

###### fg.warning.value

```ts
readonly value: "#ed702f" = colorsBase.amber500;
```

##### line

```ts
readonly line: object;
```

###### Type declaration

###### line.default

```ts
readonly default: object;
```

###### Type declaration

###### line.default.value

```ts
readonly value: "#dcdfe4" = colorsBase.gray200;
```

###### line.heavy

```ts
readonly heavy: object;
```

###### Type declaration

###### line.heavy.value

```ts
readonly value: "#9397a0" = colorsBase.gray500;
```

###### line.primary

```ts
readonly primary: object;
```

###### Type declaration

###### line.primary.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### line.positive

```ts
readonly positive: object;
```

###### Type declaration

###### line.positive.value

```ts
readonly value: "{colors.fg.positive}" = "{colors.fg.positive}";
```

###### line.negative

```ts
readonly negative: object;
```

###### Type declaration

###### line.negative.value

```ts
readonly value: "{colors.fg.negative}" = "{colors.fg.negative}";
```

#### See

[colorsComponents](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#colorscomponents) for the component colors that inherit from these

***

### colorsComponents

```ts
const colorsComponents: object;
```

These are the default values for the component color tokens.

Component colors are the colors for the individual UI components.
They inherit values from the [colorsSemantic](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#colorssemantic).

#### Type declaration

##### page

```ts
readonly page: object;
```

###### Type declaration

###### page.bg

```ts
readonly bg: object;
```

###### Type declaration

###### page.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### page.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### page.border

```ts
readonly border: object;
```

###### Type declaration

###### page.border.default

```ts
readonly default: object;
```

###### Type declaration

###### page.border.default.value

```ts
readonly value: "{colors.line.default}" = "{colors.line.default}";
```

###### page.text

```ts
readonly text: object;
```

###### Type declaration

###### page.text.default

```ts
readonly default: object;
```

###### Type declaration

###### page.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### page.text.muted

```ts
readonly muted: object;
```

###### Type declaration

###### page.text.muted.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

##### cta

```ts
readonly cta: object;
```

###### Type declaration

###### cta.primary

```ts
readonly primary: object;
```

###### Type declaration

###### cta.primary.bg

```ts
readonly bg: object;
```

###### Type declaration

###### cta.primary.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### cta.primary.bg.default.value

```ts
readonly value: "{colors.bg.primary}" = "{colors.bg.primary}";
```

###### cta.primary.bg.hover

```ts
readonly hover: object;
```

###### Type declaration

###### cta.primary.bg.hover.value

```ts
readonly value: "{colors.bg.primary}" = "{colors.bg.primary}";
```

###### cta.primary.bg.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### cta.primary.bg.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### cta.primary.bg.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "15%"]];
```

###### cta.primary.bg.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### cta.primary.bg.pressed.value

```ts
readonly value: "{colors.bg.primary}" = "{colors.bg.primary}";
```

###### cta.primary.bg.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### cta.primary.bg.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### cta.primary.bg.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "30%"]];
```

###### cta.primary.border

```ts
readonly border: object;
```

###### Type declaration

###### cta.primary.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### cta.primary.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### cta.primary.text

```ts
readonly text: object;
```

###### Type declaration

###### cta.primary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### cta.primary.text.default.value

```ts
readonly value: "{colors.fg.onPrimary}" = "{colors.fg.onPrimary}";
```

###### cta.primary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### cta.primary.text.hover.value

```ts
readonly value: "{colors.fg.onPrimary}" = "{colors.fg.onPrimary}";
```

###### cta.secondary

```ts
readonly secondary: object;
```

###### Type declaration

###### cta.secondary.bg

```ts
readonly bg: object;
```

###### Type declaration

###### cta.secondary.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### cta.secondary.bg.default.value

```ts
readonly value: "{colors.bg.secondary}" = "{colors.bg.secondary}";
```

###### cta.secondary.bg.hover

```ts
readonly hover: object;
```

###### Type declaration

###### cta.secondary.bg.hover.value

```ts
readonly value: "{colors.bg.secondary}" = "{colors.bg.secondary}";
```

###### cta.secondary.bg.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### cta.secondary.bg.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### cta.secondary.bg.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
```

###### cta.secondary.bg.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### cta.secondary.bg.pressed.value

```ts
readonly value: "{colors.bg.secondary}" = "{colors.bg.secondary}";
```

###### cta.secondary.bg.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### cta.secondary.bg.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### cta.secondary.bg.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "20%"]];
```

###### cta.secondary.border

```ts
readonly border: object;
```

###### Type declaration

###### cta.secondary.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### cta.secondary.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### cta.secondary.text

```ts
readonly text: object;
```

###### Type declaration

###### cta.secondary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### cta.secondary.text.default.value

```ts
readonly value: "{colors.fg.onSecondary}" = "{colors.fg.onSecondary}";
```

###### cta.secondary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### cta.secondary.text.hover.value

```ts
readonly value: "{colors.fg.onSecondary}" = "{colors.fg.onSecondary}";
```

##### link

```ts
readonly link: object;
```

###### Type declaration

###### link.primary

```ts
readonly primary: object;
```

###### Type declaration

###### link.primary.text

```ts
readonly text: object;
```

###### Type declaration

###### link.primary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### link.primary.text.default.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### link.primary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### link.primary.text.hover.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### link.primary.text.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### link.primary.text.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### link.primary.text.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "15%"]];
```

###### link.primary.text.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### link.primary.text.pressed.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### link.primary.text.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### link.primary.text.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### link.primary.text.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "30%"]];
```

###### link.secondary

```ts
readonly secondary: object;
```

###### Type declaration

###### link.secondary.text

```ts
readonly text: object;
```

###### Type declaration

###### link.secondary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### link.secondary.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### link.secondary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### link.secondary.text.hover.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### link.secondary.text.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### link.secondary.text.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### link.secondary.text.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
```

###### link.secondary.text.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### link.secondary.text.pressed.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### link.secondary.text.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### link.secondary.text.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### link.secondary.text.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "20%"]];
```

##### input

```ts
readonly input: object;
```

###### Type declaration

###### input.bg

```ts
readonly bg: object;
```

###### Type declaration

###### input.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### input.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### input.border

```ts
readonly border: object;
```

###### Type declaration

###### input.border.default

```ts
readonly default: object;
```

###### Type declaration

###### input.border.default.value

```ts
readonly value: "{colors.line.heavy}" = "{colors.line.heavy}";
```

###### input.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### input.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### input.border.error

```ts
readonly error: object;
```

###### Type declaration

###### input.border.error.value

```ts
readonly value: "{colors.line.negative}" = "{colors.line.negative}";
```

###### input.border.success

```ts
readonly success: object;
```

###### Type declaration

###### input.border.success.value

```ts
readonly value: "{colors.line.positive}" = "{colors.line.positive}";
```

###### input.label

```ts
readonly label: object;
```

###### Type declaration

###### input.label.default

```ts
readonly default: object;
```

###### Type declaration

###### input.label.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### input.placeholder

```ts
readonly placeholder: object;
```

###### Type declaration

###### input.placeholder.default

```ts
readonly default: object;
```

###### Type declaration

###### input.placeholder.default.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### input.text

```ts
readonly text: object;
```

###### Type declaration

###### input.text.default

```ts
readonly default: object;
```

###### Type declaration

###### input.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### input.errorText

```ts
readonly errorText: object;
```

###### Type declaration

###### input.errorText.default

```ts
readonly default: object;
```

###### Type declaration

###### input.errorText.default.value

```ts
readonly value: "{colors.fg.negative}" = "{colors.fg.negative}";
```

###### input.successText

```ts
readonly successText: object;
```

###### Type declaration

###### input.successText.default

```ts
readonly default: object;
```

###### Type declaration

###### input.successText.default.value

```ts
readonly value: "{colors.fg.positive}" = "{colors.fg.positive}";
```

##### select

```ts
readonly select: object;
```

###### Type declaration

###### select.label

```ts
readonly label: object;
```

###### Type declaration

###### select.label.default

```ts
readonly default: object;
```

###### Type declaration

###### select.label.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### select.trigger

```ts
readonly trigger: object;
```

###### Type declaration

###### select.trigger.bg

```ts
readonly bg: object;
```

###### Type declaration

###### select.trigger.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.trigger.bg.hover

```ts
readonly hover: object;
```

###### Type declaration

###### select.trigger.bg.hover.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.trigger.bg.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### select.trigger.bg.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### select.trigger.bg.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "5%"]];
```

###### select.trigger.bg.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### select.trigger.bg.pressed.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.trigger.bg.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### select.trigger.bg.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### select.trigger.bg.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "7%"]];
```

###### select.trigger.border

```ts
readonly border: object;
```

###### Type declaration

###### select.trigger.border.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.border.default.value

```ts
readonly value: "{colors.line.default}" = "{colors.line.default}";
```

###### select.trigger.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### select.trigger.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### select.trigger.border.error

```ts
readonly error: object;
```

###### Type declaration

###### select.trigger.border.error.value

```ts
readonly value: "{colors.line.negative}" = "{colors.line.negative}";
```

###### select.trigger.border.success

```ts
readonly success: object;
```

###### Type declaration

###### select.trigger.border.success.value

```ts
readonly value: "{colors.line.positive}" = "{colors.line.positive}";
```

###### select.trigger.placeholder

```ts
readonly placeholder: object;
```

###### Type declaration

###### select.trigger.placeholder.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.placeholder.default.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### select.trigger.text

```ts
readonly text: object;
```

###### Type declaration

###### select.trigger.text.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### select.trigger.errorText

```ts
readonly errorText: object;
```

###### Type declaration

###### select.trigger.errorText.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.errorText.default.value

```ts
readonly value: "{colors.fg.negative}" = "{colors.fg.negative}";
```

###### select.trigger.successText

```ts
readonly successText: object;
```

###### Type declaration

###### select.trigger.successText.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.successText.default.value

```ts
readonly value: "{colors.fg.positive}" = "{colors.fg.positive}";
```

###### select.list

```ts
readonly list: object;
```

###### Type declaration

###### select.list.bg

```ts
readonly bg: object;
```

###### Type declaration

###### select.list.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### select.list.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.list.border

```ts
readonly border: object;
```

###### Type declaration

###### select.list.border.default

```ts
readonly default: object;
```

###### Type declaration

###### select.list.border.default.value

```ts
readonly value: "{colors.line.default}" = "{colors.line.default}";
```

###### select.list.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### select.list.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### select.list.border.error

```ts
readonly error: object;
```

###### Type declaration

###### select.list.border.error.value

```ts
readonly value: "{colors.line.negative}" = "{colors.line.negative}";
```

###### select.list.border.success

```ts
readonly success: object;
```

###### Type declaration

###### select.list.border.success.value

```ts
readonly value: "{colors.line.positive}" = "{colors.line.positive}";
```

###### select.list.item

```ts
readonly item: object;
```

###### Type declaration

###### select.list.item.bg

```ts
readonly bg: object;
```

###### Type declaration

###### select.list.item.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### select.list.item.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.list.item.bg.highlight

```ts
readonly highlight: object;
```

###### Type declaration

###### select.list.item.bg.highlight.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.list.item.bg.highlight.modify

```ts
readonly modify: object;
```

###### Type declaration

###### select.list.item.bg.highlight.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### select.list.item.bg.highlight.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
```

###### select.list.item.text

```ts
readonly text: object;
```

###### Type declaration

###### select.list.item.text.default

```ts
readonly default: object;
```

###### Type declaration

###### select.list.item.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### select.list.item.text.muted

```ts
readonly muted: object;
```

###### Type declaration

###### select.list.item.text.muted.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### select.list.item.text.onHighlight

```ts
readonly onHighlight: object;
```

###### Type declaration

###### select.list.item.text.onHighlight.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### select.list.item.text.mutedOnHighlight

```ts
readonly mutedOnHighlight: object;
```

###### Type declaration

###### select.list.item.text.mutedOnHighlight.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

##### code

```ts
readonly code: object;
```

###### Type declaration

###### code.bg

```ts
readonly bg: object;
```

###### Type declaration

###### code.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### code.bg.default.value

```ts
readonly value: "{colors.bg.alternate}" = "{colors.bg.alternate}";
```

###### code.border

```ts
readonly border: object;
```

###### Type declaration

###### code.border.default

```ts
readonly default: object;
```

###### Type declaration

###### code.border.default.value

```ts
readonly value: "{colors.line.heavy}" = "{colors.line.heavy}";
```

###### code.text

```ts
readonly text: object;
```

###### Type declaration

###### code.text.default

```ts
readonly default: object;
```

###### Type declaration

###### code.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

***

### colors

```ts
const colors: object;
```

All the color tokens.

#### Type declaration

##### page

```ts
readonly page: object;
```

###### Type declaration

###### page.bg

```ts
readonly bg: object;
```

###### Type declaration

###### page.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### page.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### page.border

```ts
readonly border: object;
```

###### Type declaration

###### page.border.default

```ts
readonly default: object;
```

###### Type declaration

###### page.border.default.value

```ts
readonly value: "{colors.line.default}" = "{colors.line.default}";
```

###### page.text

```ts
readonly text: object;
```

###### Type declaration

###### page.text.default

```ts
readonly default: object;
```

###### Type declaration

###### page.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### page.text.muted

```ts
readonly muted: object;
```

###### Type declaration

###### page.text.muted.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

##### cta

```ts
readonly cta: object;
```

###### Type declaration

###### cta.primary

```ts
readonly primary: object;
```

###### Type declaration

###### cta.primary.bg

```ts
readonly bg: object;
```

###### Type declaration

###### cta.primary.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### cta.primary.bg.default.value

```ts
readonly value: "{colors.bg.primary}" = "{colors.bg.primary}";
```

###### cta.primary.bg.hover

```ts
readonly hover: object;
```

###### Type declaration

###### cta.primary.bg.hover.value

```ts
readonly value: "{colors.bg.primary}" = "{colors.bg.primary}";
```

###### cta.primary.bg.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### cta.primary.bg.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### cta.primary.bg.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "15%"]];
```

###### cta.primary.bg.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### cta.primary.bg.pressed.value

```ts
readonly value: "{colors.bg.primary}" = "{colors.bg.primary}";
```

###### cta.primary.bg.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### cta.primary.bg.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### cta.primary.bg.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "30%"]];
```

###### cta.primary.border

```ts
readonly border: object;
```

###### Type declaration

###### cta.primary.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### cta.primary.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### cta.primary.text

```ts
readonly text: object;
```

###### Type declaration

###### cta.primary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### cta.primary.text.default.value

```ts
readonly value: "{colors.fg.onPrimary}" = "{colors.fg.onPrimary}";
```

###### cta.primary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### cta.primary.text.hover.value

```ts
readonly value: "{colors.fg.onPrimary}" = "{colors.fg.onPrimary}";
```

###### cta.secondary

```ts
readonly secondary: object;
```

###### Type declaration

###### cta.secondary.bg

```ts
readonly bg: object;
```

###### Type declaration

###### cta.secondary.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### cta.secondary.bg.default.value

```ts
readonly value: "{colors.bg.secondary}" = "{colors.bg.secondary}";
```

###### cta.secondary.bg.hover

```ts
readonly hover: object;
```

###### Type declaration

###### cta.secondary.bg.hover.value

```ts
readonly value: "{colors.bg.secondary}" = "{colors.bg.secondary}";
```

###### cta.secondary.bg.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### cta.secondary.bg.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### cta.secondary.bg.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
```

###### cta.secondary.bg.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### cta.secondary.bg.pressed.value

```ts
readonly value: "{colors.bg.secondary}" = "{colors.bg.secondary}";
```

###### cta.secondary.bg.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### cta.secondary.bg.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### cta.secondary.bg.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "20%"]];
```

###### cta.secondary.border

```ts
readonly border: object;
```

###### Type declaration

###### cta.secondary.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### cta.secondary.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### cta.secondary.text

```ts
readonly text: object;
```

###### Type declaration

###### cta.secondary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### cta.secondary.text.default.value

```ts
readonly value: "{colors.fg.onSecondary}" = "{colors.fg.onSecondary}";
```

###### cta.secondary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### cta.secondary.text.hover.value

```ts
readonly value: "{colors.fg.onSecondary}" = "{colors.fg.onSecondary}";
```

##### link

```ts
readonly link: object;
```

###### Type declaration

###### link.primary

```ts
readonly primary: object;
```

###### Type declaration

###### link.primary.text

```ts
readonly text: object;
```

###### Type declaration

###### link.primary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### link.primary.text.default.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### link.primary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### link.primary.text.hover.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### link.primary.text.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### link.primary.text.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### link.primary.text.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "15%"]];
```

###### link.primary.text.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### link.primary.text.pressed.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### link.primary.text.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### link.primary.text.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### link.primary.text.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "30%"]];
```

###### link.secondary

```ts
readonly secondary: object;
```

###### Type declaration

###### link.secondary.text

```ts
readonly text: object;
```

###### Type declaration

###### link.secondary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### link.secondary.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### link.secondary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### link.secondary.text.hover.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### link.secondary.text.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### link.secondary.text.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### link.secondary.text.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
```

###### link.secondary.text.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### link.secondary.text.pressed.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### link.secondary.text.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### link.secondary.text.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### link.secondary.text.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "20%"]];
```

##### input

```ts
readonly input: object;
```

###### Type declaration

###### input.bg

```ts
readonly bg: object;
```

###### Type declaration

###### input.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### input.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### input.border

```ts
readonly border: object;
```

###### Type declaration

###### input.border.default

```ts
readonly default: object;
```

###### Type declaration

###### input.border.default.value

```ts
readonly value: "{colors.line.heavy}" = "{colors.line.heavy}";
```

###### input.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### input.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### input.border.error

```ts
readonly error: object;
```

###### Type declaration

###### input.border.error.value

```ts
readonly value: "{colors.line.negative}" = "{colors.line.negative}";
```

###### input.border.success

```ts
readonly success: object;
```

###### Type declaration

###### input.border.success.value

```ts
readonly value: "{colors.line.positive}" = "{colors.line.positive}";
```

###### input.label

```ts
readonly label: object;
```

###### Type declaration

###### input.label.default

```ts
readonly default: object;
```

###### Type declaration

###### input.label.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### input.placeholder

```ts
readonly placeholder: object;
```

###### Type declaration

###### input.placeholder.default

```ts
readonly default: object;
```

###### Type declaration

###### input.placeholder.default.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### input.text

```ts
readonly text: object;
```

###### Type declaration

###### input.text.default

```ts
readonly default: object;
```

###### Type declaration

###### input.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### input.errorText

```ts
readonly errorText: object;
```

###### Type declaration

###### input.errorText.default

```ts
readonly default: object;
```

###### Type declaration

###### input.errorText.default.value

```ts
readonly value: "{colors.fg.negative}" = "{colors.fg.negative}";
```

###### input.successText

```ts
readonly successText: object;
```

###### Type declaration

###### input.successText.default

```ts
readonly default: object;
```

###### Type declaration

###### input.successText.default.value

```ts
readonly value: "{colors.fg.positive}" = "{colors.fg.positive}";
```

##### select

```ts
readonly select: object;
```

###### Type declaration

###### select.label

```ts
readonly label: object;
```

###### Type declaration

###### select.label.default

```ts
readonly default: object;
```

###### Type declaration

###### select.label.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### select.trigger

```ts
readonly trigger: object;
```

###### Type declaration

###### select.trigger.bg

```ts
readonly bg: object;
```

###### Type declaration

###### select.trigger.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.trigger.bg.hover

```ts
readonly hover: object;
```

###### Type declaration

###### select.trigger.bg.hover.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.trigger.bg.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### select.trigger.bg.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### select.trigger.bg.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "5%"]];
```

###### select.trigger.bg.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### select.trigger.bg.pressed.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.trigger.bg.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### select.trigger.bg.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### select.trigger.bg.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "7%"]];
```

###### select.trigger.border

```ts
readonly border: object;
```

###### Type declaration

###### select.trigger.border.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.border.default.value

```ts
readonly value: "{colors.line.default}" = "{colors.line.default}";
```

###### select.trigger.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### select.trigger.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### select.trigger.border.error

```ts
readonly error: object;
```

###### Type declaration

###### select.trigger.border.error.value

```ts
readonly value: "{colors.line.negative}" = "{colors.line.negative}";
```

###### select.trigger.border.success

```ts
readonly success: object;
```

###### Type declaration

###### select.trigger.border.success.value

```ts
readonly value: "{colors.line.positive}" = "{colors.line.positive}";
```

###### select.trigger.placeholder

```ts
readonly placeholder: object;
```

###### Type declaration

###### select.trigger.placeholder.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.placeholder.default.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### select.trigger.text

```ts
readonly text: object;
```

###### Type declaration

###### select.trigger.text.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### select.trigger.errorText

```ts
readonly errorText: object;
```

###### Type declaration

###### select.trigger.errorText.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.errorText.default.value

```ts
readonly value: "{colors.fg.negative}" = "{colors.fg.negative}";
```

###### select.trigger.successText

```ts
readonly successText: object;
```

###### Type declaration

###### select.trigger.successText.default

```ts
readonly default: object;
```

###### Type declaration

###### select.trigger.successText.default.value

```ts
readonly value: "{colors.fg.positive}" = "{colors.fg.positive}";
```

###### select.list

```ts
readonly list: object;
```

###### Type declaration

###### select.list.bg

```ts
readonly bg: object;
```

###### Type declaration

###### select.list.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### select.list.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.list.border

```ts
readonly border: object;
```

###### Type declaration

###### select.list.border.default

```ts
readonly default: object;
```

###### Type declaration

###### select.list.border.default.value

```ts
readonly value: "{colors.line.default}" = "{colors.line.default}";
```

###### select.list.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### select.list.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### select.list.border.error

```ts
readonly error: object;
```

###### Type declaration

###### select.list.border.error.value

```ts
readonly value: "{colors.line.negative}" = "{colors.line.negative}";
```

###### select.list.border.success

```ts
readonly success: object;
```

###### Type declaration

###### select.list.border.success.value

```ts
readonly value: "{colors.line.positive}" = "{colors.line.positive}";
```

###### select.list.item

```ts
readonly item: object;
```

###### Type declaration

###### select.list.item.bg

```ts
readonly bg: object;
```

###### Type declaration

###### select.list.item.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### select.list.item.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.list.item.bg.highlight

```ts
readonly highlight: object;
```

###### Type declaration

###### select.list.item.bg.highlight.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### select.list.item.bg.highlight.modify

```ts
readonly modify: object;
```

###### Type declaration

###### select.list.item.bg.highlight.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### select.list.item.bg.highlight.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
```

###### select.list.item.text

```ts
readonly text: object;
```

###### Type declaration

###### select.list.item.text.default

```ts
readonly default: object;
```

###### Type declaration

###### select.list.item.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### select.list.item.text.muted

```ts
readonly muted: object;
```

###### Type declaration

###### select.list.item.text.muted.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### select.list.item.text.onHighlight

```ts
readonly onHighlight: object;
```

###### Type declaration

###### select.list.item.text.onHighlight.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### select.list.item.text.mutedOnHighlight

```ts
readonly mutedOnHighlight: object;
```

###### Type declaration

###### select.list.item.text.mutedOnHighlight.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

##### code

```ts
readonly code: object;
```

###### Type declaration

###### code.bg

```ts
readonly bg: object;
```

###### Type declaration

###### code.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### code.bg.default.value

```ts
readonly value: "{colors.bg.alternate}" = "{colors.bg.alternate}";
```

###### code.border

```ts
readonly border: object;
```

###### Type declaration

###### code.border.default

```ts
readonly default: object;
```

###### Type declaration

###### code.border.default.value

```ts
readonly value: "{colors.line.heavy}" = "{colors.line.heavy}";
```

###### code.text

```ts
readonly text: object;
```

###### Type declaration

###### code.text.default

```ts
readonly default: object;
```

###### Type declaration

###### code.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

##### bg

```ts
readonly bg: object;
```

###### Type declaration

###### bg.default

```ts
readonly default: object;
```

###### Type declaration

###### bg.default.value

```ts
readonly value: "#ffffff" = colorsBase.white;
```

###### bg.alternate

```ts
readonly alternate: object;
```

###### Type declaration

###### bg.alternate.value

```ts
readonly value: "#eef0f3" = colorsBase.gray100;
```

###### bg.contrast

```ts
readonly contrast: object;
```

###### Type declaration

###### bg.contrast.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### bg.overlay

```ts
readonly overlay: object;
```

###### Type declaration

###### bg.overlay.value

```ts
readonly value: "{colors.bg.alternate}" = "{colors.bg.alternate}";
```

###### bg.overlay.modify

```ts
readonly modify: object;
```

###### Type declaration

###### bg.overlay.modify.type

```ts
readonly type: "color-alpha" = "color-alpha";
```

###### bg.overlay.modify.value

```ts
readonly value: 0.33 = 0.33;
```

###### bg.skeleton

```ts
readonly skeleton: object;
```

###### Type declaration

###### bg.skeleton.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### bg.skeleton.modify

```ts
readonly modify: object;
```

###### Type declaration

###### bg.skeleton.modify.type

```ts
readonly type: "color-alpha" = "color-alpha";
```

###### bg.skeleton.modify.value

```ts
readonly value: 0.1 = 0.1;
```

###### bg.primary

```ts
readonly primary: object;
```

###### Type declaration

###### bg.primary.value

```ts
readonly value: "#0052ff" = colorsBase.blue500;
```

###### bg.secondary

```ts
readonly secondary: object;
```

###### Type declaration

###### bg.secondary.value

```ts
readonly value: "#eef0f3" = colorsBase.gray100;
```

##### fg

```ts
readonly fg: object;
```

###### Type declaration

###### fg.default

```ts
readonly default: object;
```

###### Type declaration

###### fg.default.value

```ts
readonly value: "#0a0b0d" = colorsBase.black;
```

###### fg.muted

```ts
readonly muted: object;
```

###### Type declaration

###### fg.muted.value

```ts
readonly value: "#5b616e" = colorsBase.gray700;
```

###### fg.primary

```ts
readonly primary: object;
```

###### Type declaration

###### fg.primary.value

```ts
readonly value: "#0052ff" = colorsBase.blue500;
```

###### fg.onPrimary

```ts
readonly onPrimary: object;
```

###### Type declaration

###### fg.onPrimary.value

```ts
readonly value: "#ffffff" = colorsBase.white;
```

###### fg.onSecondary

```ts
readonly onSecondary: object;
```

###### Type declaration

###### fg.onSecondary.value

```ts
readonly value: "#0a0b0d" = colorsBase.black;
```

###### fg.positive

```ts
readonly positive: object;
```

###### Type declaration

###### fg.positive.value

```ts
readonly value: "#098551" = colorsBase.green500;
```

###### fg.negative

```ts
readonly negative: object;
```

###### Type declaration

###### fg.negative.value

```ts
readonly value: "#cf202f" = colorsBase.red500;
```

###### fg.warning

```ts
readonly warning: object;
```

###### Type declaration

###### fg.warning.value

```ts
readonly value: "#ed702f" = colorsBase.amber500;
```

##### line

```ts
readonly line: object;
```

###### Type declaration

###### line.default

```ts
readonly default: object;
```

###### Type declaration

###### line.default.value

```ts
readonly value: "#dcdfe4" = colorsBase.gray200;
```

###### line.heavy

```ts
readonly heavy: object;
```

###### Type declaration

###### line.heavy.value

```ts
readonly value: "#9397a0" = colorsBase.gray500;
```

###### line.primary

```ts
readonly primary: object;
```

###### Type declaration

###### line.primary.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### line.positive

```ts
readonly positive: object;
```

###### Type declaration

###### line.positive.value

```ts
readonly value: "{colors.fg.positive}" = "{colors.fg.positive}";
```

###### line.negative

```ts
readonly negative: object;
```

###### Type declaration

###### line.negative.value

```ts
readonly value: "{colors.fg.negative}" = "{colors.fg.negative}";
```

***

### fontSemantic

```ts
const fontSemantic: object;
```

Semantic font tokens.

#### Type declaration

##### family

```ts
readonly family: object;
```

###### Type declaration

###### family.mono

```ts
readonly mono: object;
```

###### Type declaration

###### family.mono.value

```ts
readonly value: "\"DM Mono\", monospace" = '"DM Mono", monospace';
```

###### family.sans

```ts
readonly sans: object;
```

###### Type declaration

###### family.sans.value

```ts
readonly value: "\"Rethink Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"" = '"Rethink Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
```

###### family.body

```ts
readonly body: object;
```

###### Type declaration

###### family.body.value

```ts
readonly value: "{font.family.sans}" = "{font.family.sans}";
```

###### family.interactive

```ts
readonly interactive: object;
```

###### Type declaration

###### family.interactive.value

```ts
readonly value: "{font.family.sans}" = "{font.family.sans}";
```

##### size

```ts
readonly size: object;
```

###### Type declaration

###### size.base

```ts
readonly base: object;
```

###### Type declaration

###### size.base.value

```ts
readonly value: 16 = 16;
```

***

### fontComponents

```ts
const fontComponents: object;
```

Component font tokens.

#### Type declaration

##### family

```ts
readonly family: object;
```

###### Type declaration

###### family.page

```ts
readonly page: object;
```

###### Type declaration

###### family.page.value

```ts
readonly value: "{font.family.body}" = "{font.family.body}";
```

###### family.cta

```ts
readonly cta: object;
```

###### Type declaration

###### family.cta.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### family.link

```ts
readonly link: object;
```

###### Type declaration

###### family.link.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### family.input

```ts
readonly input: object;
```

###### Type declaration

###### family.input.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### family.select

```ts
readonly select: object;
```

###### Type declaration

###### family.select.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### family.code

```ts
readonly code: object;
```

###### Type declaration

###### family.code.value

```ts
readonly value: "{font.family.mono}" = "{font.family.mono}";
```

***

### font

```ts
const font: object;
```

All the font tokens.

#### Type declaration

##### family

```ts
readonly family: object;
```

###### Type declaration

###### family.page

```ts
readonly page: object;
```

###### Type declaration

###### family.page.value

```ts
readonly value: "{font.family.body}" = "{font.family.body}";
```

###### family.cta

```ts
readonly cta: object;
```

###### Type declaration

###### family.cta.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### family.link

```ts
readonly link: object;
```

###### Type declaration

###### family.link.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### family.input

```ts
readonly input: object;
```

###### Type declaration

###### family.input.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### family.select

```ts
readonly select: object;
```

###### Type declaration

###### family.select.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### family.code

```ts
readonly code: object;
```

###### Type declaration

###### family.code.value

```ts
readonly value: "{font.family.mono}" = "{font.family.mono}";
```

###### family.mono

```ts
readonly mono: object;
```

###### Type declaration

###### family.mono.value

```ts
readonly value: "\"DM Mono\", monospace" = '"DM Mono", monospace';
```

###### family.sans

```ts
readonly sans: object;
```

###### Type declaration

###### family.sans.value

```ts
readonly value: "\"Rethink Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"" = '"Rethink Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
```

###### family.body

```ts
readonly body: object;
```

###### Type declaration

###### family.body.value

```ts
readonly value: "{font.family.sans}" = "{font.family.sans}";
```

###### family.interactive

```ts
readonly interactive: object;
```

###### Type declaration

###### family.interactive.value

```ts
readonly value: "{font.family.sans}" = "{font.family.sans}";
```

##### size

```ts
readonly size: object;
```

###### Type declaration

###### size.base

```ts
readonly base: object;
```

###### Type declaration

###### size.base.value

```ts
readonly value: 16 = 16;
```

***

### borderRadiusSemantic

```ts
const borderRadiusSemantic: object;
```

Semantic border radius tokens.

#### Type declaration

##### none

```ts
readonly none: object;
```

###### Type declaration

###### none.value

```ts
readonly value: 0 = 0;
```

##### xs

```ts
readonly xs: object;
```

###### Type declaration

###### xs.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### xs.modify

```ts
readonly modify: object;
```

###### Type declaration

###### xs.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### xs.modify.value

```ts
readonly value: 0.25 = 0.25;
```

##### sm

```ts
readonly sm: object;
```

###### Type declaration

###### sm.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### sm.modify

```ts
readonly modify: object;
```

###### Type declaration

###### sm.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### sm.modify.value

```ts
readonly value: 0.5 = 0.5;
```

##### md

```ts
readonly md: object;
```

###### Type declaration

###### md.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### md.modify

```ts
readonly modify: object;
```

###### Type declaration

###### md.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### md.modify.value

```ts
readonly value: 0.75 = 0.75;
```

##### lg

```ts
readonly lg: object;
```

###### Type declaration

###### lg.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### lg.modify

```ts
readonly modify: object;
```

###### Type declaration

###### lg.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### lg.modify.value

```ts
readonly value: 1 = 1;
```

##### xl

```ts
readonly xl: object;
```

###### Type declaration

###### xl.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### xl.modify

```ts
readonly modify: object;
```

###### Type declaration

###### xl.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### xl.modify.value

```ts
readonly value: 1.5 = 1.5;
```

##### full

```ts
readonly full: object;
```

###### Type declaration

###### full.value

```ts
readonly value: 99999 = 99999;
```

***

### borderRadiusComponents

```ts
const borderRadiusComponents: object;
```

Component border radius tokens.

#### Type declaration

##### cta

```ts
readonly cta: object;
```

###### Type declaration

###### cta.value

```ts
readonly value: "{borderRadius.full}" = "{borderRadius.full}";
```

##### input

```ts
readonly input: object;
```

###### Type declaration

###### input.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

##### link

```ts
readonly link: object;
```

###### Type declaration

###### link.value

```ts
readonly value: "{borderRadius.full}" = "{borderRadius.full}";
```

##### modal

```ts
readonly modal: object;
```

###### Type declaration

###### modal.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

##### select

```ts
readonly select: object;
```

###### Type declaration

###### select.trigger

```ts
readonly trigger: object;
```

###### Type declaration

###### select.trigger.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

###### select.list

```ts
readonly list: object;
```

###### Type declaration

###### select.list.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

***

### borderRadius

```ts
const borderRadius: object;
```

All the border radius tokens.

#### Type declaration

##### cta

```ts
readonly cta: object;
```

###### Type declaration

###### cta.value

```ts
readonly value: "{borderRadius.full}" = "{borderRadius.full}";
```

##### input

```ts
readonly input: object;
```

###### Type declaration

###### input.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

##### link

```ts
readonly link: object;
```

###### Type declaration

###### link.value

```ts
readonly value: "{borderRadius.full}" = "{borderRadius.full}";
```

##### modal

```ts
readonly modal: object;
```

###### Type declaration

###### modal.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

##### select

```ts
readonly select: object;
```

###### Type declaration

###### select.trigger

```ts
readonly trigger: object;
```

###### Type declaration

###### select.trigger.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

###### select.list

```ts
readonly list: object;
```

###### Type declaration

###### select.list.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

##### none

```ts
readonly none: object;
```

###### Type declaration

###### none.value

```ts
readonly value: 0 = 0;
```

##### xs

```ts
readonly xs: object;
```

###### Type declaration

###### xs.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### xs.modify

```ts
readonly modify: object;
```

###### Type declaration

###### xs.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### xs.modify.value

```ts
readonly value: 0.25 = 0.25;
```

##### sm

```ts
readonly sm: object;
```

###### Type declaration

###### sm.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### sm.modify

```ts
readonly modify: object;
```

###### Type declaration

###### sm.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### sm.modify.value

```ts
readonly value: 0.5 = 0.5;
```

##### md

```ts
readonly md: object;
```

###### Type declaration

###### md.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### md.modify

```ts
readonly modify: object;
```

###### Type declaration

###### md.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### md.modify.value

```ts
readonly value: 0.75 = 0.75;
```

##### lg

```ts
readonly lg: object;
```

###### Type declaration

###### lg.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### lg.modify

```ts
readonly modify: object;
```

###### Type declaration

###### lg.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### lg.modify.value

```ts
readonly value: 1 = 1;
```

##### xl

```ts
readonly xl: object;
```

###### Type declaration

###### xl.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### xl.modify

```ts
readonly modify: object;
```

###### Type declaration

###### xl.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### xl.modify.value

```ts
readonly value: 1.5 = 1.5;
```

##### full

```ts
readonly full: object;
```

###### Type declaration

###### full.value

```ts
readonly value: 99999 = 99999;
```

***

### tokens

```ts
const tokens: object;
```

All the tokens used in the theme.

#### Type declaration

##### borderRadius

```ts
borderRadius: object;
```

###### Type declaration

###### borderRadius.cta

```ts
readonly cta: object;
```

###### Type declaration

###### borderRadius.cta.value

```ts
readonly value: "{borderRadius.full}" = "{borderRadius.full}";
```

###### borderRadius.input

```ts
readonly input: object;
```

###### Type declaration

###### borderRadius.input.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

###### borderRadius.link

```ts
readonly link: object;
```

###### Type declaration

###### borderRadius.link.value

```ts
readonly value: "{borderRadius.full}" = "{borderRadius.full}";
```

###### borderRadius.modal

```ts
readonly modal: object;
```

###### Type declaration

###### borderRadius.modal.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

###### borderRadius.select

```ts
readonly select: object;
```

###### Type declaration

###### borderRadius.select.trigger

```ts
readonly trigger: object;
```

###### Type declaration

###### borderRadius.select.trigger.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

###### borderRadius.select.list

```ts
readonly list: object;
```

###### Type declaration

###### borderRadius.select.list.value

```ts
readonly value: "{borderRadius.sm}" = "{borderRadius.sm}";
```

###### borderRadius.none

```ts
readonly none: object;
```

###### Type declaration

###### borderRadius.none.value

```ts
readonly value: 0 = 0;
```

###### borderRadius.xs

```ts
readonly xs: object;
```

###### Type declaration

###### borderRadius.xs.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### borderRadius.xs.modify

```ts
readonly modify: object;
```

###### Type declaration

###### borderRadius.xs.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### borderRadius.xs.modify.value

```ts
readonly value: 0.25 = 0.25;
```

###### borderRadius.sm

```ts
readonly sm: object;
```

###### Type declaration

###### borderRadius.sm.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### borderRadius.sm.modify

```ts
readonly modify: object;
```

###### Type declaration

###### borderRadius.sm.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### borderRadius.sm.modify.value

```ts
readonly value: 0.5 = 0.5;
```

###### borderRadius.md

```ts
readonly md: object;
```

###### Type declaration

###### borderRadius.md.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### borderRadius.md.modify

```ts
readonly modify: object;
```

###### Type declaration

###### borderRadius.md.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### borderRadius.md.modify.value

```ts
readonly value: 0.75 = 0.75;
```

###### borderRadius.lg

```ts
readonly lg: object;
```

###### Type declaration

###### borderRadius.lg.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### borderRadius.lg.modify

```ts
readonly modify: object;
```

###### Type declaration

###### borderRadius.lg.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### borderRadius.lg.modify.value

```ts
readonly value: 1 = 1;
```

###### borderRadius.xl

```ts
readonly xl: object;
```

###### Type declaration

###### borderRadius.xl.value

```ts
readonly value: "{font.size.base}" = "{font.size.base}";
```

###### borderRadius.xl.modify

```ts
readonly modify: object;
```

###### Type declaration

###### borderRadius.xl.modify.type

```ts
readonly type: "multiply" = "multiply";
```

###### borderRadius.xl.modify.value

```ts
readonly value: 1.5 = 1.5;
```

###### borderRadius.full

```ts
readonly full: object;
```

###### Type declaration

###### borderRadius.full.value

```ts
readonly value: 99999 = 99999;
```

##### colors

```ts
colors: object;
```

###### Type declaration

###### colors.page

```ts
readonly page: object;
```

###### Type declaration

###### colors.page.bg

```ts
readonly bg: object;
```

###### Type declaration

###### colors.page.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.page.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### colors.page.border

```ts
readonly border: object;
```

###### Type declaration

###### colors.page.border.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.page.border.default.value

```ts
readonly value: "{colors.line.default}" = "{colors.line.default}";
```

###### colors.page.text

```ts
readonly text: object;
```

###### Type declaration

###### colors.page.text.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.page.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.page.text.muted

```ts
readonly muted: object;
```

###### Type declaration

###### colors.page.text.muted.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### colors.cta

```ts
readonly cta: object;
```

###### Type declaration

###### colors.cta.primary

```ts
readonly primary: object;
```

###### Type declaration

###### colors.cta.primary.bg

```ts
readonly bg: object;
```

###### Type declaration

###### colors.cta.primary.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.cta.primary.bg.default.value

```ts
readonly value: "{colors.bg.primary}" = "{colors.bg.primary}";
```

###### colors.cta.primary.bg.hover

```ts
readonly hover: object;
```

###### Type declaration

###### colors.cta.primary.bg.hover.value

```ts
readonly value: "{colors.bg.primary}" = "{colors.bg.primary}";
```

###### colors.cta.primary.bg.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.cta.primary.bg.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.cta.primary.bg.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "15%"]];
```

###### colors.cta.primary.bg.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### colors.cta.primary.bg.pressed.value

```ts
readonly value: "{colors.bg.primary}" = "{colors.bg.primary}";
```

###### colors.cta.primary.bg.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.cta.primary.bg.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.cta.primary.bg.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "30%"]];
```

###### colors.cta.primary.border

```ts
readonly border: object;
```

###### Type declaration

###### colors.cta.primary.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### colors.cta.primary.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### colors.cta.primary.text

```ts
readonly text: object;
```

###### Type declaration

###### colors.cta.primary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.cta.primary.text.default.value

```ts
readonly value: "{colors.fg.onPrimary}" = "{colors.fg.onPrimary}";
```

###### colors.cta.primary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### colors.cta.primary.text.hover.value

```ts
readonly value: "{colors.fg.onPrimary}" = "{colors.fg.onPrimary}";
```

###### colors.cta.secondary

```ts
readonly secondary: object;
```

###### Type declaration

###### colors.cta.secondary.bg

```ts
readonly bg: object;
```

###### Type declaration

###### colors.cta.secondary.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.cta.secondary.bg.default.value

```ts
readonly value: "{colors.bg.secondary}" = "{colors.bg.secondary}";
```

###### colors.cta.secondary.bg.hover

```ts
readonly hover: object;
```

###### Type declaration

###### colors.cta.secondary.bg.hover.value

```ts
readonly value: "{colors.bg.secondary}" = "{colors.bg.secondary}";
```

###### colors.cta.secondary.bg.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.cta.secondary.bg.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.cta.secondary.bg.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
```

###### colors.cta.secondary.bg.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### colors.cta.secondary.bg.pressed.value

```ts
readonly value: "{colors.bg.secondary}" = "{colors.bg.secondary}";
```

###### colors.cta.secondary.bg.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.cta.secondary.bg.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.cta.secondary.bg.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "20%"]];
```

###### colors.cta.secondary.border

```ts
readonly border: object;
```

###### Type declaration

###### colors.cta.secondary.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### colors.cta.secondary.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### colors.cta.secondary.text

```ts
readonly text: object;
```

###### Type declaration

###### colors.cta.secondary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.cta.secondary.text.default.value

```ts
readonly value: "{colors.fg.onSecondary}" = "{colors.fg.onSecondary}";
```

###### colors.cta.secondary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### colors.cta.secondary.text.hover.value

```ts
readonly value: "{colors.fg.onSecondary}" = "{colors.fg.onSecondary}";
```

###### colors.link

```ts
readonly link: object;
```

###### Type declaration

###### colors.link.primary

```ts
readonly primary: object;
```

###### Type declaration

###### colors.link.primary.text

```ts
readonly text: object;
```

###### Type declaration

###### colors.link.primary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.link.primary.text.default.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### colors.link.primary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### colors.link.primary.text.hover.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### colors.link.primary.text.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.link.primary.text.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.link.primary.text.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "15%"]];
```

###### colors.link.primary.text.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### colors.link.primary.text.pressed.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### colors.link.primary.text.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.link.primary.text.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.link.primary.text.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "30%"]];
```

###### colors.link.secondary

```ts
readonly secondary: object;
```

###### Type declaration

###### colors.link.secondary.text

```ts
readonly text: object;
```

###### Type declaration

###### colors.link.secondary.text.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.link.secondary.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.link.secondary.text.hover

```ts
readonly hover: object;
```

###### Type declaration

###### colors.link.secondary.text.hover.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.link.secondary.text.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.link.secondary.text.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.link.secondary.text.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
```

###### colors.link.secondary.text.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### colors.link.secondary.text.pressed.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.link.secondary.text.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.link.secondary.text.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.link.secondary.text.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "20%"]];
```

###### colors.input

```ts
readonly input: object;
```

###### Type declaration

###### colors.input.bg

```ts
readonly bg: object;
```

###### Type declaration

###### colors.input.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.input.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### colors.input.border

```ts
readonly border: object;
```

###### Type declaration

###### colors.input.border.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.input.border.default.value

```ts
readonly value: "{colors.line.heavy}" = "{colors.line.heavy}";
```

###### colors.input.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### colors.input.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### colors.input.border.error

```ts
readonly error: object;
```

###### Type declaration

###### colors.input.border.error.value

```ts
readonly value: "{colors.line.negative}" = "{colors.line.negative}";
```

###### colors.input.border.success

```ts
readonly success: object;
```

###### Type declaration

###### colors.input.border.success.value

```ts
readonly value: "{colors.line.positive}" = "{colors.line.positive}";
```

###### colors.input.label

```ts
readonly label: object;
```

###### Type declaration

###### colors.input.label.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.input.label.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.input.placeholder

```ts
readonly placeholder: object;
```

###### Type declaration

###### colors.input.placeholder.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.input.placeholder.default.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### colors.input.text

```ts
readonly text: object;
```

###### Type declaration

###### colors.input.text.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.input.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.input.errorText

```ts
readonly errorText: object;
```

###### Type declaration

###### colors.input.errorText.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.input.errorText.default.value

```ts
readonly value: "{colors.fg.negative}" = "{colors.fg.negative}";
```

###### colors.input.successText

```ts
readonly successText: object;
```

###### Type declaration

###### colors.input.successText.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.input.successText.default.value

```ts
readonly value: "{colors.fg.positive}" = "{colors.fg.positive}";
```

###### colors.select

```ts
readonly select: object;
```

###### Type declaration

###### colors.select.label

```ts
readonly label: object;
```

###### Type declaration

###### colors.select.label.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.label.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.select.trigger

```ts
readonly trigger: object;
```

###### Type declaration

###### colors.select.trigger.bg

```ts
readonly bg: object;
```

###### Type declaration

###### colors.select.trigger.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.trigger.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### colors.select.trigger.bg.hover

```ts
readonly hover: object;
```

###### Type declaration

###### colors.select.trigger.bg.hover.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### colors.select.trigger.bg.hover.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.select.trigger.bg.hover.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.select.trigger.bg.hover.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "5%"]];
```

###### colors.select.trigger.bg.pressed

```ts
readonly pressed: object;
```

###### Type declaration

###### colors.select.trigger.bg.pressed.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### colors.select.trigger.bg.pressed.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.select.trigger.bg.pressed.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.select.trigger.bg.pressed.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "7%"]];
```

###### colors.select.trigger.border

```ts
readonly border: object;
```

###### Type declaration

###### colors.select.trigger.border.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.trigger.border.default.value

```ts
readonly value: "{colors.line.default}" = "{colors.line.default}";
```

###### colors.select.trigger.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### colors.select.trigger.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### colors.select.trigger.border.error

```ts
readonly error: object;
```

###### Type declaration

###### colors.select.trigger.border.error.value

```ts
readonly value: "{colors.line.negative}" = "{colors.line.negative}";
```

###### colors.select.trigger.border.success

```ts
readonly success: object;
```

###### Type declaration

###### colors.select.trigger.border.success.value

```ts
readonly value: "{colors.line.positive}" = "{colors.line.positive}";
```

###### colors.select.trigger.placeholder

```ts
readonly placeholder: object;
```

###### Type declaration

###### colors.select.trigger.placeholder.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.trigger.placeholder.default.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### colors.select.trigger.text

```ts
readonly text: object;
```

###### Type declaration

###### colors.select.trigger.text.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.trigger.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.select.trigger.errorText

```ts
readonly errorText: object;
```

###### Type declaration

###### colors.select.trigger.errorText.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.trigger.errorText.default.value

```ts
readonly value: "{colors.fg.negative}" = "{colors.fg.negative}";
```

###### colors.select.trigger.successText

```ts
readonly successText: object;
```

###### Type declaration

###### colors.select.trigger.successText.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.trigger.successText.default.value

```ts
readonly value: "{colors.fg.positive}" = "{colors.fg.positive}";
```

###### colors.select.list

```ts
readonly list: object;
```

###### Type declaration

###### colors.select.list.bg

```ts
readonly bg: object;
```

###### Type declaration

###### colors.select.list.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.list.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### colors.select.list.border

```ts
readonly border: object;
```

###### Type declaration

###### colors.select.list.border.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.list.border.default.value

```ts
readonly value: "{colors.line.default}" = "{colors.line.default}";
```

###### colors.select.list.border.focus

```ts
readonly focus: object;
```

###### Type declaration

###### colors.select.list.border.focus.value

```ts
readonly value: "{colors.line.primary}" = "{colors.line.primary}";
```

###### colors.select.list.border.error

```ts
readonly error: object;
```

###### Type declaration

###### colors.select.list.border.error.value

```ts
readonly value: "{colors.line.negative}" = "{colors.line.negative}";
```

###### colors.select.list.border.success

```ts
readonly success: object;
```

###### Type declaration

###### colors.select.list.border.success.value

```ts
readonly value: "{colors.line.positive}" = "{colors.line.positive}";
```

###### colors.select.list.item

```ts
readonly item: object;
```

###### Type declaration

###### colors.select.list.item.bg

```ts
readonly bg: object;
```

###### Type declaration

###### colors.select.list.item.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.list.item.bg.default.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### colors.select.list.item.bg.highlight

```ts
readonly highlight: object;
```

###### Type declaration

###### colors.select.list.item.bg.highlight.value

```ts
readonly value: "{colors.bg.default}" = "{colors.bg.default}";
```

###### colors.select.list.item.bg.highlight.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.select.list.item.bg.highlight.modify.type

```ts
readonly type: "color-mix" = "color-mix";
```

###### colors.select.list.item.bg.highlight.modify.value

```ts
readonly value: readonly [readonly ["{colors.bg.contrast}", "10%"]];
```

###### colors.select.list.item.text

```ts
readonly text: object;
```

###### Type declaration

###### colors.select.list.item.text.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.select.list.item.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.select.list.item.text.muted

```ts
readonly muted: object;
```

###### Type declaration

###### colors.select.list.item.text.muted.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### colors.select.list.item.text.onHighlight

```ts
readonly onHighlight: object;
```

###### Type declaration

###### colors.select.list.item.text.onHighlight.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.select.list.item.text.mutedOnHighlight

```ts
readonly mutedOnHighlight: object;
```

###### Type declaration

###### colors.select.list.item.text.mutedOnHighlight.value

```ts
readonly value: "{colors.fg.muted}" = "{colors.fg.muted}";
```

###### colors.code

```ts
readonly code: object;
```

###### Type declaration

###### colors.code.bg

```ts
readonly bg: object;
```

###### Type declaration

###### colors.code.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.code.bg.default.value

```ts
readonly value: "{colors.bg.alternate}" = "{colors.bg.alternate}";
```

###### colors.code.border

```ts
readonly border: object;
```

###### Type declaration

###### colors.code.border.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.code.border.default.value

```ts
readonly value: "{colors.line.heavy}" = "{colors.line.heavy}";
```

###### colors.code.text

```ts
readonly text: object;
```

###### Type declaration

###### colors.code.text.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.code.text.default.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.bg

```ts
readonly bg: object;
```

###### Type declaration

###### colors.bg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.bg.default.value

```ts
readonly value: "#ffffff" = colorsBase.white;
```

###### colors.bg.alternate

```ts
readonly alternate: object;
```

###### Type declaration

###### colors.bg.alternate.value

```ts
readonly value: "#eef0f3" = colorsBase.gray100;
```

###### colors.bg.contrast

```ts
readonly contrast: object;
```

###### Type declaration

###### colors.bg.contrast.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.bg.overlay

```ts
readonly overlay: object;
```

###### Type declaration

###### colors.bg.overlay.value

```ts
readonly value: "{colors.bg.alternate}" = "{colors.bg.alternate}";
```

###### colors.bg.overlay.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.bg.overlay.modify.type

```ts
readonly type: "color-alpha" = "color-alpha";
```

###### colors.bg.overlay.modify.value

```ts
readonly value: 0.33 = 0.33;
```

###### colors.bg.skeleton

```ts
readonly skeleton: object;
```

###### Type declaration

###### colors.bg.skeleton.value

```ts
readonly value: "{colors.fg.default}" = "{colors.fg.default}";
```

###### colors.bg.skeleton.modify

```ts
readonly modify: object;
```

###### Type declaration

###### colors.bg.skeleton.modify.type

```ts
readonly type: "color-alpha" = "color-alpha";
```

###### colors.bg.skeleton.modify.value

```ts
readonly value: 0.1 = 0.1;
```

###### colors.bg.primary

```ts
readonly primary: object;
```

###### Type declaration

###### colors.bg.primary.value

```ts
readonly value: "#0052ff" = colorsBase.blue500;
```

###### colors.bg.secondary

```ts
readonly secondary: object;
```

###### Type declaration

###### colors.bg.secondary.value

```ts
readonly value: "#eef0f3" = colorsBase.gray100;
```

###### colors.fg

```ts
readonly fg: object;
```

###### Type declaration

###### colors.fg.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.fg.default.value

```ts
readonly value: "#0a0b0d" = colorsBase.black;
```

###### colors.fg.muted

```ts
readonly muted: object;
```

###### Type declaration

###### colors.fg.muted.value

```ts
readonly value: "#5b616e" = colorsBase.gray700;
```

###### colors.fg.primary

```ts
readonly primary: object;
```

###### Type declaration

###### colors.fg.primary.value

```ts
readonly value: "#0052ff" = colorsBase.blue500;
```

###### colors.fg.onPrimary

```ts
readonly onPrimary: object;
```

###### Type declaration

###### colors.fg.onPrimary.value

```ts
readonly value: "#ffffff" = colorsBase.white;
```

###### colors.fg.onSecondary

```ts
readonly onSecondary: object;
```

###### Type declaration

###### colors.fg.onSecondary.value

```ts
readonly value: "#0a0b0d" = colorsBase.black;
```

###### colors.fg.positive

```ts
readonly positive: object;
```

###### Type declaration

###### colors.fg.positive.value

```ts
readonly value: "#098551" = colorsBase.green500;
```

###### colors.fg.negative

```ts
readonly negative: object;
```

###### Type declaration

###### colors.fg.negative.value

```ts
readonly value: "#cf202f" = colorsBase.red500;
```

###### colors.fg.warning

```ts
readonly warning: object;
```

###### Type declaration

###### colors.fg.warning.value

```ts
readonly value: "#ed702f" = colorsBase.amber500;
```

###### colors.line

```ts
readonly line: object;
```

###### Type declaration

###### colors.line.default

```ts
readonly default: object;
```

###### Type declaration

###### colors.line.default.value

```ts
readonly value: "#dcdfe4" = colorsBase.gray200;
```

###### colors.line.heavy

```ts
readonly heavy: object;
```

###### Type declaration

###### colors.line.heavy.value

```ts
readonly value: "#9397a0" = colorsBase.gray500;
```

###### colors.line.primary

```ts
readonly primary: object;
```

###### Type declaration

###### colors.line.primary.value

```ts
readonly value: "{colors.fg.primary}" = "{colors.fg.primary}";
```

###### colors.line.positive

```ts
readonly positive: object;
```

###### Type declaration

###### colors.line.positive.value

```ts
readonly value: "{colors.fg.positive}" = "{colors.fg.positive}";
```

###### colors.line.negative

```ts
readonly negative: object;
```

###### Type declaration

###### colors.line.negative.value

```ts
readonly value: "{colors.fg.negative}" = "{colors.fg.negative}";
```

##### font

```ts
font: object;
```

###### Type declaration

###### font.family

```ts
readonly family: object;
```

###### Type declaration

###### font.family.page

```ts
readonly page: object;
```

###### Type declaration

###### font.family.page.value

```ts
readonly value: "{font.family.body}" = "{font.family.body}";
```

###### font.family.cta

```ts
readonly cta: object;
```

###### Type declaration

###### font.family.cta.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### font.family.link

```ts
readonly link: object;
```

###### Type declaration

###### font.family.link.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### font.family.input

```ts
readonly input: object;
```

###### Type declaration

###### font.family.input.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### font.family.select

```ts
readonly select: object;
```

###### Type declaration

###### font.family.select.value

```ts
readonly value: "{font.family.interactive}" = "{font.family.interactive}";
```

###### font.family.code

```ts
readonly code: object;
```

###### Type declaration

###### font.family.code.value

```ts
readonly value: "{font.family.mono}" = "{font.family.mono}";
```

###### font.family.mono

```ts
readonly mono: object;
```

###### Type declaration

###### font.family.mono.value

```ts
readonly value: "\"DM Mono\", monospace" = '"DM Mono", monospace';
```

###### font.family.sans

```ts
readonly sans: object;
```

###### Type declaration

###### font.family.sans.value

```ts
readonly value: "\"Rethink Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"" = '"Rethink Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
```

###### font.family.body

```ts
readonly body: object;
```

###### Type declaration

###### font.family.body.value

```ts
readonly value: "{font.family.sans}" = "{font.family.sans}";
```

###### font.family.interactive

```ts
readonly interactive: object;
```

###### Type declaration

###### font.family.interactive.value

```ts
readonly value: "{font.family.sans}" = "{font.family.sans}";
```

###### font.size

```ts
readonly size: object;
```

###### Type declaration

###### font.size.base

```ts
readonly base: object;
```

###### Type declaration

###### font.size.base.value

```ts
readonly value: 16 = 16;
```

***

### cssVariables

```ts
const cssVariables: CDPWebCSSVariables;
```

The CSS variables for the theme.

This is the theme object with a namespace added to the keys (`--cdp-web-`).

#### See

[theme](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react/index#theme-4) for the theme object
