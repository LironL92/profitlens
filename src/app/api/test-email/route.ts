import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import WelcomeEmail from '../../../../emails/welcome-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testEmail = 'your-email@example.com' } = body

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Send test welcome email
    const { data, error } = await resend.emails.send({
      from: 'ProfitLens <hello@profitlens.co>',
      to: testEmail,
      subject: 'Test - ProfitLens Welcome Email',
      react: WelcomeEmail({ email: 'test@example.com' }),
    })

    if (error) {
      console.error('❌ Failed to send test email:', error)
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      )
    }

    console.log('✅ Test email sent to:', testEmail)
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      emailId: data?.id,
      sentTo: testEmail
    })

  } catch (error) {
    console.error('❌ Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}

// Also support GET for simple testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Test email endpoint. Use POST with { "testEmail": "your-email@example.com" } to send a test email.' 
  })
}
