"use client"

import { useState, useEffect, useRef } from "react"
import { Users, Package, Star, Globe } from "lucide-react"

const stats = [
  { icon: Users, label: "Happy Customers", value: 50000, suffix: "+" },
  { icon: Package, label: "Posters Shipped", value: 125000, suffix: "+" },
  { icon: Star, label: "5-Star Reviews", value: 15000, suffix: "+" },
  { icon: Globe, label: "Countries Served", value: 85, suffix: "" },
]

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * target))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [isVisible, target, duration])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return <span ref={ref}>{formatNumber(count)}</span>
}

export function StatsCounter() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-foreground text-background relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Elements */}
      <div
        className={`absolute top-10 left-10 w-20 h-20 border border-background/20 rounded-full transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        style={{ animationDelay: "200ms" }}
      />
      <div
        className={`absolute bottom-10 right-10 w-32 h-32 border border-background/10 rounded-full transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      />
      <div
        className={`absolute top-1/2 right-1/4 w-16 h-16 border border-background/15 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 rotate-45" : "opacity-0 rotate-0"
        }`}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background/10 mb-4 group hover:bg-background/20 transition-colors">
                <stat.icon className="w-7 h-7 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <AnimatedCounter target={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-background/60 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
