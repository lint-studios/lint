'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../../../../../../components/ui/button'

export default function SignInPage() {
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-body text-[2rem] font-medium text-text-primary mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-body-m font-body text-text-secondary mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Link href="/dashboard">
            <Button className="font-body text-body-m">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-body text-[1.875rem] font-medium leading-tight tracking-[-0.094rem] text-black hover:text-primary transition-colors duration-200 mb-2">
            lint<span className="text-primary">.</span>
          </h1>
          <p className="text-body-m font-body text-text-secondary">
            Sign in to your account (Clerk Components Demo)
          </p>
        </div>

        {/* Clerk SignIn Component with custom styling */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-surface-card border-0 shadow-none rounded-none p-8",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "w-full h-12 font-body text-body-m font-medium rounded-xl border border-border-subtle hover:bg-gray-50 transition-colors mb-3",
                socialButtonsBlockButtonText: "font-body text-body-m font-medium",
                dividerLine: "bg-border-subtle",
                dividerText: "font-mono text-mono-label text-text-secondary uppercase tracking-wide",
                formFieldLabel: "font-mono text-mono-label text-text-secondary uppercase tracking-wide",
                formFieldInput: "h-12 font-body text-body-m rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-transparent",
                formButtonPrimary: "w-full h-12 gradient-lint text-white font-body text-body-m font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border-0",
                footerActionLink: "text-primary hover:text-primary/80 font-medium transition-colors"
              },
              layout: {
                socialButtonsPlacement: "top"
              }
            }}
            routing="path"
            path="/auth-demo/sign-in-clerk/sign-in"
            signUpUrl="/auth-demo/sign-up-clerk/sign-up"
          />
        </div>

        <div className="mt-8 text-center">
          <Link href="/auth-demo">
            <Button variant="outline" className="font-body text-body-m">
              ← Back to Auth Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}