// Test Supabase connection
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://gcqxuhjzczpztadfrqdz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcXh1aGp6Y3pwenRhZGZycWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NDkwNjQsImV4cCI6MjA3MDIyNTA2NH0.OhaZygdRS_v0wIoQKgVHWXCw1K7QM6RrVoGi8NVhIvg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testConnection() {
  console.log('🧪 Testing Supabase connection...')
  
  try {
    // Test 1: Check if we can connect
    console.log('1. Testing basic connection...')
    const { data, error } = await supabase
      .from('waitlist')
      .select('count(*)', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      console.error('Error code:', error.code)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return false
    }
    
    console.log('✅ Connection successful!')
    
    // Test 2: Try to insert a test record
    console.log('2. Testing insert operation...')
    const testEmail = `test-${Date.now()}@example.com`
    
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert([{ 
        email: testEmail,
        source: 'test'
      }])
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError.message)
      console.error('Error code:', insertError.code)
      console.error('Error details:', insertError)
      return false
    }
    
    console.log('✅ Insert successful! Created record:', insertData.id)
    
    // Test 3: Clean up test record
    console.log('3. Cleaning up test record...')
    await supabase
      .from('waitlist')
      .delete()
      .eq('email', testEmail)
    
    console.log('✅ Test record cleaned up')
    console.log('🎉 All tests passed! Your Supabase setup is working correctly.')
    return true
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

testConnection()
