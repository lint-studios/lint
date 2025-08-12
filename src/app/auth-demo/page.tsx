'use client'

import { useAuth } from '@clerk/nextjs'
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"
import Link from 'next/link'

export default function AuthDemoPage() {
  const { isSignedIn } = useAuth()

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
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-body text-[2.5rem] font-medium leading-tight tracking-[-0.094rem] text-black mb-4">
            lint<span className="text-primary">.</span> Auth Demo
          </h1>
          <p className="text-body-l font-body text-text-secondary">
            Choose between Clerk's pre-built components or your custom forms with headless Clerk
          </p>
          {isSignedIn && (
            <p className="mt-4 text-accent font-medium">
              ✅ You're currently signed in! Sign out to test the auth flows.
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Clerk Components Approach */}
          <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-[1.5rem] font-body font-medium text-black mb-3">
                Clerk Components
              </h2>
              <p className="text-body-m font-body text-text-secondary mb-6">
                Uses Clerk's pre-built, styled components with custom appearance overrides
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-body-s font-body text-text-secondary">Quick to implement</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-body-s font-body text-text-secondary">Built-in validation & flows</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-body-s font-body text-text-secondary">Auto-handles complex auth states</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-body-s font-body text-text-secondary">Custom styling via appearance prop</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/auth-demo/sign-in-clerk/sign-in">
                <Button className="w-full h-12 gradient-lint text-white font-body text-body-m font-medium rounded-xl">
                  View Clerk Sign In
                </Button>
              </Link>
              <Link href="/auth-demo/sign-up-clerk/sign-up">
                <Button variant="outline" className="w-full h-12 border border-border-subtle rounded-xl">
                  View Clerk Sign Up
                </Button>
              </Link>
            </div>
          </Card>

          {/* Custom Forms Approach */}
          <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-[1.5rem] font-body font-medium text-black mb-3">
                Custom Forms + Clerk
              </h2>
              <p className="text-body-m font-body text-text-secondary mb-6">
                Your original beautiful forms powered by Clerk's headless authentication
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-body-s font-body text-text-secondary">Complete UI control</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-body-s font-body text-text-secondary">Your exact design system</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-body-s font-body text-text-secondary">Custom validation & UX</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-body-s font-body text-text-secondary">Clerk's powerful auth backend</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/sign-in">
                <Button className="w-full h-12 gradient-lint text-white font-body text-body-m font-medium rounded-xl">
                  View Custom Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" className="w-full h-12 border border-border-subtle rounded-xl">
                  View Custom Sign Up
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card className="mt-12 p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
          <h3 className="text-[1.25rem] font-body font-medium text-black mb-6 text-center">
            Feature Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 px-4 font-mono text-mono-label text-text-secondary uppercase tracking-wide">Feature</th>
                  <th className="text-left py-3 px-4 font-mono text-mono-label text-text-secondary uppercase tracking-wide">Clerk Components</th>
                  <th className="text-left py-3 px-4 font-mono text-mono-label text-text-secondary uppercase tracking-wide">Custom Forms</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 px-4 font-body text-body-m text-text-primary">Development Speed</td>
                  <td className="py-3 px-4 font-body text-body-m text-accent">⚡ Faster</td>
                  <td className="py-3 px-4 font-body text-body-m text-text-secondary">Slower (more code)</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 px-4 font-body text-body-m text-text-primary">UI Control</td>
                  <td className="py-3 px-4 font-body text-body-m text-text-secondary">Limited to appearance API</td>
                  <td className="py-3 px-4 font-body text-body-m text-accent">⚡ Complete control</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 px-4 font-body text-body-m text-text-primary">Error Handling</td>
                  <td className="py-3 px-4 font-body text-body-m text-accent">⚡ Built-in</td>
                  <td className="py-3 px-4 font-body text-body-m text-text-secondary">Manual implementation</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 px-4 font-body text-body-m text-text-primary">Customization</td>
                  <td className="py-3 px-4 font-body text-body-m text-text-secondary">Good (via CSS)</td>
                  <td className="py-3 px-4 font-body text-body-m text-accent">⚡ Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-body text-body-m text-text-primary">Maintenance</td>
                  <td className="py-3 px-4 font-body text-body-m text-accent">⚡ Low (Clerk handles updates)</td>
                  <td className="py-3 px-4 font-body text-body-m text-text-secondary">Higher (you handle flows)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <div className="text-center mt-8">
          <Link href="/dashboard">
            <Button variant="outline" className="font-body text-body-m">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
