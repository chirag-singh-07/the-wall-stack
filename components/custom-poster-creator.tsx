"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import {
  Upload,
  ImageIcon,
  Frame,
  Palette,
  Type,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Check,
  ShoppingCart,
  X,
  Maximize2,
  Layers,
  Wand2,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { saveCustomPoster } from "@/actions/user/custom-poster-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const frameStyles = [
  { id: "none", name: "No Frame", border: "none", padding: "0" },
  {
    id: "thin-black",
    name: "Thin Black",
    border: "2px solid #000",
    padding: "8px",
  },
  {
    id: "thick-black",
    name: "Thick Black",
    border: "8px solid #000",
    padding: "12px",
  },
  {
    id: "double",
    name: "Double Line",
    border: "4px double #000",
    padding: "10px",
  },
  {
    id: "shadow",
    name: "Shadow Box",
    border: "1px solid #000",
    padding: "16px",
  },
  { id: "vintage", name: "Vintage", border: "6px ridge #333", padding: "14px" },
];

const posterSizes = [
  { id: "small", name: "Small", dimensions: "8×10″", price: 129 },
  { id: "medium", name: "Medium", dimensions: "12×16″", price: 149 },
  { id: "large", name: "Large", dimensions: "18×24″", price: 179 },
  { id: "xl", name: "Extra Large", dimensions: "24×36″", price: 229 },
];

const imageFilters = [
  { id: "none", name: "Original", filter: "none" },
  { id: "grayscale", name: "B&W", filter: "grayscale(100%)" },
  {
    id: "contrast",
    name: "High Contrast",
    filter: "grayscale(100%) contrast(150%)",
  },
  { id: "sepia", name: "Vintage", filter: "sepia(100%)" },
  { id: "bright", name: "Bright", filter: "brightness(120%) contrast(110%)" },
  {
    id: "noir",
    name: "Noir",
    filter: "grayscale(100%) contrast(200%) brightness(80%)",
  },
];

const aspectRatios = [
  { id: "2:3", name: "2:3 Portrait", ratio: 2 / 3 },
  { id: "3:4", name: "3:4 Classic", ratio: 3 / 4 },
  { id: "1:1", name: "1:1 Square", ratio: 1 },
  { id: "4:5", name: "4:5 Photo", ratio: 4 / 5 },
];

