"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: { product: any }) {
  const [isHovered, setIsHovered] = useState(false);

  // Use slug if available, otherwise fallback to id
  const identifier = product.slug || product.id;
  const displayPrice =
    typeof product.price === "number"
      ? product.price.toFixed(2)
      : product.price;

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-muted rounded-lg mb-4 border border-border/50">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          )}
        />
        <div
          className={cn(
            "absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 z-10",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Button
            className="flex-1 shadow-lg"
            size="sm"
            onClick={(e) => e.preventDefault()}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Link href={`/shop/${identifier}`}>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/90 hover:bg-background shadow-lg"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Decorative corner elements */}
        <div
          className={cn(
            "absolute top-4 left-4 w-6 h-6 border-l border-t border-background/80 transition-all duration-500",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        />
        <div
          className={cn(
            "absolute top-4 right-4 w-6 h-6 border-r border-t border-background/80 transition-all duration-500 delay-75",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        />
      </div>
      <Link href={`/shop/${identifier}`} className="block space-y-1 group">
        <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
          {product.title}
        </h3>
        <p className="text-muted-foreground font-light">${displayPrice}</p>
      </Link>
    </div>
  );
}
