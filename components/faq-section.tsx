"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  HelpCircle,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question:
      "What specific grade of paper is used for THE WALL STACK artifacts?",
    answer:
      "We utilize gallery-exclusive 200gsm museum-grade matte paper. This acid-free substrate is coupled with archival pigmentation inks, ensuring a chromatic stability rated for over 100 years. Each piece is treated as a master print, not a commercial copy.",
  },
  {
    question: "Does the archive ship to international sanctuaries?",
    answer:
      "Absolutely. We coordinate secure, global transit for our collectors. Every order is encased in reinforced, impact-resistant architect tubes. While delivery typically spans 5-10 business days, we prioritize speed and security for every sequence.",
  },
  {
    question: "How are the dimensions standardized?",
    answer:
      "Our standard archives are available in four precise ratios: A4 (21×29.7cm), A3 (29.7×42cm), A2 (42×59.4cm), and A1 (59.4×84.1cm). Should your sanctuary require a unique dimension, our bespoke studio can accommodate custom requests.",
  },
  {
    question: "What is the policy regarding acquisition returns?",
    answer:
      "We maintain a 30-day Satisfaction Protocol. If an artifact does not align with your space's vision, we facilitate a seamless return or exchange process. We believe the dialogue between the observer and the art should be one of absolute certainty.",
  },
  {
    question: "Are the artifacts delivered with frames?",
    answer:
      "To ensure the integrity of the print during high-speed global transit, artifacts are sold unframed. This allows you to select a frame that precisely complements your interior architectural language. We recommend deep-set matte black or raw oak for the Noir Series.",
  },
  {
    question: "Can I commission a custom artist collaboration?",
    answer:
      "Yes. Our Studio Vantage program allows for unique collaborations between collectors and our featured artists. Reach out to our curation team for bespoke narrative pieces that define your specific environment.",
  },
  {
    question: "How is the sustainability of the archives managed?",
    answer:
      "Our production sequence is carbon-neutral. We utilize FSC-certified papers and eco-solvent inks. Every acquisition supports responsible forest management and contributes to a more sustainable art ecosystem.",
  },
  {
    question: "How can I join the community gallery archives?",
    answer:
      "Collectors who have acquired an artifact are invited to share their setup. Approved submissions are featured in our Community Dialogue section, fostering a visual conversation among our global residents.",
  },
];

export function FAQSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-48 bg-white overflow-hidden relative border-t border-black/5"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
          {/* Header Narrative */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">
                  The Protocol
                </span>
                <div className="h-px w-12 bg-black/10" />
              </div>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                Common <br />
                <span className="text-black/10">Inquiries</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8"
            >
              <p className="text-xl font-medium text-black/40 italic leading-relaxed max-w-sm">
                Clarifying the technical and philosophical standards of our
                curated archives.
              </p>

              <div className="flex flex-col gap-4">
                <a
                  href="mailto:hello@thewallstack.com"
                  className="group flex items-center gap-4 py-6 px-10 border border-black/5 bg-zinc-50/50 rounded-full hover:bg-black hover:text-white transition-all duration-500"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    Direct Dialogue
                  </span>
                  <ArrowUpRight className="ml-auto w-4 h-4 group-hover:rotate-45 transition-transform" />
                </a>
                <div className="flex items-center gap-4 px-10 py-4 opacity-20">
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                    Support Available 24/7 // Global GMT
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-7">
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className={cn(
                    "group rounded-3xl transition-all duration-500",
                    openIndex === index
                      ? "bg-zinc-50 border border-black/5"
                      : "bg-white border border-transparent hover:bg-zinc-50 translate-x-0 hover:translate-x-2"
                  )}
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full p-8 md:p-10 flex items-center justify-between text-left"
                  >
                    <span
                      className={cn(
                        "text-lg md:text-xl font-black uppercase tracking-tighter transition-colors duration-300",
                        openIndex === index
                          ? "text-black"
                          : "text-black/60 group-hover:text-black"
                      )}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={cn(
                        "shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500",
                        openIndex === index
                          ? "bg-black border-black text-white rotate-0"
                          : "bg-white border-black/5 text-black rotate-90 group-hover:rotate-0"
                      )}
                    >
                      {openIndex === index ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 md:px-10 pb-10">
                          <div className="w-12 h-px bg-black/10 mb-6" />
                          <p className="text-black/60 font-medium leading-relaxed max-w-xl text-lg md:text-xl italic">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Accent */}
      <div className="absolute -bottom-20 -left-20 pointer-events-none opacity-[0.02]">
        <h2 className="text-[30vw] font-black uppercase tracking-tighter italic">
          Support
        </h2>
      </div>
    </section>
  );
}
