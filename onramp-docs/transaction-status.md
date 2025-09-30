# Transaction Status & History

## Onramp Transaction Status

The Transaction Status API provides developers with a real time list of user Onramp transactions. Developers can poll the real time status of transactions and show users a view of their Coinbase Onramp transactions made within the client app.

To link all transactions created during the session, developers must provide the (optional) field `partnerUserId` as a query parameter when [initializing Coinbase Onramp](/onramp-&-offramp/onramp-apis/generating-onramp-url).

Transaction Status returns a paginated list of all transactions from newest to oldest. If the client app doesn’t have a concept of a user, clients can pass a random `partnerUserId` to reference a one-off session.

<Tip>
  Full API endpoint list

  For a complete list of all API endpoints supported by Onramp/Offramp, visit our [API Reference section](/api-reference/rest-api/onramp-offramp/get-onramp-transactions-by-id).
</Tip>

### Method

```
GET
```

### URL

```
https://api.developer.coinbase.com/onramp/v1/buy/user/{partner_user_id}/transactions?page_key={next_page_key}&page_size={page_size}
```

### Request Parameters

The Transaction Status API is an RPC endpoint that accepts an argument as part of its URL path.

| Name              | Type   | Req | Description                                                                   |
| :---------------- | :----- | :-- | :---------------------------------------------------------------------------- |
| `partner_user_id` | String | Y   | ID referring to user Onramp transactions in client app.                       |
| `page_key`        | String | N   | Reference to next page of transactions. Returned in previous page’s response. |
| `page_size`       | Number | N   | Number of transactions to return per page. Default is 1.                      |

### Response Fields

The Transaction Status API returns a JSON response including the following fields.

| Name            | Description                                                  |
| :-------------- | :----------------------------------------------------------- |
| `transactions`  | List of `OnrampTransactions` in reverse chronological order. |
| `next_page_key` | A reference to the next page of transactions.                |
| `total_count`   | The total number of transactions made by the user.           |

#### Onramp Transaction Schema

| Name                | Description                                                                                                       | Value                                                                                                                    |
| :------------------ | :---------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| `status`            | Status of the onramp transaction.                                                                                 | `ONRAMP_TRANSACTION_STATUS_IN_PROGRESS`<br />`ONRAMP_TRANSACTION_STATUS_SUCCESS`<br />`ONRAMP_TRANSACTION_STATUS_FAILED` |
| `purchase_currency` | Crypto currency being purchased.                                                                                  | String                                                                                                                   |
| `purchase_network`  | Network used to deliver crypto to the user’s wallet.                                                              | String                                                                                                                   |
| `purchase_amount`   | Amount of crypto currency being purchased.                                                                        | String                                                                                                                   |
| `payment_total`     | Total amount of fiat the user will pay.                                                                           | String                                                                                                                   |
| `payment_subtotal`  | Amount of fiat the user will pay, exclusive of fees                                                               | String                                                                                                                   |
| `coinbase_fee`      | Amount of fiat charged to cover brokerage fees.                                                                   | String                                                                                                                   |
| `network_fee`       | Amount of fiat charged to cover network fees.                                                                     | String                                                                                                                   |
| `exchange_rate`     | Unit price of the crypto currency being purchased.                                                                | String                                                                                                                   |
| `country`           | Country the user resides in.                                                                                      | String                                                                                                                   |
| `user_id`           | Unique identifier representing the user.                                                                          | String                                                                                                                   |
| `partner_user_ref`  | `partner_user_ref` corresponds to the `partnerUserId` parameter if one was originally included in the Onramp URL. | String                                                                                                                   |
| `payment_method`    | Type of payment method the user is paying with.                                                                   | `CARD`<br />`ACH_BANK_ACCOUNT`<br />`APPLE_PAY`<br />`FIAT_WALLET`<br />`CRYPTO_WALLET`<br />                            |
| `tx_hash`           | The block hash of the onchain send.                                                                               | String                                                                                                                   |
| `transaction_id`    | Unique identifier for the onramp transaction                                                                      | String                                                                                                                   |
| `wallet_address`    | The address of the wallet the transaction was sent to.                                                            | String                                                                                                                   |
| `type`              | The type of transaction.                                                                                          | `ONRAMP_TRANSACTION_TYPE_BUY_AND_SEND`<br />`ONRAMP_TRANSACTION_TYPE_SEND`<br />                                         |

