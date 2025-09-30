# Generating Quotes

## Onramp Quote

The Onramp Quote API provides clients with a quote based on the asset the user would like to purchase, the network they plan to purchase it on, the dollar amount of the payment, the payment currency, the payment method, and country of the user.

<Tip>
  The Onramp Quote API can now return a ready-to-use one-click-buy URL. Simply include the `destination_address` parameter in your request to receive a complete `onramp_url` in the response. See the [example with one-click-buy URL](#example-requestresponse-with-one-click-buy-url) below.
</Tip>

<Info>
  Limitations

  The quote provided by this API is an estimate only. It does not guarantee that the user will be able to complete their purchase using the returned quote. Depending on fluctuations in network fees and exchange rates, and whether or not the user chooses the logged in or guest checkout experience, the actual fees charged may be different.
</Info>

There are two ways to get a quote:

1. Use the [fetchOnrampQuote](https://docs.base.org/builderkits/onchainkit/fund/fetch-onramp-quote) util to get a quote
2. Make a direct call to the API

<Tip>
  Full API endpoint list

  For a complete list of all API endpoints supported by Onramp/Offramp, visit our [API Reference section](/api-reference/rest-api/onramp-offramp/create-buy-quote).
</Tip>

### Method

```
POST
```

### URL

```
https://api.developer.coinbase.com/onramp/v1/buy/quote
```

### Request Parameters

The Onramp Quote API is an RPC endpoint that accepts parameters as JSON in the request body.

| Name                  | Type   | Req | Description                                                                                                                                                                                                                                                                                       |
| :-------------------- | :----- | :-- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `purchase_currency`   |        | Y   | ID of the crypto asset the user wants to purchase. Retrieved from the options API.                                                                                                                                                                                                                |
| `purchase_network`    |        | N   | Name of the network that the purchase currency should be purchased on. Retrieved from the options API. If omitted, the default network for the crypto currency is used.                                                                                                                           |
| `payment_amount`      | String | Y   | Fiat amount the user wants to spend to purchase the crypto currency, inclusive of fees with two decimals of precision, e.g., `100.00`.                                                                                                                                                            |
| `payment_currency`    | String | Y   | Fiat currency of the payment amount, e.g., `USD`.                                                                                                                                                                                                                                                 |
| `payment_method`      |        | Y   | ID of payment method used to complete the purchase. Retrieved from the options API.                                                                                                                                                                                                               |
| `country`             |        | Y   | [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) two-digit country code string representing the purchasing user’s country of residence, e.g., `US`.                                                                                                                                         |
| `subdivision`         |        | N   | [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) two-digit country subdivision code representing the purchasing user's subdivision of residence within their country, e.g. `NY`. Required if the `country="US"` because certain states (e.g., `NY`) have state specific asset restrictions. |
| `destination_address` |        | N   | Destination Wallet address. Optional for creating buy quote. Required for generating a ready-to-use one-click-buy URL.                                                                                                                                                                            |

### Response Fields

The Onramp Quote API returns a JSON response including the following fields.

| Name               | Description                                                                                                                                                                                                                             |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payment_total`    | Object with amount and currency of the total fiat payment required to complete the purchase, inclusive of any fees. The currency will match the `payment_currency` in the request if it is supported, otherwise it falls back to `USD`. |
| `payment_subtotal` | Object with amount and currency of the fiat cost of the crypto asset to be purchased, exclusive of any fees. The currency will match the `payment_currency`.                                                                            |
| `purchase_amount`  | Object with amount and currency of the crypto that to be purchased. The currency will match the `purchase_currency` in the request. The number of decimals will be based on the crypto asset.                                           |
| `coinbase_fee`     | Object with amount and currency of the fee changed by the Coinbase exchange to complete the transaction. The currency will match the `payment_currency`.                                                                                |
| `network_fee`      | Object with amount and currency of the network fee required to send the purchased crypto to the user’s wallet. The currency will match the `payment_currency`.                                                                          |
| `quote_id`         | Reference to the quote that should be passed into the initialization parameters when launching the Coinbase Onramp widget via the SDK or URL generator.                                                                                 |
| `onramp_url`       | Ready-to-use one-click-buy URL. Only returned when `destination_address` is provided in the request.                                                                                                                                    |

### Example Request/Response

<Tabs>
  <Tab value="bash" title="Request (cURL)">
    ```bash lines wrap
    cdpcurl -X POST 'https://api.developer.coinbase.com/onramp/v1/buy/quote' \
      -k /tmp/cdp_api_key.json \
      -d '{"purchase_currency": "BTC", "payment_amount": "100.00", "payment_currency": "USD", "payment_method": "CARD", "country": "US", "subdivision": "NY"}'
    ```
  </Tab>

  <Tab value="jsonResponse" title="Response 200 (JSON)">
    ```json lines wrap
    {
      "data": {
        "payment_total": {
          "amount": "100.00",
          "currency": "USD"
        },
        "payment_subtotal": {
          "amount": "97.00",
          "currency": "USD"
        },
        "purchase_amount": {
          "amount": "10.00000000",
          "currency": "BTC"
        },
        "coinbase_fee": {
          "amount": "1.50",
          "currency": "USD"
        },
        "network_fee": {
          "amount": "1.50",
          "currency": "USD"
        },
        "quote_id": "46da84dc-b6d7-11ed-afa1-0242ac120002"
      }
    }
    ```
  </Tab>
</Tabs>

### Example Request/Response with One-Click-Buy URL

<Tabs>
  <Tab value="bash" title="Request with destination_address (cURL)">
    ```bash lines wrap
    cdpcurl -X POST 'https://api.developer.coinbase.com/onramp/v1/buy/quote' \
      -k /tmp/cdp_api_key.json \
      -d '{"purchase_currency": "BTC", "payment_amount": "100.00", "payment_currency": "USD", "payment_method": "CARD", "country": "US", "subdivision": "NY", "destination_address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"}'
    ```
  </Tab>

  <Tab value="jsonResponseWithUrl" title="Response 200 with onramp_url (JSON)">
    ```json lines wrap
    {
      "data": {
        "payment_total": {
          "amount": "100.00",
          "currency": "USD"
        },
        "payment_subtotal": {
          "amount": "97.00",
          "currency": "USD"
        },
        "purchase_amount": {
          "amount": "10.00000000",
          "currency": "BTC"
        },
        "coinbase_fee": {
          "amount": "1.50",
          "currency": "USD"
        },
        "network_fee": {
          "amount": "1.50",
          "currency": "USD"
        },
        "quote_id": "46da84dc-b6d7-11ed-afa1-0242ac120002",
        "onramp_url": "https://pay.coinbase.com/buy/select-asset?sessionToken=MWYwNWQwYzYtN2ExMy02YzI4LWFiODUtZDZmZTcwYTBmYjMy&quoteId=46da84dc-b6d7-11ed-afa1-0242ac120002&defaultPaymentMethod=CARD&presetFiatAmount=100.00&fiatCurrency=USD"
      }
    }
    ```
  </Tab>
</Tabs>
