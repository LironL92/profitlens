import Link from 'next/link'
import { CheckCircle, ArrowLeft, Mail } from 'lucide-react'

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Email Confirmed!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your email has been successfully confirmed. You're all set on the ProfitLens waitlist. 
            We'll notify you as soon as we launch!
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="btn-primary w-full inline-flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Homepage
            </Link>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center text-blue-700 mb-2">
                <Mail className="h-5 w-5 mr-2" />
                <span className="font-medium">What's Next?</span>
              </div>
              <p className="text-sm text-blue-600">
                We'll send you updates on our progress and notify you the moment ProfitLens is ready for early access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
