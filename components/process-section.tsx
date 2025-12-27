"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Palette, Printer, Package, Truck, Minus } from "lucide-react";

const steps = [
  {
    icon: Palette,
    title: "The Vision",
    description:
      "Our curators handpick exclusive artwork that pushes the boundaries of digital and physical art.",
    number: "01",
  },
  {
    icon: Printer,
    title: "Master Proof",
    description:
      "Every piece is printed on museum-grade 200gsm archival paper using 12-color giclée technology.",
    number: "02",
  },
  {
    icon: Package,
    title: "White Glove",
    description:
      "Carefully wrapped in protective silk and encased in heavy-duty archival tubes for absolute safety.",
    number: "03",
  },
  {
    icon: Truck,
    title: "Final Arrival",
    description:
      "Reliable, carbon-neutral shipping to over 200 countries, bringing the gallery to your doorstep.",
    number: "04",
  },
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-40 bg-white text-black overflow-hidden relative"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                Behind The Scenes
              </span>
              <div className="h-px w-12 bg-black/10" />
            </div>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
              The <span className="text-black/10 italic">Studio</span> <br />
              Standard
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:text-right"
          >
            <p className="text-black/40 max-w-xs text-[10px] font-bold uppercase tracking-widest leading-relaxed ml-auto">
              Our uncompromising commitment to quality ensures your space only
              gets the finest.
            </p>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group relative"
            >
              {/* Large Background Number */}
              <span className="absolute -top-12 -left-4 text-9xl font-black text-black/[0.03] select-none transition-colors duration-700 group-hover:text-black/[0.05]">
                {step.number}
              </span>

              <div className="relative pt-8">
                <div className="mb-8 w-12 h-12 flex items-center justify-center rounded-2xl bg-black/[0.02] border border-black/5 transition-all duration-700 group-hover:bg-black group-hover:border-black group-hover:rotate-12">
                  <step.icon className="w-5 h-5 text-black group-hover:text-white transition-colors duration-700" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter group-hover:tracking-widest transition-all duration-700">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-black/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Decorative bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                  className="h-px bg-black/5 mt-8 group-hover:bg-black/20 transition-colors"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 flex items-center justify-center gap-8"
        >
          <div className="h-px flex-1 bg-black/[0.05]" />
          <Minus className="text-black/10 w-4 h-4" />
          <div className="h-px flex-1 bg-black/[0.05]" />
        </motion.div>
      </div>
    </section>
  );
}
