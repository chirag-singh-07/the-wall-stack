"use client";

import { useEffect, useRef, useState } from "react";
import { getFeaturedProducts } from "@/actions/user/product-actions";

export function FeaturedProducts() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getFeaturedProducts().then((res) => {
      if (res.success && res.data) {
        setPosters(res.data);
      }
      setLoading(false);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (loading) return null;
  if (posters.length === 0) return null;

  return (
    <section ref={sectionRef} id="shop" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Featured Posters
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Discover our hand-picked selection of premium wall art
          </p>
        </div>

        <div
          className={cn(
            "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {posters.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
