'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react'

// Declare gtag as a global function
declare global {
  function gtag(...args: any[]): void
}

interface WaitlistFormProps {
  className?: string
  variant?: 'hero' | 'footer'
  showSocialProof?: boolean
}

export default function WaitlistForm({ 
  className = '', 
  variant = 'hero',
  showSocialProof = true 
}: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already-signed-up' | 'validation-error'>('idle')
  const [message, setMessage] = useState('')
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Enhanced email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  // Enhanced form submission with better debugging
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedEmail = email.trim()
    
    // Clear previous messages
    setStatus('idle')
    setMessage('')
    setDebugInfo([])
    
    // Enhanced validation
    if (!trimmedEmail) {
      setStatus('validation-error')
      setMessage('Please enter your email address')
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setStatus('validation-error')
      setMessage('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    
    // Add debug info
    const debugSteps: string[] = []
    debugSteps.push('Starting form submission...')
    debugSteps.push(`Email: ${trimmedEmail}`)
    debugSteps.push('Validating email format...')
    debugSteps.push('Email validation passed')
    setDebugInfo(debugSteps)

    try {
      debugSteps.push('Preparing API request...')
      setDebugInfo([...debugSteps])

      const requestBody = {
        email: trimmedEmail,
        source: 'landing_page',
        creatorType: 'onlyfans',
        referralSource: getReferralSource(),
        utmSource: getURLParameter('utm_source'),
        utmMedium: getURLParameter('utm_medium'),
        utmCampaign: getURLParameter('utm_campaign')
      }

      debugSteps.push('Sending request to API...')
      setDebugInfo([...debugSteps])

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      debugSteps.push(`API response received: ${response.status}`)
      setDebugInfo([...debugSteps])

      const data = await response.json()

      if (response.ok) {
        debugSteps.push('Success! User added to waitlist')
        setDebugInfo([...debugSteps])
        
        setStatus('success')
        setMessage(data.message || "🎉 You're in! Check your email for confirmation.")
        setEmail('')
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
          gtag('event', 'waitlist_signup', {
            'event_category': 'engagement',
            'event_label': 'landing_page'
          })
        }
      } else if (response.status === 409) {
        debugSteps.push('User already exists in waitlist')
        setDebugInfo([...debugSteps])
        
        setStatus('already-signed-up')
        setMessage(data.error || "You're already on the waitlist!")
        setEmail('')
      } else {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Waitlist signup error:', error)
      
      debugSteps.push(`Error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setDebugInfo([...debugSteps])
      
      setStatus('error')
      
      // Enhanced error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          setMessage('Network error. Please check your connection and try again.')
        } else if (error.message.includes('500')) {
          setMessage('Server error. Please try again or email us at support@profitlens.co')
        } else {
          setMessage(error.message || 'Something went wrong. Please try again or email us at support@profitlens.co')
        }
      } else {
        setMessage('Something went wrong. Please try again or email us at support@profitlens.co')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getReferralSource = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_source') || 
           urlParams.get('ref') || 
           document.referrer || 
           'direct'
  }

  const getURLParameter = (name: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name) || null
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'already-signed-up':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'validation-error':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      default:
        return null
    }
  }

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'already-signed-up':
        return 'border-blue-200 bg-blue-50 text-blue-800'
      case 'validation-error':
        return 'border-orange-200 bg-orange-50 text-orange-800'
      default:
        return ''
    }
  }

  // Show success/confirmation states
  if (status === 'success' || status === 'already-signed-up') {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <div className={`border rounded-lg p-4 ${getStatusStyles()}`}>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div>
              <div className="font-semibold">
                {status === 'success' ? "✅ You're on the list!" : "✅ Already signed up!"}
              </div>
              <div className="text-sm mt-1">
                {message}
              </div>
            </div>
          </div>
        </div>
        {showSocialProof && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            Free for the first 100 creators • No spam, ever
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:opacity-50"
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 font-semibold inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </div>
        
        {/* Enhanced error display */}
        {(status === 'error' || status === 'validation-error') && (
          <div className="flex items-start space-x-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <span>{message}</span>
              {status === 'error' && (
                <div className="mt-1 text-xs text-gray-500">
                  If this persists, please email us at support@profitlens.co
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Debug information (only show in development) */}
        {process.env.NODE_ENV === 'development' && debugInfo.length > 0 && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
            <div className="flex items-center space-x-1 mb-2">
              <Info className="h-3 w-3 text-gray-600" />
              <span className="font-semibold text-gray-700">Debug Info:</span>
            </div>
            <div className="space-y-1">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-gray-600">
                  {index + 1}. {info}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showSocialProof && (
          <p className="text-sm text-gray-500 text-center">
            Free for the first 100 creators • No spam, ever
          </p>
        )}
      </form>
    </div>
  )
}
