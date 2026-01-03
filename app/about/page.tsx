"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StatsCounter } from "@/components/stats-counter";
import { ProcessSection } from "@/components/process-section";
import { BrandStory } from "@/components/brand-story";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Palette, Shield, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg-dark.jpg" // Placeholder for a dark moody abstract image
            alt="About Background"
            fill
            className="object-cover opacity-40 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>

        <div className="container relative z-10 px-4 text-center space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-white/60"
          >
            Since 2020
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-balance"
          >
            ART FOR THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white/80">
              MODERN WALL.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 font-light leading-relaxed"
          >
            We don&apos;t just sell posters. We frame the moments, moods, and
            movements that define your space.
          </motion.p>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* Brand Journey - Partially Reused */}
      <BrandStory />

      {/* Values Section */}
      <section className="py-24 bg-muted/20">
        <div className="container px-4 md:px-8 mx-auto">
          <motion.div
            {...fadeInUp}
            className="text-center max-w-3xl mx-auto mb-20 space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Built on Core Values
            </h2>
            <p className="text-muted-foreground">
              Quality isn&apos;t just a promise; it&apos;s our DNA. Every pixel
              is proofed, and every print is personal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Palette,
                title: "Artistic Integrity",
                desc: "Collaborating with global artists to bring exclusive, meaningful designs to your door.",
              },
              {
                icon: Shield,
                title: "Museum Quality",
                desc: "Printed on 200gsm archival paper with inks that last a lifetime without fading.",
              },
              {
                icon: Zap,
                title: "Modern Design",
                desc: "Aesthetic-first approach to ensure every piece fits perfectly in contemporary spaces.",
              },
              {
                icon: Heart,
                title: "Eco-Conscious",
                desc: "Sustainable production and plastic-free packaging for a greener planet.",
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 bg-background border border-border/40 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <ProcessSection />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Behind the Scenes / Team Placeholder */}
      <section className="py-24 overflow-hidden">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} className="space-y-8">
              <span className="text-sm font-bold tracking-widest text-primary uppercase">
                Innovation
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                Merging Technology <br /> with Traditional Art.
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  We use state-of-the-art Giclée printing technology to achieve
                  exceptional detail and color accuracy. Each piece undergoes a
                  3-step quality check before being hand-rolled.
                </p>
                <p>
                  Our R&D team is constantly exploring new textures, frames, and
                  interactive elements to push the boundaries of wall art.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" className="rounded-full px-8 gap-2">
                    Explore Shop <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/custom-poster">
                  <Button
                  variant="outline"
                    size="lg"
                    className="rounded-full px-8"
                  >
                    Custom Creation
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/default-images/good.jpg" // Placeholder for an artist or warehouse image
                alt="Our innovation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-3xl font-bold">Quality First.</p>
                <p className="opacity-80">Always.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-foreground text-background flex items-center w-full justify-center">
        <div className="flex items-center flex-col px-4 text-center space-y-10">
          <motion.h2
            whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
            className="text-4xl md:text-7xl font-black tracking-tighter"
          >
            READY TO TRANSFORM <br /> YOUR SPACE?
          </motion.h2>
          <motion.div
            whileInView={{ y: [20, 0], opacity: [0, 1] }}
            className="flex flex-col md:flex-row justify-center gap-4"
          >
            <Link href="/shop">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-12 py-8 text-xl font-bold hover:scale-110 active:scale-95 transition-all"
              >
                The Collections
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
