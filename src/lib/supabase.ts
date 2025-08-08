import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check for missing environment variables at runtime, not build time
function checkEnvironmentVariables() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not configured. Database operations will fail.')
    return false
  }
  return true
}

// Client for browser/public operations
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

// Server client with service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl!,
  serviceRoleKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = checkEnvironmentVariables

// Types for our database tables
export interface WaitlistSignup {
  id: string
  email: string
  created_at: string
  source?: string
  creator_type?: string
  estimated_monthly_revenue?: number
  referral_source?: string
  email_confirmed: boolean
  ip_address?: string
  user_agent?: string
}

export interface EmailConfirmationToken {
  id: string
  email: string
  token: string
  expires_at: string
  created_at: string
}

export interface WaitlistStats {
  total_signups: number
  confirmed_signups: number
  recent_signups: number
  top_referral_sources: Array<{
    source: string
    count: number
  }>
}
