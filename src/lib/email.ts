// Email utility functions
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function generateClaimEmail(params: {
  recipientEmail: string
  senderEmail: string
  amount: string
  claimUrl: string
  message?: string
}): EmailTemplate {
  const { senderEmail, amount, claimUrl, message } = params
  const senderName = senderEmail.split('@')[0]
  
  const subject = `${senderName} sent you $${amount}`
  
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 700; margin: 0 0 32px 0; line-height: 1.2; letter-spacing: -0.5px;">
          ${senderName} sent you $${amount}
        </h1>
      </div>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 32px 0;">
        <div style="margin-bottom: 16px;">
          <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">From</div>
          <div style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${senderEmail}</div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Amount</div>
          <div style="color: #1a1a1a; font-size: 18px; font-weight: 600;">$${amount} USDC</div>
        </div>
        
        <div>
          <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Expires</div>
          <div style="color: #1a1a1a; font-size: 14px; font-weight: 500;">7 days</div>
        </div>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${claimUrl}" style="background-color: #222222; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 600; font-size: 16px; display: inline-block; border: none; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          Claim $${amount} USDC
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 24px;">
        <p style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.4;">
          via Between Friends
        </p>
      </div>
    </div>
  `
  
  const text = `
${senderName} sent you money!

You received $${amount} USDC from ${senderEmail} via Between Friends.

${message ? `Message: "${message}"\n\n` : ''}

Claim your funds: ${claimUrl}

Sign in to claim your funds. This transfer expires in 7 days.
  `
  
  return { subject, html, text }
}

export function generateRefundEmail(params: {
  senderEmail: string
  recipientEmail: string
  amount: string
  reason: string
}): EmailTemplate {
  const { recipientEmail, amount, reason } = params
  
  const subject = `Refund processed: $${amount} USDC returned`
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Refund Processed</h2>
      <p>Your $${amount} USDC transfer to <strong>${recipientEmail}</strong> has been refunded.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>The funds have been returned to your wallet.</p>
    </div>
  `
  
  const text = `
Refund Processed

Your $${amount} USDC transfer to ${recipientEmail} has been refunded.

Reason: ${reason}

The funds have been returned to your wallet.
  `
  
  return { subject, html, text }
}

