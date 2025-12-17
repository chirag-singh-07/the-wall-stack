"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Palette, Printer, Package, Truck } from "lucide-react"

const steps = [
  {
    icon: Palette,
    title: "Design",
    description: "Each piece is carefully curated by our team of artists and designers.",
    number: "01",
  },
  {
    icon: Printer,
    title: "Print",
    description: "Printed on museum-grade 200gsm paper using archival inks.",
    number: "02",
  },
  {
    icon: Package,
    title: "Package",
    description: "Carefully packaged in protective tubes to ensure safe delivery.",
    number: "03",
  },
  {
    icon: Truck,
    title: "Deliver",
    description: "Free worldwide shipping with tracking on every order.",
    number: "04",
  },
]

export function ProcessSection() {
  const [isVisible, setIsVisible] = useState(false)
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
            "text-center mb-20 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">Our Process</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-balance">From Design to Doorstep</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-border" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                "text-center relative transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-foreground rounded-full scale-0 group-hover:scale-100 transition-transform" />
                <div className="relative h-32 w-32 rounded-full border-2 border-border flex items-center justify-center bg-background">
                  <step.icon className="h-10 w-10" />
                </div>
                <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
