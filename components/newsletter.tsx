"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Check,
  Mail,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { subscribeToNewsletter } from "@/actions/user/newsletter-actions";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setIsSuccess(true);
        toast.success(result.message);
        setEmail("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("A connection error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-48 bg-white relative overflow-hidden border-t border-black/5"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-50 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Narrative Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20">
                  The Collective
                </span>
                <div className="h-px w-12 bg-black/10" />
              </div>

              <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
                Stay In <br />
                <span className="text-black/10">The Frame</span>
              </h2>

              <div className="space-y-6">
                <p className="text-xl font-medium text-black/60 italic leading-relaxed">
                  "Join our inner circle for exclusive artifact drops,
                  independent artist spotlights, and a 10% protocol discount on
                  your primary acquisition."
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/40">
                    <Sparkles className="w-3.5 h-3.5" />
                    Early Access to Limited Series
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Privacy First // No Commercial Spam
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interaction Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-zinc-50 border border-black/5 p-8 md:p-12 rounded-[50px] shadow-2xl shadow-black/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
                    <Input
                      type="email"
                      placeholder="ENTER EMAIL PROTOCOL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-20 pl-16 pr-6 bg-white border-black/5 rounded-[30px] font-black uppercase tracking-widest text-[11px] focus:ring-black/5 transition-all outline-none"
                      disabled={isSubmitting || isSuccess}
                      required
                      suppressHydrationWarning
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className={cn(
                      "w-full h-20 rounded-[30px] font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-500 shadow-xl",
                      isSuccess
                        ? "bg-black text-white cursor-default"
                        : "bg-black text-white hover:bg-zinc-800 shadow-black/10"
                    )}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isSuccess ? (
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5" />
                        Entry Granted
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 group">
                        Request Membership
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </Button>
                </form>

                <p className="mt-8 text-center text-[9px] font-bold text-black/20 uppercase tracking-[0.2em] leading-relaxed">
                  By requesting membership, you agree to our <br />
                  <span className="text-black/40 hover:text-black cursor-pointer transition-colors">
                    Privacy Protocol
                  </span>{" "}
                  &{" "}
                  <span className="text-black/40 hover:text-black cursor-pointer transition-colors">
                    Digital Terms
                  </span>
                  .
                </p>
              </div>

              {/* Decorative Accent */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-black/5 rounded-full blur-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
