"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail("")
      }, 3000)
    }
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-32 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={cn(
            "max-w-2xl mx-auto text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Stay in the frame.</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for exclusive drops, design inspiration, and 10% off your first order.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background"
              required
            />
            <Button
              type="submit"
              size="lg"
              className={cn("h-12 px-8 transition-all duration-300", isSubmitted && "bg-green-600 hover:bg-green-600")}
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Subscribed
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
