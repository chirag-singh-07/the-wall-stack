"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { getBestSellers } from "@/actions/user/product-actions";
import Link from "next/link";

export function BestSellers() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    getBestSellers().then((res) => {
      if (res.success && res.data) {
        setPosters(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (!loading && posters.length === 0) return null;

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-black">
                Hall of Fame
              </span>
              <div className="h-px w-12 bg-black/10" />
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-black uppercase leading-[0.8]">
              The <span className="text-black/20">Best</span> Sellers
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href="/shop"
              className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-black/60 hover:text-black transition-all"
            >
              Browse The Archive
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loading
            ? // Premium Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-3/4 bg-black/5 rounded-3xl" />
                  <div className="h-4 w-2/3 bg-black/5 rounded mx-auto" />
                </div>
              ))
            : posters.map((poster, index) => (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link href={`/shop/${poster.slug}`} className="block">
                    <div className="relative aspect-3/4 overflow-hidden rounded-3xl bg-black/5 border border-black/5 hover:border-black/10 transition-colors duration-500">
                      <Image
                        src={poster.image || "/placeholder.svg"}
                        alt={poster.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />

                      {/* Glossy Overlay */}
                      <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-white/10 opacity-60 group-hover:opacity-20 transition-opacity duration-700" />

                      {/* Quick Add Icon */}
                      <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl">
                          <ShoppingBag className="w-5 h-5 text-black" />
                        </div>
                      </div>

                      {/* Rank Indicator */}
                      <div className="absolute top-6 left-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono font-bold text-white/40 mb-1">
                            RANK
                          </span>
                          <span className="text-2xl font-black text-white/90 group-hover:text-white transition-colors">
                            0{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Panel */}
                    <div className="mt-8 space-y-2 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Star className="w-2 h-2 fill-black text-black" />
                        <span className="text-[8px] uppercase tracking-[0.4em] font-black text-black/40">
                          Top Rated Piece
                        </span>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-black group-hover:tracking-widest transition-all duration-500">
                        {poster.title}
                      </h3>
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-[10px] uppercase font-bold text-black/30 tracking-widest">
                          {poster.category?.name || "Edition"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-black/10" />
                        <span className="text-[10px] font-mono font-bold text-black/60">
                          {formatPrice(poster.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Bottom Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-black/10" />
          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-black/30">
            Trusted by +10k Collectors Worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
}
