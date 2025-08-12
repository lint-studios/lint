import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, Github, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SignUpProps {
  onSignUpSuccess: () => void;
  onBackToLogin: () => void;
}

export function SignUp({ onSignUpSuccess, onBackToLogin }: SignUpProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  const validateForm = () => {
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else if (data.user) {
        toast.success("Account created successfully! Welcome to HelloLint.");
        onSignUpSuccess();
      }
    } catch (error) {
      console.error('SignUp error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'github') => {
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
      console.error('Social signup error:', error);
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

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBackToLogin}
            className="absolute top-6 left-6 font-body text-body-s"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
          <h1 className="font-display text-display-l font-semibold text-text-primary mb-2">
            lint.
          </h1>
          <p className="text-body-m font-body text-text-secondary">
            Create your account
          </p>
        </div>

        <Card className="p-8 bg-surface-card border border-border-subtle">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full font-body text-body-m h-12"
              onClick={() => handleSocialSignUp('google')}
            >
              <Mail className="h-4 w-4 mr-3" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full font-body text-body-m h-12"
              onClick={() => handleSocialSignUp('github')}
            >
              <Github className="h-4 w-4 mr-3" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-surface-card px-4 text-mono-label font-mono text-text-secondary">
                OR CREATE WITH EMAIL
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-mono text-mono-label text-text-secondary">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                className={`h-12 font-body text-body-m ${errors.name ? 'border-destructive' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-body-s font-body text-destructive">{errors.name}</p>
              )}
            </div>

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
              <Label htmlFor="password" className="font-mono text-mono-label text-text-secondary">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={`h-12 font-body text-body-m pr-12 ${errors.password ? 'border-destructive' : ''}`}
                  placeholder="Create a password"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-mono text-mono-label text-text-secondary">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className={`h-12 font-body text-body-m ${errors.confirmPassword ? 'border-destructive' : ''}`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-body-s font-body text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-white font-body text-body-m font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-body-s font-body text-text-secondary">
              Already have an account?{" "}
              <button 
                onClick={onBackToLogin}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </Card>

        {/* Bottom Text */}
        <div className="mt-8 text-center">
          <p className="text-body-s font-body text-text-secondary">
            By creating an account, you agree to our{" "}
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