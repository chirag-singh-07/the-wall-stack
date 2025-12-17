"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Mail, CheckCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function VerifyEmailPage() {
  const [mounted, setMounted] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // Fake verification delay (replace with Better Auth logic later)
    const timer = setTimeout(() => {
      setIsVerifying(false)
      setVerified(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
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
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold tracking-tight">
              POSTER.
            </Link>
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              {isVerifying ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <CheckCircle className="h-8 w-8 text-foreground" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {isVerifying ? "Verifying your email" : "Email verified"}
            </h1>

            <p className="text-muted-foreground">
              {isVerifying
                ? "Please wait while we confirm your email address."
                : "Your email has been successfully verified. You can now access your account."}
            </p>
          </div>

          {/* Email box */}
          <div className="rounded-xl border bg-muted/40 p-4 flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              john.doe@example.com
            </p>
          </div>

          {/* Actions */}
          {!isVerifying && (
            <Button className="w-full h-12 text-base font-medium"
            onClick={() => router.push("/")}
            >
              Continue to Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {/* Back */}
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

      {/* Right Side – SAME as Register */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        {/* Animated diagonal lines */}
        <div className="absolute inset-0">
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
                transform: "rotate(-15deg)",
                transitionDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Brand */}
        <div
          className={cn(
            "absolute bottom-12 right-12 text-right transition-all duration-700 delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <h2 className="text-background text-4xl font-bold tracking-tight">
            POSTER.
          </h2>
          <p className="text-background/60 mt-2">
            Secure. Minimal. Premium.
          </p>
        </div>
      </div>
    </div>
  )
}
