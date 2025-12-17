"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Instagram } from "lucide-react"

const images = [
  { id: 1, src: "/instagram-poster-1-black-white-minimal-interior.jpg", alt: "Customer showcase 1" },
  { id: 2, src: "/instagram-poster-2-black-white-gallery-wall.jpg", alt: "Customer showcase 2" },
  { id: 3, src: "/instagram-poster-3-black-white-modern-living.jpg", alt: "Customer showcase 3" },
  { id: 4, src: "/instagram-poster-4-black-white-office-decor.jpg", alt: "Customer showcase 4" },
  { id: 5, src: "/instagram-poster-5-black-white-bedroom-art.jpg", alt: "Customer showcase 5" },
  { id: 6, src: "/instagram-poster-6-black-white-studio-space.jpg", alt: "Customer showcase 6" },
]

export function InstagramGallery() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-sm font-medium tracking-widest text-background/60 uppercase">@postercraft</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-balance">Share Your Space</h2>
          <p className="mt-4 text-background/70 max-w-md mx-auto">Tag us in your photos for a chance to be featured</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "relative aspect-square overflow-hidden group cursor-pointer transition-all duration-700",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  hoveredIndex === index ? "scale-110" : "scale-100",
                  hoveredIndex !== null && hoveredIndex !== index ? "opacity-50" : "opacity-100",
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-foreground/60 flex items-center justify-center transition-opacity duration-300",
                  hoveredIndex === index ? "opacity-100" : "opacity-0",
                )}
              >
                <Instagram className="h-8 w-8 text-background" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
