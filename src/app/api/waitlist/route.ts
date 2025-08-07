import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server operations
)

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'landing_page', referralSource, estimatedRevenue } = await request.json()
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' }, 
        { status: 400 }
      )
    }

    // Get request metadata
    const headersList = headers()
    const userAgent = headersList.get('user-agent')
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || null

    // Insert into waitlist
    const { error } = await supabase
      .from('waitlist_signups')
      .insert({
        email: email.toLowerCase().trim(),
        source,
        creator_type: 'onlyfans',
        estimated_monthly_revenue: estimatedRevenue,
        referral_source: referralSource,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (error) {
      // Handle duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { 
            error: 'Email already registered', 
            message: 'You\'re already on our waitlist! We\'ll notify you when we launch.' 
          }, 
          { status: 409 }
        )
      }
      
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to join waitlist' }, 
        { status: 500 }
      )
    }

    // Generate confirmation token (optional)
    const { data: tokenData } = await supabase.rpc('generate_confirmation_token', {
      user_email: email.toLowerCase().trim()
    })

    // TODO: Send welcome email with confirmation link
    // await sendWelcomeEmail(email, tokenData)

    // Get current waitlist size for social proof
    const { count } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the waitlist!',
      waitlistPosition: count,
      confirmationToken: tokenData // Remove this in production
    })

  } catch (error) {
    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('confirm')
    
    if (token) {
      // Handle email confirmation
      const { data: confirmed } = await supabase.rpc('confirm_waitlist_email', {
        confirmation_token: token
      })
      
      if (confirmed) {
        return NextResponse.redirect(new URL('/waitlist/confirmed', request.url))
      } else {
        return NextResponse.redirect(new URL('/waitlist/invalid', request.url))
      }
    }

    // Get waitlist stats (admin only)
    const { data: stats, error } = await supabase.rpc('get_waitlist_stats')
    
    if (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(stats[0])
    
  } catch (error) {
    console.error('Waitlist GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}