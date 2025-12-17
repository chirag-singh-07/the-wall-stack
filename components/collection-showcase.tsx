"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const showcaseCollections = [
  {
    id: "sc1",
    title: "The Zen Collection",
    subtitle: "Find Your Inner Peace",
    description:
      "Calming minimalist designs that bring tranquility to any space. Each piece is crafted to evoke serenity and balance.",
    posterCount: 12,
    mainImage: "/placeholder.svg?height=800&width=600",
    accentImages: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
    color: "from-foreground/60",
  },
  {
    id: "sc2",
    title: "Urban Noir",
    subtitle: "City Nights, Bold Sights",
    description:
      "Capturing the raw energy of city life through bold contrasts and striking compositions. For the urban soul.",
    posterCount: 18,
    mainImage: "/placeholder.svg?height=800&width=600",
    accentImages: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
    color: "from-foreground/70",
  },
  {
    id: "sc3",
    title: "Nature's Whisper",
    subtitle: "Organic Forms, Timeless Beauty",
    description: "Botanical and natural elements reimagined in striking monochrome. Where nature meets artistry.",
    posterCount: 15,
    mainImage: "/placeholder.svg?height=800&width=600",
    accentImages: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
    color: "from-foreground/50",
  },
]

export function CollectionShowcase() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const navigate = (direction: "prev" | "next") => {
    if (isAnimating) return
    setIsAnimating(true)

    if (direction === "next") {
      setActiveIndex((prev) => (prev + 1) % showcaseCollections.length)
    } else {
      setActiveIndex((prev) => (prev - 1 + showcaseCollections.length) % showcaseCollections.length)
    }

    setTimeout(() => setIsAnimating(false), 700)
  }

  const activeCollection = showcaseCollections[activeIndex]

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-background/60 text-sm tracking-wider uppercase mb-4 block">Featured Collections</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Curated For You</h2>
        </div>

        {/* Showcase */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Section */}
          <div
            className={cn(
              "relative transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12",
            )}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              {showcaseCollections.map((collection, index) => (
                <div
                  key={collection.id}
                  className={cn(
                    "absolute inset-0 transition-all duration-700",
                    index === activeIndex
                      ? "opacity-100 scale-100"
                      : index < activeIndex
                        ? "opacity-0 scale-95 -translate-x-full"
                        : "opacity-0 scale-95 translate-x-full",
                  )}
                >
                  <Image
                    src={collection.mainImage || "/placeholder.svg"}
                    alt={collection.title}
                    fill
                    className="object-cover"
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-t to-transparent", collection.color)} />
                </div>
              ))}

              {/* Floating accent images */}
              <div
                className={cn(
                  "absolute -right-4 top-8 w-24 h-32 rounded-lg overflow-hidden shadow-2xl transition-all duration-700 delay-200",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
                )}
              >
                <Image
                  src={activeCollection.accentImages[0] || "/placeholder.svg"}
                  alt="Accent 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className={cn(
                  "absolute -left-4 bottom-16 w-20 h-28 rounded-lg overflow-hidden shadow-2xl transition-all duration-700 delay-300",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
                )}
              >
                <Image
                  src={activeCollection.accentImages[1] || "/placeholder.svg"}
                  alt="Accent 2"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Collection count badge */}
              <div className="absolute bottom-4 right-4 bg-background text-foreground px-4 py-2 rounded-full text-sm font-medium">
                {activeCollection.posterCount} Posters
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div
            className={cn(
              "transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12",
            )}
          >
            <div className="relative overflow-hidden">
              {showcaseCollections.map((collection, index) => (
                <div
                  key={collection.id}
                  className={cn(
                    "transition-all duration-700",
                    index === activeIndex
                      ? "opacity-100 translate-y-0 relative"
                      : "opacity-0 translate-y-8 absolute inset-0",
                  )}
                >
                  <span className="text-background/40 text-sm tracking-wider uppercase block mb-2">
                    {collection.subtitle}
                  </span>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{collection.title}</h3>
                  <p className="text-background/70 text-lg mb-8 max-w-md">{collection.description}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 group">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("prev")}
                  disabled={isAnimating}
                  className="w-12 h-12 rounded-full border border-background/30 flex items-center justify-center hover:bg-background/10 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate("next")}
                  disabled={isAnimating}
                  className="w-12 h-12 rounded-full border border-background/30 flex items-center justify-center hover:bg-background/10 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Progress indicators */}
              <div className="flex items-center gap-2">
                {showcaseCollections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => !isAnimating && setActiveIndex(index)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      index === activeIndex ? "w-12 bg-background" : "w-4 bg-background/30 hover:bg-background/50",
                    )}
                  />
                ))}
              </div>

              <span className="text-background/40 text-sm ml-auto">
                {String(activeIndex + 1).padStart(2, "0")} / {String(showcaseCollections.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
