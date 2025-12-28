"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products-shared";

interface RecommendedProductsProps {
  products: Product[];
  currentCategory: string;
}

export function RecommendedProducts({
  products,
  currentCategory,
}: RecommendedProductsProps) {
  return (
    <section className="py-16 md:py-24 border-t">
      <div className="container px-4 md:px-8 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              You May Also Like
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Recommended Posters
            </h2>
          </div>
          <Link href="/shop">
            <Button variant="ghost" className="group">
              View All Posters
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <RecommendedProductCard
              key={product.id}
              product={product}
              index={index}
              isFromSameCategory={product.category === currentCategory}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecommendedProductCard({
  product,
  index,
  isFromSameCategory,
}: {
  product: Product;
  index: number;
  isFromSameCategory: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-lg mb-4">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />

        {/* Same category badge */}
        {isFromSameCategory && (
          <div className="absolute top-3 left-3 bg-foreground text-background text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-medium">
            Same Collection
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Quick add button */}
        <div
          className={cn(
            "absolute bottom-4 left-4 right-4 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>

        {/* Corner accents */}
        <div
          className={cn(
            "absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-background transition-all duration-500",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        />
        <div
          className={cn(
            "absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-background transition-all duration-500 delay-75",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        />
      </div>

      <div className="space-y-1">
        <h3 className="font-medium group-hover:underline underline-offset-4 transition-all">
          {product.title}
        </h3>
        <p className="text-muted-foreground">${product.price}</p>
      </div>
    </Link>
  );
}
