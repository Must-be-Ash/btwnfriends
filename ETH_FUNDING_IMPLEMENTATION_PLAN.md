# ETH Funding Implementation Plan
## Automatic ETH Distribution for New Users

### Overview

Implement a secure, non-breaking system to automatically send 0.000011 ETH (~$0.05) to new users upon registration. This provides gas funding for their first transactions while maintaining strict security controls to prevent abuse.

## Core Security Requirements

### 1. **CDP Authentication Required**
- Only users who have completed full CDP OTP verification can receive ETH
- Must validate CDP access token before any funding
- Prevent funding for users who bypass normal registration flow

### 2. **One-Time Funding Only**
- Track funding status in database to prevent duplicate funding
- Implement multiple safety checks to ensure single funding per user
- Handle edge cases like failed transactions and retries

### 3. **Graceful Failure Handling**
- Never break user registration if ETH funding fails
- Log all funding attempts and failures for monitoring
- Continue normal app functionality even with depleted admin wallet

### 4. **Abuse Prevention**
- Rate limiting per IP address and email
- Wallet address validation before funding
- Admin wallet balance monitoring and alerts

## Technical Architecture

### Database Schema Changes

```typescript
// Add to User interface in src/lib/models.ts
interface User {
  // ... existing fields
  ethFundingStatus: 'pending' | 'completed' | 'failed' | 'skipped'
  ethFundingTxHash?: string
  ethFundingAmount?: string
  ethFundingAttempts: number
  ethFundingAt?: Date
  ethFundingFailureReason?: string
}

// New collection for funding audit trail
interface EthFundingLog {
  userId: string
  userEmail: string
  walletAddress: string
  amount: string
  status: 'success' | 'failed' | 'insufficient_funds' | 'network_error'
  txHash?: string
  errorMessage?: string
  gasUsed?: string
  gasPrice?: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}
```

### Core Implementation Files

#### 1. **src/lib/eth-funding.ts** (New File)

