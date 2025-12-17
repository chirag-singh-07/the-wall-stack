"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Sparkles, Check, ArrowRight } from "lucide-react"

const combos = [
  {
    id: "c1",
    title: "The Minimalist Set",
    description: "Perfect harmony for modern spaces",
    originalPrice: 180,
    comboPrice: 129,
    savings: 51,
    posters: ["/minimal-geometric-black-white-poster.jpg", "/minimal-lines-black-white-poster.jpg", "/minimal-circles-black-white-poster.jpg"],
    features: ["3 Premium Posters", "Free Shipping", "Gift Box Included"],
    popular: true,
  },
  {
    id: "c2",
    title: "Abstract Collection",
    description: "Bold expressions for creative minds",
    originalPrice: 220,
    comboPrice: 159,
    savings: 61,
    posters: [
      "/abstract-fluid-black-white-poster.jpg",
      "/abstract-chaos-black-white-poster.jpg",
      "/abstract-motion-black-white-poster.jpg",
      "/abstract-wave-black-white-poster.jpg",
    ],
    features: ["4 Premium Posters", "Free Shipping", "Artist Certificate"],
    popular: false,
  },
  {
    id: "c3",
    title: "Gallery Starter",
    description: "Everything you need to start your collection",
    originalPrice: 350,
    comboPrice: 249,
    savings: 101,
    posters: [
      "/gallery-minimal-black-white-poster.jpg",
      "/gallery-abstract-black-white-poster.jpg",
      "/gallery-typography-black-white-poster.jpg",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    features: ["6 Premium Posters", "Free Shipping", "Hanging Kit", "Lifetime Warranty"],
    popular: false,
  },
]

export function ComboSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCombo, setHoveredCombo] = useState<string | null>(null)
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 rounded-full mb-6">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">Bundle & Save</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">Combo Collections</h2>
          <p className="text-background/60 max-w-lg mx-auto">
            Curated poster sets at exclusive prices. Save more when you buy together.
          </p>
        </div>

        {/* Combo Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {combos.map((combo, index) => (
            <div
              key={combo.id}
              onMouseEnter={() => setHoveredCombo(combo.id)}
              onMouseLeave={() => setHoveredCombo(null)}
              className={cn(
                "group relative bg-background/5 backdrop-blur-sm rounded-2xl p-6 transition-all duration-700 border border-background/10",
                hoveredCombo === combo.id && "bg-background/10 scale-[1.02] border-background/30",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Popular Badge */}
              {combo.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-background text-foreground px-4 py-1 animate-pulse">Most Popular</Badge>
                </div>
              )}

              {/* Poster Stack Preview */}
              <div className="relative h-48 mb-6">
                {combo.posters.slice(0, 4).map((poster, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute w-28 h-36 rounded-lg overflow-hidden shadow-2xl transition-all duration-500",
                      hoveredCombo === combo.id ? "rotate-0" : "",
                    )}
                    style={{
                      left: `${i * 20}%`,
                      top: `${Math.sin(i) * 10 + 10}px`,
                      transform:
                        hoveredCombo === combo.id
                          ? `rotate(${(i - 1.5) * 8}deg) translateY(${i % 2 === 0 ? -10 : 10}px)`
                          : `rotate(${(i - 1.5) * 5}deg)`,
                      zIndex: combo.posters.length - i,
                    }}
                  >
                    <Image src={poster || "/placeholder.svg"} alt={`Poster ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}

                {/* Glow effect */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-radial from-background/20 to-transparent opacity-0 transition-opacity duration-500",
                    hoveredCombo === combo.id && "opacity-100",
                  )}
                />
              </div>

              {/* Combo Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{combo.title}</h3>
                  <p className="text-background/60 text-sm">{combo.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {combo.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-background/80">
                      <Check className="h-4 w-4 text-background/60" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Pricing */}
                <div className="pt-4 border-t border-background/10">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className="text-background/40 line-through text-sm">${combo.originalPrice}</span>
                      <div className="text-3xl font-bold">${combo.comboPrice}</div>
                    </div>
                    <Badge variant="outline" className="border-background/30 text-background">
                      Save ${combo.savings}
                    </Badge>
                  </div>

                  <Button
                    className={cn(
                      "w-full bg-background text-foreground hover:bg-background/90 group/btn transition-all duration-300",
                      hoveredCombo === combo.id && "shadow-lg shadow-background/20",
                    )}
                  >
                    Get This Combo
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Corner accents */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-16 h-16 transition-opacity duration-300",
                  hoveredCombo === combo.id ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="absolute top-4 right-4 w-8 h-[1px] bg-background/40" />
                <div className="absolute top-4 right-4 w-[1px] h-8 bg-background/40" />
              </div>
              <div
                className={cn(
                  "absolute bottom-0 left-0 w-16 h-16 transition-opacity duration-300",
                  hoveredCombo === combo.id ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="absolute bottom-4 left-4 w-8 h-[1px] bg-background/40" />
                <div className="absolute bottom-4 left-4 w-[1px] h-8 bg-background/40" />
              </div>
            </div>
          ))}
        </div>

        {/* Custom Combo CTA */}
        <div
          className={cn(
            "mt-16 text-center transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <p className="text-background/60 mb-4">Want to create your own combo?</p>
          <Button
            variant="outline"
            className="border-background/30 text-background hover:bg-background/10 bg-transparent"
          >
            Build Custom Combo
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
