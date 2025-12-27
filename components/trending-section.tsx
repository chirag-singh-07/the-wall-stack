"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TrendingUp, Eye, Heart, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const trendingPosters = [
  {
    id: "t1",
    title: "Minimal Techno Event Poster Design",
    views: "12.4K",
    likes: 892,
    image: "/poster-images/t1.jpg",
    rank: 1,
  },
  {
    id: "t2",
    title: "BRUNOO",
    views: "10.8K",
    likes: 756,
    image: "/poster-images/t2.jpg",
    rank: 2,
  },
  {
    id: "t3",
    title: "the weeknd poster",
    views: "9.2K",
    likes: 634,
    image: "/poster-images/t3.jpg",
    rank: 3,
  },
  {
    id: "t4",
    title: "Micheal Jackson 🔥",
    views: "8.5K",
    likes: 589,
    image: "/poster-images/t4.jpg",
    rank: 4,
  },
  {
    id: "t5",
    title: "PORSCHE PROJECT FOUR FINAL MAC",
    views: "7.9K",
    likes: 521,
    image: "/poster-images/t5.jpg",
    rank: 5,
  },
];

export function TrendingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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

  // Auto-cycle through trending items
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % trendingPosters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-full text-sm font-medium">
                <Flame className="h-4 w-4 animate-pulse" />
                Hot Right Now
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Trending This Week
            </h2>
            <p className="text-muted-foreground mt-2">
              The most loved posters by our community
            </p>
          </div>
          <Button variant="outline" className="w-fit group bg-transparent">
            View All Trending
            <TrendingUp className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Trending Grid */}
        <div
          className="grid lg:grid-cols-2 gap-8 items-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Featured Large Poster */}
          <div
            className={cn(
              "relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-700",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            )}
          >
            {trendingPosters.map((poster, index) => (
              <div
                key={poster.id}
                className={cn(
                  "absolute inset-0 transition-all duration-700",
                  index === activeIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                )}
              >
                <Image
                  src={poster.image || "/placeholder.svg"}
                  alt={poster.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                {/* Rank Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center font-bold text-xl">
                    #{poster.rank}
                  </div>
                </div>

                {/* Poster Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-background mb-2">
                    {poster.title}
                  </h3>
                  <div className="flex items-center gap-4 text-background/80">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {poster.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {poster.likes} likes
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-foreground/20 pointer-events-none" />
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `conic-gradient(from ${
                  activeIndex * 72
                }deg, transparent, var(--foreground) 10%, transparent 20%)`,
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "xor",
                padding: "2px",
              }}
            />
          </div>

          {/* Trending List */}
          <div className="space-y-4">
            {trendingPosters.map((poster, index) => (
              <div
                key={poster.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-500",
                  index === activeIndex
                    ? "bg-foreground text-background scale-[1.02]"
                    : "bg-muted hover:bg-foreground/10",
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-12"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Rank */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-colors",
                    index === activeIndex
                      ? "bg-background text-foreground"
                      : "bg-foreground/10"
                  )}
                >
                  {poster.rank}
                </div>

                {/* Thumbnail */}
                <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={poster.image || "/placeholder.svg"}
                    alt={poster.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{poster.title}</h4>
                  <div className="flex items-center gap-3 text-sm opacity-70">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {poster.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {poster.likes}
                    </span>
                  </div>
                </div>

                {/* Trending indicator */}
                <TrendingUp
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    index === activeIndex
                      ? "text-background"
                      : "text-foreground/30",
                    index < 3 && "animate-bounce"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
