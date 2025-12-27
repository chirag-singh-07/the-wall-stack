"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/actions/user/product-actions";
import { motion, AnimatePresence } from "framer-motion";

export function RotatingShowcase() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getFeaturedProducts().then((res) => {
      if (res.success && res.data) {
        // Only show first 5 for the 3D effect to look best
        setPosters(res.data.slice(0, 5));
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

  useEffect(() => {
    if (!isAutoPlaying || isHovered || loading || posters.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posters.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, loading, posters.length]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const next = () => setCurrentIndex((prev) => (prev + 1) % posters.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);

  if (!loading && posters.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-black text-white overflow-hidden relative"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-20 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-8 bg-white/20" />
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/40">
              Interactive Gallery
            </span>
            <div className="h-px w-8 bg-white/20" />
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-6">
            3D <span className="text-white/10 italic">Showcase</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-xs font-bold uppercase tracking-widest">
            A curated selection of our most iconic pieces,{" "}
            <br className="hidden md:block" />
            presented in an immersive digital space.
          </p>
        </div>

        <div
          className="relative h-[500px] md:h-[650px] perspective-[1500px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 3D Carousel / Loading State */}
          <div className="absolute inset-0 flex items-center justify-center">
            {loading ? (
              // Enhanced Loading State
              <div className="w-[320px] h-[440px] bg-white/5 rounded-2xl animate-pulse border border-white/10 flex flex-col items-center justify-center gap-4">
                <ShoppingBag className="w-8 h-8 text-white/10" />
                <span className="text-[10px] uppercase font-black tracking-widest text-white/10">
                  Loading Showcase
                </span>
              </div>
            ) : (
              posters.map((poster, index) => {
                const offset = index - currentIndex;
                const absOffset = Math.abs(offset);
                const isCenter = offset === 0;

                let transform = "";
                let zIndex = 10 - absOffset;
                let opacity = 1;

                if (offset === 0) {
                  transform = "translateX(0) translateZ(150px) rotateY(0deg)";
                  zIndex = 20;
                } else if (offset === 1 || offset === -posters.length + 1) {
                  transform =
                    "translateX(280px) translateZ(-50px) rotateY(-30deg) scale(0.9)";
                  opacity = 0.6;
                } else if (offset === -1 || offset === posters.length - 1) {
                  transform =
                    "translateX(-280px) translateZ(-50px) rotateY(30deg) scale(0.9)";
                  opacity = 0.6;
                } else if (offset === 2 || offset === -posters.length + 2) {
                  transform =
                    "translateX(450px) translateZ(-200px) rotateY(-40deg) scale(0.8)";
                  opacity = 0.3;
                } else if (offset === -2 || offset === posters.length - 2) {
                  transform =
                    "translateX(-450px) translateZ(-200px) rotateY(40deg) scale(0.8)";
                  opacity = 0.3;
                } else {
                  transform =
                    "translateX(0) translateZ(-400px) rotateY(0deg) scale(0.5)";
                  opacity = 0;
                }

                return (
                  <motion.div
                    key={poster.id}
                    className="absolute transition-all duration-1000 ease-out cursor-pointer"
                    style={{
                      transform,
                      zIndex,
                      opacity,
                      transformStyle: "preserve-3d",
                    }}
                    onClick={() => goTo(index)}
                  >
                    <div
                      className={cn(
                        "relative bg-white p-2 md:p-3 shadow-[0_50px_100px_rgba(0,0,0,0.5)] transition-all duration-700 group",
                        isCenter ? "scale-100" : "scale-90"
                      )}
                    >
                      {/* Poster Frame */}
                      <div className="relative overflow-hidden w-[260px] md:w-[320px] h-[360px] md:h-[440px]">
                        <Image
                          src={poster.image || "/placeholder.svg"}
                          alt={poster.title}
                          fill
                          className="object-cover"
                        />

                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-linear-to-tr from-black/20 via-transparent to-white/10" />

                        {/* Interactive Elements for Center */}
                        {isCenter && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                            <Link href={`/shop/${poster.slug}`}>
                              <Button className="bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Floating Info Panel - Only for Center */}
                      <AnimatePresence>
                        {isCenter && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -bottom-24 left-0 right-0 py-6 text-center"
                          >
                            <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-1">
                              {poster.title}
                            </h3>
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">
                                {poster.category?.name || "Premium Series"}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span className="text-[10px] font-mono text-white/60">
                                {formatPrice(poster.price)}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Corner Accents */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/50" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t border-r border-white/50" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b border-l border-white/50" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/50" />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Navigation Controls */}
          {!loading && posters.length > 0 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all group"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}
        </div>

        {/* Dynamic Controls Bottom */}
        {!loading && posters.length > 0 && (
          <div className="flex flex-col items-center gap-8 mt-32">
            {/* Progress Bar / Dots */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                {posters.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={cn(
                      "h-1 transition-all duration-500 rounded-full",
                      index === currentIndex
                        ? "w-8 bg-white"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    )}
                  />
                ))}
              </div>

              {/* Autoplay Toggle */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                {isAutoPlaying ? (
                  <Pause className="w-3 h-3 text-white" />
                ) : (
                  <Play className="w-3 h-3 text-white ml-0.5" />
                )}
              </button>
            </div>

            <Link
              href="/shop"
              className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 hover:text-white transition-colors border-b border-white/10 pb-2"
            >
              Explore Our Physical Store
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
