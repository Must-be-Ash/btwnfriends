# 🚀 Gasless Email-Based Escrow Deployment Guide

This guide will help you deploy the new SimpleEscrow contract and set up the gasless claiming system.

## 📋 Prerequisites

1. **Foundry installed** (for contract deployment)
2. **Base Sepolia ETH** for deployment and admin wallet
3. **Environment variables** configured

## 🔧 Step 1: Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Fill in your environment variables:
```bash
# Your CDP Project ID from portal.cdp.coinbase.com
NEXT_PUBLIC_CDP_PROJECT_ID=your_project_id

# Your MongoDB connection string
DATABASE_URL=your_mongodb_url

# Generate a new private key for the admin wallet
# ⚠️  NEVER use a key with real funds on mainnet!
ADMIN_WALLET_PRIVATE_KEY=0x... 
```

## 🏗️ Step 2: Generate Admin Wallet

Generate a new private key for the admin wallet:

```bash
# Using openssl
openssl rand -hex 32

# Or using foundry
cast wallet new
```

**Important**: 
- Save the private key securely
- Fund this wallet with Base Sepolia ETH (~0.1 ETH should be enough for testing)
- This wallet will pay gas for all user claims

## 📦 Step 3: Deploy SimpleEscrow Contract

1. **Set up your private key for deployment**:
```bash
export PRIVATE_KEY=your_deployer_private_key
```

2. **Deploy the contract**:
```bash
forge script script/DeploySimpleEscrow.s.sol --rpc-url https://sepolia.base.org --broadcast
```

3. **Copy the deployed contract address** from the output and add to `.env.local`:
```bash
NEXT_PUBLIC_SIMPLE_ESCROW_ADDRESS=0x...
```

## ⚙️ Step 4: Fund Admin Wallet

Send Base Sepolia ETH to your admin wallet address:

```bash
# Get admin wallet address
cast wallet address $ADMIN_WALLET_PRIVATE_KEY

# Send ETH to this address using a faucet or your test wallet
```

## 🧪 Step 5: Test the System

1. **Start the development server**:
```bash
npm run dev
```

2. **Test the complete flow**:
   - Send money to a new email address
   - Sign up with that email address
   - Verify the gasless claim works

## 🔍 Step 6: Verify Deployment

### Contract Verification
- Verify the contract was deployed correctly
- Check that the USDC address is correct (Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`)
- Ensure the admin wallet is the owner

### Admin Wallet Status
Check admin wallet status:
```bash
curl http://localhost:3000/api/admin/release
```

Should return:
```json
{
  "configured": true,
  "address": "0x...",
  "network": "base-sepolia"
}
```

## 🎯 Step 7: Test Gasless Claims

1. **Send a test transfer** to a new email address
2. **Sign up with that email** 
3. **Verify the onboarding flow** shows pending claims
4. **Click "Claim"** and verify:
   - No transaction signing required from user
   - USDC appears in user's wallet
   - Gas paid by admin wallet

## 📊 Monitoring Gas Costs

Track admin wallet ETH balance to monitor gas costs:

```bash
# Check admin wallet balance
cast balance $ADMIN_WALLET_ADDRESS --rpc-url https://sepolia.base.org

# Estimate gas cost per claim (~50,000 gas × gas price)
```

**Typical costs**: ~$0.10-0.50 per claim depending on network congestion.

## 🚨 Security Considerations

1. **Admin Wallet Security**:
   - Use a dedicated wallet only for gas payments
   - Never store large amounts of ETH
   - Monitor for unusual activity

2. **Private Key Management**:
   - Store admin private key securely (consider using a secret manager)
   - Rotate keys periodically
   - Use environment variables, never hardcode

3. **Contract Ownership**:
   - Admin wallet should own the SimpleEscrow contract
   - Consider using a multisig for production

## 🔄 Migration from Old Escrow

The system supports both contracts simultaneously:

- **New transfers**: Use SimpleEscrow (gasless claims)
- **Existing transfers**: Use legacy escrow (signature-based)
- **Gradual migration**: Old transfers will expire naturally

## 🐛 Troubleshooting

### "Admin wallet not configured"
- Check `ADMIN_WALLET_PRIVATE_KEY` is set in `.env.local`
- Verify the private key format (should start with `0x`)

### "SimpleEscrow contract not deployed"
- Check `NEXT_PUBLIC_SIMPLE_ESCROW_ADDRESS` is set
- Verify contract deployment was successful

### "Insufficient funds for gas"
- Fund admin wallet with more Base Sepolia ETH
- Monitor admin wallet balance regularly

### Claims fail silently
- Check admin wallet has ETH for gas
- Verify contract address is correct
- Check network connectivity

## 📈 Production Deployment

For production deployment on Base mainnet:

1. **Generate new admin wallet** with production-grade security
2. **Deploy to Base mainnet** using mainnet RPC
3. **Use mainnet USDC address**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
4. **Set up monitoring** for admin wallet balance
5. **Implement alerts** for low ETH balance
6. **Consider fee structure** to cover gas costs (e.g., 0.1% fee on transfers)

## 🎉 Success!

You now have a fully functional gasless email-based escrow system where:

✅ Recipients can claim funds with zero gas fees  
✅ No transaction signing required from recipients  
✅ Email privacy is maintained (no emails on-chain)  
✅ Senders can refund unclaimed transfers  
✅ Admin wallet handles all gas costs  

The perfect UX for email-based crypto transfers! 🚀