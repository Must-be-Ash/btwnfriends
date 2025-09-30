# Welcome to Paymaster

The Coinbase Paymaster API provides [ERC-4337](https://www.erc4337.io/) Account Abstraction endpoints to send transactions from smart wallets and sponsor gas for users.

Paymaster is [ERC-7677](https://www.erc7677.xyz/introduction) compliant and supports both [pm\_getPaymasterStubData](https://www.erc7677.xyz/reference/paymasters/getPaymasterStubData) and [pm\_getPaymasterData](https://www.erc7677.xyz/reference/paymasters/getPaymasterData).

The endpoint also provides access to our Bundler.

## Get Started

1. [Create](https://coinbase.com/developer-platform) a new CDP account or [sign in](https://portal.cdp.coinbase.com) to your existing account.
2. Create a new project.
3. Navigate to the Paymaster product where you'll see \$100 in credits (and can get \$500 more for adding a payment method).
4. Use the Playground to make a request and see the response.
5. Set your gas policy configurations. Allowlist at least one contract to protect against unintended sponsorship (disregard if allowlisting through a paymaster proxy).
6. Start sending UserOperations and creating gasless experiences for your users.
7. [Apply for additional gas credits](https://docs.google.com/forms/d/1yPnBFW0bVUNLUN_w3ctCqYM9sjdIQO3Typ53KXlsS5g/viewform?edit_requested=true\&pli=1) as you scale.

<Accordion title="Expand for images and click to enlarge">
  <img src="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-sponsorship-scw.png?fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=a6e63e0bc522da8a903df03727f52638" width="413" height="591" data-path="paymaster/images/pb-sponsorship-scw.png" srcset="https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-sponsorship-scw.png?w=280&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=f4ebcb847719c3e92997ff696d51c691 280w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-sponsorship-scw.png?w=560&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=3dbd399b66678754adf2725ebecacaff 560w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-sponsorship-scw.png?w=840&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=30b71f6a5438b9f1d8f8f666140e1eba 840w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-sponsorship-scw.png?w=1100&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=f02044089e6e88a5503a99baf2baf698 1100w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-sponsorship-scw.png?w=1650&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=0d78e0cceeb0dc3c39640f79f5be4c09 1650w, https://mintcdn.com/coinbase-prod/s_QeFV8SFwGVfV_u/paymaster/images/pb-sponsorship-scw.png?w=2500&fit=max&auto=format&n=s_QeFV8SFwGVfV_u&q=85&s=ae398665b22aa5aa9cfe33ed870a6179 2500w" data-optimize="true" data-opv="2" />
</Accordion>

### Example Repository

See [our examples on GitHub](https://github.com/coinbase/paymaster-bundler-examples) for details on integrating our Paymaster with popular SDKs.

### Want More Guidance?

If you'd like more specific guidance, reach out to us in the [`#paymaster` channel](https://discord.com/channels/1220414409550336183/1233164126251909190) in the CDP Discord.
