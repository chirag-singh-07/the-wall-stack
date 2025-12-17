"use client"

import { useEffect, useRef, useState } from "react"
import { Award, Truck, Leaf, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Award,
    title: "Premium Print",
    description: "Museum-quality prints on archival paper",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Free shipping on orders over $100",
  },
  {
    icon: Leaf,
    title: "Eco Paper",
    description: "Sustainably sourced, FSC certified",
  },
  {
    icon: RotateCcw,
    title: "30-Day Return",
    description: "Hassle-free returns, no questions asked",
  },
]

export function FeaturesSection() {
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

  return (
    <section ref={sectionRef} className="py-20 md:py-32 border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "text-center transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 border border-border rounded-full">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
