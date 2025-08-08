import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { headers } from 'next/headers'
import { Resend } from 'resend'
import WelcomeEmail from '../../../../emails/welcome-email'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/waitlist - Add email to waitlist
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting waitlist API request...')
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase not configured')
      return NextResponse.json(
        { error: 'Database is not configured. Please check your environment variables.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { 
      email, 
      source = 'landing_page', 
      creatorType = 'onlyfans', 
      estimatedRevenue, 
      referralSource,
      utmSource,
      utmMedium,
      utmCampaign
    } = body

    console.log('📧 Processing email:', email)

    // Validate email
    if (!email || !emailRegex.test(email)) {
      console.log('❌ Invalid email format')
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    console.log('🔍 Checking if email exists...')

    // Check if email already exists
    const { data: existingSignup, error: checkError } = await supabase
      .from('waitlist')
      .select('email, created_at')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (checkError) {
      console.error('❌ Error checking existing email:', checkError)
      return NextResponse.json(
        { error: 'Database connection error. Please try again.' },
        { status: 500 }
      )
    }

    if (existingSignup) {
      console.log('ℹ️ Email already exists')
      return NextResponse.json(
        { 
          error: 'You\'re already on the waitlist! We\'ll notify you when ProfitLens is ready.',
          isAlreadySignedUp: true,
          signedUpAt: existingSignup.created_at
        },
        { status: 409 }
      )
    }

    console.log('💾 Inserting new signup...')

    // Get headers for tracking
    const headersList = await headers()
    const referer = headersList.get('referer') || 'direct'

    // Insert new signup with enhanced data
    const { data: newSignup, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: email.toLowerCase(),
        source: source,
        referrer: referer,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        creator_type: creatorType,
        estimated_revenue: estimatedRevenue,
        referral_source: referralSource
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Insert error:', insertError)
      console.error('Error details:', JSON.stringify(insertError))
      
      // Provide specific error messages
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'You\'re already on the waitlist!' },
          { status: 409 }
        )
      } else if (insertError.code === '42P01') {
        return NextResponse.json(
          { error: 'Database table not found. Please contact support.' },
          { status: 500 }
        )
      } else if (insertError.code === '42501') {
        return NextResponse.json(
          { error: 'Database permission error. Please contact support.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Database error. Please try again.' },
        { status: 500 }
      )
    }

    console.log('✅ Successfully added to waitlist:', newSignup.id)

    // Send welcome email (non-blocking)
    if (process.env.RESEND_API_KEY) {
      resend.emails.send({
        from: 'ProfitLens <hello@profitlens.co>',
        to: email,
        subject: "You're in! Welcome to ProfitLens 🎉",
        react: WelcomeEmail({ email }),
      }).then(() => {
        console.log('✅ Welcome email sent to:', email)
      }).catch((error) => {
        console.error('❌ Failed to send welcome email:', error)
        // Don't fail the signup if email fails
      })
    } else {
      console.log('⚠️ RESEND_API_KEY not configured, skipping email')
    }

    // Get waitlist position for social proof
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      message: '🎉 Welcome to the waitlist! We\'ll notify you when ProfitLens is ready.',
      waitlistPosition: count || 1,
      estimatedLaunch: 'Q4 2025'
    })

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or email us at support@profitlens.co' },
      { status: 500 }
    )
  }
}

// GET /api/waitlist - Get waitlist stats (for admin)
export async function GET(request: NextRequest) {
  try {
    console.log('📊 Getting waitlist stats...')
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database is not configured. Please check your environment variables.' },
        { status: 500 }
      )
    }

    // Get waitlist stats
    const { data: signups, count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact' })

    if (error) {
      console.error('❌ Error getting stats:', error)
      return NextResponse.json(
        { error: 'Failed to get waitlist stats' },
        { status: 500 }
      )
    }

    const confirmedCount = signups?.filter(s => s.confirmed).length || 0
    const recentCount = signups?.filter(s => 
      new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0

    return NextResponse.json({
      totalSignups: count || 0,
      confirmedSignups: confirmedCount,
      recentSignups: recentCount
    })

  } catch (error) {
    console.error('❌ GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
