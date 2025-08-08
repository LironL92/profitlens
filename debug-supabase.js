// Debug Supabase connection issues
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://gcqxuhjzczpztadfrqdz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcXh1aGp6Y3pwenRhZGZycWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NDkwNjQsImV4cCI6MjA3MDIyNTA2NH0.OhaZygdRS_v0wIoQKgVHWXCw1K7QM6RrVoGi8NVhIvg'

console.log('🔍 Debugging Supabase connection...')
console.log('URL:', SUPABASE_URL)
console.log('Key length:', SUPABASE_ANON_KEY.length)
console.log('Key starts with:', SUPABASE_ANON_KEY.substring(0, 20) + '...')

try {
  console.log('📡 Creating Supabase client...')
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  console.log('✅ Client created successfully')
  
  console.log('🔍 Testing basic connection...')
  
  // Test 1: Simple health check
  supabase
    .from('waitlist')
    .select('id')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Error details:')
        console.error('Message:', error.message)
        console.error('Code:', error.code)
        console.error('Details:', error.details)
        console.error('Hint:', error.hint)
        console.error('Full error:', JSON.stringify(error, null, 2))
      } else {
        console.log('✅ Connection successful!')
        console.log('Data:', data)
      }
    })
    .catch(err => {
      console.error('❌ Promise rejection:', err.message)
    })
    
} catch (error) {
  console.error('❌ Failed to create client:', error.message)
}
