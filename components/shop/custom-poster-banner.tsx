"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function CustomPosterBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (bannerRef.current) {
      observer.observe(bannerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={bannerRef}
      className={cn(
        "relative overflow-hidden bg-foreground text-background rounded-2xl p-6 md:p-8 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-background" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-background" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-background" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-background" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-background/10 flex items-center justify-center">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">Create Your Custom Poster</h3>
            <p className="text-background/70 text-sm md:text-base mt-1">
              Transform your ideas into unique wall art. Upload your design or work with our artists.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="bg-background text-foreground hover:bg-background/90 border-0 group flex-shrink-0"
        >
          Start Creating
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}
