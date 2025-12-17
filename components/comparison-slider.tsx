"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Move } from "lucide-react"

export function ComparisonSlider() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percent = (x / rect.width) * 100
    setSliderPosition(percent)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX)
  }

  return (
    <section ref={sectionRef} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 block">
            Quality Comparison
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">See the Difference</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Drag the slider to compare our premium museum-quality prints with standard printing.
          </p>
        </div>

        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div
            ref={containerRef}
            className="relative aspect-[16/10] rounded-lg overflow-hidden cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            {/* Before Image (Standard Print) */}
            <div className="absolute inset-0">
              <img
                src="/placeholder.svg?height=600&width=900"
                alt="Standard print quality"
                className="w-full h-full object-cover filter contrast-75 brightness-90"
              />
              <div className="absolute bottom-4 left-4 bg-foreground/80 text-background px-4 py-2 rounded-full text-sm font-medium">
                Standard Print
              </div>
            </div>

            {/* After Image (Premium Print) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src="/placeholder.svg?height=600&width=900"
                alt="Premium print quality"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-background text-foreground px-4 py-2 rounded-full text-sm font-medium border">
                Premium Quality
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-background shadow-lg cursor-ew-resize z-10"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              {/* Handle Circle */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background border-4 border-foreground flex items-center justify-center shadow-xl transition-transform ${
                  isDragging ? "scale-110" : ""
                }`}
              >
                <Move className="w-5 h-5 text-foreground" />
              </div>

              {/* Decorative Lines */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-[calc(50%-40px)] bg-background/50" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-[calc(50%-40px)] bg-background/50" />
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div
              className={`p-6 border rounded-lg transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <h3 className="font-bold text-lg mb-4 text-muted-foreground">Standard Print</h3>
              <ul className="space-y-3 text-muted-foreground">
                {["Basic paper stock", "Standard inkjet printing", "May fade over time", "Limited color accuracy"].map(
                  (item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div
              className={`p-6 bg-foreground text-background rounded-lg transition-all duration-700 delay-500 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              <h3 className="font-bold text-lg mb-4">Premium Quality</h3>
              <ul className="space-y-3">
                {[
                  "Museum-grade archival paper",
                  "Giclée fine art printing",
                  "100+ year color guarantee",
                  "True-to-life color reproduction",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
