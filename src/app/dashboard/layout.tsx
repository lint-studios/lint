"use client";

import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function RedirectToCustomSignIn() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/sign-in')
  }, [router])

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-body text-[1.875rem] font-medium leading-tight tracking-[-0.094rem] text-black mb-4">
          lint<span className="text-primary">.</span>
        </h1>
        <p className="text-body-m font-body text-text-secondary mb-6">
          Redirecting to sign in...
        </p>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToCustomSignIn />
      </SignedOut>
    </>
  )
}
