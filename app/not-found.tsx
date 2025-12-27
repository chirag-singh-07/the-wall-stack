"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 selection:bg-white selection:text-black">
      {/* Decorative background element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/2 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        {/* Large 404 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative inline-block"
        >
          <span className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-white/20 select-none">
            404
          </span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            className="absolute bottom-4 left-0 h-[2px] bg-white/20"
          />
        </motion.div>

        {/* Narrative Text */}
        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-2xl md:text-3xl font-light tracking-tight text-white"
          >
            Lost in the Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-white/40 text-sm md:text-base max-w-md mx-auto leading-relaxed"
          >
            The piece you're looking for seems to have been moved or doesn't
            exist. Let's get you back to the main collection.
          </motion.p>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            variant="outline"
            className="h-12 px-8 bg-transparent border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none w-full sm:w-auto group"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              BACK TO SITE
            </Link>
          </Button>
          <Button
            asChild
            className="h-12 px-8 bg-white text-black hover:bg-neutral-200 transition-all duration-300 rounded-none w-full sm:w-auto group"
          >
            <Link href="/shop">
              EXPLORE SHOP
              <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Footer Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="pt-12 text-[10px] uppercase tracking-[0.4em] text-white/20 font-medium"
        >
          THE WALL STACK • EST 2024
        </motion.div>
      </div>
    </div>
  );
}
