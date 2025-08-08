'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Clock } from 'lucide-react'

interface WaitlistStats {
  totalSignups: number
  confirmedSignups: number
  recentSignups: number
  topReferralSources: Array<{
    source: string
    count: number
  }>
}

export default function WaitlistAnalytics() {
  const [stats, setStats] = useState<WaitlistStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/waitlist')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch waitlist stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-pink-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalSignups.toLocaleString()}+
          </div>
          <div className="text-sm text-gray-600">Creators on Waitlist</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-6 w-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.recentSignups}+
          </div>
          <div className="text-sm text-gray-600">Joined This Week</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-6 w-6 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round((stats.confirmedSignups / stats.totalSignups) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Email Confirmed</div>
        </div>
      </div>

      {/* Top Referral Sources */}
      {stats.topReferralSources.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Top Referral Sources</h3>
          <div className="space-y-3">
            {stats.topReferralSources.slice(0, 5).map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="capitalize">{source.source}</span>
                </div>
                <span className="text-sm text-gray-600">{source.count} creators</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
