"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const sizes = [
  { name: "A4", dimensions: "21×29.7cm", description: "Perfect for desks & shelves", scale: 0.4 },
  { name: "A3", dimensions: "29.7×42cm", description: "Ideal for small walls", scale: 0.55 },
  { name: "A2", dimensions: "42×59.4cm", description: "Great statement piece", scale: 0.75 },
  { name: "A1", dimensions: "59.4×84.1cm", description: "Maximum impact", scale: 1 },
]

export function SizeGuide() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSize, setActiveSize] = useState(2)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">Size Guide</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-balance">Find Your Perfect Fit</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={cn(
              "flex items-end justify-center gap-4 h-[400px] transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
            )}
          >
            {sizes.map((size, index) => (
              <div
                key={size.name}
                className={cn(
                  "relative bg-muted rounded-sm flex items-center justify-center cursor-pointer transition-all duration-500",
                  activeSize === index
                    ? "ring-2 ring-foreground ring-offset-4 ring-offset-background"
                    : "hover:opacity-80",
                )}
                style={{
                  width: `${60 * size.scale}px`,
                  height: `${280 * size.scale}px`,
                }}
                onClick={() => setActiveSize(index)}
              >
                <span className="text-xs font-medium text-muted-foreground">{size.name}</span>
              </div>
            ))}
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
            )}
          >
            <div className="space-y-6">
              {sizes.map((size, index) => (
                <button
                  key={size.name}
                  onClick={() => setActiveSize(index)}
                  className={cn(
                    "w-full text-left p-6 rounded-lg border transition-all duration-300",
                    activeSize === index
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground/50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">{size.name}</span>
                      <p
                        className={cn(
                          "text-sm mt-1",
                          activeSize === index ? "text-background/70" : "text-muted-foreground",
                        )}
                      >
                        {size.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-lg font-medium",
                        activeSize === index ? "text-background/80" : "text-muted-foreground",
                      )}
                    >
                      {size.dimensions}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