// Email sending functions
export async function sendClaimSuccessEmail(params: {
  recipientEmail: string
  senderEmail: string
  amount: string
  txHash: string
  recipientName?: string
  claimTxHash?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    // This would typically use a service like SendGrid, AWS SES, etc.
    console.log('Sending claim success email:', params)
    return { success: true }
  } catch (error) {
    console.error('Error sending claim success email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendRefundNotificationEmail(params: {
  senderEmail: string
  recipientEmail: string
  amount: string
  reason: string
  senderName?: string
  refundTxHash?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'info@btwnfriends.com'
    const senderName = params.senderName || params.senderEmail.split('@')[0]
    
    const subject = `Refund processed: $${params.amount} USDC returned`
    
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 700; margin: 0 0 32px 0; line-height: 1.2; letter-spacing: -0.5px;">
            Refund Processed
          </h1>
        </div>
        
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 32px 0;">
          <div style="margin-bottom: 16px;">
            <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Amount Refunded</div>
            <div style="color: #1a1a1a; font-size: 18px; font-weight: 600;">$${params.amount} USDC</div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Original Recipient</div>
            <div style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${params.recipientEmail}</div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Reason</div>
            <div style="color: #1a1a1a; font-size: 14px; font-weight: 500;">${params.reason}</div>
          </div>
          
          ${params.refundTxHash ? `
          <div>
            <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Transaction</div>
            <div style="color: #1a1a1a; font-size: 14px; font-family: 'SF Mono', Monaco, Consolas, monospace;">
              <a href="https://basescan.org/tx/${params.refundTxHash}" style="color: #374151; text-decoration: underline;">
                ${params.refundTxHash.slice(0, 12)}...${params.refundTxHash.slice(-8)}
              </a>
            </div>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.4;">
            Hi ${senderName}, the funds have been automatically returned to your wallet.<br>
            via Between Friends
          </p>
        </div>
      </div>
    `
    
    const text = `
Refund Processed

Hi ${senderName},

Your $${params.amount} USDC transfer to ${params.recipientEmail} has been refunded.

Reason: ${params.reason}

The funds have been automatically returned to your wallet.

${params.refundTxHash ? `Transaction: https://basescan.org/tx/${params.refundTxHash}` : ''}

via Between Friends
    `
    
    console.log('📧 SENDING REFUND NOTIFICATION EMAIL:', {
      to: params.senderEmail,
      from: fromAddress,
      subject,
      amount: params.amount,
      recipientEmail: params.recipientEmail
    })
    
    const response = await resend.emails.send({
      from: fromAddress,
      to: params.senderEmail,
      subject,
      html,
      text,
    })
    
    console.log('✅ REFUND EMAIL SENT SUCCESSFULLY:', { emailId: response.data?.id })
    return { success: true }
  } catch (error) {
    console.error('❌ ERROR SENDING REFUND EMAIL:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Alias for backward compatibility
export const sendRefundConfirmationEmail = sendRefundNotificationEmail

export async function sendDirectTransferNotificationEmail(params: {
  recipientEmail: string
  senderEmail: string
  senderName?: string
  amount: string
  txHash: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const senderName = params.senderName || params.senderEmail.split('@')[0]
    const subject = `${senderName} sent you $${params.amount}`
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'info@btwnfriends.com'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.btwnfriends.com'
    
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 700; margin: 0 0 32px 0; line-height: 1.2; letter-spacing: -0.5px;">
            ${senderName} sent you $${params.amount}
          </h1>
        </div>
        
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 32px 0;">
          <div style="margin-bottom: 16px;">
            <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">From</div>
            <div style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${params.senderEmail}</div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Amount</div>
            <div style="color: #1a1a1a; font-size: 18px; font-weight: 600;">$${params.amount} USDC</div>
          </div>
          
          <div>
            <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Transaction</div>
            <div style="color: #1a1a1a; font-size: 14px; font-family: 'SF Mono', Monaco, Consolas, monospace;">
              <a href="https://basescan.org/tx/${params.txHash}" style="color: #374151; text-decoration: underline;">
                ${params.txHash.slice(0, 12)}...${params.txHash.slice(-8)}
              </a>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}" style="background-color: #222222; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 600; font-size: 16px; display: inline-block; border: none; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            Open Between Friends
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.4;">
            via Between Friends
          </p>
        </div>
      </div>
    `
    
    const text = `
${senderName} sent you money!

You received $${params.amount} USDC from ${params.senderEmail} via Between Friends.

Open the app: ${appUrl}

Transaction: https://basescan.org/tx/${params.txHash}
    `
    
    console.log('📧 SENDING DIRECT TRANSFER NOTIFICATION EMAIL:', {
      to: params.recipientEmail,
      from: fromAddress,
      subject,
      amount: params.amount,
      senderEmail: params.senderEmail,
      txHash: params.txHash
    })
    
    const response = await resend.emails.send({
      from: fromAddress,
      to: params.recipientEmail,
      subject,
      html,
      text,
    })
    
    console.log('✅ DIRECT TRANSFER EMAIL SENT SUCCESSFULLY:', { emailId: response.data?.id })
    return { success: true }
  } catch (error) {
    console.error('❌ ERROR SENDING DIRECT TRANSFER EMAIL:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendClaimNotificationEmail(params: {
  recipientEmail: string
  senderEmail: string
  senderName?: string
  amount: string
  claimUrl: string
  message?: string
  expiryDate?: Date
}): Promise<{ success: boolean; error?: string }> {
  try {
    const emailTemplate = generateClaimEmail(params)
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'info@btwnfriends.com'
    
    console.log('📧 SENDING CLAIM NOTIFICATION EMAIL:', {
      to: params.recipientEmail,
      from: fromAddress,
      subject: emailTemplate.subject,
      amount: params.amount,
      senderEmail: params.senderEmail
    })
    
    const response = await resend.emails.send({
      from: fromAddress,
      to: params.recipientEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })
    
    console.log('✅ EMAIL SENT SUCCESSFULLY:', { emailId: response.data?.id })
    return { success: true }
  } catch (error) {
    console.error('❌ ERROR SENDING CLAIM NOTIFICATION EMAIL:', error)
    return { success: false, error: 'Failed to send email' }
  }
}