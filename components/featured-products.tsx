"use client";

import { useEffect, useRef, useState } from "react";
import { getFeaturedProducts } from "@/actions/user/product-actions";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";

export function FeaturedProducts() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    getFeaturedProducts().then((res) => {
      if (res.success && res.data) {
        setPosters(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (!loading && posters.length === 0) return null;

  return (
    <section
      ref={containerRef}
      id="featured"
      className="py-24 md:py-32 bg-white text-black overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/5 text-black/60 rounded-full text-[10px] font-black uppercase tracking-widest border border-black/10">
                <Star className="w-3 h-3" />
                <span>Curated Excellence</span>
              </div>
              <div className="h-px w-12 bg-black/10" />
            </div>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-6">
              The <span className="text-black/10 italic">Featured</span> <br />
              Gallery
            </h2>
            <p className="text-black/40 max-w-lg text-xs font-bold uppercase tracking-widest leading-relaxed">
              Our hand-picked selection of masterpieces that define the current
              era of digital print.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href="/shop"
              className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-black/60 hover:text-black transition-all underline underline-offset-8 decoration-black/10 hover:decoration-black"
            >
              Browse The Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 bg-black/5 rounded-3xl animate-pulse border border-black/5"
                />
              ))
            : posters.map((poster, index) => (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link href={`/shop/${poster.slug}`}>
                    <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-black/5 transition-all duration-700 hover:shadow-2xl hover:shadow-black/10 border border-black/5">
                      {/* Image */}
                      <Image
                        src={poster.image || "/placeholder.svg"}
                        alt={poster.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />

                      {/* Metallic/Glossy Overlay on Hover */}
                      <div className="absolute inset-0 bg-linear-to-tr from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      {/* Floating Add Button */}
                      <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <Button
                          size="icon"
                          className="w-12 h-12 rounded-full bg-white text-black hover:bg-black hover:text-white border-none shadow-2xl transition-all duration-500"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Badge */}
                      <div className="absolute top-6 left-6">
                        <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          <span className="text-[8px] font-black uppercase tracking-widest text-black">
                            Featured Edition
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-6 space-y-2 px-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-sm font-black uppercase tracking-tighter group-hover:tracking-widest transition-all duration-700 truncate">
                        {poster.title}
                      </h3>
                      <span className="text-sm font-black whitespace-nowrap">
                        {formatPrice(poster.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/30">
                      <span>{poster.category?.name || "Premium"}</span>
                      <span className="w-1 h-1 rounded-full bg-black/10" />
                      <span>Archival Grade</span>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