```typescript
import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base, baseSepolia } from 'viem/chains'

interface EthFundingConfig {
  amount: bigint
  maxRetries: number
  gasLimit: bigint
  maxFeePerGas: bigint
  maxPriorityFeePerGas: bigint
  minAdminBalance: bigint
}

interface FundingResult {
  success: boolean
  txHash?: string
  error?: string
  gasUsed?: bigint
  finalBalance?: bigint
}

export class EthFundingService {
  private config: EthFundingConfig
  private adminAccount: any
  private publicClient: any
  private walletClient: any

  constructor() {
    this.initializeConfig()
    this.initializeClients()
  }

  /**
   * Main funding function with comprehensive safety checks
   */
  async fundNewUser(params: {
    userId: string
    userEmail: string
    walletAddress: string
    ipAddress?: string
    userAgent?: string
  }): Promise<FundingResult> {
    try {
      // 1. Validate inputs
      const validation = await this.validateFundingRequest(params)
      if (!validation.isValid) {
        return { success: false, error: validation.error }
      }

      // 2. Check admin wallet balance
      const balanceCheck = await this.checkAdminBalance()
      if (!balanceCheck.sufficient) {
        await this.logFundingAttempt({...params, status: 'insufficient_funds', errorMessage: balanceCheck.error})
        return { success: false, error: 'Insufficient admin wallet balance' }
      }

      // 3. Check if user already funded
      const alreadyFunded = await this.checkIfAlreadyFunded(params.userId)
      if (alreadyFunded) {
        return { success: false, error: 'User already received ETH funding' }
      }

      // 4. Execute funding transaction
      const fundingResult = await this.executeEthTransfer(params.walletAddress)
      
      // 5. Update database and log
      await this.updateUserFundingStatus(params.userId, fundingResult)
      await this.logFundingAttempt({
        ...params, 
        status: fundingResult.success ? 'success' : 'failed',
        txHash: fundingResult.txHash,
        errorMessage: fundingResult.error
      })

      return fundingResult

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await this.logFundingAttempt({...params, status: 'network_error', errorMessage})
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Validate funding request with multiple security checks
   */
  private async validateFundingRequest(params: any): Promise<{isValid: boolean, error?: string}> {
    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(params.walletAddress)) {
      return { isValid: false, error: 'Invalid wallet address format' }
    }

    // Check rate limiting (implement IP-based rate limiting)
    const rateLimitCheck = await this.checkRateLimit(params.ipAddress, params.userEmail)
    if (!rateLimitCheck.allowed) {
      return { isValid: false, error: 'Rate limit exceeded' }
    }

    // Validate user exists and has proper authentication
    const userExists = await this.validateUserExists(params.userId)
    if (!userExists) {
      return { isValid: false, error: 'User not found or not properly authenticated' }
    }

    return { isValid: true }
  }

  /**
   * Check admin wallet balance with safety margins
   */
  private async checkAdminBalance(): Promise<{sufficient: boolean, error?: string, balance?: bigint}> {
    try {
      const balance = await this.publicClient.getBalance({
        address: this.adminAccount.address
      })

      // Need funding amount + gas costs + safety margin
      const requiredBalance = this.config.amount + this.config.gasLimit * this.config.maxFeePerGas + this.config.minAdminBalance
      
      if (balance < requiredBalance) {
        return { 
          sufficient: false, 
          error: `Insufficient balance. Required: ${formatEther(requiredBalance)} ETH, Available: ${formatEther(balance)} ETH`,
          balance 
        }
      }

      return { sufficient: true, balance }
    } catch (error) {
      return { sufficient: false, error: `Failed to check balance: ${error}` }
    }
  }

  /**
   * Execute ETH transfer with proper gas estimation and error handling
   */
  private async executeEthTransfer(recipientAddress: string): Promise<FundingResult> {
    try {
      // Estimate gas for the transaction
      const gasEstimate = await this.publicClient.estimateGas({
        account: this.adminAccount,
        to: recipientAddress,
        value: this.config.amount
      })

      // Add 20% buffer to gas estimate
      const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100)

      // Get current gas prices
      const feeData = await this.publicClient.estimateFeesPerGas()

      // Execute transaction
      const txHash = await this.walletClient.sendTransaction({
        account: this.adminAccount,
        to: recipientAddress,
        value: this.config.amount,
        gas: gasLimit,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
      })

      // Wait for confirmation
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
        timeout: 60000 // 60 second timeout
      })

      if (receipt.status === 'success') {
        return {
          success: true,
          txHash,
          gasUsed: receipt.gasUsed,
          finalBalance: await this.publicClient.getBalance({ address: recipientAddress })
        }
      } else {
        return {
          success: false,
          error: 'Transaction failed on blockchain',
          txHash
        }
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction execution failed'
      }
    }
  }

  // Additional helper methods...
  private async checkIfAlreadyFunded(userId: string): Promise<boolean> { /* implementation */ }
  private async checkRateLimit(ipAddress?: string, email?: string): Promise<{allowed: boolean}> { /* implementation */ }
  private async validateUserExists(userId: string): Promise<boolean> { /* implementation */ }
  private async updateUserFundingStatus(userId: string, result: FundingResult): Promise<void> { /* implementation */ }
  private async logFundingAttempt(params: any): Promise<void> { /* implementation */ }
}
```

#### 2. **src/app/api/users/route.ts** (Modifications)

```typescript
// Add to existing POST handler
export async function POST(request: NextRequest) {
  try {
    // ... existing user creation logic ...

    // User creation successful - attempt ETH funding
    let fundingResult = null
    try {
      const ethFundingService = new EthFundingService()
      fundingResult = await ethFundingService.fundNewUser({
        userId: newUser.userId,
        userEmail: newUser.email,
        walletAddress: validatedData.walletAddress,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (fundingError) {
      // Log error but don't fail user registration
      console.error('ETH funding failed for new user:', {
        userId: newUser.userId,
        error: fundingError instanceof Error ? fundingError.message : 'Unknown funding error'
      })
      
      // Update user with failed funding status
      await updateUser(newUser.userId, { 
        ethFundingStatus: 'failed',
        ethFundingFailureReason: fundingError instanceof Error ? fundingError.message : 'Unknown error'
      })
    }

    // Return success regardless of funding outcome
    return NextResponse.json({
      success: true,
      user: {
        userId: newUser.userId,
        email: newUser.email,
        displayName: newUser.displayName,
        walletAddress: newUser.walletAddress,
        ethFunding: {
          attempted: true,
          successful: fundingResult?.success || false,
          txHash: fundingResult?.txHash,
          error: fundingResult?.error
        }
      }
    })

  } catch (error) {
    // ... existing error handling ...
  }
}
```

