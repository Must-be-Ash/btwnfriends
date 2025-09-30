# Session Token Authentication

## Overview

Coinbase Onramp and Offramp use session tokens for secure authentication. Session tokens are generated on your backend server using your CDP API keys and passed in the URL instead of including sensitive data like wallet addresses as query parameters.

## How Session Tokens Work

Session tokens provide a secure way to initialize Onramp/Offramp experiences:

1. Your backend server generates a session token using the CDP API
2. The token encapsulates user addresses, supported assets, and other configuration
3. You pass the token in the Onramp/Offramp URL
4. The token expires after 5 minutes and can only be used once

### Example URL Format

```bash
https://pay.coinbase.com/buy/select-asset?sessionToken=<token>&<other params>
```

## Implementation Steps

### Step 1: Create a CDP Secret API Key

To generate session tokens, you'll need a Secret API Key from the [CDP Portal](https://portal.cdp.coinbase.com/projects/api-keys):

1. Navigate to your project's **API Keys** tab
2. Select the **Secret API Keys** section
3. Click **Create API key**
4. Configure your key settings (IP allowlist recommended)
5. Download and securely store your API key

<Tip>
  Session tokens must be generated server-side, so you'll need a Secret API Key (not a Client API Key).
</Tip>

### Step 2: Set Up JWT Authentication

To generate session tokens, you need to authenticate with CDP using JWT Bearer tokens. Follow the [CDP API key authentication guide](/api-reference/v2/authentication#generate-bearer-token-jwt-and-export) to set up JWT generation.

### Step 3: Generate Session Tokens

Use the Session Token API to generate tokens for each user session:

<Info>
  For complete API documentation including all parameters and response formats, see the [Create Session Token API Reference](/api-reference/rest-api/onramp-offramp/create-session-token).
</Info>

```bash
curl -X POST 'https://api.developer.coinbase.com/onramp/v1/token' \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "addresses": [
      {
        "address": "0x4315d134aCd3221a02dD380ADE3aF39Ce219037c",
        "blockchains": ["ethereum", "base"]
      }
    ],
    "assets": ["ETH", "USDC"]
  }'
```

**Response:**

```json
{
  "token": "ZWJlNDgwYmItNjBkMi00ZmFiLWIxYTQtMTM3MGI2YjJiNjFh",
  "channel_id": ""
}
```

[See an example](https://github.com/coinbase/onramp-demo-application/blob/51733031e49ed4b505291ee7acbdbee429dceb3c/app/utils/sessionTokenApi.ts) of how to generate a JWT and session token.

### Step 4: Create Onramp/Offramp URLs

Use the session token to create your Onramp/Offramp URLs:

<Info>
  For detailed information about URL parameters and options, see:

  * [Generating an Onramp URL](/onramp-&-offramp/onramp-apis/generating-onramp-url) for onramp parameters
  * [Generating an Offramp URL](/onramp-&-offramp/offramp-apis/generating-offramp-url) for offramp parameters
</Info>

#### Onramp URL Example

```bash
https://pay.coinbase.com/buy/select-asset?sessionToken=ZWJlNDgwYmItNjBkMi00ZmFiLWIxYTQtMTM3MGI2YjJiNjFh&defaultNetwork=base&presetFiatAmount=100
```

#### Offramp URL Example

```bash
https://pay.coinbase.com/v3/sell/input?sessionToken=ZWJlNDgwYmItNjBkMi00ZmFiLWIxYTQtMTM3MGI2YjJiNjFh&partnerUserId=user123&redirectUrl=https://yourapp.com/success
```

## Session Token Properties

* **Expiration**: Session tokens expire after 5 minutes
* **Single-use**: Each token can only be used once
* **Server-side generation**: Must be generated on your backend server

## Support and Resources

* **Sample Code**: [Session Token Implementation](https://github.com/coinbase/onramp-demo-application/blob/51733031e49ed4b505291ee7acbdbee429dceb3c/app/utils/sessionTokenApi.ts)
* **Authentication Guide**: [CDP API Key Authentication](/api-reference/v2/authentication)
* **Community Support**: [CDP Discord](https://discord.com/invite/cdp)
