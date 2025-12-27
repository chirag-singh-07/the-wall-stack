"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { getFeaturedCollections } from "@/actions/user/product-actions";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

export function CollectionShowcase() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    getFeaturedCollections().then((res) => {
      if (res.success && res.data) {
        setCollections(res.data);
      }
      setLoading(false);
    });
  }, []);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex(
      (prev) => (prev + newDirection + collections.length) % collections.length
    );
  };

  if (!loading && collections.length === 0) return null;

  const activeCollection = collections[activeIndex];
  const accentImages =
    activeCollection?.posters?.map((p: any) => p.image) || [];

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-40 bg-black text-white overflow-hidden relative"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-white/2 to-transparent pointer-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 text-white/60 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                <Sparkles className="w-3 h-3" />
                <span>Curated Narratives</span>
              </div>
              <div className="h-px w-12 bg-white/10" />
            </div>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
              Collection <span className="text-white/10 italic">Showcase</span>
            </h2>
          </motion.div>

          {/* Navigation Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => paginate(-1)}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
              >
                <ChevronLeft className="w-6 h-6 transition-transform group-hover:scale-110" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
              >
                <ChevronRight className="w-6 h-6 transition-transform group-hover:scale-110" />
              </button>
            </div>
            <div className="hidden md:block h-14 w-px bg-white/10" />
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                Navigation
              </span>
              <span className="text-sm font-black whitespace-nowrap">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(collections.length).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        </div>

        {loading ? (
          /* Premium Skeleton Loader */
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-3/4 bg-white/5 rounded-4xl animate-pulse" />
            <div className="space-y-8">
              <div className="h-8 w-32 bg-white/5 rounded-full animate-pulse" />
              <div className="h-20 w-3/4 bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-24 w-full bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-14 w-48 bg-white/5 rounded-full animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image Showcase */}
            <div className="relative">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    x: direction > 0 ? 100 : -100,
                    scale: 0.9,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: direction > 0 ? -100 : 100,
                    scale: 0.9,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-3/4 rounded-4xl overflow-hidden border border-white/10 shadow-2xl"
                >
                  <Image
                    src={
                      activeCollection.coverImage ||
                      activeCollection.image ||
                      "/placeholder.svg"
                    }
                    alt={activeCollection.title}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Glassmorphic Overlay Card */}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />

                  {/* Poster Count Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-3"
                  >
                    <Layers className="w-5 h-5 text-white/60" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                        Volume
                      </span>
                      <span className="text-xs font-black">
                        {activeCollection._count?.posters || 0} Rare Editions
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Decorative Accent Images */}
              <AnimatePresence>
                {accentImages.slice(0, 2).map((img: string, i: number) => (
                  <motion.div
                    key={`${activeIndex}-accent-${i}`}
                    initial={{ opacity: 0, scale: 0.5, x: i === 0 ? 50 : -50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                    className={cn(
                      "absolute w-24 h-32 md:w-32 md:h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10",
                      i === 0 ? "-right-8 top-12" : "-left-8 bottom-12"
                    )}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt="Accent"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Content Showcase */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-3">
                      <div className="h-px w-8 bg-white/20" />
                      Premium Series
                    </span>
                    <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                      {activeCollection.title}
                    </h3>
                  </div>

                  <p className="text-white/40 text-sm md:text-lg font-bold uppercase tracking-widest leading-relaxed max-w-md">
                    {activeCollection.description ||
                      "A masterfully curated set of premium archival prints, designed to transform your space into a private gallery."}
                  </p>

                  <ul className="space-y-6 pt-4">
                    {[
                      "Exclusively Licensed Art",
                      "Numbered Gallery Editions",
                      "Integrated Visual Harmony",
                    ].map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/60"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="pt-8 flex flex-wrap items-center gap-8">
                    <Link href={`/collections/${activeCollection.slug}`}>
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-white/90 rounded-full px-12 h-16 font-black uppercase tracking-widest text-xs shadow-2xl shadow-white/10 group"
                      >
                        Explore Series
                        <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-2" />
                      </Button>
                    </Link>

                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">
                        Starting At
                      </span>
                      <span className="text-2xl font-black">₹1,499</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Background Large Number Index */}
              <div className="absolute top-1/2 -right-12 -translate-y-1/2 text-[20vw] font-black text-white/2 select-none pointer-events-none -z-10">
                {String(activeIndex + 1).padStart(2, "0")}
              </div>
            </div>
          </div>
        )}

        {/* Custom Collection Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            Explore over 50+ curated gallery sets
          </p>
          <div className="flex items-center gap-2">
            {collections.map((_, index) => (
              <button
                key={index}
                onClick={() => index !== activeIndex && setActiveIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-700",
                  index === activeIndex
                    ? "w-12 bg-white"
                    : "w-3 bg-white/10 hover:bg-white/30"
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