#### 3. **src/lib/models.ts** (Database Updates)

```typescript
// Add new functions for funding management
export async function checkUserFundingStatus(userId: string): Promise<{
  isFunded: boolean,
  status: string,
  txHash?: string,
  attempts: number
}> {
  try {
    const db = await getDatabase()
    const user = await db.collection('users').findOne({ userId })
    
    return {
      isFunded: user?.ethFundingStatus === 'completed',
      status: user?.ethFundingStatus || 'not_attempted',
      txHash: user?.ethFundingTxHash,
      attempts: user?.ethFundingAttempts || 0
    }
  } catch (error) {
    console.error('Error checking funding status:', error)
    return { isFunded: false, status: 'error', attempts: 0 }
  }
}

export async function createEthFundingLog(logData: EthFundingLog): Promise<boolean> {
  try {
    const db = await getDatabase()
    await db.collection('eth_funding_logs').insertOne({
      ...logData,
      timestamp: new Date()
    })
    return true
  } catch (error) {
    console.error('Error creating funding log:', error)
    return false
  }
}

export async function getRecentFundingAttempts(timeWindowMs: number = 3600000): Promise<number> {
  try {
    const db = await getDatabase()
    const since = new Date(Date.now() - timeWindowMs)
    const count = await db.collection('eth_funding_logs').countDocuments({
      timestamp: { $gte: since }
    })
    return count
  } catch (error) {
    console.error('Error getting recent funding attempts:', error)
    return 0
  }
}
```

#### 4. **src/api/admin/funding-status/route.ts** (New Admin Endpoint)

```typescript
// Admin endpoint to monitor funding system health
export async function GET(request: NextRequest) {
  try {
    // Validate admin access (implement proper admin auth)
    const adminAuth = await validateAdminAuth(request)
    if (!adminAuth.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ethFundingService = new EthFundingService()
    
    // Get admin wallet balance
    const balanceInfo = await ethFundingService.getAdminWalletInfo()
    
    // Get recent funding statistics
    const stats = await getFundingStatistics()

    return NextResponse.json({
      adminWallet: {
        address: balanceInfo.address,
        balance: balanceInfo.balance,
        balanceUSD: balanceInfo.balanceUSD,
        canFund: balanceInfo.canFund,
        estimatedFundings: balanceInfo.estimatedFundings
      },
      stats: {
        totalFunded: stats.totalFunded,
        todayFunded: stats.todayFunded,
        failedToday: stats.failedToday,
        recentErrors: stats.recentErrors
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get funding status' }, { status: 500 })
  }
}
```

## Security Controls

### 1. **CDP Authentication Validation**
```typescript
// Ensure only CDP-authenticated users receive funding
async function validateCDPUser(userId: string, accessToken: string): Promise<boolean> {
  try {
    const cdpClient = getCdpClient()
    const endUser = await cdpClient.endUser.validateAccessToken({ accessToken })
    return endUser.userId === userId
  } catch {
    return false
  }
}
```

### 2. **Rate Limiting Implementation**
```typescript
// Prevent abuse with multiple rate limiting layers
class RateLimiter {
  // IP-based: max 1 funding per IP per day
  // Email-based: max 1 funding per email ever
  // Global: max 100 fundings per hour
  // Admin wallet: pause if balance below threshold
}
```

### 3. **Monitoring and Alerts**
```typescript
// Health monitoring system
interface HealthCheck {
  adminWalletBalance: bigint
  recentFailures: number
  systemStatus: 'healthy' | 'warning' | 'critical'
  lastSuccessfulFunding: Date
  estimatedFundingsRemaining: number
}
```

## Configuration Management

