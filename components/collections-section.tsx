"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getActiveCollections } from "@/actions/user/collection-actions";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CollectionsSection() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getActiveCollections().then((res) => {
      if (res.success && res.data) {
        setCollections(res.data);
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
  if (collections.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="collections"
      className="py-20 md:py-32 bg-foreground text-background"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Collections
          </h2>
          <p className="text-background/60 max-w-md mx-auto">
            Explore our curated collections, each telling its own story
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className={cn(
                "group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer transition-all duration-700 block",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Image
                src={
                  collection.coverImage ||
                  collection.image ||
                  "/placeholder.svg"
                }
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/60 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-background p-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {collection.title}
                </h3>
                <p className="text-background/80 text-center mb-4 line-clamp-2">
                  {collection.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-background text-background hover:bg-background hover:text-foreground transition-all duration-200"
                >
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
