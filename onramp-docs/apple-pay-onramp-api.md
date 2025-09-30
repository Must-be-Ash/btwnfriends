# Apple Pay Onramp API

<Tip>You can get started testing the Apple Pay Onramp API using [sandbox mode](#testing). When you're ready to test
with real funds [contact us](https://calendar.app.google/BLn6fzaz2aCZGvLu7) to get production access.</Tip>

The new [v2 Onramp Order API](/api-reference/v2/rest-api/onramp/create-an-onramp-order) enables you to build a native
feeling onramp experience with Apple Pay where the user never leaves your app. **It's the fastest onramp experience
available anywhere.** Integrating takes only three steps:

## Integration steps

<Steps>
  <Step title="Call the API">
    Call the [Create Onramp Order API](/api-reference/v2/rest-api/onramp/create-an-onramp-order) to get a quote and an
    Apple Pay payment link. You can fetch the list of available currencies from the [Buy Options API](/api-reference/rest-api/onramp-offramp/get-buy-options).
  </Step>

  <Step title="Render the Apple Pay button">
    Render the Apple Pay button via the [payment link URL](/api-reference/v2/rest-api/onramp/create-an-onramp-order#response-payment-link-url)
    in a webview in your app. The link can only be rendered in iOS apps.
  </Step>

  <Step title="Listen to events and update transaction status">
    Subscribe to [post message events](#post-message-events) from the webview to listen for success/error messages. Use
    these events to notify the user when their transaction succeeds, or what type of error they encountered and how they
    might fix it.
  </Step>
</Steps>

## Requirements

#### User verification

In order to provide an API driven native onramp experience, we rely on you, the app developer, to collect and verify the user's email address and phone number in your request to the [Create Onramp Order API](/api-reference/v2/rest-api/onramp/create-an-onramp-order). You must verify the user's ownership of the email address and phone number, this can be done by sending an OTP using a vendor like Twilio or AWS SES.
Additionally, the phone number must be re-verified at least every 60 days.

#### US only

We currently support the Apple Pay Onramp API for US users with valid US phone numbers. The phone
number must be a real cell phone number, not a VoIP phone number.

#### iOS only

The Apple Pay onramp payment link can only be rendered in a webview in an iOS app. We currently do not support integrating
this use case in web apps via iframe. If you're building a web app based integration, [let us know](https://calendar.app.google/BLn6fzaz2aCZGvLu7).

#### User gesture required

Apple [requires](https://developer.apple.com/documentation/applepayontheweb/creating-an-apple-pay-session) that an Apple
Pay session be created by a user gesture. This means that the user has to physically press the Apple Pay button we
render within the webview. It cannot be programmatically triggered.

#### Legal agreements

Your users must accept Coinbase's [Guest Checkout Terms of Service](https://www.coinbase.com/legal/guest-checkout/us),
[User Agreement](https://www.coinbase.com/legal/user_agreement) and [Privacy Policy](https://www.coinbase.com/legal/privacy)
prior to using Coinbase Onramp. It is your responsibility to clearly inform users that by proceeding with this payment
they are agreeing to these policies.

## Post message events

Payment links returned by the Create Order API are designed to be loaded within a webview so that your app can subscribe
to [post message](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) events emitted by our web component.
Events contain an error code and an error message. The message will be localized for the user so it can be displayed
directly in your app UI. See the documentation of your webview library for details on how to consume post message events.

```javascript Post message event structure
{
  eventName: "<EVENT_NAME>",
  data: {
    errorCode: "<ERROR_CODE>",
    errorMessage: "<ERROR_MESSAGE>",
}
```

### Events names

The following events are published by the Apple Pay button payment link.

<ParamField path="onramp_api.load_pending">
  Emitted when Javascript is initialized and we have started fetching data required to render.
</ParamField>

<ParamField path="onramp_api.load_success">
  Emitted when the Apple Pay button is successfully rendered and ready for user interaction.
</ParamField>

<ParamField path="onramp_api.load_error">
  Emitted when an error occurred attempting to initialize the Apple Pay button. See the error message for more details. Some possible error codes are listed below.
</ParamField>

| Error Code                                 | Description                                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `ERROR_CODE_INIT`                          | The payment link is no longer valid, call the Create Onramp Order endpoint to create a new one.       |
| `ERROR_CODE_GUEST_APPLE_PAY_NOT_SUPPORTED` | The user’s browser or device does not support Apple Pay.                                              |
| `ERROR_CODE_GUEST_APPLE_PAY_NOT_SETUP`     | The user has not set up Apple Pay on their device. Prompt the user to setup Apple Pay then try again. |

<ParamField path="onramp_api.commit_success">
  Emitted after the user presses the Apple Pay button if the transaction was successfully started.
</ParamField>

<ParamField path="onramp_api.commit_error">
  Emitted after the user presses the Apple Pay button if the transaction could not be started. See the error message for more details regarding the payment failure reasons. Some possible error codes are listed below.
</ParamField>

| Error Code                                   | Description                                                                                                                                                                                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERROR_CODE_GUEST_CARD_SOFT_DECLINED`        | The user was declined by the bank. Please contact your bank or try again with a different debit card.<br /><br />Users attempting to use Apple Cash will also get this error, but we cannot distinguish it from other bank decline cases. |
| `ERROR_CODE_GUEST_INVALID_CARD`              | Invalid card or billing address.                                                                                                                                                                                                          |
| `ERROR_CODE_GUEST_CARD_INSUFFICIENT_BALANCE` | The debit card has an insufficient balance to process the transaction.                                                                                                                                                                    |
| `ERROR_CODE_GUEST_CARD_HARD_DECLINED`        | The transaction was declined by the issuing bank of the card.                                                                                                                                                                             |
| `ERROR_CODE_GUEST_CARD_RISK_DECLINED`        | The transaction was flagged by our risk rules and is unable to proceed.                                                                                                                                                                   |
| `ERROR_CODE_GUEST_REGION_MISMATCH`           | The region the user is located in is not supported.                                                                                                                                                                                       |
| `ERROR_CODE_GUEST_PERMISSION_DENIED`         | The user has been blocked from using onramp.                                                                                                                                                                                              |
| `ERROR_CODE_GUEST_CARD_PREPAID_DECLINED`     | The user tried to pay with a prepaid debit card, which is unsupported.                                                                                                                                                                    |
| `ERROR_CODE_GUEST_TRANSACTION_LIMIT`         | This transaction would exceed the user’s weekly transaction limit.                                                                                                                                                                        |
| `ERROR_CODE_GUEST_TRANSACTION_COUNT`         | This transaction would exceed the user’s lifetime transaction count limit (currently 15).                                                                                                                                                 |

<ParamField path="onramp_api.cancel">
  Emitted if the user cancels the Apple Pay popup.
</ParamField>

<ParamField path="onramp_api.polling_start">
  If you keep the webview active in your app after receiving the `onramp_api.commit_success` message, the webview will poll our transaction status API automatically and report success or failure via the following two events.
</ParamField>

<ParamField path="onramp_api.polling_success">
  Emitted if the transaction completed successfully and funds have been sent to the destination wallet address.
</ParamField>

<ParamField path="onramp_api.polling_error">
  Emitted if there was an error processing the transaction. Some possible error codes are listed below.
</ParamField>

| Error Code                                           | Description                                                                                                                                                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ERROR_CODE_GUEST_TRANSACTION_BUY_FAILED`            | We were unable to complete the crypto purchase, likely due to a failed risk check. The user’s card will not be charged.                                                                                |
| `ERROR_CODE_GUEST_TRANSACTION_SEND_FAILED`           | We were unable to send the funds to the user’s destination address, the user’s card will be refunded.                                                                                                  |
| `ERROR_CODE_GUEST_TRANSACTION_TRANSACTION_FAILED`    | An internal error has occurred in Coinbase services, the Onramp team will be automatically notified to investigate.                                                                                    |
| `ERROR_CODE_GUEST_TRANSACTION_AVS_VALIDATION_FAILED` | We were unable to process the transaction due to failure to validate the user’s billing address. Ask the user to verify their billing address with the bank card. The user’s card will not be charged. |

## Testing

You can test your integration with the Apple Pay Onramp API by creating sandbox orders. To create a sandbox order, just
prefix the `partnerUserRef` parameter in your call to the [Create Onramp Order API](/api-reference/v2/rest-api/onramp/create-an-onramp-order#body-partner-user-ref)
with the string `sandbox-`. Doing so will result in your Apple Pay transaction always succeeding, but your debit card will never be charged.

For the `phoneNumber` parameter, you can use any random phone number, as long as it's in a valid US phone number format (example: +1 international code + US area code + 7 digit number; +12345678901)
