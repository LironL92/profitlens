-- Fix RLS Policies for ProfitLens Waitlist
-- Run this in your Supabase SQL Editor

-- First, let's see what columns your table actually has
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
ORDER BY ordinal_position;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow email existence check" ON waitlist;
DROP POLICY IF EXISTS "Allow anonymous updates" ON waitlist;

-- Enable Row Level Security (if not already enabled)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow anonymous inserts" ON waitlist
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow email existence check" ON waitlist
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous updates" ON waitlist
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Test the policies by trying to insert a test record
INSERT INTO waitlist (email, source) 
VALUES ('test-policy@example.com', 'policy_test')
ON CONFLICT (email) DO NOTHING;

-- Verify the insert worked
SELECT * FROM waitlist WHERE email = 'test-policy@example.com';

-- Clean up test record
DELETE FROM waitlist WHERE email = 'test-policy@example.com';

-- Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'waitlist';
