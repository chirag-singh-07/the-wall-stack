"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  content?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    image?: string;
  };
}

export function HeroSection({ content }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div
              className={cn(
                "w-12 h-1 bg-foreground mb-8 transition-all duration-1000",
                isVisible ? "opacity-100 w-12" : "opacity-0 w-0"
              )}
            />
            <h1
              className={cn(
                "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] text-balance transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              dangerouslySetInnerHTML={{
                __html: content?.title || "Art for<br />your walls.",
              }}
            />
            <p
              className={cn(
                "mt-6 text-lg md:text-xl text-muted-foreground max-w-md transition-all duration-700 delay-150",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              {content?.subtitle ||
                "Premium posters crafted for design enthusiasts. Transform any space with our curated collection."}
            </p>
            <div
              className={cn(
                "mt-8 flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              <Button
                size="lg"
                className="group h-14 px-10 text-base relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {content?.ctaText || "Shop Posters"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-10 text-base bg-transparent group"
              >
                <span className="relative">
                  Explore Collections
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
                </span>
              </Button>
            </div>

            <div
              className={cn(
                "mt-12 flex items-center gap-8 transition-all duration-700 delay-500",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              <div className="text-sm">
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-muted-foreground">Happy Customers</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-sm">
                <p className="text-2xl font-bold">4.9/5</p>
                <p className="text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "order-1 lg:order-2 transition-all duration-1000 delay-500",
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-95"
            )}
            style={{
              transform: isVisible
                ? `translate(${mousePosition.x * 0.5}px, ${
                    mousePosition.y * 0.5
                  }px)`
                : undefined,
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div
                  className="relative aspect-3/4 overflow-hidden bg-muted rounded-lg group"
                  style={{
                    transform: `translate(${mousePosition.x * -0.3}px, ${
                      mousePosition.y * -0.3
                    }px)`,
                  }}
                >
                  <Image
                    src="/poster-images/pinterest_3.jpg"
                    alt="Minimal poster"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500" />
                </div>
                <div
                  className="relative aspect-square overflow-hidden bg-muted rounded-lg group"
                  style={{
                    transform: `translate(${mousePosition.x * 0.2}px, ${
                      mousePosition.y * 0.2
                    }px)`,
                  }}
                >
                  <Image
                    src="/poster-images/pinterest_5.jpg"
                    alt="Abstract poster"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div
                  className="relative aspect-square overflow-hidden bg-muted rounded-lg group"
                  style={{
                    transform: `translate(${mousePosition.x * -0.2}px, ${
                      mousePosition.y * -0.2
                    }px)`,
                  }}
                >
                  <Image
                    src="/poster-images/pinterest_7.jpg"
                    alt="Typography poster"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500" />
                </div>
                <div
                  className="relative aspect-3/4 overflow-hidden bg-muted rounded-lg group"
                  style={{
                    transform: `translate(${mousePosition.x * 0.3}px, ${
                      mousePosition.y * 0.3
                    }px)`,
                  }}
                >
                  <Image
                    src="/poster-images/pinterest_8.jpg"
                    alt="Line art poster"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToNextSection}
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-700 delay-1000 cursor-pointer",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
}
