"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function BrandStory() {
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
    <section ref={sectionRef} id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={cn(
              "relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-lg bg-muted transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
            )}
          >
            <Image src="/minimal-studio-workspace-posters-black-white.jpg" alt="Our studio" fill className="object-cover" />
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
            )}
          >
            <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Our Story</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-6 text-balance">
              Crafting art that speaks to you.
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2020, POSTER. began as a passion project between two design enthusiasts who believed that
                beautiful art should be accessible to everyone.
              </p>
              <p>
                Every piece in our collection is carefully curated and printed using museum-quality techniques. We work
                directly with independent artists from around the world, ensuring that each poster tells a unique story.
              </p>
              <p>
                Our commitment to sustainability means every purchase supports responsible sourcing and eco-friendly
                production methods.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-border grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">Unique Designs</div>
              </div>
              <div>
                <div className="text-3xl font-bold">30+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
