"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, ArrowRight, Sparkles } from "lucide-react"

const newArrivals = [
  {
    id: "na1",
    title: "Midnight Bloom",
    price: 69,
    image: "/placeholder.svg?height=600&width=450",
    releaseDate: "Just Dropped",
    isNew: true,
  },
  {
    id: "na2",
    title: "Urban Echo",
    price: 59,
    image: "/placeholder.svg?height=600&width=450",
    releaseDate: "2 days ago",
    isNew: true,
  },
  {
    id: "na3",
    title: "Cosmic Drift",
    price: 75,
    image: "/placeholder.svg?height=600&width=450",
    releaseDate: "5 days ago",
    isNew: true,
  },
  {
    id: "na4",
    title: "Linear Thoughts",
    price: 55,
    image: "/placeholder.svg?height=600&width=450",
    releaseDate: "1 week ago",
    isNew: false,
  },
]

export function NewArrivals() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-foreground/5 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-foreground/5 rounded-full animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-foreground/5 rotate-45 animate-pulse delay-300" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-foreground animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="h-6 w-6 text-foreground/30" />
                </div>
              </div>
              <span className="text-sm font-medium tracking-wider uppercase">Fresh Off The Press</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">New Arrivals</h2>
            <p className="text-muted-foreground mt-2">The latest additions to our collection</p>
          </div>
          <Button variant="outline" className="w-fit group bg-transparent">
            <Bell className="mr-2 h-4 w-4" />
            Get Notified
          </Button>
        </div>

        {/* Cards Carousel */}
        <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {newArrivals.map((item, index) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveCard(item.id)}
              onMouseLeave={() => setActiveCard(null)}
              className={cn(
                "group relative flex-shrink-0 w-[280px] md:w-[320px] snap-start transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Card */}
              <div
                className={cn(
                  "relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500",
                  activeCard === item.id && "scale-[1.02]",
                )}
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className={cn("object-cover transition-all duration-700", activeCard === item.id && "scale-110")}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-transparent to-transparent" />

                {/* New badge */}
                {item.isNew && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background text-foreground px-3 py-1 font-medium animate-pulse">NEW</Badge>
                  </div>
                )}

                {/* Release date */}
                <div className="absolute top-4 right-4 flex items-center gap-1 text-background/80 text-sm">
                  <Clock className="h-3 w-3" />
                  {item.releaseDate}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-background mb-1">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-background">${item.price}</span>
                    <Button
                      size="sm"
                      className={cn(
                        "bg-background text-foreground hover:bg-background/90 transition-all duration-300",
                        activeCard === item.id ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                      )}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent -translate-x-full transition-transform duration-1000",
                    activeCard === item.id && "translate-x-full",
                  )}
                />
              </div>
            </div>
          ))}

          {/* View All Card */}
          <div
            className={cn(
              "relative flex-shrink-0 w-[280px] md:w-[320px] aspect-[3/4] rounded-2xl border-2 border-dashed border-foreground/20 flex flex-col items-center justify-center gap-4 snap-start transition-all duration-700 hover:border-foreground/40 hover:bg-muted/50 cursor-pointer group",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
            )}
            style={{ transitionDelay: `${newArrivals.length * 150}ms` }}
          >
            <div className="w-16 h-16 rounded-full border-2 border-foreground/20 flex items-center justify-center group-hover:border-foreground/40 transition-colors">
              <ArrowRight className="h-6 w-6 text-foreground/40 group-hover:text-foreground/60 transition-all group-hover:translate-x-1" />
            </div>
            <span className="text-foreground/60 font-medium group-hover:text-foreground/80 transition-colors">
              View All New
            </span>
          </div>
        </div>

        {/* Scroll indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {newArrivals.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === 0 ? "w-8 bg-foreground" : "bg-foreground/20",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
