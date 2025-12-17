"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    quote: "The quality exceeded all my expectations. These posters have completely transformed my living room.",
    author: "Sarah M.",
    role: "Interior Designer",
  },
  {
    id: 2,
    quote: "Finally found a brand that understands minimal design. Every piece is a conversation starter.",
    author: "James K.",
    role: "Architect",
  },
  {
    id: 3,
    quote: "I've ordered from many poster shops, but none compare to the paper quality and attention to detail here.",
    author: "Emma L.",
    role: "Art Collector",
  },
  {
    id: 4,
    quote: "The curation is impeccable. Each poster feels like it belongs in a gallery, not just on a wall.",
    author: "Michael R.",
    role: "Creative Director",
  },
]

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const next = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">Testimonials</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-balance">What Our Customers Say</h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    "w-full flex-shrink-0 px-4 transition-all duration-500",
                    isVisible ? "opacity-100" : "opacity-0",
                  )}
                >
                  <div className="text-center">
                    <Quote className="h-12 w-12 mx-auto mb-8 text-muted-foreground/30" />
                    <p className="text-2xl md:text-3xl font-light leading-relaxed mb-8 text-balance">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-semibold text-lg">{testimonial.author}</p>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-12">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full bg-transparent">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setActiveIndex(index)
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === activeIndex ? "w-8 bg-foreground" : "w-2 bg-muted-foreground/30",
                  )}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full bg-transparent">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
