import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import WelcomeEmail from '../../../../emails/welcome-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: 'ProfitLens <hello@profitlens.co>',
      to: email,
      subject: "You're in! Welcome to ProfitLens 🎉",
      react: WelcomeEmail({ email }),
    })

    if (error) {
      console.error('❌ Failed to send welcome email:', error)
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      )
    }

    console.log('✅ Welcome email sent to:', email)
    return NextResponse.json({ 
      success: true, 
      message: 'Welcome email sent successfully',
      emailId: data?.id
    })

  } catch (error) {
    console.error('❌ Send welcome email error:', error)
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    )
  }
}
