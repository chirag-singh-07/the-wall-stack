"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What paper do you use for printing?",
    answer:
      "We use museum-grade 200gsm matte paper with archival inks that are rated to last 100+ years without fading. Each print is made to order with meticulous attention to detail.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We offer free worldwide shipping on all orders. Posters are shipped in protective tubes to ensure they arrive in perfect condition. Delivery typically takes 5-10 business days.",
  },
  {
    question: "What sizes are available?",
    answer:
      "Our posters come in four standard sizes: A4 (21×29.7cm), A3 (29.7×42cm), A2 (42×59.4cm), and A1 (59.4×84.1cm). Custom sizes are available upon request.",
  },
  {
    question: "Can I return or exchange my order?",
    answer:
      "Absolutely. We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, we'll provide a full refund or exchange, no questions asked.",
  },
  {
    question: "Are frames included?",
    answer:
      "Posters are sold unframed to keep shipping costs down and allow you to choose a frame that matches your space. We recommend simple black or white frames for the best effect.",
  },
];

export function FAQSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div
            className={cn(
              "transition-all duration-700",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            )}
          >
            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Questions? We've got answers.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg">
              Can't find what you're looking for? Reach out to our team at{" "}
              <a
                href="mailto:hello@thewallstack.com"
                className="underline underline-offset-4"
              >
                hello@thewallstack.com
              </a>
            </p>
          </div>

          <div
            className={cn(
              "space-y-4 transition-all duration-700 delay-200",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            )}
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  "border-b border-border transition-all duration-300",
                  index === 0 && "border-t"
                )}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className="font-medium text-lg pr-8">
                    {faq.question}
                  </span>
                  <span className="shrink-0 h-8 w-8 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                    {openIndex === index ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-500",
                    openIndex === index ? "max-h-48 pb-6" : "max-h-0"
                  )}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
