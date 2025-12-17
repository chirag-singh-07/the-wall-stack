"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const showcasePosters = [
  {
    id: 1,
    title: "Midnight Geometry",
    artist: "Studio Noir",
    price: 49,
    image: "/geometric-black-white-abstract-poster-art.jpg",
  },
  {
    id: 2,
    title: "Urban Shadows",
    artist: "Metro Arts",
    price: 59,
    image: "/urban-cityscape-black-white-poster-photography.jpg",
  },
  {
    id: 3,
    title: "Botanical Dreams",
    artist: "Nature Press",
    price: 45,
    image: "/botanical-plants-black-white-line-art-poster.jpg",
  },
  {
    id: 4,
    title: "Wave Forms",
    artist: "Ocean Studio",
    price: 55,
    image: "/ocean-waves-black-white-abstract-poster.jpg",
  },
  {
    id: 5,
    title: "Mountain Echo",
    artist: "Peak Design",
    price: 52,
    image: "/mountain-landscape-black-white-minimalist-poster.jpg",
  },
]

export function RotatingShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || isHovered) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcasePosters.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, isHovered])

  const goTo = (index: number) => {
    setCurrentIndex(index)
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % showcasePosters.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + showcasePosters.length) % showcasePosters.length)

  return (
    <section ref={sectionRef} className="py-24 bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm tracking-[0.3em] uppercase text-background/60 mb-4 block">Interactive Gallery</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">3D Showcase</h2>
          <p className="text-background/70 max-w-2xl mx-auto">
            Explore our featured posters in an immersive 3D carousel
          </p>
        </div>

        <div
          className="relative h-[500px] md:h-[600px] perspective-[1500px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 3D Carousel */}
          <div className="absolute inset-0 flex items-center justify-center">
            {showcasePosters.map((poster, index) => {
              const offset = index - currentIndex
              const absOffset = Math.abs(offset)
              const isCenter = offset === 0

              let transform = ""
              let zIndex = 10 - absOffset
              let opacity = 1

              if (offset === 0) {
                transform = "translateX(0) translateZ(100px) rotateY(0deg)"
                zIndex = 20
              } else if (offset === 1 || offset === -showcasePosters.length + 1) {
                transform = "translateX(250px) translateZ(-50px) rotateY(-25deg)"
                opacity = 0.7
              } else if (offset === -1 || offset === showcasePosters.length - 1) {
                transform = "translateX(-250px) translateZ(-50px) rotateY(25deg)"
                opacity = 0.7
              } else if (offset === 2 || offset === -showcasePosters.length + 2) {
                transform = "translateX(400px) translateZ(-150px) rotateY(-35deg)"
                opacity = 0.4
              } else if (offset === -2 || offset === showcasePosters.length - 2) {
                transform = "translateX(-400px) translateZ(-150px) rotateY(35deg)"
                opacity = 0.4
              } else {
                transform = "translateX(0) translateZ(-300px) rotateY(0deg)"
                opacity = 0
              }

              return (
                <div
                  key={poster.id}
                  className="absolute transition-all duration-700 ease-out cursor-pointer"
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => goTo(index)}
                >
                  <div
                    className={`relative bg-background p-3 shadow-2xl transition-all duration-500 ${
                      isCenter ? "scale-100" : "scale-90"
                    }`}
                  >
                    {/* Poster Frame */}
                    <div className="relative overflow-hidden">
                      <img
                        src={poster.image || "/placeholder.svg"}
                        alt={poster.title}
                        className="w-[280px] md:w-[320px] h-[380px] md:h-[440px] object-cover"
                      />

                      {/* Shine Effect */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ${
                          isCenter && isVisible ? "translate-x-[200%]" : "-translate-x-[200%]"
                        }`}
                        style={{ transitionDelay: "500ms" }}
                      />
                    </div>

                    {/* Info Panel */}
                    <div
                      className={`absolute -bottom-20 left-0 right-0 bg-foreground text-background p-4 transition-all duration-500 ${
                        isCenter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      <h3 className="font-bold text-lg">{poster.title}</h3>
                      <p className="text-background/60 text-sm">{poster.artist}</p>
                      <p className="font-bold mt-2">${poster.price}</p>
                    </div>

                    {/* Corner Accents for Center */}
                    {isCenter && (
                      <>
                        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-background/50" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-background/50" />
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-background/50" />
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-background/50" />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 flex items-center justify-center hover:bg-background/20 transition-all group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 flex items-center justify-center hover:bg-background/20 transition-all group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-24">
          {/* Dots */}
          <div className="flex gap-2">
            {showcasePosters.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-background" : "w-2 bg-background/30 hover:bg-background/50"
                }`}
              />
            ))}
          </div>

          {/* Play/Pause */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="ml-4 border-background/30 text-background hover:bg-background/10"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </section>
  )
}
