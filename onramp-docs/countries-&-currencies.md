# Countries & Currencies

## Countries & payment methods

The Config API endpoint returns the current **countries (states)** supported by Coinbase Onramp and the **payment methods** available in each region.
Clients can call this API periodically and cache the response so that they know which users to serve Onramp.
Today, Coinbase operates in 90+ countries and this gets updated as we grow! See FAQ for an overview.

There are two ways to get the config:

1. Use the [fetchOnrampConfig](https://docs.base.org/builderkits/onchainkit/fund/fetch-onramp-config) util to get the config
2. Make a direct call to the API

<Tip>
  Full API endpoint list

  For a complete list of all API endpoints supported by Onramp/Offramp, visit our [API Reference section](/api-reference/rest-api/onramp-offramp/get-buy-config).
</Tip>

### Method

```
GET
```

### URL

```
https://api.developer.coinbase.com/onramp/v1/buy/config
```

### Request Parameters

The Onramp Config API has no request parameters.

### Response Fields

The Onramp Config API returns a JSON response including the following fields.

| Name        | Description                                                                                                                                                                                                                                                                |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `countries` | A list of supported countries, represented by their [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) two digit country code. Each country contains a list of payment method types available in that country; for the US it also contains a list of supported states. |

### Example Request/Response

<Tabs>
  <Tab value="bash" title="Request (cURL)">
    ```bash lines wrap
    cdpcurl -k /tmp/cdp_api_key.json 'https://api.developer.coinbase.com/onramp/v1/buy/config'
    ```
  </Tab>

  <Tab value="jsonResponse" title="Response 200 (JSON)">
    ```json lines wrap
    {
      "data": {
        "countries": [
          {
            "id": "US",
            "subdivisions": ["CA","NY","WA"],
            "payment_methods": [
              {
                "id": "CARD",
              },
              {
                "id": "ACH_BANK_ACCOUNT",
              },
            ],
          },
          {
            "id": "CA",
            "subdivisions": []
            "payment_methods": [
              {
                "id": "CARD",
              },
            ],
          },
        ],
      }
    }
    ```
  </Tab>
</Tabs>

## Fiat currencies and crypto assets supported

The **Options endpoint** returns the supported fiat currencies and available crypto assets that can be passed into the Onramp Quote API.

<Tip>
  Full API endpoint list

  For a complete list of all API endpoints supported by Onramp/Offramp, visit our [API Reference section](/api-reference/rest-api/onramp-offramp/get-buy-options).
</Tip>

### Method

```
GET
```

### URL

```
https://api.developer.coinbase.com/onramp/v1/buy/options
```

### Request Parameters

| Name          | Req | Description                                                                                                                                                                                                                                                                                       |
| :------------ | :-- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `country`     | Y   | [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) two-digit country code string representing the purchasing user’s country of residence, e.g., `US`.                                                                                                                                         |
| `subdivision` | N   | [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) two-digit country subdivision code representing the purchasing user’s subdivision of residence within their country, e.g. `NY`. Required if the `country=“US”` because certain states (e.g., `NY`) have state specific asset restrictions. |

### Response Fields

The Onramp Options API returns a JSON response including the following fields.

| Name                  | Description                                                                                                                                                                                                            |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payment_currencies`  | List of supported fiat currencies that can be exchanged for crypto on Onramp in the given location. Each currency contains a list of available payment methods, with min and max transaction limits for that currency. |
| `purchase_currencies` | List of available crypto assets that can be bought on Onramp in the given location.                                                                                                                                    |

### Example Request/Response

<Tabs>
  <Tab value="bash" title="Request (cURL)">
    ```bash lines wrap
    cdpcurl -k /tmp/cdp_api_key.json 'https://api.developer.coinbase.com/onramp/v1/buy/options?country=US&subdivision=NY'
    ```
  </Tab>

  <Tab value="jsonResponse" title="Response 200 (JSON)">
    ```json lines wrap
    {
      "data": {
        "payment_currencies": [
          {
            "id": "USD",
            "payment_method_limits": [
              {
                "id": "card",
                "min": "10.00",
                "max": "7500.00",
              },
              {
                "id": "ach_bank_account",
                "min": "10.00",
                "max": "25000.00",
              },
            ],
          },
        ],
        "purchase_currencies": [
          {
            "id": "2b92315d-eab7-5bef-84fa-089a131333f5",
            "name": "USD Coin",
            "symbol": "USDC",
            "networks": [
              {
                "name": "ethereum-mainnet",
                "display_name": "Ethereum",
                "chain_id": "1",
                "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              },
              {
                "name": "polygon-mainnet",
                "display_name": "Polygon",
                "chain_id": "137",
                "contract_address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              },
            ]
          }
        ],
      }
    }
    ```
  </Tab>
</Tabs>
