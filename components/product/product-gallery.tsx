"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ZoomIn } from "lucide-react"

interface ProductGalleryProps {
  image: string
  title: string
}

export function ProductGallery({ image, title }: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-muted rounded-lg cursor-zoom-in group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className={cn("object-cover transition-transform duration-300", isZoomed ? "scale-150" : "scale-100")}
          style={isZoomed ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` } : undefined}
          priority
        />

        {/* Zoom indicator */}
        <div
          className={cn(
            "absolute bottom-4 right-4 bg-foreground/80 text-background px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-opacity duration-300",
            isZoomed ? "opacity-0" : "opacity-100 group-hover:opacity-100",
          )}
        >
          <ZoomIn className="h-3 w-3" />
          Hover to zoom
        </div>

        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-foreground/20 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-foreground/20 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-foreground/20 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-foreground/20 pointer-events-none" />
      </div>

      {/* Frame preview indicator */}
      <div className="flex items-center justify-center gap-4 py-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Preview in frame</span>
        <div className="flex gap-2">
          {["Black", "White", "Natural"].map((frame) => (
            <button
              key={frame}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-all hover:scale-110",
                frame === "Black" && "bg-foreground border-foreground",
                frame === "White" && "bg-background border-border",
                frame === "Natural" && "bg-amber-100 border-amber-200",
              )}
              title={`${frame} frame`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
