"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function ParallaxBanner() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const offsetTop = rect.top + window.scrollY
        setScrollY((window.scrollY - offsetTop) * 0.3)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.3 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/parallax-banner-black-white-poster-studio.jpg')",
          transform: `translateY(${scrollY}px)`,
        }}
      />
      <div className="absolute inset-0 bg-foreground/70" />

      <div
        className={cn(
          "relative z-10 text-center text-background px-4 transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
        )}
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">Art That Speaks</h2>
        <p className="text-lg md:text-xl text-background/80 max-w-2xl mx-auto mb-8">
          Discover pieces that resonate with your aesthetic. Every poster tells a story.
        </p>
        <Button
          size="lg"
          variant="outline"
          className="bg-transparent border-background text-background hover:bg-background hover:text-foreground group"
        >
          Explore Collection
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  )
}