### Example Request/Response

<Tabs>
  <Tab value="bash" title="Request (cURL)">
    ```bash lines wrap
    cdpcurl -k /tmp/cdp_api_key.json 'https://api.developer.coinbase.com/onramp/v1/buy/user/{partner_user_id}/transactions?page_key={next_page_key}&page_size={page_size}'
    ```
  </Tab>

  <Tab value="jsonResponse" title="Response 200 (JSON)">
    ```json lines wrap
    {
        "transactions": [
            {
                "status":"ONRAMP_TRANSACTION_STATUS_SUCCESS",
                "purchase_currency": "USDC",
                "purchase_network": "base",
                "purchase_amount": {
                    "value": "5",
                    "currency": "USDC"
                },
                "payment_total": {
                    "value": "5.07",
                    "currency": "USD"
                },
                "payment_subtotal": {
                    "value": "5",
                    "currency": "USD"
                },
                "coinbase_fee": {
                    "value": "0",
                    "currency": "USD"
                },
                "network_fee": {
                    "value": "0.07",
                    "currency": "USD"
                },
                "exchange_rate": {
                    "value": "1",
                    "currency": "USDC"
                },
                "tx_hash": "0x31814ba2fef2a400a9816767370be09ca12d9e9753b972198fe330a0ecedcbf6",
                "created_at": "2023-09-26T20:06:07.076Z",
                "country": "US",
                "user_id": "9f86d081884c7d659a2feaa0c55ad01",
                "payment_method": "CARD",
                "transaction_id": "1ee7a7ec-fdd1-6032-ad91-0e2bacb520d3"
        }
    ],
    "next_page_key":"eyJndF9za2lwIjowLCJvdF9za2lwIjoxfQ==",
    "total_count":"3"
    }
    ```
  </Tab>
</Tabs>

## Onramp Transactions

The Transactions API provides clients with a historical list of Coinbase Onramp transactions between two dates.
Transactions returns a paginated list of all transactions from newest to oldest.
The Transactions API is indented for analytics purposes.

