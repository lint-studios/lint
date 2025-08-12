import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Eye, EyeOff, Mail, Check } from "lucide-react";

interface SignUpProps {
  onSwitchToSignIn: () => void;
  onSignUp: () => void;
}

export function SignUp({ onSwitchToSignIn, onSignUp }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains number", met: /\d/.test(formData.password) }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-body text-[1.875rem] font-medium leading-tight tracking-[-0.094rem] text-black hover:text-primary transition-colors duration-200 mb-2">
            lint<span className="text-primary">.</span>
          </h1>
          <p className="text-body-m font-body text-text-secondary">
            Create your account
          </p>
        </div>

        <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 font-body text-body-m font-medium rounded-xl border border-border-subtle hover:bg-gray-50 transition-colors"
            >
              <Mail className="h-5 w-5 mr-3" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 font-body text-body-m font-medium rounded-xl border border-border-subtle hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-surface-card px-4 text-mono-label font-mono text-text-secondary uppercase tracking-wide">
                OR CREATE WITH EMAIL
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSignUp(); }}>
            <div className="space-y-2">
              <Label htmlFor="name" className="font-mono text-mono-label text-text-secondary uppercase tracking-wide">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-12 font-body text-body-m rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
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
              />
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
              className="w-full h-12 gradient-lint text-white font-body text-body-m font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border-0"
            >
              Create account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-body-s font-body text-text-secondary">
              Already have an account?{" "}
              <button 
                onClick={onSwitchToSignIn}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </Card>

        {/* Terms & Privacy */}
        <div className="mt-8 text-center">
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