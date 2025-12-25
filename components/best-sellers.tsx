"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

import { getBestSellers } from "@/actions/user/product-actions";
import Link from "next/link";

export function BestSellers() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getBestSellers().then((res) => {
      if (res.success && res.data) {
        setPosters(res.data);
      }
      setLoading(false);
    });

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading) return null;
  if (posters.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div
            className={cn(
              "transition-all duration-700",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              Most Loved
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Best Sellers
            </h2>
          </div>
          <Button
            variant="ghost"
            className={cn(
              "mt-6 md:mt-0 group transition-all duration-700 delay-200",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posters.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="block"
            >
              <div
                className={cn(
                  "group cursor-pointer transition-all duration-700",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative aspect-3/4 overflow-hidden bg-muted rounded-lg mb-6">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className={cn(
                      "object-cover transition-all duration-700",
                      hoveredIndex === index ? "scale-110" : "scale-100"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-foreground transition-opacity duration-500",
                      hoveredIndex === index ? "opacity-10" : "opacity-0"
                    )}
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-background text-foreground text-xs font-medium rounded-full">
                    Best Seller
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {product.category?.name || "Poster"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
