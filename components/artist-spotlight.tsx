"use client";

import { useRef } from "react";
import {
  Globe,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const featuredArtist = {
  name: "Elena Vasquez",
  username: "evasquez_studio",
  title: "Principal Abstract Minimalist",
  location: "Barcelona, Spain",
  bio: "Architectural narratives translated into minimalist form. Exploring the tension between negative space and structural integrity. Her work is a dialogue between the seen and the felt.",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop",
  stats: [
    { label: "Original Works", value: "47" },
    { label: "Verified Collectors", value: "12.4K" },
    { label: "Exhibitions", value: "12" },
  ],
  works: [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&h=1000&auto=format&fit=crop",
      category: "Noir Series",
      size: "large",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=400&h=400&auto=format&fit=crop",
      category: "Abstract",
      size: "small",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&h=400&auto=format&fit=crop",
      category: "Minimal",
      size: "small",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800&h=600&auto=format&fit=crop",
      category: "Series X",
      size: "wide",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1459706484596-7a8ca1833446?q=80&w=400&h=400&auto=format&fit=crop",
      category: "Canvas",
      size: "small",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=400&h=400&auto=format&fit=crop",
      category: "Noir",
      size: "small",
    },
  ],
  socials: {
    website: "evasquez.studio",
  },
};

export function ArtistSpotlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-48 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Editorial Header */}
        <div className="grid lg:grid-cols-12 gap-16 items-center mb-32">
          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[40px] border border-black/5 shadow-2xl">
              <Image
                src={featuredArtist.avatar}
                alt={featuredArtist.name}
                fill
                className="object-cover scale-110 grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Signature-style Text */}
            <div className="absolute -bottom-8 -right-8 bg-black p-8 rounded-3xl shadow-2xl hidden md:block border-4 border-white">
              <Zap className="w-8 h-8 text-white mb-4 animate-pulse" />
              <p className="text-white font-black text-2xl uppercase tracking-tighter italic leading-none">
                Maestro <br /> <span className="text-white/40">Edition</span>
              </p>
            </div>
          </motion.div>

          {/* Narrative Side */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">
                  The Collaborator
                </span>
                <div className="h-px w-12 bg-black/10" />
              </div>
              <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
                <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
                  {featuredArtist.name.split(" ")[0]} <br />
                  <span className="text-black/10">
                    {featuredArtist.name.split(" ")[1]}
                  </span>
                </h2>
                <div className="pb-2">
                  <div className="flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full border border-black/10">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {featuredArtist.username}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid sm:grid-cols-3 gap-8 py-10 border-y border-black/5"
            >
              {featuredArtist.stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-4xl font-black tracking-tighter">
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              <p className="text-xl md:text-2xl font-medium text-black/60 italic leading-relaxed max-w-2xl">
                "{featuredArtist.bio}"
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="h-14 px-8 bg-black text-white hover:bg-zinc-800 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/10">
                  Acquire Exhibition Works
                </Button>
                <Button
                  variant="outline"
                  className="h-14 px-8 border-black/10 rounded-full font-black uppercase tracking-widest text-[10px] group"
                >
                  Official Website{" "}
                  <ExternalLink className="ml-2 w-3 h-3 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* The Curated Series (No Tabs) */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between"
          >
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              The <span className="text-black/20 italic">Archives</span>
            </h3>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">
              Series 01 // Curated Selection
            </span>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredArtist.works.map((work, i) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-black/5 bg-zinc-50",
                  work.size === "large" &&
                    "col-span-2 row-span-2 aspect-square md:aspect-[4/5]",
                  work.size === "wide" &&
                    "col-span-2 aspect-square md:aspect-video",
                  work.size === "small" && "aspect-square"
                )}
              >
                <Image
                  src={work.image}
                  alt={work.category}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">
                        COLLECTION
                      </span>
                      <h4 className="text-white font-black uppercase tracking-tight text-xl">
                        {work.category}
                      </h4>
                    </div>
                    <Button
                      size="icon"
                      className="bg-white text-black rounded-full hover:bg-zinc-100"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-32 text-center"
        >
          <div className="inline-flex items-center gap-8 py-6 px-10 border border-black/5 bg-zinc-50/50 rounded-full group cursor-pointer hover:bg-black hover:text-white transition-all duration-500">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Official Artist Partnership
            </span>
            <div className="w-px h-4 bg-black/10 group-hover:bg-white/20" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Connect with Elena
              </span>
              <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
