"use client";

import { getCategories } from "@/actions/admin/poster-actions";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export function PressMentions() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success && res.data) {
        // Filter and slice 5 active categories
        const filtered = res.data
          .filter(
            (c: any) => c.status === "active" && c.name.toLowerCase() !== "all"
          )
          .slice(0, 5);
        setCategories(filtered);
      }
      setLoading(false);
    });
  }, []);

  if (!loading && categories.length === 0) return null;

  return (
    <section
      className="py-24 bg-white border-y border-black/5"
      ref={containerRef}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-20"
        >
          <div className="h-px w-12 bg-black/20 mb-6" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase mb-4">
            Curated <span className="text-black/20">Series</span>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/40">
            Select your aesthetic
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
          {loading
            ? // Skeleton State
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-black/5 rounded-3xl animate-pulse"
                />
              ))
            : categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="relative flex flex-col items-center justify-center p-8 aspect-square rounded-3xl bg-black/5 hover:bg-black transition-all duration-700 overflow-hidden"
                  >
                    <span className="absolute top-6 left-6 text-[10px] font-mono font-bold text-black/20 group-hover:text-white/20 transition-colors">
                      0{index + 1}
                    </span>

                    <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-tighter group-hover:text-white group-hover:tracking-widest transition-all duration-500 text-center z-10 px-4">
                      {category.name}
                    </h3>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-black/5 rounded-full group-hover:bg-white/5 group-hover:scale-[2.5] transition-all duration-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white/10 rounded-full group-hover:w-full group-hover:h-full transition-all duration-700" />
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Action Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-black/60 hover:text-black transition-all"
          >
            Explore Full Index
            <div className="w-8 h-px bg-black/20 group-hover:w-16 group-hover:bg-black transition-all duration-500" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
