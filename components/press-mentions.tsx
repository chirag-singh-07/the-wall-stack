"use client"

import { useEffect, useRef, useState } from "react"

const pressLogos = [
  { name: "Vogue", logo: "VOGUE" },
  { name: "Architectural Digest", logo: "AD" },
  { name: "Elle Decor", logo: "ELLE DECOR" },
  { name: "Dezeen", logo: "DEZEEN" },
  { name: "Wallpaper", logo: "WALLPAPER*" },
  { name: "Dwell", logo: "DWELL" },
  { name: "Monocle", logo: "MONOCLE" },
  { name: "Surface", logo: "SURFACE" },
]

export function PressMentions() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-background border-y">
      <div className="container mx-auto px-4">
        <p
          className={`text-center text-sm tracking-[0.2em] uppercase text-muted-foreground mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          As Featured In
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {pressLogos.map((press, index) => (
            <div
              key={press.name}
              className={`text-2xl md:text-3xl font-serif font-bold text-muted-foreground/40 hover:text-foreground transition-all duration-500 cursor-default ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {press.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
