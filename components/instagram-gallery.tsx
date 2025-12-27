"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  Instagram,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const row1 = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "1.2K",
    comments: "48",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1544450297-f58445dd8970?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "850",
    comments: "32",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1581850518616-bcb8186c393d?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "2.1K",
    comments: "124",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1513519107127-1bed33748e4c?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "1.5K",
    comments: "67",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "3.4K",
    comments: "215",
  },
];

const row2 = [
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "940",
    comments: "29",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "1.8K",
    comments: "88",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "2.7K",
    comments: "156",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "1.1K",
    comments: "42",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1510784722466-f2aa9c52fe6f?q=80&w=600&h=600&auto=format&fit=crop",
    likes: "2.2K",
    comments: "93",
  },
];

export function InstagramGallery() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-48 bg-white overflow-hidden border-t border-black/5"
    >
      <div className="container mx-auto px-4 mb-20 md:mb-32">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">
                The Social Narrative
              </span>
              <div className="h-px w-12 bg-black/10" />
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              Vantage <br />
              <span className="text-black/10">Point</span>
            </h2>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-black/40 flex items-center gap-3">
              <Instagram className="w-5 h-5 text-black" />
              Join 124K+ Residents //{" "}
              <span className="text-black">@thewallstack</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <a
              href="https://instagram.com"
              target="_blank"
              className="group flex flex-col items-end gap-4"
            >
              <div className="flex items-center gap-6 py-6 px-10 border border-black/5 bg-zinc-50/50 rounded-full hover:bg-black hover:text-white transition-all duration-500">
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Observe Feed
                </span>
                <div className="w-px h-4 bg-black/10 group-hover:bg-white/20" />
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </div>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="space-y-6 md:space-y-10">
        {/* Row 1: Leftward */}
        <div className="flex overflow-hidden">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-4 md:gap-10 shrink-0 pr-4 md:pr-10"
          >
            {[...row1, ...row1].map((item, i) => (
              <InstagramCard key={`${item.id}-${i}`} item={item} />
            ))}
          </motion.div>
        </div>

        {/* Row 2: Rightward */}
        <div className="flex overflow-hidden">
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: 0 }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-4 md:gap-10 shrink-0 pr-4 md:pr-10"
          >
            {[...row2, ...row2].map((item, i) => (
              <InstagramCard key={`${item.id}-${i}`} item={item} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Sparkles Signature */}
      <div className="container mx-auto px-4 mt-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-black/10"
        >
          <Sparkles className="w-4 h-4" />
          Synchronized Community Archive
          <Sparkles className="w-4 h-4" />
        </motion.div>
      </div>
    </section>
  );
}

function InstagramCard({ item }: { item: any }) {
  return (
    <div className="relative w-[280px] h-[280px] md:w-[450px] md:h-[450px] rounded-[30px] md:rounded-[50px] overflow-hidden group cursor-crosshair border border-black/5">
      <Image
        src={item.src}
        alt="Studio Vantage"
        fill
        className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
      />
      {/* Overlay UI */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[4px] flex flex-col justify-between p-10 md:p-16">
        <div className="flex justify-between items-start">
          <Instagram className="w-6 h-6 text-white" />
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              Verified View
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex gap-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-white" />
                <span className="text-xl font-black text-white tracking-tighter">
                  {item.likes}
                </span>
              </div>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                Approvals
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <span className="text-xl font-black text-white tracking-tighter">
                  {item.comments}
                </span>
              </div>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                Responses
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-white/10">
            <Share2 className="w-4 h-4 text-white" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
              Join the Dialogue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
