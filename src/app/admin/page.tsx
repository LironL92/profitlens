'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Mail, Calendar, ExternalLink, RefreshCw } from 'lucide-react'
import { WaitlistSignup, WaitlistStats } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState<WaitlistStats | null>(null)
  const [signups, setSignups] = useState<WaitlistSignup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/waitlist')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data)
        // In a real implementation, you'd have a separate endpoint for signup details
        // For now, we'll just show the stats
      } else {
        setError(data.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-brand-pink mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-600 mb-4">
              <Mail className="h-12 w-12 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Restricted
            </h1>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button 
              onClick={fetchData}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ProfitLens <span className="gradient-text">Admin</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Waitlist Dashboard
              </p>
            </div>
            <button 
              onClick={fetchData}
              className="btn-secondary flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Signups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total_signups || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed Emails</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.confirmed_signups || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.recent_signups || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total_signups ? 
                    Math.round((stats.confirmed_signups / stats.total_signups) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Referral Sources */}
        {stats?.top_referral_sources && stats.top_referral_sources.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Top Referral Sources</h2>
            <div className="space-y-4">
              {stats.top_referral_sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="ml-3 font-medium capitalize">
                      {source.source || 'Direct'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-4">{source.count} signups</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-brand-pink to-brand-purple h-2 rounded-full"
                        style={{ 
                          width: `${(source.count / (stats.total_signups || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Export Data</h3>
            <p className="text-gray-600 mb-4">
              Download waitlist signups as CSV for further analysis.
            </p>
            <button className="btn-secondary w-full">
              Export CSV
            </button>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Send Update</h3>
            <p className="text-gray-600 mb-4">
              Send a progress update to all confirmed subscribers.
            </p>
            <button className="btn-secondary w-full">
              Compose Email
            </button>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Supabase Dashboard</h3>
            <p className="text-gray-600 mb-4">
              View detailed data in your Supabase project.
            </p>
            <button className="btn-secondary w-full flex items-center justify-center">
              Open Dashboard
              <ExternalLink className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📋 Setup Instructions
          </h3>
          <div className="space-y-2 text-blue-800">
            <p>1. <strong>Configure Supabase:</strong> Create the required tables using the SQL schema provided</p>
            <p>2. <strong>Environment Variables:</strong> Add your Supabase credentials to .env.local</p>
            <p>3. <strong>Security:</strong> In production, add proper authentication to this admin route</p>
            <p>4. <strong>Email Service:</strong> Integrate with a service like SendGrid for confirmation emails</p>
          </div>
        </div>
      </div>
    </div>
  )
}
