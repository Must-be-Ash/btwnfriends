# SignIn Component

## Overview

The `SignIn` component provides a flexible and composable way to implement embedded wallet authentication flows. It is designed to be easily extensible with new authentication methods and allows for complete customization of the UI through a system of subcomponents and render props.

The core features include:

* Support for multiple authentication methods (e.g., Email, SMS).
* Multi-step authentication process (i.e., credential input followed by verification).
* Composable UI that gives developers full control over the layout and styling.
* Smooth transitions between authentication methods and steps.
* Centralized state management for the sign-in process.

## Architecture

The component is broken down into several parts that work together to create the sign-in experience.

### Composition model

Instead of a monolithic component, `SignIn` is a collection of subcomponents that can be composed together. This allows developers to structure the UI as they see fit by providing their own children. If no children are provided, a default will be rendered.

The main components are:

* `SignIn`: The root wrapper component that provides the `SignInContext`.
* `SignInTitle`: Renders the title for the current step and authentication method.
* `SignInDescription`: Renders a description for the current step and authentication method.
* `SignInForm`: Renders the form for the current step and authentication method.
* `SignInAuthMethodButtons`: Renders buttons to switch between authentication methods.
* `SignInBackButton`: A button to navigate to the previous step.
* `SignInImage`: A component to render the app logo (provided in `config` in the `CDPReactProvider`)
* `SignInFooter`: The "Secured by Coinbase" footer for the sign-in component.

### SignIn

The `SignIn` component also offers a `children` render function, which provides the `SignInState` as an argument. This is a convenient way to access the sign-in state without needing to use the `useSignInContext` hook directly.

**Example of `children` as a render function:**

```tsx lines
function MySignInPage() {
  return (
    <SignIn>
      {(state) => (
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
          {state.step === 'credentials' && <SignInAuthMethodButtons activeMethod={state.authMethod} />}
          <SignInFooter />
        </>
      )}
    </SignIn>
  );
}
```

### State management (SignInProvider and SignInContext)

State for the entire sign-in flow is managed by `SignInProvider` and accessed via the `useSignInContext` hook. This context holds all the necessary data, such as:

* `step`: The current step in the flow (e.g., `credentials`, `verification`).
* `authMethod`: The selected authentication method (e.g., `email`, `sms`).
* `email`, `phoneNumber`, `otp`: User-provided credentials.
* `isPending`, `error`: State for asynchronous operations.
* `flowId`: The ID for the current authentication flow, returned from the backend.

Subcomponents use this context to determine what to render.

### SignInForm

The `SignInForm` component is responsible for rendering the correct input form based on the current authentication method (`authMethod`) and step of the flow (`step`). It also manages the visual transition when the authentication method changes.

For advanced customization, `SignInForm` provides a `children` render prop. This function receives an object containing the current `step`, `authMethod`, and the `Form` component itself. This allows you to wrap the form and inject other components, which is especially useful for creating custom layouts that respond to the authentication flow.

```tsx lines
<SignInForm>
  {({ step, authMethod, Form }) => (
    <div className={`form-for-${authMethod}`}>
      <p>You are on the {step} step for the {authMethod} method.</p>
      {Form}
    </div>
  )}
</SignInForm>
```

The arguments provided by this render function are essential for correctly handling transitions, as explained in the next section.

### SignInTitle & SignInDescription

These components work similarly. By default, they use `useSignInContext` to get the current `authMethod` and `step` and render the appropriate title or description for the current state of the flow.

They also accept `authMethod` and `step` props, which will override the values from the context. This is a key feature for enabling smooth UI transitions. For example, when switching between authentication methods, the `SignInForm` component will briefly render both the outgoing and incoming views. The `SignInForm`'s `children` render prop provides the correct `authMethod` and `step` for each of these views, which can be passed to `SignInTitle` and `SignInDescription`. This ensures that each view within the transition displays its corresponding title and description, rather than both showing the same text from the global context.

They also accept `children` to allow developers to provide a custom title or description that will be rendered instead of the dynamic content.

### SignInAuthMethodButtons

The `SignInAuthMethodButtons` component renders a list of buttons that allow the user to switch between the available authentication methods. It should typically be rendered only on the `credentials` step. It accepts an `activeMethod` prop to avoid rendering a button for the currently active authentication flow.

## Example: Add page title

**Add a page title based off the current step of the sign in flow**

```tsx lines
import {
  SignIn,
  SignInAuthMethodButtons,
  SignInBackButton,
  SignInDescription,
  SignInFooter,
  SignInForm,
  SignInImage,
  SignInTitle,
  useSignInContext,
} from '@/components/SignIn';

function MySignInPage() {
  return (
    <SignIn>
      <MySignInPageContent />
    </SignIn>
  );
}

function MySignInPageContent() {
  const { state } = useSignInContext();
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
      {state.step === 'credentials' && <SignInAuthMethodButtons activeMethod={state.authMethod} />}
      <SignInFooter />
    </>
  )
}
```

## Example: Recreate default UI

**Put title, description, and authentication method buttons inside the transition container**

```tsx lines
import {
  SignIn,
  SignInAuthMethodButtons,
  SignInBackButton,
  SignInDescription,
  SignInFooter,
  SignInForm,
  SignInImage,
  SignInTitle,
  useSignInContext,
} from '@/components/SignIn';

function MySignInPage() {
  return (
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
  );
}
```
