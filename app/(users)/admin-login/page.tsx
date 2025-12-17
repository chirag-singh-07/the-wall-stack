"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    router.push("/admin")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Admin Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Central Admin Icon with Glow Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Glowing Background Circle */}
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-background/20 blur-3xl transition-all duration-1000",
                mounted ? "scale-100 opacity-100" : "scale-0 opacity-0",
              )}
              style={{ width: "400px", height: "400px", left: "-150px", top: "-150px" }}
            />

            {/* Shield Icon */}
            <div
              className={cn(
                "relative z-10 transition-all duration-700 delay-200",
                mounted ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-180",
              )}
            >
              <div className="bg-background rounded-full p-12 shadow-2xl">
                <Shield className="h-24 w-24 text-foreground" strokeWidth={1.5} />
              </div>
            </div>

            {/* Orbiting Dots */}
            {[0, 120, 240].map((rotation, i) => (
              <div
                key={i}
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000",
                  mounted ? "opacity-100" : "opacity-0",
                )}
                style={{
                  transitionDelay: `${400 + i * 150}ms`,
                }}
              >
                <div className="w-40 h-40 animate-[spin_20s_linear_infinite]" style={{ animationDelay: `${-i * 6}s` }}>
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-background rounded-full shadow-lg"
                    style={{ transform: `rotate(${rotation}deg) translateY(-80px)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Geometric Accents */}
        <div
          className={cn(
            "absolute top-20 left-20 w-32 h-32 border-2 border-background/20 transition-all duration-1000 delay-300",
            mounted ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 rotate-45",
          )}
          style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
        />
        <div
          className={cn(
            "absolute bottom-32 right-32 w-48 h-48 border-2 border-background/20 transition-all duration-1000 delay-500",
            mounted ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-45",
          )}
          style={{ borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%" }}
        />

        {/* Admin Branding Text */}
        <div
          className={cn(
            "absolute bottom-12 left-12 transition-all duration-700 delay-400",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <h2 className="text-background text-4xl font-bold tracking-tight">POSTER ADMIN</h2>
          <p className="text-background/70 mt-2 text-lg">Secure administrative access</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 text-3xl font-bold tracking-tight">
              <Shield className="h-8 w-8" />
              <span>ADMIN</span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="bg-foreground text-background p-2 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Access</h1>
            </div>
            <p className="text-muted-foreground">
              Sign in to your admin account to manage products, orders, and customers
            </p>
          </div>

          {/* Admin Notice */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-foreground/10 p-2 rounded-md mt-0.5">
                <Shield className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-foreground mb-1">Secure Area</p>
                <p className="text-muted-foreground leading-relaxed">
                  This area is restricted to authorized personnel only. All access attempts are logged.
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
                      focusedField === "email" ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@postercraft.com"
                    className={cn(
                      "pl-10 h-12 transition-all duration-200 border-2 bg-background",
                      focusedField === "email" ? "border-foreground shadow-lg" : "border-input",
                    )}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300",
                      focusedField === "email" ? "w-full" : "w-0",
                    )}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
                      focusedField === "password" ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
                    className={cn(
                      "pl-10 pr-10 h-12 transition-all duration-200 border-2 bg-background",
                      focusedField === "password" ? "border-foreground shadow-lg" : "border-input",
                    )}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300",
                      focusedField === "password" ? "w-full" : "w-0",
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium relative overflow-hidden group shadow-lg"
              disabled={isLoading}
            >
              <span
                className={cn(
                  "flex items-center justify-center gap-2 transition-all duration-300",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
              >
                <Shield className="h-4 w-4" />
                Sign In to Admin
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
            </Button>
          </form>

          {/* Back Links */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