### Environment Variables
```bash
# Existing
ADMIN_WALLET_PRIVATE_KEY=your_admin_private_key

# New funding-specific variables
ETH_FUNDING_AMOUNT=0.000011  # Amount in ETH
ETH_FUNDING_ENABLED=true     # Feature flag
ETH_FUNDING_MIN_ADMIN_BALANCE=0.001  # Minimum admin balance to maintain
ETH_FUNDING_MAX_DAILY_FUNDINGS=1000  # Safety limit
ETH_FUNDING_RATE_LIMIT_PER_IP=1      # Max fundings per IP per day
```

### Network-Specific Configuration
```typescript
const FUNDING_CONFIG = {
  'base-sepolia': {
    amount: parseEther('0.000011'),
    enabled: true,
    maxDailyFundings: 1000
  },
  'base': {
    amount: parseEther('0.000011'),
    enabled: true,
    maxDailyFundings: 100  // More conservative on mainnet
  }
}
```

## Error Handling & Recovery

### 1. **Graceful Degradation**
- User registration succeeds even if ETH funding fails
- Clear error messages logged for debugging
- Retry mechanisms for transient failures
- Automatic disabling if admin wallet depleted

### 2. **Recovery Procedures**
```typescript
// Manual retry endpoint for failed fundings
async function retryFailedFunding(userId: string): Promise<FundingResult> {
  // Validate user hasn't been funded since failure
  // Check current admin balance
  // Attempt funding with fresh transaction
  // Update database with result
}
```

### 3. **Emergency Controls**
```typescript
// Emergency disable mechanism
async function emergencyDisableFunding(reason: string): Promise<void> {
  // Set global disable flag
  // Log emergency action
  // Notify administrators
  // Return user-friendly message
}
```

## Testing Strategy

### 1. **Unit Tests**
- ETH funding service functionality
- Rate limiting mechanisms
- Balance checking logic
- Database operations

### 2. **Integration Tests**
- End-to-end user registration with funding
- Error handling scenarios
- Admin wallet depletion scenarios
- Network failure recovery

### 3. **Load Testing**
- Multiple concurrent funding requests
- Rate limiting effectiveness
- Database performance under load

## Deployment Plan

### Phase 1: Infrastructure Setup
1. Deploy database schema changes
2. Configure environment variables
3. Set up monitoring endpoints

### Phase 2: Testing Deployment
1. Deploy to testnet first
2. Test with small ETH amounts
3. Validate all security controls
4. Monitor for 24 hours

### Phase 3: Production Deployment
1. Deploy to production with feature flag disabled
2. Gradually enable for small percentage of users
3. Monitor metrics and admin wallet balance
4. Full rollout after validation

### Phase 4: Monitoring & Optimization
1. Set up alerting for low balances
2. Optimize gas prices and funding amounts
3. Implement automated admin wallet top-ups
4. Regular security audits

## Success Metrics

### Technical Metrics
- ETH funding success rate (target: >99%)
- Average funding transaction time (target: <30 seconds)
- Failed funding recovery rate (target: >95%)
- Zero funding-related registration failures

### Business Metrics
- User transaction activity post-funding
- Reduction in user support tickets about gas fees
- New user onboarding completion rates
- Cost per funded user

### Security Metrics
- Zero unauthorized funding attempts
- Zero duplicate fundings per user
- Admin wallet balance never below safety threshold
- Rate limiting effectiveness (zero abuse detected)

## Risk Mitigation

### Financial Risks
- **Admin wallet depletion**: Balance monitoring with alerts
- **Gas price spikes**: Dynamic gas price management
- **High funding volume**: Daily limits and emergency controls

### Security Risks
- **Funding abuse**: Multiple rate limiting layers
- **Unauthorized access**: CDP authentication required
- **Replay attacks**: Transaction nonce management

### Operational Risks
- **Network failures**: Retry mechanisms and failover
- **Database failures**: Backup logging systems
- **Code bugs**: Comprehensive testing and gradual rollout

This implementation provides a robust, secure, and scalable solution for automatically funding new users while maintaining strict security controls and preventing any disruption to the core application functionality.