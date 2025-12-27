"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white">
      {/* Animated Background Pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-black/5 via-transparent to-transparent pointer-events-none"
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo/Brand Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-black uppercase mb-2">
            THE WALL STACK
          </h1>
          <div className="h-px w-12 bg-black/20" />
        </motion.div>

        {/* Minimal Loading Indicator */}
        <div className="relative h-px w-48 bg-black/5 overflow-hidden rounded-full">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-black/40 to-transparent"
          />
        </div>

        {/* Subtle Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/60"
        >
          Curating Excellence
        </motion.p>
      </div>
    </div>
  );
}
