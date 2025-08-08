-- ProfitLens Waitlist Database Setup
-- Run this in your Supabase SQL Editor

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50) DEFAULT 'landing_page',
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (required for the form to work)
CREATE POLICY "Allow anonymous inserts" ON waitlist
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow checking if email exists (for duplicate detection)
CREATE POLICY "Allow email existence check" ON waitlist
    FOR SELECT
    TO anon
    USING (true);

-- Allow updates (for tracking data)
CREATE POLICY "Allow anonymous updates" ON waitlist
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_source ON waitlist(source);

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_updated_at 
    BEFORE UPDATE ON waitlist 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Test the setup by inserting a sample record (optional)
-- INSERT INTO waitlist (email, source) VALUES ('test@example.com', 'setup_test');

-- Verify the setup
SELECT 
    'Table created successfully' as status,
    COUNT(*) as record_count
FROM waitlist;
