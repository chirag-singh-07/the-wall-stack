"use client";

import { useEffect, useRef } from "react";

interface MarqueeBannerProps {
  content?: {
    text?: string;
    speed?: number;
  };
}

export function MarqueeBanner({ content }: MarqueeBannerProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationId: number;
    let position = 0;

    const animate = () => {
      position -= 1;
      if (position <= -50) {
        position = 0;
      }
      marquee.style.transform = `translateX(${position}%)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const items = [
    "FREE SHIPPING WORLDWIDE",
    "PREMIUM QUALITY",
    "HANDCRAFTED",
    "LIMITED EDITIONS",
    "MUSEUM GRADE PAPER",
    "ECO FRIENDLY",
  ];

  return (
    <div className="bg-foreground text-background py-3 overflow-hidden">
      <div ref={marqueeRef} className="flex whitespace-nowrap">
        {content?.text
          ? [...Array(4)].map((_, i) => (
              <span
                key={i}
                className="mx-8 text-sm font-medium tracking-widest uppercase"
              >
                {content.text} <span className="mx-4">•</span>
              </span>
            ))
          : [...items, ...items, ...items, ...items].map((item, i) => (
              <span
                key={i}
                className="mx-8 text-sm font-medium tracking-widest"
              >
                {item} <span className="mx-4">•</span>
              </span>
            ))}
      </div>
    </div>
  );
}
