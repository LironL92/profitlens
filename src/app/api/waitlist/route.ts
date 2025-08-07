import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { headers } from 'next/headers'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/waitlist - Add email to waitlist
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database is not configured. Please check your environment variables.' },
        { status: 500 }
      )
    }
    const body = await request.json()
    const { email, source = 'landing_page', creatorType = 'onlyfans', estimatedRevenue, referralSource } = body

    // Validate email
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Get request metadata
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // Check if email already exists
    const { data: existingSignup } = await supabase
      .from('waitlist_signups')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existingSignup) {
      return NextResponse.json(
        { 
          error: 'You\'re already on the waitlist! We\'ll notify you when ProfitLens is ready.',
          isAlreadySignedUp: true 
        },
        { status: 409 }
      )
    }

    // Insert new signup
    const { data: newSignup, error: insertError } = await supabase
      .from('waitlist_signups')
      .insert({
        email: email.toLowerCase(),
        source,
        creator_type: creatorType,
        estimated_monthly_revenue: estimatedRevenue,
        referral_source: referralSource,
        ip_address: ip,
        user_agent: userAgent,
        email_confirmed: false
      })
      .select()
      .single()

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      )
    }

    // Get waitlist position for social proof
    const { count } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })

    // Generate confirmation token (optional feature)
    const confirmationToken = crypto.randomUUID()
    await supabaseAdmin
      .from('email_confirmation_tokens')
      .insert({
        email: email.toLowerCase(),
        token: confirmationToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })

    return NextResponse.json({
      success: true,
      message: 'Welcome to the waitlist! We\'ll notify you when ProfitLens is ready.',
      waitlistPosition: count || 1,
      confirmationToken // Include if you want to send confirmation emails
    })

  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// GET /api/waitlist - Get waitlist stats (for admin)
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database is not configured. Please check your environment variables.' },
        { status: 500 }
      )
    }
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const action = searchParams.get('action')

    // Handle email confirmation
    if (action === 'confirm' && token) {
      const { data: tokenData } = await supabaseAdmin
        .from('email_confirmation_tokens')
        .select('email, expires_at')
        .eq('token', token)
        .single()

      if (!tokenData) {
        return NextResponse.redirect('/waitlist/invalid')
      }

      if (new Date(tokenData.expires_at) < new Date()) {
        return NextResponse.redirect('/waitlist/invalid')
      }

      // Confirm email
      await supabaseAdmin
        .from('waitlist_signups')
        .update({ email_confirmed: true })
        .eq('email', tokenData.email)

      // Delete used token
      await supabaseAdmin
        .from('email_confirmation_tokens')
        .delete()
        .eq('token', token)

      return NextResponse.redirect('/waitlist/confirmed')
    }

    // Get waitlist stats (requires admin authentication in production)
    const { data: signups, count } = await supabaseAdmin
      .from('waitlist_signups')
      .select('*', { count: 'exact' })

    const confirmedCount = signups?.filter(s => s.email_confirmed).length || 0
    const recentCount = signups?.filter(s => 
      new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0

    // Top referral sources
    const referralSources = signups?.reduce((acc: any, signup) => {
      const source = signup.referral_source || 'direct'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})

    const topReferralSources = Object.entries(referralSources || {})
      .map(([source, count]) => ({ source, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json({
      totalSignups: count || 0,
      confirmedSignups: confirmedCount,
      recentSignups: recentCount,
      topReferralSources
    })

  } catch (error) {
    console.error('Waitlist GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
