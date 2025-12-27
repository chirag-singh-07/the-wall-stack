"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Sparkles, Check, ArrowRight, Layers } from "lucide-react";
import { getFeaturedCollections } from "@/actions/user/product-actions";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

export function ComboSection() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (!loading && collections.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-32 bg-black text-white overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
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
                <Package className="w-3 h-3" />
                <span>Bundle & Save</span>
              </div>
              <div className="h-px w-12 bg-white/10" />
            </div>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
              Combo <span className="text-white/10 italic">Sets</span>
            </h2>
            <p className="text-white/40 max-w-lg text-xs font-bold uppercase tracking-widest leading-relaxed">
              Carefully curated sets designed to transform your space.{" "}
              <br className="hidden md:block" />
              Save up to 40% when you buy the complete series.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href="/shop"
              className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all underline underline-offset-8 decoration-white/10 hover:decoration-white"
            >
              Explore Full Catalog
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>

        {/* Combo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[450px] bg-white/5 rounded-4xl animate-pulse border border-white/5"
                />
              ))
            : collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  className="group relative h-full"
                >
                  <div className="relative h-full bg-white/3 backdrop-blur-xl rounded-4xl p-8 transition-all duration-700 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 flex flex-col">
                    {/* Visual Stack of Posters */}
                    <div className="relative h-48 mb-12 flex items-center justify-center">
                      {collection.posters.map((poster: any, i: number) => (
                        <div
                          key={i}
                          className="absolute w-24 h-32 rounded-xl overflow-hidden shadow-2xl transition-all duration-700 border border-white/10"
                          style={{
                            left: `${
                              50 +
                              (i - (collection.posters.length - 1) / 2) * 15
                            }%`,
                            transform: `translateX(-50%) rotate(${
                              (i - (collection.posters.length - 1) / 2) * 8
                            }deg) translateY(${
                              Math.abs(
                                i - (collection.posters.length - 1) / 2
                              ) * 10
                            }px)`,
                            zIndex: collection.posters.length - i,
                            opacity:
                              0.5 + (i / collection.posters.length) * 0.5,
                          }}
                        >
                          <Image
                            src={poster.image || "/placeholder.svg"}
                            alt="Poster Stack"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      <div className="absolute inset-0 bg-radial from-white/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white group-hover:tracking-widest transition-all duration-700">
                          {collection.title}
                        </h3>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed line-clamp-2">
                          {collection.description ||
                            "A masterfully curated set of premium editions."}
                        </p>
                      </div>

                      <ul className="space-y-4">
                        {[
                          "Curated Visual Story",
                          "Premium Archival Paper",
                          "Numbered Edition",
                        ].map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/50"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono font-bold text-white/30 tracking-widest mb-1">
                          BUNDLE PRICE
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-white">
                            ₹2,999
                          </span>
                          <span className="text-xs font-mono text-white/20 line-through">
                            ₹4,499
                          </span>
                        </div>
                      </div>
                      <Link href={`/shop?collection=${collection.slug}`}>
                        <Button className="w-12 h-12 rounded-full bg-white text-black hover:bg-white/90 p-0 overflow-hidden group/btn">
                          <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/5 rounded-tr-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
        </div>

        {/* Custom Build CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4">
            <div className="h-px w-24 bg-white/10" />
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20">
              Infinite possibilities await
            </p>
            <Link
              href="/shop"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              <Layers className="w-3 h-3" />
              Build Your Own Series
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
