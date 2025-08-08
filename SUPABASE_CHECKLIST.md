# 🔍 Supabase Connection Debug Checklist

## Step 1: Verify Your Supabase Project

1. **Go to**: https://app.supabase.com
2. **Check if your project is active** (not paused)
3. **Verify project URL**: `gcqxuhjzczpztadfrqdz`
4. **Check project status** - should show "Active"

## Step 2: Verify API Keys

1. **Go to**: Settings → API
2. **Copy the Project URL** - should be: `https://gcqxuhjzczpztadfrqdz.supabase.co`
3. **Copy the anon public key** - should start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Check Table Structure

1. **Go to**: Database → Tables
2. **Verify `waitlist` table exists**
3. **Click on the table** to see columns
4. **Note down the exact column names**

## Step 4: Check RLS Policies

1. **Go to**: Database → Policies
2. **Look for `waitlist` table policies**
3. **Should have policies for `anon` role**

## Step 5: Run Debug Script

```bash
node debug-supabase.js
```

This will show us exactly what's failing.

## Common Issues & Solutions

### Issue 1: Project Paused
- **Symptom**: Connection timeout
- **Solution**: Resume project in Supabase dashboard

### Issue 2: Wrong API Key
- **Symptom**: "Invalid API key" error
- **Solution**: Use anon key, not service role key

### Issue 3: RLS Blocking Access
- **Symptom**: "Permission denied" error
- **Solution**: Run the RLS fix script

### Issue 4: Table Doesn't Exist
- **Symptom**: "relation does not exist" error
- **Solution**: Create the table

## Quick Test Commands

Test basic connectivity:
```bash
curl -X GET "https://gcqxuhjzczpztadfrqdz.supabase.co/rest/v1/waitlist?select=id&limit=1" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcXh1aGp6Y3pwenRhZGZycWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NDkwNjQsImV4cCI6MjA3MDIyNTA2NH0.OhaZygdRS_v0wIoQKgVHWXCw1K7QM6RrVoGi8NVhIvg" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcXh1aGp6Y3pwenRhZGZycWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NDkwNjQsImV4cCI6MjA3MDIyNTA2NH0.OhaZygdRS_v0wIoQKgVHWXCw1K7QM6RrVoGi8NVhIvg"
```

Run the debug script and share the output!