If you need real time information about a specific transaction, use the [Onramp Transaction Status API](#onramp-transaction-status).

<Tip>
  Full API endpoint list

  For a complete list of all API endpoints supported by Onramp/Offramp, visit our [API Reference section](/api-reference/rest-api/onramp-offramp/get-all-onramp-transactions).
</Tip>

### Method

```
GET
```

### URL

```
https://api.developer.coinbase.com/onramp/v1/buy/transactions?page_key={next_page_key}&page_size={page_size}&start_date={start_date}&end_date={end_date}
```

### Request Parameters

| Name         | Type   | Req | Description                                                                                                                                  |
| :----------- | :----- | :-- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `page_key`   | String | N   | Reference to next page of transactions. Returned in previous page’s response.                                                                |
| `page_size`  | Number | N   | Number of transactions to return per page. Default is 1000.                                                                                  |
| `start_date` | String | N   | The start date (inclusive) of the range of transactions to return. YYYY-MM-DD format - UTC Timezone. Default is one month before `end_date`. |
| `end_date`   | String | N   | The end date (exclusive) of the range of transactions to return. YYYY-MM-DD format. Default is tomorrow.                                     |

### Response Fields

The Transaction API returns a JSON response including the following fields.

| Name            | Description                                                  |
| :-------------- | :----------------------------------------------------------- |
| `transactions`  | List of `OnrampTransactions` in reverse chronological order. |
| `next_page_key` | A reference to the next page of transactions.                |

#### Onramp Transaction Schema

| Name                | Description                                                                                                       | Value                                                                                   |
| :------------------ | :---------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| `status`            | Status of the buy transaction.                                                                                    | `ONRAMP_TRANSACTION_STATUS_SUCCESS`<br />`ONRAMP_TRANSACTION_STATUS_FAILED`             |
| `purchase_currency` | Crypto currency being purchased.                                                                                  | String                                                                                  |
| `purchase_network`  | Network used to deliver crypto to the user’s wallet.                                                              | String                                                                                  |
| `purchase_amount`   | Amount of crypto currency being purchased.                                                                        | String                                                                                  |
| `payment_total`     | Total amount of fiat the user will pay.                                                                           | String                                                                                  |
| `payment_subtotal`  | Amount of fiat the user will pay, exclusive of fees                                                               | String                                                                                  |
| `coinbase_fee`      | Amount of fiat charged to cover brokerage fees.                                                                   | String                                                                                  |
| `network_fee`       | Amount of fiat charged to cover network fees.                                                                     | String                                                                                  |
| `exchange_rate`     | Unit price of the crypto currency being purchased.                                                                | String                                                                                  |
| `country`           | Country the user resides in.                                                                                      | String                                                                                  |
| `user_id`           | Unique identifier representing the user.                                                                          | String                                                                                  |
| `partner_user_ref`  | `partner_user_ref` corresponds to the `partnerUserId` parameter if one was originally included in the Onramp URL. | String                                                                                  |
| `payment_method`    | Type of payment method the user is paying with.                                                                   | `CARD`<br />`ACH_BANK_ACCOUNT`<br />`APPLE_PAY`<br />`FIAT_WALLET`<br />`CRYPTO_WALLET` |
| `tx_hash`           | The block hash of the onchain send.                                                                               | String                                                                                  |
| `transaction_id`    | Unique identifier for the onramp transaction                                                                      | String                                                                                  |
| `wallet_address`    | The address of the wallet the transaction was sent to.                                                            | String                                                                                  |
| `type`              | The type of transaction.                                                                                          | `ONRAMP_TRANSACTION_TYPE_BUY_AND_SEND`<br />`ONRAMP_TRANSACTION_TYPE_SEND`<br />        |

### Example Request/Response

<Tabs>
  <Tab value="bash" title="Request (cURL)">
    ```bash lines wrap
    cdpcurl -k /tmp/cdp_api_key.json 'https://api.developer.coinbase.com/onramp/v1/buy/transactions?page_key={next_page_key}&page_size={page_size}&start_date={start_date}&end_date={end_date}'
    ```
  </Tab>

  <Tab value="jsonResponse" title="Response 200 (JSON)">
    ```json lines wrap
    {
        "transactions": [
            {
                "status":"ONRAMP_TRANSACTION_STATUS_SUCCESS",
                "purchase_currency": "USDC",
                "purchase_network": "base",
                "purchase_amount": {
                    "value": "5",
                    "currency": "USDC"
                },
                "payment_total": {
                    "value": "5.07",
                    "currency": "USD"
                },
                "payment_subtotal": {
                    "value": "5",
                    "currency": "USD"
                },
                "coinbase_fee": {
                    "value": "0",
                    "currency": "USD"
                },
                "network_fee": {
                    "value": "0.07",
                    "currency": "USD"
                },
                "exchange_rate": {
                    "value": "1",
                    "currency": "USDC"
                },
                "tx_hash": "0x31814ba2fef2a400a9816767370be09ca12d9e9753b972198fe330a0ecedcbf6",
                "created_at": "2023-09-26T20:06:07.076Z",
                "country": "US",
                "user_id": "9f86d081884c7d659a2feaa0c55ad01",
                "payment_method": "CARD",
                "transaction_id": "1ee7a7ec-fdd1-6032-ad91-0e2bacb520d3",
                "wallet_address": "0x3d7b51da8AA41270C6e052eE261db4514Ba4D50A"
        }
    ],
    "next_page_key":"eyJndF9za2lwIjowLCJvdF9za2lwIjoxfQ==",
    }
    ```
  </Tab>
</Tabs>
