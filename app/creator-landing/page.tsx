'use client'

import { ArrowRight, Calculator, TrendingUp, Clock } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function OnlyFansCreatorLandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'onlyfans-creator-landing',
          referrer: 'creator-landing-page'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setEmail('')
      } else {
        setError(data.error || 'Failed to join waitlist. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full" />
              <span className="ml-2 text-xl font-semibold text-gray-900">ProfitLens</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                ← Main Site
              </Link>
              <div className="text-sm text-gray-600 font-medium">
                For OnlyFans Creators
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center bg-pink-100 text-pink-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <span>🎉 Built specifically for OnlyFans creators</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Finally,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Financial Control
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The financial dashboard built for OnlyFans creators. Track your real profit across all platforms, 
            optimize your taxes, and focus on what you do best — creating content.
          </p>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto mb-12">
            {!isSubmitted ? (
              <form onSubmit={handleWaitlistSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 font-semibold inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Joining...' : 'Join Waitlist'}
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </button>
                </div>
                {error && (
                  <div className="mt-3 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-semibold">✅ You&apos;re on the list!</div>
                <div className="text-green-600 text-sm mt-1">
                  We&apos;ll notify you when ProfitLens launches for creators.
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Free for the first 100 creators • No spam, ever
            </p>
          </div>
        </div>

        {/* Problem Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-8">Sound Familiar?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Spreadsheet Hell</h3>
                  <p className="text-gray-600">Manually tracking OnlyFans + ManyVids + cam sites + tips across 5 different spreadsheets</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tax Season Panic</h3>
                  <p className="text-gray-600">Scrambling to find receipts and getting hit with surprise quarterly payments of $8,000+</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">QuickBooks Confusion</h3>
                  <p className="text-gray-600">&ldquo;Why is this so complicated?&rdquo; — trying to explain why lingerie is a business expense</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cash Flow Guessing</h3>
                  <p className="text-gray-600">Never knowing your real profit after platform fees, expenses, and taxes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Time Drain</h3>
                  <p className="text-gray-600">Spending 20+ hours per month on financial admin instead of creating content</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Missing Deductions</h3>
                  <p className="text-gray-600">Leaving thousands on the table because you don&apos;t know what&apos;s actually deductible</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Finally, a Tool That Gets It
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            ProfitLens understands your business. No judgment, no confusion — just professional financial management 
            designed specifically for adult content creators.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Profit Tracking</h3>
              <p className="text-gray-600">
                See your actual take-home after platform fees, expenses, and taxes. 
                OnlyFans + ManyVids + cam sites all in one place.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Tax Planning</h3>
              <p className="text-gray-600">
                Quarterly payment reminders, self-employment tax calculations, 
                and creator-specific deduction guidance.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Savings</h3>
              <p className="text-gray-600">
                Upload your OnlyFans statements, connect your accounts, 
                and get back to creating. 5 minutes vs. 5 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">
              Join 500+ Creators Already on the Waitlist
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-lg italic mb-4">
                  &ldquo;Finally, someone who understands that my ring light is a business expense, 
                  not a personal purchase. Can&apos;t wait for this!&rdquo;
                </p>
                <p className="font-semibold">— Maya, Top 1% Creator</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-lg italic mb-4">
                  &ldquo;I spend more time on spreadsheets than I do creating content. 
                  This could be a game-changer for my business.&rdquo;
                </p>
                <p className="font-semibold">— Alex, 6-Figure Creator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pricing That Makes Sense
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">$0<span className="text-lg font-normal text-gray-600">/month</span></p>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Basic profit tracking</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>OnlyFans CSV import</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Tax estimation</li>
                <li className="flex items-center"><span className="text-gray-400 mr-2">×</span>Multi-platform sync</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg p-8 text-white relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Creator</h3>
              <p className="text-3xl font-bold mb-4">$29<span className="text-lg font-normal opacity-80">/month</span></p>
              <p className="opacity-80 mb-6">For growing creators</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center"><span className="text-green-300 mr-2">✓</span>Everything in Free</li>
                <li className="flex items-center"><span className="text-green-300 mr-2">✓</span>All platform connections</li>
                <li className="flex items-center"><span className="text-green-300 mr-2">✓</span>Advanced tax planning</li>
                <li className="flex items-center"><span className="text-green-300 mr-2">✓</span>Mobile app</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-3xl font-bold mb-4">$59<span className="text-lg font-normal text-gray-600">/month</span></p>
              <p className="text-gray-600 mb-6">For established creators</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Everything in Creator</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>1099 preparation</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Accountant reports</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Priority support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the waitlist and be the first to know when ProfitLens launches.
          </p>
          
          {!isSubmitted && (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleWaitlistSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 font-semibold inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Joining...' : 'Join Waitlist'}
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </button>
                </div>
                {error && (
                  <div className="mt-3 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
              </form>
              <p className="text-sm text-gray-500 mt-2">
                Free for the first 100 creators • Launch expected Q4 2024
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full" />
              <span className="ml-2 text-xl font-semibold">ProfitLens</span>
            </div>
            <p className="text-gray-400 mb-4">
              Financial management built for OnlyFans creators
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}