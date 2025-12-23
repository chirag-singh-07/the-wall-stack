"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CustomPosterBanner } from "@/components/shop/custom-poster-banner";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { getPostersForShop } from "@/actions/admin/poster-actions";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ShopPage() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const fetchPosters = useCallback(async () => {
    setLoading(true);

    // Calculate min/max price from ranges if any
    let minPrice = undefined;
    let maxPrice = undefined;
    if (selectedPriceRanges.length > 0) {
      // For simplicity, we'll take the broadest range if multiple selected
      // Or just map them. My getPostersForShop action currently takes single min/max.
      // I'll adjust it or just use the first one for now.
      const ranges = [
        { min: 0, max: 50 },
        { min: 50, max: 60 },
        { min: 60, max: 70 },
        { min: 70, max: 999 },
      ];
      const selectedRanges = selectedPriceRanges.map((idx) => ranges[idx]);
      minPrice = Math.min(...selectedRanges.map((r) => r.min));
      maxPrice = Math.max(...selectedRanges.map((r) => r.max));
    }

    const result = await getPostersForShop({
      search: searchQuery,
      categories: selectedCategories,
      minPrice,
      maxPrice,
      sort: sortBy,
    });

    if (result.success) {
      setPosters(result.data || []);
    } else {
      toast.error("Failed to load posters");
    }
    setLoading(false);
  }, [searchQuery, selectedCategories, selectedPriceRanges, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosters();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchPosters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <div className="pt-24 md:pt-28">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div
            ref={headerRef}
            className={cn(
              "text-center mb-8 md:mb-12 transition-all duration-1000",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4">
              Premium <span className="text-primary italic">Posters</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg font-light">
              Transform your space with our curated collection of high-quality
              wall art.
            </p>
          </div>

          {/* Custom Poster Banner */}
          <div className="mb-12">
            <CustomPosterBanner />
          </div>

          {/* Main Content */}

          <div className="flex flex-col lg:flex-row gap-12 pb-20">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28 space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-6">Discovery</h2>
                  <ShopFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategories={selectedCategories}
                    onCategoryChange={setSelectedCategories}
                    selectedPriceRanges={selectedPriceRanges}
                    onPriceRangeChange={setSelectedPriceRanges}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalResults={posters.length}
                    availableCategories={posters.reduce(
                      (acc: any[], p: any) => {
                        if (
                          p.category &&
                          !acc.find((c) => c.id === p.category.id)
                        ) {
                          acc.push(p.category);
                        }
                        return acc;
                      },
                      []
                    )}
                  />
                </div>
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1">
              {/* Mobile/Tablet Filters */}
              <div className="lg:hidden mb-8">
                <ShopFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                  selectedPriceRanges={selectedPriceRanges}
                  onPriceRangeChange={setSelectedPriceRanges}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  totalResults={posters.length}
                />
              </div>

              {/* Products */}
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-4 animate-pulse">
                      <div className="aspect-3/4 bg-muted rounded-xl" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <ProductGrid products={posters} viewMode={viewMode} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
