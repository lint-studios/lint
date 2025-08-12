'use client'

import { useState } from "react";
import { useSignUp, useClerk, useOrganization } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Card } from "../../../../../components/ui/card";
import { Separator } from "../../../../../components/ui/separator";
import { Eye, EyeOff, Mail, Check } from "lucide-react";
import Link from 'next/link';

export default function CustomSignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { organization } = useOrganization();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    organizationName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains number", met: /\d/.test(formData.password) }
  ];

  // Helper function to create organization after successful sign-up
  const createOrganizationIfNeeded = async () => {
    if (formData.organizationName.trim()) {
      try {
        const response = await fetch('/api/organizations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.organizationName.trim()
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to create organization');
        }
      } catch (error) {
        console.error('Error creating organization:', error);
      }
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.status === "missing_requirements") {
        // Usually need email verification
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingVerification(true);
      } else if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await createOrganizationIfNeeded();
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        await createOrganizationIfNeeded();
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'oauth_google') => {
    if (!isLoaded) return;
    
    try {
      // Direct OAuth redirect for fastest response
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: `${window.location.origin}/dashboard`,
        redirectUrlComplete: `${window.location.origin}/dashboard`
      });
    } catch (err: any) {
      console.error("Social sign-up error:", err);
      setError(err.errors?.[0]?.message || "Social sign-up failed. Please try again.");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Email verification form
  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="w-full max-w-[440px]">
          <div className="text-center mb-8">
            <h1 className="font-body text-[1.875rem] font-medium leading-tight tracking-[-0.094rem] text-black hover:text-primary transition-colors duration-200 mb-2">
              lint<span className="text-primary">.</span>
            </h1>
            <p className="text-body-m font-body text-text-secondary">
              Verify your email address
            </p>
          </div>

          <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
            <div className="text-center mb-6">
              <p className="text-body-m font-body text-text-secondary">
                We've sent a verification code to <strong>{formData.email}</strong>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-body-s font-body">{error}</p>
              </div>
            )}

            <form onSubmit={handleVerifyEmail} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="font-mono text-mono-label text-text-secondary uppercase tracking-wide">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 font-body text-body-m rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                  placeholder="Enter verification code"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 gradient-lint text-white font-body text-body-s font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-body text-[1.875rem] font-medium leading-tight tracking-[-0.094rem] text-black hover:text-primary transition-colors duration-200 mb-2">
            lint<span className="text-primary">.</span>
          </h1>
          <p className="text-body-m font-body text-text-secondary">
            Create your account
          </p>
        </div>

        <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-5">
            <Button
              variant="outline"
              onClick={() => handleSocialSignUp('oauth_google')}
              className="w-full h-12 font-body text-body-m font-medium rounded-xl border border-border-subtle hover:bg-gray-50 transition-colors"
            >
              <Mail className="h-5 w-5 mr-3" />
              Continue with Google
            </Button>

          </div>

          <div className="relative mb-5">
            <Separator />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-surface-card px-4 text-mono-label font-mono text-text-secondary uppercase tracking-wide">
                OR CREATE WITH EMAIL
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-body-s font-body">{error}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form className="space-y-4" onSubmit={handleEmailSignUp}>
            <div className="space-y-2">
                              <Label htmlFor="name" className="font-mono text-mono-label text-text-secondary uppercase tracking-wide">
                  Full Name
                </Label>
              <Input
                id="name"
                type="text"
                value={formData.firstName + ' ' + formData.lastName}
                onChange={(e) => {
                  const nameParts = e.target.value.split(' ');
                  setFormData(prev => ({ 
                    ...prev, 
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || ''
                  }));
                }}
                className="h-12 font-body text-body-m rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-mono-label text-text-secondary uppercase tracking-wide">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="h-12 font-body text-body-m rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationName" className="font-mono text-mono-label text-text-secondary uppercase tracking-wide">
                Organization Name <span className="text-text-tertiary">(Optional)</span>
              </Label>
              <Input
                id="organizationName"
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                className="h-12 font-body text-body-m rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your organization name"
              />
              <p className="text-body-xs font-body text-text-secondary">
                Create a workspace for your team (you can add this later)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-mono-label text-text-secondary uppercase tracking-wide">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="h-12 font-body text-body-m rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check 
                        className={`h-3 w-3 ${req.met ? 'text-accent' : 'text-gray-300'}`} 
                      />
                      <span 
                        className={`text-body-s font-body ${req.met ? 'text-accent' : 'text-text-secondary'}`}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 gradient-lint text-white font-body text-body-m font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border-0"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-body-s font-body text-text-secondary">
              Already have an account?{" "}
              <Link 
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>

        {/* Terms & Privacy */}
        <div className="mt-6 text-center">
          <p className="text-body-s font-body text-text-secondary">
            By creating an account, you agree to our{" "}
            <button className="text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
