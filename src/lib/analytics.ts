// Analytics and UTM tracking utilities

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

export interface AnalyticsEvent {
  event: string
  category: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

// Get UTM parameters from URL
export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {}
  
  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
  }
}

// Get referral source
export function getReferralSource(): string {
  if (typeof window === 'undefined') return 'direct'
  
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('utm_source') || 
         urlParams.get('ref') || 
         document.referrer || 
         'direct'
}

// Track Google Analytics event
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined' || typeof gtag === 'undefined') return
  
  gtag('event', event.event, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters
  })
}

// Track waitlist signup
export function trackWaitlistSignup(source: string = 'landing_page'): void {
  trackEvent({
    event: 'waitlist_signup',
    category: 'engagement',
    label: source,
    custom_parameters: {
      ...getUTMParams(),
      referral_source: getReferralSource()
    }
  })
}

// Track form view
export function trackFormView(formId: string): void {
  trackEvent({
    event: 'form_view',
    category: 'engagement',
    label: formId,
    custom_parameters: {
      ...getUTMParams(),
      referral_source: getReferralSource()
    }
  })
}

// Track form interaction
export function trackFormInteraction(action: string, formId: string): void {
  trackEvent({
    event: 'form_interaction',
    category: 'engagement',
    label: `${formId}_${action}`,
    custom_parameters: {
      ...getUTMParams(),
      referral_source: getReferralSource()
    }
  })
}

// Get device information
export function getDeviceInfo() {
  if (typeof window === 'undefined') return {}
  
  const userAgent = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)
  
  let browser = 'Unknown'
  let os = 'Unknown'
  
  // Detect browser
  if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Edge')) browser = 'Edge'
  
  // Detect OS
  if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS')) os = 'iOS'
  
  return {
    device_type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    browser,
    os,
    user_agent: userAgent
  }
}

// Store UTM parameters in localStorage for later use
export function storeUTMParams(): void {
  if (typeof window === 'undefined') return
  
  const utmParams = getUTMParams()
  const hasUTMParams = Object.values(utmParams).some(param => param)
  
  if (hasUTMParams) {
    localStorage.setItem('utm_params', JSON.stringify(utmParams))
    localStorage.setItem('utm_timestamp', Date.now().toString())
  }
}

// Get stored UTM parameters
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem('utm_params')
    const timestamp = localStorage.getItem('utm_timestamp')
    
    if (stored && timestamp) {
      const age = Date.now() - parseInt(timestamp)
      // Keep UTM params for 30 days
      if (age < 30 * 24 * 60 * 60 * 1000) {
        return JSON.parse(stored)
      }
    }
  } catch (error) {
    console.error('Error parsing stored UTM params:', error)
  }
  
  return {}
}

// Initialize analytics tracking
export function initializeAnalytics(): void {
  if (typeof window === 'undefined') return
  
  // Store UTM parameters on page load
  storeUTMParams()
  
  // Track page view
  trackEvent({
    event: 'page_view',
    category: 'navigation',
    label: window.location.pathname,
    custom_parameters: {
      ...getUTMParams(),
      referral_source: getReferralSource()
    }
  })
}
