"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < 2) {
      setCurrentStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) return;

    setIsLoading(true);

    const res = await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });

    setIsLoading(false);

    if (res.error) {
      toast.error(res.error.message || "An error occurred during registration");
      return;
    }

    toast.success(
      "Registration successful! Please check your email to verify your account."
    );
    router.push("/verify-email"); // or "/login"
  };

  const passwordStrength = passwordRequirements.filter((req) =>
    req.test(formData.password)
  ).length;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div
          className={cn(
            "w-full max-w-md space-y-8 relative z-10 transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-3xl font-bold tracking-tight">
              THE WALL STACK
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    currentStep >= step
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                {step < 2 && (
                  <div
                    className={cn(
                      "w-16 h-0.5 mx-2 transition-colors duration-300",
                      currentStep > step ? "bg-foreground" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {currentStep === 1
                ? "Create your account"
                : "Secure your account"}
            </h1>
            <p className="text-muted-foreground">
              {currentStep === 1
                ? "Join our community of art enthusiasts"
                : "Create a strong password to protect your account"}
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User
                      className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
                        focusedField === "name"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className={cn(
                        "pl-10 h-12 transition-all duration-200 border-2",
                        focusedField === "name"
                          ? "border-foreground"
                          : "border-input"
                      )}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300",
                        focusedField === "name" ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail
                      className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
                        focusedField === "email"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className={cn(
                        "pl-10 h-12 transition-all duration-200 border-2",
                        focusedField === "email"
                          ? "border-foreground"
                          : "border-input"
                      )}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300",
                        focusedField === "email" ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>

                {/* Social Sign Up */}
                <div className="pt-4">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or sign up with
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="relative overflow-hidden group h-12 bg-transparent"
                    >
                      <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <svg
                        className="w-5 h-5 mr-2 relative z-10 group-hover:text-background transition-colors"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="relative z-10 group-hover:text-background transition-colors">
                        Google
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="relative overflow-hidden group h-12 bg-transparent"
                    >
                      <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <svg
                        className="w-5 h-5 mr-2 relative z-10 group-hover:text-background transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="relative z-10 group-hover:text-background transition-colors">
                        GitHub
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
                        focusedField === "password"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className={cn(
                        "pl-10 pr-10 h-12 transition-all duration-200 border-2",
                        focusedField === "password"
                          ? "border-foreground"
                          : "border-input"
                      )}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-all duration-300",
                            i < passwordStrength ? "bg-foreground" : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {passwordRequirements.map((req, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-1.5 text-xs transition-colors duration-200",
                            req.test(formData.password)
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {req.test(formData.password) ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {req.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
                        focusedField === "confirmPassword"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={cn(
                        "pl-10 pr-10 h-12 transition-all duration-200 border-2",
                        focusedField === "confirmPassword"
                          ? "border-foreground"
                          : "border-input",
                        formData.confirmPassword &&
                          formData.password !== formData.confirmPassword &&
                          "border-destructive"
                      )}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                        Passwords do not match
                      </p>
                    )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 mt-0.5",
                      agreedToTerms
                        ? "bg-foreground border-foreground"
                        : "border-input hover:border-foreground"
                    )}
                  >
                    {agreedToTerms && (
                      <Check className="h-3 w-3 text-background" />
                    )}
                  </button>
                  <p className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-foreground hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-foreground hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 bg-transparent"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 h-12 text-base font-medium relative overflow-hidden group"
                disabled={
                  isLoading ||
                  (currentStep === 2 &&
                    (!agreedToTerms ||
                      formData.password !== formData.confirmPassword ||
                      passwordStrength < 4))
                }
              >
                <span
                  className={cn(
                    "flex items-center justify-center gap-2 transition-all duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                  )}
                >
                  {currentStep === 1 ? "Continue" : "Create Account"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {isLoading && (
                  <Loader2 className="absolute h-5 w-5 animate-spin" />
                )}
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Moving diagonal lines */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute h-px bg-background/10 transition-all duration-1000",
                mounted ? "opacity-100" : "opacity-0"
              )}
              style={{
                width: "200%",
                left: "-50%",
                top: `${i * 10 + 5}%`,
                transform: `rotate(${-15}deg)`,
                transitionDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* 3D Stacked Cards */}
        <div className="absolute inset-0 flex items-center justify-center perspective-1000">
          <div
            className={cn(
              "relative transition-all duration-1000 delay-300",
              mounted ? "opacity-100 rotate-0" : "opacity-0 rotate-12"
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-background rounded-xl shadow-2xl overflow-hidden"
                style={{
                  width: "300px",
                  height: "400px",
                  transform: `translateZ(${i * -30}px) translateX(${
                    i * 20
                  }px) translateY(${i * 15}px) rotateY(${i * 5}deg)`,
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-muted to-background" />
                <div className="absolute inset-6 border border-border rounded-lg" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div
                    className="h-2 bg-muted rounded mb-2"
                    style={{ width: `${60 + i * 10}%` }}
                  />
                  <div
                    className="h-2 bg-muted rounded"
                    style={{ width: `${40 + i * 5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div
          className={cn(
            "absolute top-1/4 right-1/4 w-20 h-20 border-2 border-background/20 transition-all duration-1000 delay-500",
            mounted
              ? "scale-100 opacity-100 rotate-45"
              : "scale-0 opacity-0 rotate-0"
          )}
        />
        <div
          className={cn(
            "absolute bottom-1/4 left-1/4 w-16 h-16 bg-background/10 rounded-full transition-all duration-1000 delay-700",
            mounted ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />

        {/* Brand Text */}
        <div
          className={cn(
            "absolute bottom-12 right-12 text-right transition-all duration-700 delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <h2 className="text-background text-4xl font-bold tracking-tight">
            THE WALL STACK
          </h2>
          <p className="text-background/60 mt-2">Join 50,000+ art lovers</p>
        </div>
      </div>
    </div>
  );
}
