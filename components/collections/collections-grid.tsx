"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getActiveCollections,
  searchCollections,
} from "@/actions/user/collection-actions";
import { Loader2, Package } from "lucide-react";
import { toast } from "sonner";

export function CollectionsGrid() {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const fetchCollections = async (searchQuery?: string) => {
    setIsLoading(true);
    try {
      const result = searchQuery
        ? await searchCollections(searchQuery)
        : await getActiveCollections();

      if (result.success) {
        setCollections(result.data || []);
      } else {
        toast.error(result.error || "Failed to fetch collections");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();

    // Listen for search events
    const handleSearch = (e: any) => {
      fetchCollections(e.detail);
    };

    window.addEventListener("collectionsSearch", handleSearch);
    return () => window.removeEventListener("collectionsSearch", handleSearch);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No collections found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection, index) => (
        <Link
          key={collection.id}
          href={`/collections/${collection.slug}`}
          onMouseEnter={() => setHoveredId(collection.id)}
          onMouseLeave={() => setHoveredId(null)}
          className={cn(
            "group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:shadow-2xl",
            "opacity-0 translate-y-8 animate-in fade-in slide-in-from-bottom-8"
          )}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "forwards",
          }}
        >
          {/* Cover Image */}
          <div className="relative aspect-4/3 overflow-hidden bg-muted">
            <Image
              src={
                collection.coverImage || collection.image || "/placeholder.svg"
              }
              alt={collection.title}
              fill
              className={cn(
                "object-cover transition-all duration-700",
                hoveredId === collection.id && "scale-110"
              )}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

            {/* Poster Count Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full text-sm font-medium">
              {collection.posterCount}{" "}
              {collection.posterCount === 1 ? "Poster" : "Posters"}
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {collection.title}
              </h3>
              {collection.description && (
                <p className="text-white/80 text-sm line-clamp-2">
                  {collection.description}
                </p>
              )}
            </div>
          </div>

          {/* Hover Effect Border */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl border-2 border-foreground/50 pointer-events-none transition-opacity duration-300",
              hoveredId === collection.id ? "opacity-100" : "opacity-0"
            )}
          />
        </Link>
      ))}
    </div>
  );
}
