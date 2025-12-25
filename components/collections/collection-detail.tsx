"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionDetailProps {
  collection: any;
}

export function CollectionDetail({ collection }: CollectionDetailProps) {
  const [hoveredPosterId, setHoveredPosterId] = useState<string | null>(null);

  return (
    <div className="pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/collections"
            className="hover:text-foreground transition-colors"
          >
            Collections
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{collection.title}</span>
        </div>
      </div>

      {/* Collection Header */}
      <div className="container mx-auto px-4 md:px-6 mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Cover Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={
                collection.coverImage || collection.image || "/placeholder.svg"
              }
              alt={collection.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Collection Info */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-lg text-muted-foreground mb-8">
                {collection.description}
              </p>
            )}
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {collection.posters?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Posters</div>
              </div>
              <div className="px-4 py-2 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {new Date(collection.createdAt).getFullYear()}
                </div>
                <div className="text-sm text-muted-foreground">Created</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posters Grid */}
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Posters in this Collection
        </h2>

        {collection.posters && collection.posters.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collection.posters.map((poster: any, index: number) => (
              <Link
                key={poster.id}
                href={`/shop/${poster.slug}`}
                onMouseEnter={() => setHoveredPosterId(poster.id)}
                onMouseLeave={() => setHoveredPosterId(null)}
                className={cn(
                  "group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-500 hover:shadow-xl",
                  "opacity-0 translate-y-4 animate-in fade-in slide-in-from-bottom-4"
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "forwards",
                }}
              >
                {/* Poster Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image
                    src={poster.image || "/placeholder.svg"}
                    alt={poster.title}
                    fill
                    className={cn(
                      "object-cover transition-all duration-700",
                      hoveredPosterId === poster.id && "scale-110"
                    )}
                  />
                </div>

                {/* Poster Info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">
                    {poster.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ₹{poster.price}
                  </p>
                  {poster.category && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {poster.category.name}
                    </p>
                  )}
                </div>

                {/* Hover Border */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-lg border-2 border-foreground/50 pointer-events-none transition-opacity duration-300",
                    hoveredPosterId === poster.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              No posters in this collection yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
