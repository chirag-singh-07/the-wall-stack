"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";

export function BrandStory() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-24 md:py-48 bg-white overflow-hidden relative"
    >
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 py-20 opacity-[0.02] pointer-events-none select-none">
        <h2 className="text-[25vw] font-black uppercase leading-none tracking-tighter">
          Legacy
        </h2>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-center">
          {/* Visual Presentation */}
          <div className="lg:col-span-12 xl:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square md:aspect-[4/5] rounded-[60px] overflow-hidden border border-black/5 shadow-2xl"
            >
              <motion.div
                style={{ y: imgY }}
                className="absolute inset-x-0 -top-20 -bottom-20"
              >
                <Image
                  src="/default-images/minimal-studio-workspace-posters-black-white.jpg"
                  alt="THE WALL STACK Studio"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </motion.div>
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl">
                <Sparkles className="w-6 h-6 text-white mb-2" />
                <p className="text-white font-black text-xs uppercase tracking-widest">
                  Est. 2020
                </p>
              </div>
            </motion.div>

            {/* Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -left-10 top-1/2 w-20 h-px bg-black origin-left hidden xl:block"
            />
          </div>

          {/* Narrative Side */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">
                  Our Manifest
                </span>
                <div className="h-px w-12 bg-black/10" />
              </div>

              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-balance">
                Architects <br />
                <span className="text-black/10">Of Ambience</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8 max-w-2xl"
            >
              <p className="text-xl md:text-2xl font-medium text-black/60 italic leading-relaxed">
                Founded on the belief that every wall is a canvas for identity.
                THE WALL STACK transcends traditional decor, curating artifacts
                that define modern sanctuaries.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-black" />
                    <span className="font-black uppercase tracking-widest text-[10px]">
                      The Objective
                    </span>
                  </div>
                  <p className="text-black/40 leading-relaxed font-bold uppercase text-[9px] tracking-wider">
                    To democratize elite design, ensuring museum-grade curation
                    is accessible to every discerning collector.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-black" />
                    <span className="font-black uppercase tracking-widest text-[10px]">
                      The Standard
                    </span>
                  </div>
                  <p className="text-black/40 leading-relaxed font-bold uppercase text-[9px] tracking-wider">
                    Direct collaboration with international visionaries to
                    produce exclusive, time-bound artifact series.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats Transformation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-10 border-t border-black/5 flex flex-wrap gap-12 md:gap-24"
            >
              {[
                { label: "Global Collectors", value: "50K+" },
                { label: "Exclusive Series", value: "200+" },
                { label: "Member Nations", value: "30+" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-4xl font-black tracking-tighter">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <button className="group flex items-center gap-6 py-6 px-10 border border-black/5 bg-zinc-50/50 rounded-full hover:bg-black hover:text-white transition-all duration-500">
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Explore our history
                </span>
                <div className="w-px h-4 bg-black/10 group-hover:bg-white/20" />
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
