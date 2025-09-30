import { NextRequest, NextResponse } from 'next/server'
// import { generateClaimEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'direct'
  
  try {
    if (type === 'direct') {
      // Create sample direct transfer email HTML
      const senderName = 'John'
      const senderEmail = 'john@example.com'
      const amount = '25.50'
      const txHash = '0x42c29bc246277b2d2c14395ce0aef79e03b3f3f5316154b0f76a2a1fe2c9b774'
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.btwnfriends.com'
      
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
              <div style="color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Transaction</div>
              <div style="color: #1a1a1a; font-size: 14px; font-family: 'SF Mono', Monaco, Consolas, monospace;">
                <a href="https://basescan.org/tx/${txHash}" style="color: #374151; text-decoration: underline;">
                  ${txHash.slice(0, 12)}...${txHash.slice(-8)}
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
      
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
      
    } else if (type === 'escrow') {
      // Create sample escrow claim email HTML
      const senderName = 'Jane'
      const senderEmail = 'jane@example.com'
      const amount = '15.75'
      const claimUrl = 'https://www.btwnfriends.com'
      
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
      
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }
    
    // Default: show options
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px;">
        <h1>Email Preview</h1>
        <p>Choose an email template to preview:</p>
        <ul>
          <li><a href="?type=direct">Direct Transfer Email</a></li>
          <li><a href="?type=escrow">Escrow Claim Email</a></li>
        </ul>
      </div>
    `
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
    
  } catch (error) {
    console.error('Email preview error:', error)
    return NextResponse.json({ error: 'Failed to generate email preview' }, { status: 500 })
  }
}