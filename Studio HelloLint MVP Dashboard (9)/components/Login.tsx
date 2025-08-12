import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { SignUp } from './SignUp';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  const validateForm = () => {
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
      } else if (data.session) {
        toast.success("Welcome back!");
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.info(`Redirecting to ${provider === 'google' ? 'Google' : 'GitHub'}...`);
      }
    } catch (error) {
      console.error('Social login error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Show signup screen if requested
  if (showSignUp) {
    return (
      <SignUp 
        onSignUpSuccess={onLoginSuccess}
        onBackToLogin={() => setShowSignUp(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-display-l font-semibold text-text-primary mb-2">
            lint.
          </h1>
          <p className="text-body-m font-body text-text-secondary">
            Sign in to your account
          </p>
        </div>

        <Card className="p-8 bg-surface-card border border-border-subtle">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full font-body text-body-m h-12"
              onClick={() => handleSocialLogin('google')}
            >
              <Mail className="h-4 w-4 mr-3" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full font-body text-body-m h-12"
              onClick={() => handleSocialLogin('github')}
            >
              <Github className="h-4 w-4 mr-3" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-surface-card px-4 text-mono-label font-mono text-text-secondary">
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-mono-label text-text-secondary">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`h-12 font-body text-body-m ${errors.email ? 'border-destructive' : ''}`}
                placeholder="hello@hellolint.com"
              />
              {errors.email && (
                <p className="text-body-s font-body text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-mono text-mono-label text-text-secondary">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-body-s font-body text-primary hover:text-primary/80"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={`h-12 font-body text-body-m pr-12 ${errors.password ? 'border-destructive' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-body-s font-body text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-white font-body text-body-m font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-body-s font-body text-text-secondary">
              Don't have an account?{" "}
              <button 
                onClick={() => setShowSignUp(true)}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Create one here
              </button>
            </p>
          </div>
        </Card>

        {/* Bottom Text */}
        <div className="mt-8 text-center">
          <p className="text-body-s font-body text-text-secondary">
            By signing in, you agree to our{" "}
            <button className="text-primary hover:text-primary/80">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-primary hover:text-primary/80">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}