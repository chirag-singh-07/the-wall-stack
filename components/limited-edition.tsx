"use client"

import { useState, useEffect, useRef } from "react"
import { Clock, Flame, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const limitedPosters = [
  {
    id: 1,
    title: "Eclipse Series #001",
    artist: "Luna Studio",
    originalPrice: 149,
    salePrice: 99,
    image: "/placeholder.svg?height=500&width=350",
    edition: "50/100",
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    viewers: 47,
  },
  {
    id: 2,
    title: "Architect's Dream",
    artist: "Blueprint Co",
    originalPrice: 199,
    salePrice: 129,
    image: "/placeholder.svg?height=500&width=350",
    edition: "23/50",
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    viewers: 82,
  },
  {
    id: 3,
    title: "Zen Garden",
    artist: "Eastern Arts",
    originalPrice: 129,
    salePrice: 79,
    image: "/placeholder.svg?height=500&width=350",
    edition: "78/100",
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    viewers: 156,
  },
]

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTime = () => {
      const diff = endTime.getTime() - Date.now()
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTime())
    const interval = setInterval(() => setTimeLeft(calculateTime()), 1000)
    return () => clearInterval(interval)
  }, [endTime])

  return (
    <div className="flex gap-2">
      {[
        { value: timeLeft.hours, label: "HRS" },
        { value: timeLeft.minutes, label: "MIN" },
        { value: timeLeft.seconds, label: "SEC" },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-foreground text-background w-12 h-12 rounded flex items-center justify-center font-mono text-xl font-bold">
            {String(item.value).padStart(2, "0")}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1 block">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function LimitedEdition() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm animate-pulse">
                <Flame className="w-4 h-4" />
                <span>Limited Time</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Limited Editions</h2>
            <p className="text-background/70 max-w-xl">
              Exclusive artist collaborations. Once they are gone, they are gone forever.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-background/30 text-background hover:bg-background/10 self-start md:self-auto bg-transparent"
          >
            View All Exclusives
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {limitedPosters.map((poster, index) => (
            <div
              key={poster.id}
              className={`group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(poster.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative bg-background/5 backdrop-blur-sm rounded-lg overflow-hidden border border-background/10">
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-background text-foreground text-xs font-bold rounded-full">
                    {Math.round((1 - poster.salePrice / poster.originalPrice) * 100)}% OFF
                  </span>
                  <span className="px-3 py-1 bg-foreground/80 text-background text-xs rounded-full">
                    Edition {poster.edition}
                  </span>
                </div>

                {/* Viewers Badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2 py-1 bg-foreground/80 text-background text-xs rounded-full">
                  <Users className="w-3 h-3" />
                  <span>{poster.viewers} watching</span>
                </div>

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={poster.image || "/placeholder.svg"}
                    alt={poster.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredCard === poster.id ? "scale-110" : "scale-100"
                    }`}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent" />

                  {/* Animated Border */}
                  <div
                    className={`absolute inset-0 border-2 border-background/50 transition-all duration-500 ${
                      hoveredCard === poster.id ? "inset-2 opacity-100" : "inset-0 opacity-0"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-background/60 text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Ends in:</span>
                  </div>
                  <CountdownTimer endTime={poster.endTime} />

                  <div className="mt-4 pt-4 border-t border-background/20">
                    <h3 className="font-bold text-xl mb-1">{poster.title}</h3>
                    <p className="text-background/60 text-sm mb-3">{poster.artist}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">${poster.salePrice}</span>
                        <span className="text-background/50 line-through">${poster.originalPrice}</span>
                      </div>
                      <Button
                        size="sm"
                        className={`bg-background text-foreground hover:bg-background/90 transition-all duration-300 ${
                          hoveredCard === poster.id ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                        }`}
                      >
                        Claim Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
