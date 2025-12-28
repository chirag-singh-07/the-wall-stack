"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getRecommendedPosters } from "@/actions/user/product-actions";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";

export function CartRecommendations() {
  const { items, addItem } = useCartStore();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        // Extract poster IDs from cart (excluding custom posters)
        const cartPosterIds = items
          .filter((item) => !item.productId.startsWith("custom_"))
          .map((item) => item.productId);

        const result = await getRecommendedPosters(cartPosterIds);
        if (result.success && result.data) {
          setRecommendations(result.data);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [items]);

  const handleQuickAdd = (posterId: string, price: number) => {
    addItem(posterId, "A3 (30×42cm)", price);
    toast.success("Added to cart");
  };

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 border-t border-border">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            Complete Your Collection
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Curated picks that complement your cart
          </p>
        </div>
        <Link
          href="/shop"
          className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {recommendations.map((product, index) => (
          <div
            key={product.id}
            className="group relative"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.5s ease forwards",
              opacity: 0,
            }}
          >
            <Link href={`/shop/${product.id}`}>
              <div className="relative aspect-3/4 bg-muted rounded-lg overflow-hidden mb-3">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
              </div>
            </Link>

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-0.5">
                  {product.category?.name || "Poster"}
                </p>
                <Link href={`/shop/${product.id}`}>
                  <h3 className="font-medium text-sm truncate hover:underline underline-offset-4">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5">
                  ₹{product.price}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 bg-transparent hover:bg-foreground hover:text-background transition-colors"
                onClick={() =>
                  handleQuickAdd(product.id, Number(product.price))
                }
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add to cart</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/shop"
        className="flex md:hidden items-center justify-center gap-2 text-sm font-medium mt-6 hover:underline underline-offset-4"
      >
        View All Products
        <ArrowRight className="h-4 w-4" />
      </Link>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
