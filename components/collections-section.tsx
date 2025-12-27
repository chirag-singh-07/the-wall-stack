"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getActiveCollections } from "@/actions/user/collection-actions";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";

export function CollectionsSection() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    getActiveCollections().then((res) => {
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
      id="collections"
      className="py-24 md:py-40 bg-zinc-50 overflow-hidden"
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
              <div className="flex items-center gap-2 px-3 py-1 bg-black/5 text-black/60 rounded-full text-[10px] font-black uppercase tracking-widest border border-black/10">
                <Sparkles className="w-3 h-3" />
                <span>The Curated Catalog</span>
              </div>
              <div className="h-px w-12 bg-black/10" />
            </div>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
              Explore Our <br />
              <span className="text-black/10 italic">Collections</span>
            </h2>
            <p className="text-black/40 max-w-lg text-xs font-bold uppercase tracking-widest leading-relaxed">
              From brutalist monochrome to vibrant abstract series, find the
              visual language that speaks for your walls.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-2">
                Total Archives
              </span>
              <span className="text-4xl font-black">
                {collections.length.toString().padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 bg-black/5 rounded-4xl animate-pulse border border-black/5"
                />
              ))
            : collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Link
                    href={`/shop?collection=${collection.slug}`}
                    className="group relative aspect-3/4 overflow-hidden rounded-4xl block shadow-xl transition-all duration-700 hover:shadow-2xl hover:shadow-black/10"
                  >
                    <Image
                      src={
                        collection.coverImage ||
                        collection.image ||
                        "/placeholder.svg"
                      }
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 brightness-75 group-hover:brightness-100"
                    />

                    {/* Glassmorphic Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 opacity-60 group-hover:opacity-40" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                      <motion.div
                        className="space-y-4"
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/60">
                            Series {index + 1}
                          </span>
                          <div className="h-px w-8 bg-white/20" />
                        </div>

                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                          {collection.title}
                        </h3>

                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs group-hover:text-white/80 transition-colors">
                          {collection.description ||
                            "A curated series of premium master prints."}
                        </p>

                        <div className="pt-4 flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 font-black uppercase tracking-widest text-[9px] h-11 px-8"
                          >
                            Explore
                            <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                          </Button>

                          <div className="flex flex-col items-end">
                            <span className="text-[7px] font-black uppercase tracking-widest text-white/30">
                              Archives
                            </span>
                            <span className="text-sm font-black text-white">
                              {collection.posterCount || 0}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Top Badge */}
                    <div className="absolute top-8 right-8">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform duration-700 group-hover:rotate-12">
                        <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
