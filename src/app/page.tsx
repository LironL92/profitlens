'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Clock, 
  Shield, 
  CheckCircle, 
  Mail, 
  Star,
  DollarSign,
  Calculator,
  FileText,
  AlertTriangle,
  Users,
  Zap
} from 'lucide-react'

interface WaitlistFormData {
  email: string
  isLoading: boolean
  isSuccess: boolean
  error: string
  waitlistPosition?: number
}

export default function LandingPage() {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: '',
    isLoading: false,
    isSuccess: false,
    error: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      setFormData(prev => ({ ...prev, error: 'Please enter your email address' }))
      return
    }

    setFormData(prev => ({ ...prev, isLoading: true, error: '' }))

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          source: 'landing_page',
          creatorType: 'onlyfans'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          waitlistPosition: data.waitlistPosition
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          error: data.error || 'Something went wrong. Please try again.',
          isLoading: false
        }))
      }
    } catch (err) {
      setFormData(prev => ({
        ...prev,
        error: 'Network error. Please check your connection and try again.',
        isLoading: false
      }))
    }
  }

  const WaitlistForm = () => (
    <div className="w-full max-w-md mx-auto">
      {formData.isSuccess ? (
        <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">You&apos;re on the list!</h3>
                      <p className="text-green-700 mb-2">
              Welcome to the ProfitLens waitlist. We&apos;ll notify you when we launch.
            </p>
          {formData.waitlistPosition && (
            <p className="text-sm text-green-600">
              You&apos;re #{formData.waitlistPosition} on the waitlist
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value, error: '' }))}
              className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-brand-pink/30 focus:border-brand-pink outline-none text-lg"
              disabled={formData.isLoading}
              required
            />
          </div>
          
          {formData.error && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-red-800 text-sm">{formData.error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={formData.isLoading}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {formData.isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Joining waitlist...
              </span>
            ) : (
              'Join the Waitlist'
            )}
          </button>
          
          <p className="text-sm text-gray-600 text-center">
            Free forever. No spam. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-bg text-white section-padding">
        <div className="container-custom text-center">
          <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Built specifically for OnlyFans creators</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Finally, Financial Control
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            The financial dashboard built for OnlyFans creators. Track your real profit across all platforms, 
            optimize your taxes, and focus on what you do best — creating content.
          </p>
          
          <WaitlistForm />
          
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>500+ creators waiting</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>Launching Q2 2024</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <span>Bank-level security</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Sound <span className="gradient-text">Familiar?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every OnlyFans creator faces these financial headaches. You&apos;re not alone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Spreadsheet Hell",
                description: "Manually tracking OnlyFans, Fansly, ManyVids, and custom content across dozens of messy spreadsheets."
              },
              {
                icon: AlertTriangle,
                title: "Tax Season Panic",
                description: "Scrambling to find receipts and calculate quarterly payments, often facing surprise tax bills."
              },
              {
                icon: Calculator,
                title: "QuickBooks Confusion",
                description: "Wrestling with complex accounting software that wasn't designed for content creators."
              },
              {
                icon: DollarSign,
                title: "Cash Flow Guessing",
                description: "Never knowing your real profit after platform fees, chargebacks, and business expenses."
              },
              {
                icon: Clock,
                title: "Time Drain",
                description: "Spending 20+ hours monthly on admin work instead of creating content that makes money."
              },
              {
                icon: TrendingUp,
                title: "Missing Deductions",
                description: "Leaving thousands on the table by not tracking legitimate business expenses properly."
              }
            ].map((problem, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
                  <problem.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Finally, a Tool That <span className="gradient-text">Gets It</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ProfitLens is built specifically for content creators. No more generic solutions that don't understand your business.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                icon: TrendingUp,
                title: "Real Profit Tracking",
                description: "Connect all your platforms (OnlyFans, Fansly, ManyVids) and see your actual profit after fees, chargebacks, and expenses.",
                features: [
                  "Auto-sync with all major platforms",
                  "Real-time profit calculations",
                  "Expense categorization",
                  "Chargeback tracking"
                ]
              },
              {
                icon: Calculator,
                title: "Smart Tax Planning",
                description: "Never get surprised by tax season again. Get quarterly reminders and accurate calculations built for creators.",
                features: [
                  "Quarterly tax estimates",
                  "Deduction optimization",
                  "1099 preparation",
                  "State tax compliance"
                ]
              },
              {
                icon: Zap,
                title: "Time Savings",
                description: "What used to take 5 hours now takes 5 minutes. Spend more time creating, less time on paperwork.",
                features: [
                  "Automated reporting",
                  "One-click reconciliation",
                  "Smart categorization",
                  "Export for accountants"
                ]
              }
            ].map((solution, index) => (
              <div key={index} className="card p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 gradient-bg rounded-2xl mb-6">
                  <solution.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <ul className="space-y-3">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Join <span className="gradient-text">500+ Creators</span> Already on the Waitlist
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 text-lg italic">
                              &quot;I&apos;ve been waiting for something like this! Currently using 3 different spreadsheets 
              and QuickBooks. It&apos;s a nightmare during tax season.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full flex items-center justify-center text-white font-semibold">
                  M
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Maya</p>
                  <p className="text-gray-600">Top 1% Creator</p>
                </div>
              </div>
            </div>
            
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 text-lg italic">
                              &quot;Finally! A tool that understands that we&apos;re real businesses. Can&apos;t wait to ditch 
              my current messy system.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-purple to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Alex</p>
                  <p className="text-gray-600">6-Figure Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Simple, <span className="gradient-text">Creator-Friendly</span> Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No surprises. No hidden fees. Just tools that help you make more money.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for getting started",
                features: [
                  "1 platform connection",
                  "Basic profit tracking",
                  "Monthly reports",
                  "Email support"
                ],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Creator",
                price: "$29",
                description: "Most popular for active creators",
                features: [
                  "Unlimited platform connections",
                  "Real-time profit tracking",
                  "Tax planning tools",
                  "Expense categorization",
                  "Quarterly reports",
                  "Priority support"
                ],
                cta: "Join Waitlist",
                popular: true
              },
              {
                name: "Pro",
                price: "$59",
                description: "For high-volume creators",
                features: [
                  "Everything in Creator",
                  "Advanced analytics",
                  "Custom reporting",
                  "Accountant collaboration",
                  "API access",
                  "Phone support"
                ],
                cta: "Join Waitlist",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`card p-8 relative ${plan.popular ? 'ring-2 ring-brand-pink' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-brand-pink to-brand-purple text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "$0" && <span className="text-gray-600">/month</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={plan.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="gradient-bg text-white section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Join hundreds of creators who are tired of financial chaos. Get early access to ProfitLens 
            and start making smarter money decisions.
          </p>
          
          <WaitlistForm />
          
          <div className="mt-12 text-white/80">
            <p className="flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" />
              We&apos;ll only email you when ProfitLens is ready. No spam, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="text-center">
            <h3 className="text-2xl font-bold gradient-text mb-4">ProfitLens</h3>
            <p className="text-gray-400 mb-8">
              The financial dashboard built for OnlyFans creators
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
              © 2024 ProfitLens. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}