"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Instagram, Twitter, Globe, ArrowRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const featuredArtist = {
  name: "Elena Vasquez",
  title: "Abstract Minimalist",
  location: "Barcelona, Spain",
  bio: "Elena's work explores the intersection of architecture and nature, creating striking compositions that challenge perception. Her minimalist approach has garnered international acclaim, with pieces featured in galleries across Europe and North America.",
  quote: "I believe in the power of negative space. What you don't see is just as important as what you do.",
  avatar: "/placeholder.svg?height=400&width=400",
  stats: {
    posters: 47,
    sales: "12K+",
    rating: 4.9,
  },
  works: [
    { id: 1, image: "/placeholder.svg?height=400&width=300" },
    { id: 2, image: "/placeholder.svg?height=400&width=300" },
    { id: 3, image: "/placeholder.svg?height=400&width=300" },
    { id: 4, image: "/placeholder.svg?height=400&width=300" },
  ],
  socials: {
    instagram: "#",
    twitter: "#",
    website: "#",
  },
}

export function ArtistSpotlight() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredWork, setHoveredWork] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    })
  }

  return (
    <section ref={sectionRef} className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 block">Featured Creator</span>
          <h2 className="text-4xl md:text-6xl font-bold">Artist Spotlight</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Artist Info */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="flex items-start gap-6 mb-8">
              <div className="relative" onMouseMove={handleMouseMove} onMouseLeave={() => setMousePos({ x: 0, y: 0 })}>
                <div
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background shadow-xl transition-transform duration-300"
                  style={{
                    transform: `rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
                  }}
                >
                  <img
                    src={featuredArtist.avatar || "/placeholder.svg"}
                    alt={featuredArtist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                  <span className="text-background text-xs font-bold">PRO</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">{featuredArtist.name}</h3>
                <p className="text-muted-foreground">{featuredArtist.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{featuredArtist.location}</p>
                <div className="flex gap-3 mt-4">
                  <a
                    href={featuredArtist.socials.instagram}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={featuredArtist.socials.twitter}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={featuredArtist.socials.website}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Posters", value: featuredArtist.stats.posters },
                { label: "Sales", value: featuredArtist.stats.sales },
                { label: "Rating", value: featuredArtist.stats.rating },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`text-center p-4 bg-background rounded-lg border transition-all duration-500 hover:shadow-lg ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div
              className={`relative bg-foreground text-background p-6 rounded-lg mb-8 transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Quote className="absolute -top-3 -left-3 w-8 h-8 text-background/20" />
              <p className="italic text-lg leading-relaxed">{featuredArtist.quote}</p>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">{featuredArtist.bio}</p>

            <Button className="group">
              View Full Collection
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Artist Works Grid */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              {featuredArtist.works.map((work, index) => (
                <div
                  key={work.id}
                  className={`relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-500 ${
                    index === 0 ? "row-span-2" : ""
                  } ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                  onMouseEnter={() => setHoveredWork(work.id)}
                  onMouseLeave={() => setHoveredWork(null)}
                >
                  <div className={`${index === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                    <img
                      src={work.image || "/placeholder.svg"}
                      alt={`Work ${work.id}`}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredWork === work.id ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-foreground/80 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredWork === work.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-background text-background hover:bg-background hover:text-foreground bg-transparent"
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Corner Accents */}
                  <div
                    className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-background transition-all duration-300 ${
                      hoveredWork === work.id ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    }`}
                  />
                  <div
                    className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-background transition-all duration-300 ${
                      hoveredWork === work.id ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
