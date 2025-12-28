"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Star, CheckCircle2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    quote:
      "The quality exceeded all my expectations. These posters have completely transformed my living room into a curated gallery space.",
    author: "Aarav Mehta",
    role: "Interior Designer",
    location: "Mumbai, MH",
    rating: 5,
    size: "large",
    avatar: "/avatars/boy.png",
  },
  {
    id: 2,
    quote:
      "Finally found a brand that understands minimal design. Every piece is a conversation starter.",
    author: "Rohan Iyer",
    role: "Architect",
    location: "Bengaluru, KA",
    rating: 5,
    size: "small",
    avatar: "/avatars/boy.png",
  },
  {
    id: 3,
    quote:
      "I've ordered from many poster shops, but none compare to the paper quality and the meticulous attention to detail here.",
    author: "Ananya Sharma",
    role: "Art Collector",
    location: "Delhi, DL",
    rating: 5,
    size: "small",
    avatar: "/avatars/girl.png",
  },
  {
    id: 4,
    quote:
      "The curation is impeccable. Each poster feels like it belongs in a museum, not just on a simple wall. The packaging was also premium.",
    author: "Kabir Nair",
    role: "Creative Director",
    location: "Kolkata, WB",
    rating: 5,
    size: "wide",
    avatar: "/avatars/boy.png",
  },
  {
    id: 5,
    quote:
      "Absolutely stunning. The Noir series is exactly what my studio needed for that professional, minimalist edge.",
    author: "Devansh Rao",
    role: "Commercial Photographer",
    location: "Hyderabad, TS",
    rating: 5,
    size: "small",
    avatar: "/avatars/boy.png",
  },
  {
    id: 6,
    quote:
      "Fast shipping and the quality is tangible. You can feel the weight of the paper and the depth of the ink. Truly a masterwork.",
    author: "Priya Kapoor",
    role: "Graphic Artist",
    location: "Chennai, TN",
    rating: 5,
    size: "small",
    avatar: "/avatars/girl.png",
  },
  {
    id: 7,
    quote:
      "A masterclass in modern branding and product quality. The Wall Stack is the only place I buy my office decor now.",
    author: "Arjun Malhotra",
    role: "Tech Founder",
    location: "Pune, MH",
    rating: 5,
    size: "small",
    avatar: "/avatars/boy.png",
  },
  {
    id: 8,
    quote:
      "The customer service is as premium as the products. They helped me choose the perfect collection for my new penthouse.",
    author: "Simran Kaur",
    role: "Luxury Real Estate",
    location: "Gurgaon, HR",
    rating: 5,
    size: "large",
    avatar: "/avatars/girl.png",
  },
  {
    id: 9,
    quote:
      "I love the story behind each collection. It's not just art; it's a narrative for your home.",
    author: "Rahul Verma",
    role: "Fashion Stylist",
    location: "Jaipur, RJ",
    rating: 5,
    size: "small",
    avatar: "/avatars/boy.png",
  },
  {
    id: 10,
    quote:
      "Securely delivered and flawless. The black and white contrast is the deepest I've ever seen on a print.",
    author: "Neha Deshpande",
    role: "Professional Curator",
    location: "Ahmedabad, GJ",
    rating: 5,
    size: "wide",
    avatar: "/avatars/girl.png",
  },
];

export function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-48 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24 md:mb-40">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">
                The Dialogue
              </span>
              <div className="h-px w-12 bg-black/10" />
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              Public <br />
              <span className="text-black/10">Appreciation</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-end gap-4"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-full border-4 border-white bg-zinc-100 overflow-hidden shadow-xl"
                >
                  <Image
                    src={`/avatars/boy.png`}
                    alt="User"
                    className="w-full h-full object-cover"
                    width={56}
                    height={56}
                  />
                </div>
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-white bg-black flex items-center justify-center shadow-xl">
                <span className="text-white text-[10px] font-black tracking-tighter">
                  12K+
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-black text-black" />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Collector Average
              </span>
            </div>
          </motion.div>
        </div>

        {/* Global Testimonials Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * i }}
              className={cn(
                "group relative p-8 md:p-12 bg-zinc-50 rounded-[40px] border border-black/5 flex flex-col justify-between transition-all duration-500 hover:bg-black hover:border-black cursor-default",
                item.size === "large" && "col-span-2 row-span-2",
                item.size === "wide" && "col-span-2",
                item.size === "small" && "col-span-1"
              )}
            >
              <div className="space-y-8">
                <Quote className="w-10 h-10 text-black/10 group-hover:text-white/10 transition-colors duration-500" />
                <p
                  className={cn(
                    "font-medium leading-relaxed group-hover:text-white transition-colors duration-500",
                    item.size === "large"
                      ? "text-2xl md:text-3xl"
                      : "text-lg md:text-xl"
                  )}
                >
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-black/5 group-hover:border-white/10 flex items-center justify-between transition-colors duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-black/5">
                    <Image
                      src={item.avatar}
                      alt={item.author}
                      className="w-full h-full object-cover"
                      width={56}
                      height={56}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors duration-500">
                        {item.author}
                      </h4>
                      <CheckCircle2 className="w-3 h-3 text-black/20 group-hover:text-white/40 transition-colors duration-500" />
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-black/30 group-hover:text-white/30 transition-colors duration-500">
                      {item.role} // {item.location}
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-black/10 group-hover:border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Decorative Index */}
              <div className="absolute top-8 right-12 text-[10px] font-black text-black/[0.03] group-hover:text-white/[0.03] transition-colors duration-500">
                {(i + 1).toString().padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand Bar Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-40 pt-20 border-t border-black/5 flex flex-col items-center gap-12"
        >
          <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-20 hover:opacity-100 transition-opacity duration-1000">
            {[
              "ARCHITECTURAL DIGEST",
              "VOGUE LIVING",
              "MONOCLE",
              "HYPEBEAST",
              "DEZEEN",
            ].map((brand) => (
              <span
                key={brand}
                className="text-xs font-black tracking-[0.5em] grayscale"
              >
                {brand}
              </span>
            ))}
          </div>

          <div className="group relative overflow-hidden bg-black text-white px-12 py-8 rounded-[30px] shadow-2xl shadow-black/20 cursor-pointer">
            <div className="relative z-10 flex items-center gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                  Join the collective
                </p>
                <h3 className="text-2xl font-black uppercase tracking-tighter">
                  Verified Review Archive
                </h3>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <ArrowUpRight className="w-8 h-8 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            {/* Animated background flare */}
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 blur-[100px] group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1000" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
