import Link from 'next/link'
import { XCircle, ArrowLeft, Mail } from 'lucide-react'

export default function InvalidPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Confirmation Link
          </h1>
          
          <p className="text-gray-600 mb-8">
            This confirmation link is either invalid or has expired. Don't worry though - 
            you might already be confirmed, or you can sign up again.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="btn-primary w-full inline-flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Homepage
            </Link>
            
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center justify-center text-amber-700 mb-2">
                <Mail className="h-5 w-5 mr-2" />
                <span className="font-medium">Need Help?</span>
              </div>
              <p className="text-sm text-amber-600">
                If you're having trouble, try signing up again on our homepage. 
                If you're already on the waitlist, we'll let you know!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