export function CustomPosterCreator() {
  const [isVisible, setIsVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(frameStyles[1]);
  const [selectedSize, setSelectedSize] = useState(posterSizes[1]);
  const [selectedFilter, setSelectedFilter] = useState(imageFilters[0]);
  const [selectedRatio, setSelectedRatio] = useState(aspectRatios[0]);
  const [customText, setCustomText] = useState("");
  const [textPosition, setTextPosition] = useState<"top" | "bottom" | "none">(
    "none"
  );
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<
    "upload" | "frame" | "filter" | "size" | "text"
  >("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const sectionRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setActiveTab("frame");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setActiveTab("frame");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!uploadedImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => setIsDragging(false);

  const resetImage = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleAddToCart = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    if (!session) {
      toast.error("Please login to create a custom order", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    setIsProcessing(true);
    try {
      const designData = {
        image: uploadedImage,
        frame: selectedFrame.id,
        size: selectedSize.id,
        filter: selectedFilter.id,
        ratio: selectedRatio.id,
        text: customText,
        textPosition,
        zoom,
        position,
      };

      const result = await saveCustomPoster({
        userId: session.user.id,
        design: designData,
        price: selectedSize.price,
      });

      if (result.success && result.data) {
        // We can either add it to cart with a special prefix or redirect to a custom checkout
        // For simplicity, let's add a "custom_" prefix to the ID
        addItem(
          `custom_${result.data.id}`,
          selectedSize.name,
          selectedSize.price,
          1
        );

        setShowSuccess(true);
        toast.success("Custom design saved and added to cart!");
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/cart");
        }, 2000);
      } else {
        toast.error(result.error || "Failed to save design");
      }
    } catch (error) {
      console.error("Custom order error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: "upload", label: "Upload", icon: Upload },
    { id: "frame", label: "Frame", icon: Frame },
    { id: "filter", label: "Filter", icon: Palette },
    { id: "size", label: "Size", icon: Maximize2 },
    { id: "text", label: "Text", icon: Type },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-foreground text-background overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-background/20 rounded-full mb-6">
            <Wand2 className="w-4 h-4" />
            <span className="text-sm tracking-wider uppercase">
              Create Your Own
            </span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-[0.8]">
            Poster <br />
            <span className="text-white/20 italic font-light">Architect</span>
          </h2>
          <p className="text-background/40 max-w-2xl mx-auto text-sm font-medium uppercase tracking-[0.2em] mb-12">
            Professional-grade customization at your fingertips.
          </p>
          <div className="flex justify-center">
            <NextLink href="/custom-poster">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full px-10 h-14 font-black uppercase tracking-widest text-xs shadow-2xl shadow-white/10 group"
              >
                Launch Full Studio
                <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-2" />
              </Button>
            </NextLink>
          </div>
        </div>

        <div
          className={`grid lg:grid-cols-2 gap-8 lg:gap-12 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Preview Panel */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="relative aspect-3/4 bg-background/5 rounded-lg overflow-hidden border border-background/10">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>

                {/* Poster Preview */}
                <div
                  ref={previewRef}
                  className="absolute inset-8 md:inset-12 flex items-center justify-center"
                >
                  <div
                    className="relative w-full h-full bg-background transition-all duration-300 overflow-hidden"
                    style={{
                      border: selectedFrame.border,
                      padding: selectedFrame.padding,
                      boxShadow:
                        selectedFrame.id === "shadow"
                          ? "8px 8px 0 rgba(0,0,0,0.8)"
                          : "none",
                      aspectRatio: selectedRatio.ratio,
                      maxHeight: "100%",
                    }}
                  >
                    {uploadedImage ? (
                      <div
                        className="w-full h-full overflow-hidden cursor-move relative"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Custom poster preview"
                          className="w-full h-full object-cover transition-all duration-300"
                          style={{
                            filter: selectedFilter.filter,
                            transform: `scale(${zoom}) translate(${
                              position.x / zoom
                            }px, ${position.y / zoom}px)`,
                          }}
                          draggable={false}
                        />
                        {/* Text Overlay */}
                        {textPosition !== "none" && customText && (
                          <div
                            className={`absolute left-0 right-0 text-center px-4 py-2 bg-foreground/80 text-background ${
                              textPosition === "top" ? "top-0" : "bottom-0"
                            }`}
                          >
                            <p className="text-sm md:text-base font-medium tracking-wider uppercase">
                              {customText}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-foreground/40">
                        <ImageIcon className="w-16 h-16 mb-4" />
                        <p className="text-sm">Your poster preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-background/30" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-background/30" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-background/30" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-background/30" />

                {/* Zoom Controls */}
                {uploadedImage && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-foreground/90 rounded-full px-3 py-2">
                    <button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      className="p-1 hover:bg-background/10 rounded-full transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs w-12 text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                      className="p-1 hover:bg-background/10 rounded-full transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-background/20" />
                    <button
                      onClick={resetImage}
                      className="p-1 hover:bg-background/10 rounded-full transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              {uploadedImage && (
                <div className="mt-6 p-6 border border-background/20 rounded-lg bg-background/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-background/60">
                      Your Custom Poster
                    </span>
                    <span className="text-2xl font-light">
                      ₹{selectedSize.price}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-background/40 mb-6">
                    <div className="flex justify-between">
                      <span>Size</span>
                      <span>
                        {selectedSize.name} ({selectedSize.dimensions})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frame</span>
                      <span>{selectedFrame.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Filter</span>
                      <span>{selectedFilter.name}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isProcessing}
                    className="w-full bg-white text-black hover:bg-zinc-200 h-14 font-black uppercase tracking-[0.2em] text-[10px] rounded-full relative overflow-hidden group transition-all duration-500 shadow-xl shadow-white/5"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Initializing...
                      </span>
                    ) : showSuccess ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Secured in Cart
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Gallery
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="order-1 lg:order-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-background text-foreground"
                      : "bg-background/10 text-background/60 hover:bg-background/20"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {/* Upload Tab */}
              {activeTab === "upload" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-medium mb-4">
                    Upload Your Image
                  </h3>
                  <p className="text-background/60 mb-6">
                    Choose a high-resolution image for the best print quality.
                    We recommend at least 2000x3000 pixels.
                  </p>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-background/30 rounded-lg p-12 text-center hover:border-background/60 transition-colors cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-background/60" />
                    </div>
                    <p className="text-background/80 mb-2">
                      Drag and drop your image here
                    </p>
                    <p className="text-sm text-background/40">
                      or click to browse files
                    </p>
                    <p className="text-xs text-background/30 mt-4">
                      Supports: JPG, PNG, WebP (Max 20MB)
                    </p>
                  </div>

                  {uploadedImage && (
                    <div className="mt-6 flex items-center justify-between p-4 bg-background/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm">
                          Image uploaded successfully
                        </span>
                      </div>
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="p-2 hover:bg-background/10 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Frame Tab */}
              {activeTab === "frame" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-medium mb-4">
                    Choose Frame Style
                  </h3>
                  <p className="text-background/60 mb-6">
                    Select a frame style that complements your image.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {frameStyles.map((frame, index) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame)}
                        className={`relative p-4 rounded-lg transition-all duration-300 ${
                          selectedFrame.id === frame.id
                            ? "bg-background text-foreground"
                            : "bg-background/10 hover:bg-background/20"
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div
                          className="aspect-[3/4] mb-3 bg-background/20 mx-auto w-16"
                          style={{
                            border: frame.border.replace(
                              "#000",
                              selectedFrame.id === frame.id ? "#000" : "#fff"
                            ),
                          }}
                        />
                        <span className="text-xs tracking-wider uppercase">
                          {frame.name}
                        </span>
                        {selectedFrame.id === frame.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Aspect Ratio */}
                  <div className="mt-8">
                    <h4 className="text-sm font-medium mb-4 tracking-wider uppercase text-background/60">
                      Aspect Ratio
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {aspectRatios.map((ratio) => (
                        <button
                          key={ratio.id}
                          onClick={() => setSelectedRatio(ratio)}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            selectedRatio.id === ratio.id
                              ? "bg-background text-foreground"
                              : "bg-background/10 hover:bg-background/20"
                          }`}
                        >
                          {ratio.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Tab */}
              {activeTab === "filter" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-medium mb-4">Apply Filter</h3>
                  <p className="text-background/60 mb-6">
                    Enhance your image with our curated filters.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {imageFilters.map((filter, index) => (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter)}
                        className={`relative p-2 rounded-lg transition-all duration-300 ${
                          selectedFilter.id === filter.id
                            ? "ring-2 ring-background"
                            : "hover:bg-background/10"
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="aspect-square mb-2 rounded overflow-hidden bg-background/20">
                          {uploadedImage ? (
                            <img
                              src={uploadedImage || "/placeholder.svg"}
                              alt={filter.name}
                              className="w-full h-full object-cover"
                              style={{ filter: filter.filter }}
                            />
                          ) : (
                            <div
                              className="w-full h-full bg-gradient-to-br from-background/40 to-background/10"
                              style={{ filter: filter.filter }}
                            />
                          )}
                        </div>
                        <span className="text-xs tracking-wider uppercase">
                          {filter.name}
                        </span>
                        {selectedFilter.id === filter.id && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-background text-foreground rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Tab */}
              {activeTab === "size" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-medium mb-4">Select Size</h3>
                  <p className="text-background/60 mb-6">
                    Choose the perfect size for your space.
                  </p>
                  <div className="space-y-3">
                    {posterSizes.map((size, index) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                          selectedSize.id === size.id
                            ? "bg-background text-foreground"
                            : "bg-background/10 hover:bg-background/20"
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex items-center justify-center rounded ${
                              selectedSize.id === size.id
                                ? "bg-foreground/10"
                                : "bg-background/10"
                            }`}
                            style={{
                              width: 20 + index * 8,
                              height: 26 + index * 10,
                            }}
                          >
                            <Layers className="w-3 h-3 opacity-50" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{size.name}</p>
                            <p
                              className={`text-sm ${
                                selectedSize.id === size.id
                                  ? "text-foreground/60"
                                  : "text-background/40"
                              }`}
                            >
                              {size.dimensions}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">${size.price}</span>
                          {selectedSize.id === size.id && (
                            <div className="w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Tab */}
              {activeTab === "text" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-medium mb-4">Add Custom Text</h3>
                  <p className="text-background/60 mb-6">
                    Personalize your poster with a custom caption or title.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-background/60 mb-2 block">
                        Your Text
                      </label>
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Enter your text..."
                        maxLength={50}
                        className="w-full px-4 py-3 bg-background/10 border border-background/20 rounded-lg text-background placeholder:text-background/40 focus:outline-none focus:border-background/40 transition-colors"
                      />
                      <p className="text-xs text-background/40 mt-2">
                        {customText.length}/50 characters
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-background/60 mb-3 block">
                        Text Position
                      </label>
                      <div className="flex gap-3">
                        {[
                          { value: "none", label: "None" },
                          { value: "top", label: "Top" },
                          { value: "bottom", label: "Bottom" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              setTextPosition(
                                option.value as typeof textPosition
                              )
                            }
                            className={`flex-1 py-3 rounded-lg text-sm transition-all ${
                              textPosition === option.value
                                ? "bg-background text-foreground"
                                : "bg-background/10 hover:bg-background/20"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step Indicator */}
            <div className="mt-12 pt-8 border-t border-background/10">
              <div className="flex items-center justify-between">
                {tabs.map((tab, index) => (
                  <div key={tab.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                        tabs.findIndex((t) => t.id === activeTab) >= index
                          ? "bg-background text-foreground"
                          : "bg-background/20 text-background/40"
                      }`}
                    >
                      {tabs.findIndex((t) => t.id === activeTab) > index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < tabs.length - 1 && (
                      <div
                        className={`w-12 md:w-20 h-0.5 mx-2 transition-all ${
                          tabs.findIndex((t) => t.id === activeTab) > index
                            ? "bg-background"
                            : "bg-background/20"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
