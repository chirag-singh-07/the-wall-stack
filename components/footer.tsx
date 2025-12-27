"use client";

import Link from "next/link";
import {
  Instagram,
  Twitter,
  Facebook,
  Shield,
  ArrowUpRight,
  Globe,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  curation: [
    { label: "All Artifacts", href: "/products" },
    { label: "Noir Series", href: "/category/noir" },
    { label: "Abstract Form", href: "/category/abstract" },
    { label: "Archival Type", href: "/category/typography" },
  ],
  narrative: [
    { label: "The Story", href: "#about" },
    { label: "Collaborators", href: "#gallery" },
    { label: "Sustainability", href: "#" },
    { label: "Press Office", href: "#" },
  ],
  protocol: [
    { label: "Shipment FAQ", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Digital Terms", href: "#" },
    { label: "Privacy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black text-white py-24 md:py-40 overflow-hidden relative">
      {/* Decorative Background Accent */}
      <div className="absolute bottom-0 right-0 py-20 opacity-[0.03] pointer-events-none select-none">
        <h2 className="text-[20vw] font-black uppercase leading-none tracking-tighter italic">
          Archive
        </h2>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-24 mb-32">
          {/* Brand Identity */}
          <div className="lg:col-span-5 space-y-10">
            <Link
              href="/"
              className="text-3xl md:text-4xl font-black tracking-tighter uppercase inline-block group"
            >
              THE WALL <br />
              <span className="text-white/20 group-hover:text-white transition-colors duration-500">
                STACK
              </span>
            </Link>

            <p className="text-lg font-medium text-white/40 italic leading-relaxed max-w-sm">
              "Curating the dialogue between architectural space and human
              identity through museum-grade artifacts."
            </p>

            <div className="flex gap-4">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Facebook, label: "Facebook" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href="#"
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group"
                >
                  <social.icon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-8 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-white/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Global Logistics
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Archival Grade
                </span>
              </div>
            </div>
          </div>

          {/* Sitemaps */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">
                Curation
              </h3>
              <ul className="space-y-4">
                {footerLinks.curation.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white transition-all duration-300 text-xs font-black uppercase tracking-widest flex items-center group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">
                Narrative
              </h3>
              <ul className="space-y-4">
                {footerLinks.narrative.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white transition-all duration-300 text-xs font-black uppercase tracking-widest flex items-center group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">
                Protocol
              </h3>
              <ul className="space-y-4">
                {footerLinks.protocol.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white transition-all duration-300 text-xs font-black uppercase tracking-widest flex items-center group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Global Footer Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/10">
            &copy; {new Date().getFullYear()} THE WALL STACK PROTOCOL // ALL
            RIGHTS RESERVED
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/admin-login"
              className="px-4 py-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-500 flex items-center gap-2 group"
            >
              <Shield className="h-3 w-3 opacity-50 group-hover:opacity-100" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                System Admin
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
