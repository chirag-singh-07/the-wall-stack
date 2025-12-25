"use client";

// Imports fixed

import { getCategories } from "@/actions/admin/poster-actions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function PressMentions() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Fetch categories
    getCategories().then((res) => {
      if (res.success && res.data) {
        // Filter active categories and those with images preferred, or just first 6
        setCategories(res.data.filter((c: any) => c.status === "active"));
      }
      setLoading(false);
    });

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading) return null; // Or a skeleton

  if (categories.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-background border-y border-border/40"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading tracking-tight">
            Browse by Category
          </h2>
          <p className="text-muted-foreground">
            Explore our curated collections of exclusive posters
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              href={`/shop?category=${category.slug}`}
              key={category.id}
              className={`group relative aspect-square overflow-hidden rounded-xl bg-muted transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                  <span className="text-4xl opacity-20 font-bold">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white font-bold text-lg md:text-xl tracking-wide drop-shadow-md transform transition-transform group-hover:scale-105">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
