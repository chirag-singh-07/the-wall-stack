"use client";

import { useEffect, useRef, useState } from "react";
import { getFeaturedProducts } from "@/actions/user/product-actions";
import { cn, formatPrice } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function FeaturesSection() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    getFeaturedProducts().then((res) => {
      if (res.success && res.data) {
        // Show only 4 posters as requested
        setPosters(res.data.slice(0, 4));
      }
      setLoading(false);
    });
  }, []);

  if (!loading && posters.length === 0) return null;

  return (
    <section className="py-24 bg-white" ref={containerRef}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/30 mb-4 block">
              Selection . 01
            </span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-black uppercase leading-[0.8]">
              The Featured <br />
              <span className="text-black/20">Editions</span>
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
              Browse Full Series
              <div className="w-8 h-px bg-black/20 group-hover:w-12 group-hover:bg-black transition-all duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loading
            ? // Loading Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-3/4 bg-black/5 rounded-3xl" />
                  <div className="h-4 w-2/3 bg-black/5 rounded" />
                </div>
              ))
            : posters.map((poster, index) => (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  className="group"
                >
                  <Link href={`/shop/${poster.slug}`}>
                    <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-black/5 mb-6 border border-black/5 transition-colors duration-500 hover:border-black/10">
                      <Image
                        src={poster.image || "/placeholder.svg"}
                        alt={poster.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />

                      {/* Glossy Overlay */}
                      <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-white/10 opacity-40 group-hover:opacity-10 transition-opacity duration-700" />

                      {/* Hover Action */}
                      <div className="absolute top-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl">
                          <ShoppingBag className="w-5 h-5 text-black" />
                        </div>
                      </div>

                      {/* Category Label */}
                      <div className="absolute bottom-6 left-6">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.2em] text-black rounded-full border border-black/5 shadow-2xl">
                          {poster.category?.name || "Edition"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 px-2">
                      <h3 className="text-sm font-black uppercase tracking-tight text-black group-hover:tracking-widest transition-all duration-500">
                        {poster.title}
                      </h3>
                      <p className="text-[10px] font-mono font-bold text-black/40">
                        {formatPrice(poster.price)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
