"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

const rooms = [
  {
    id: "living",
    name: "Living Room",
    image: "/modern-minimalist-living-room-white-walls-interior.jpg",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    image: "/modern-bedroom-white-walls-scandinavian-interior.jpg",
  },
  {
    id: "office",
    name: "Home Office",
    image: "/modern-home-office-white-walls-minimal-interior.jpg",
  },
  {
    id: "dining",
    name: "Dining Room",
    image: "/modern-dining-room-white-walls-interior-design.jpg",
  },
];

const posters = [
  {
    id: 1,
    name: "Abstract Lines",
    image: "/abstract-black-white-lines-poster-art.jpg",
  },
  {
    id: 2,
    name: "Mountain Vista",
    image: "/mountain-black-white-minimalist-poster.jpg",
  },
  {
    id: 3,
    name: "Ocean Waves",
    image: "/ocean-waves-black-white-poster-art.jpg",
  },
  {
    id: 4,
    name: "City Grid",
    image: "/city-grid-black-white-architecture-poster.jpg",
  },
  {
    id: 5,
    name: "Botanical",
    image: "/botanical-leaves-black-white-poster-art.jpg",
  },
  {
    id: 6,
    name: "Typography",
    image: "/typography-black-white-motivational-poster.jpg",
  },
];

const frames = [
  { id: "black", name: "Black", color: "#000000" },
  { id: "white", name: "White", color: "#FFFFFF" },
  { id: "natural", name: "Natural Oak", color: "#D4A574" },
  { id: "none", name: "No Frame", color: "transparent" },
];

const sizes = [
  { id: "small", name: "Small", width: 80, height: 110 },
  { id: "medium", name: "Medium", width: 120, height: 160 },
  { id: "large", name: "Large", width: 160, height: 220 },
];

export function RoomVisualizer() {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [selectedPoster, setSelectedPoster] = useState(posters[0]);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [posterPosition, setPosterPosition] = useState({ x: 50, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosterPosition({
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(80, y)),
    });
  };

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 block">
            Preview in Your Space
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Room Visualizer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how your poster looks in different rooms. Drag to reposition.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Room Preview */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div
              ref={containerRef}
              className="relative aspect-[3/2] rounded-lg overflow-hidden cursor-move bg-muted"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Room Image */}
              <img
                src={selectedRoom.image || "/placeholder.svg"}
                alt={selectedRoom.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              />

              {/* Poster on Wall */}
              <div
                className="absolute transition-all duration-300 cursor-grab active:cursor-grabbing"
                style={{
                  left: `${posterPosition.x}%`,
                  top: `${posterPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: selectedSize.width,
                  height: selectedSize.height,
                }}
                onMouseDown={handleMouseDown}
              >
                {/* Frame */}
                <div
                  className="absolute inset-0 shadow-2xl"
                  style={{
                    padding: selectedFrame.id === "none" ? 0 : 8,
                    backgroundColor: selectedFrame.color,
                    border:
                      selectedFrame.id === "white"
                        ? "1px solid #e5e5e5"
                        : "none",
                  }}
                >
                  <img
                    src={selectedPoster.image || "/placeholder.svg"}
                    alt={selectedPoster.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Drag Indicator */}
                {isDragging && (
                  <div className="absolute -inset-2 border-2 border-dashed border-foreground/50 rounded animate-pulse" />
                )}
              </div>

              {/* Room Label */}
              <div className="absolute bottom-4 left-4 bg-foreground/80 backdrop-blur-sm text-background px-4 py-2 rounded-full text-sm">
                {selectedRoom.name}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div
            className={`space-y-6 transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* Room Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Room</label>
              <div className="relative">
                <button
                  onClick={() => setShowRoomDropdown(!showRoomDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:border-foreground/50 transition-colors"
                >
                  <span>{selectedRoom.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showRoomDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showRoomDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-10 overflow-hidden">
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => {
                          setSelectedRoom(room);
                          setShowRoomDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <span>{room.name}</span>
                        {selectedRoom.id === room.id && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Poster Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Poster</label>
              <div className="grid grid-cols-3 gap-2">
                {posters.map((poster) => (
                  <button
                    key={poster.id}
                    onClick={() => setSelectedPoster(poster)}
                    className={`relative aspect-[3/4] rounded overflow-hidden border-2 transition-all ${
                      selectedPoster.id === poster.id
                        ? "border-foreground scale-105"
                        : "border-transparent hover:border-foreground/30"
                    }`}
                  >
                    <img
                      src={poster.image || "/placeholder.svg"}
                      alt={poster.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedPoster.id === poster.id && (
                      <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-background" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Frame Style</label>
              <div className="flex gap-3">
                {frames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedFrame.id === frame.id
                        ? "ring-2 ring-foreground ring-offset-2"
                        : "hover:scale-110"
                    }`}
                    style={{
                      backgroundColor: frame.color,
                      borderColor:
                        frame.id === "white"
                          ? "#e5e5e5"
                          : frame.color === "transparent"
                          ? "#e5e5e5"
                          : frame.color,
                    }}
                    title={frame.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Poster Size</label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-2 px-3 rounded border text-sm font-medium transition-all ${
                      selectedSize.id === size.id
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full py-4 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Add to Cart - ₹499
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
