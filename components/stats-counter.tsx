"use client";

import { useState, useEffect, useRef } from "react";
import { Users, Package, Star, Globe, Sparkles } from "lucide-react";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";

const stats = [
  { icon: Users, label: "Private Collectors", value: 50000, suffix: "+" },
  { icon: Package, label: "Master Prints Shipped", value: 125000, suffix: "+" },
  { icon: Star, label: "Artist Accolades", value: 15000, suffix: "+" },
  { icon: Globe, label: "Global Archives", value: 85, suffix: "" },
];

function AnimatedCounter({
  value,
  duration = 3,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue.toLocaleString()}</span>;
}

export function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="py-32 md:py-56 bg-white overflow-hidden relative border-y border-black/5"
    >
      {/* Decorative Ghost Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[30vw] font-black text-black/[0.02] uppercase tracking-tighter transition-transform duration-[3s]">
          Archives
        </span>
      </div>

      {/* Geometric Floating Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 border border-black/5 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 border border-black/5 rounded-full flex items-center justify-center">
        <div className="w-1/2 h-px bg-black/10 rotate-45" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6 px-4 py-1.5 bg-black/5 rounded-full border border-black/10"
          >
            <Sparkles className="w-3 h-3 text-black/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">
              Legacy in Numbers
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none"
          >
            Quantifying <span className="text-black/10 italic">Excellence</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="relative group flex flex-col items-center"
            >
              {/* Stat Card */}
              <div className="relative w-full aspect-square md:aspect-auto md:h-64 flex flex-col items-center justify-center p-8 rounded-4xl transition-all duration-700 hover:bg-zinc-50 border border-transparent hover:border-black/5 group">
                {/* Background Index */}
                <span className="absolute top-8 right-8 text-4xl font-black text-black/[0.03] group-hover:text-black/[0.07] transition-colors">
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                <div className="mb-6 relative">
                  <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -inset-2 bg-black/5 rounded-2xl -z-10 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-black tracking-tighter mb-2">
                    <AnimatedCounter value={stat.value} />
                    <span className="text-zinc-300">{stat.suffix}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 group-hover:text-black transition-colors duration-500">
                    {stat.label}
                  </p>
                </div>

                {/* Corner Accents */}
                <div className="absolute bottom-6 left-6 w-2 h-2 border-b-2 border-l-2 border-black/0 group-hover:border-black/10 transition-all duration-700" />
                <div className="absolute top-6 right-6 w-2 h-2 border-t-2 border-r-2 border-black/0 group-hover:border-black/10 transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
