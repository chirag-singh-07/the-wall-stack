"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { getNewArrivals } from "@/actions/user/product-actions";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

export function NewArrivals() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    getNewArrivals().then((res) => {
      if (res.success && res.data) {
        setPosters(res.data.slice(0, 4));
      }
      setLoading(false);
    });
  }, []);

  if (!loading && posters.length === 0) return null;

  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      ref={containerRef}
    >
      {/* Background Decorative Text */}
      <div className="absolute top-10 -right-20 pointer-events-none opacity-[0.02] select-none">
        <span className="text-[20vw] font-black leading-none uppercase">
          NEW
        </span>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-black/20" />
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/40">
              The Latest Release
            </span>
            <div className="h-px w-8 bg-black/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-7xl font-black tracking-tighter text-black uppercase leading-none"
          >
            New <span className="text-black/10 italic">Arrivals</span>
          </motion.h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loading
            ? // Premium Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-3/4 bg-black/5 rounded-3xl" />
                  <div className="space-y-3 px-2">
                    <div className="h-3 w-1/4 bg-black/5 rounded" />
                    <div className="h-4 w-3/4 bg-black/10 rounded" />
                    <div className="h-3 w-1/3 bg-black/5 rounded" />
                  </div>
                </div>
              ))
            : posters.map((poster, index) => (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/shop/${poster.slug}`} className="block">
                    <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-black/5 mb-6 shadow-2xl shadow-black/5 transition-transform duration-700 group-hover:-translate-y-2">
                      <Image
                        src={poster.image || "/placeholder.svg"}
                        alt={poster.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />

                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                      {/* Top Badges */}
                      <div className="absolute top-5 left-5 right-5 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">
                            {poster.category?.name || "New"}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Content Blur Overlay (Bottom) */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                              Quick View
                            </span>
                            <ArrowRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-2 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-black uppercase tracking-tight text-black flex-1 line-clamp-1 group-hover:text-black/60 transition-colors">
                          {poster.title}
                        </h3>
                        <span className="text-xs font-mono font-bold text-black/30">
                          0{index + 1}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-black pr-2">
                        ₹{parseFloat(poster.price.toString()).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Mobile View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex justify-center"
        >
          <Link
            href="/shop"
            className="px-8 py-3 rounded-full border border-black/10 text-[10px] uppercase tracking-[0.3em] font-black text-black hover:bg-black hover:text-white transition-all duration-300"
          >
            Explore All New Items
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
