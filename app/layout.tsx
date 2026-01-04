import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "THE WALL STACK | Premium Wall Art & Posters",
  description:
    "Discover premium posters crafted for design enthusiasts. Transform any space with our curated collection of minimal, abstract, and typography art prints.",
  keywords: [
    "posters",
    "wall art",
    "prints",
    "minimal art",
    "abstract art",
    "home decor",
  ],
  openGraph: {
    title: "THE WALL STACK | Premium Wall Art & Posters",
    description:
      "Discover premium posters crafted for design enthusiasts. Transform any space with our curated collection.",
    type: "website",
  },
  generator: "v0.app",
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
