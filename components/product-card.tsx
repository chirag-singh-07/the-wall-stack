"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-lg mb-4">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className={cn("object-cover transition-all duration-700", isHovered ? "scale-110" : "scale-100")}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-transparent transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <Button className="flex-1" size="sm" onClick={(e) => e.preventDefault()}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Link href={`/shop/${product.id}`}>
            <Button variant="outline" size="sm" className="bg-background/90 hover:bg-background">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div
          className={cn(
            "absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-background transition-all duration-500",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
          )}
        />
        <div
          className={cn(
            "absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-background transition-all duration-500 delay-75",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
          )}
        />
      </div>
      <Link href={`/shop/${product.id}`} className="block space-y-1">
        <h3 className="font-medium group-hover:underline underline-offset-4 transition-all">{product.title}</h3>
        <p className="text-muted-foreground">${product.price}</p>
      </Link>
    </div>
  )
}
