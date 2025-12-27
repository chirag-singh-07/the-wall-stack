"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ParallaxBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[80vh] min-h-[600px] overflow-hidden flex items-center justify-center bg-black"
    >
      {/* Background with Parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <Image
          src="/parallax-banner-black-white-poster-studio.jpg"
          alt="Studio Background"
          fill
          className="object-cover opacity-60 grayscale brightness-50"
          priority
        />
        {/* Gradients for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80" />
      </motion.div>

      {/* Decorative Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/5 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/5 rounded-full pointer-events-none"
      />

      {/* Content */}
      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-white/60" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                Crafting Excellence
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-8 text-white"
          >
            Art That <span className="text-white/10 italic">Defines</span>{" "}
            <br />
            You
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/40 max-w-xl mx-auto text-xs md:text-sm font-black uppercase tracking-[0.2em] leading-relaxed mb-12"
          >
            Beyond paper and ink. We create statements for spaces that demand
            distinction. Every poster is a piece of curated history.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full px-12 h-14 font-black uppercase tracking-widest text-xs shadow-2xl shadow-white/10 group"
              >
                The Collection
                <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
            <Link
              href="/about"
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors border-b border-white/10 pb-1"
            >
              Our Philosophy
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
