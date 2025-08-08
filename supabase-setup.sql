-- Copy and paste this into your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor

-- Create waitlist_signups table with enhanced tracking
CREATE TABLE waitlist_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'landing_page',
  creator_type VARCHAR(50) DEFAULT 'onlyfans',
  estimated_monthly_revenue INTEGER,
  referral_source VARCHAR(100),
  email_confirmed BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT,
  -- Additional UTM tracking
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  -- Device and browser info
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  -- Geographic data (if available)
  country VARCHAR(100),
  city VARCHAR(100),
  -- Engagement tracking
  signup_country VARCHAR(100),
  time_on_page INTEGER, -- seconds
  scroll_depth INTEGER, -- percentage
  -- Notes for admin
  notes TEXT,
  admin_notes TEXT
);

-- Create email_confirmation_tokens table
CREATE TABLE email_confirmation_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL REFERENCES waitlist_signups(email),
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_waitlist_signups_email ON waitlist_signups(email);
CREATE INDEX idx_waitlist_signups_created_at ON waitlist_signups(created_at);
CREATE INDEX idx_confirmation_tokens_token ON email_confirmation_tokens(token);
CREATE INDEX idx_confirmation_tokens_expires_at ON email_confirmation_tokens(expires_at);

-- Enable Row Level Security
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_confirmation_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public to insert new signups
CREATE POLICY "Allow public to insert waitlist signups" ON waitlist_signups
FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow public to read their own signup
CREATE POLICY "Allow users to view their own signup" ON waitlist_signups
FOR SELECT TO anon, authenticated USING (true);

-- Service role can do everything
CREATE POLICY "Service role can manage all signups" ON waitlist_signups
FOR ALL TO service_role USING (true);

CREATE POLICY "Service role can manage all tokens" ON email_confirmation_tokens
FOR ALL TO service_role USING (true);
