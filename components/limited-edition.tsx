"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Flame, Users, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLimitedEditions } from "@/actions/user/product-actions";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

function CountdownTimer({ hours: initialHours }: { hours: number }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: 45,
    seconds: 12,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-2">
      {[
        { value: timeLeft.hours, label: "HRS" },
        { value: timeLeft.minutes, label: "MIN" },
        { value: timeLeft.seconds, label: "SEC" },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-white/10 backdrop-blur-md text-white w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-black border border-white/10">
            {String(item.value).padStart(2, "0")}
          </div>
          <span className="text-[8px] text-white/40 mt-1.5 block font-black tracking-widest leading-none">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LimitedEdition() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    getLimitedEditions().then((res) => {
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
      className="py-24 bg-black text-white overflow-hidden relative"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                <Flame className="w-3 h-3 animate-pulse" />
                <span>Reserved for Collectors</span>
              </div>
              <div className="h-px w-12 bg-white/10" />
            </div>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-6">
              Limited <span className="text-white/10 italic">Editions</span>
            </h2>
            <p className="text-white/40 max-w-lg text-xs font-bold uppercase tracking-widest leading-relaxed">
              Rare, numbered releases that will never be reprinted.{" "}
              <br className="hidden md:block" />
              Secure your piece of digital history.
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
              View All Exclusives
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? // Premium Skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 bg-white/5 rounded-3xl animate-pulse border border-white/5"
                />
              ))
            : posters.map((poster, index) => (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-4xl overflow-hidden border border-white/10 transition-all duration-700 hover:bg-white/10 hover:border-white/20">
                    {/* Image Container */}
                    <div className="relative aspect-3/4 overflow-hidden">
                      <Image
                        src={poster.image || "/placeholder.svg"}
                        alt={poster.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />

                      {/* Dark Glossy Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent group-hover:opacity-40 transition-opacity duration-700" />

                      {/* Badge Overlay */}
                      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                        <div className="bg-white px-3 py-1 rounded-full shadow-2xl">
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">
                            Exclusive Release
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 space-y-6">
                      {/* Timer Logic (Visual placeholder) */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-black tracking-widest">
                          <Clock className="w-3 h-3" />
                          <span>Edition Closing In:</span>
                        </div>
                        <CountdownTimer hours={12 + index * 5} />
                      </div>

                      <div className="pt-6 border-t border-white/10">
                        <h3 className="font-black text-2xl uppercase tracking-tighter text-white mb-1 group-hover:tracking-widest transition-all duration-700">
                          {poster.title}
                        </h3>
                        <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                          <span>{poster.category?.name || "Masterpiece"}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span>Numbered Edition</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-mono font-bold text-white/30 tracking-widest mb-1">
                              PRICE
                            </span>
                            <span className="text-2xl font-black text-white">
                              {formatPrice(poster.price)}
                            </span>
                          </div>
                          <Link href={`/shop/${poster.slug}`}>
                            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-black uppercase tracking-widest text-[10px] h-12">
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Claim Edition
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
