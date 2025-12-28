"use client";

import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products-shared";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "large";
}

export function ProductGrid({ products, viewMode }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="h-10 w-10 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No posters found</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 md:gap-8",
        viewMode === "grid"
          ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      )}
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
