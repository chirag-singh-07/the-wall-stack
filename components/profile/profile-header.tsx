"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function ProfileHeader({
  title,
  subtitle,
  breadcrumbs,
}: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-8"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href="/profile"
          className="hover:text-foreground transition-colors"
        >
          Account
        </Link>
        {breadcrumbs?.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Title */}
      <div className="flex items-end justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-5xl font-black tracking-tighter uppercase"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-muted-foreground mt-2 max-w-md"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Decorative element */}
        <div className="hidden md:flex items-center gap-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
            className="h-[2px] bg-foreground"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-3 h-3 bg-foreground"
          />
        </div>
      </div>
    </motion.div>
  );
}
