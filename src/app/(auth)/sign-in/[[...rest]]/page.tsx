'use client'

import { useState } from "react";
import { useSignIn, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Card } from "../../../../../components/ui/card";
import { Separator } from "../../../../../components/ui/separator";
import { Eye, EyeOff, Mail } from "lucide-react";
import Link from 'next/link';

export default function CustomSignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        // Handle additional verification if needed
        console.log("Additional verification needed:", result);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'oauth_google') => {
    if (!isLoaded) return;
    
    try {
      // Direct OAuth redirect for fastest response
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: `${window.location.origin}/dashboard`,
        redirectUrlComplete: `${window.location.origin}/dashboard`
      });
    } catch (err: any) {
      console.error("Social sign-in error:", err);
      setError(err.errors?.[0]?.message || "Social sign-in failed. Please try again.");
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-body text-[1.875rem] font-medium leading-tight tracking-[-0.094rem] text-black hover:text-primary transition-colors duration-200 mb-2">
            lint<span className="text-primary">.</span>
          </h1>
          <p className="text-body-m font-body text-text-secondary">
            Sign in to your account
          </p>
        </div>

        <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-5">
            <Button
              variant="outline"
              onClick={() => handleSocialSignIn('oauth_google')}
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
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-body-s font-body">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleEmailSignIn}>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-mono text-mono-label text-text-secondary uppercase tracking-wide">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-body-s font-body text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="h-12 font-body text-body-m rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  placeholder="Enter your password"
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
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 gradient-lint text-white font-body text-body-s font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-body-s font-body text-text-secondary">
              Don't have an account?{" "}
              <Link 
                href="/sign-up"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
