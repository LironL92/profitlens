import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gcqxuhjzczpztadfrqdz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcXh1aGp6Y3pwenRhZGZycWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NDkwNjQsImV4cCI6MjA3MDIyNTA2NH0.OhaZygdRS_v0wIoQKgVHWXCw1K7QM6RrVoGi8NVhIvg'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key'

// Check for missing environment variables at runtime, not build time
function checkEnvironmentVariables() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables are not configured. Database operations will fail.')
    return false
  }
  return true
}

// Client for browser/public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client with service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
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
