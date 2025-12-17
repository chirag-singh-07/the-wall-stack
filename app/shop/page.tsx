"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CustomPosterBanner } from "@/components/shop/custom-poster-banner"
import { ShopFilters } from "@/components/shop/shop-filters"
import { ProductGrid } from "@/components/shop/product-grid"
import { allProducts, priceRanges } from "@/lib/products"
import { cn } from "@/lib/utils"

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid")
  const [isVisible, setIsVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.title.toLowerCase().includes(query) || product.category.toLowerCase().includes(query),
      )
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category))
    }

    // Filter by price ranges
    if (selectedPriceRanges.length > 0) {
      result = result.filter((product) =>
        selectedPriceRanges.some((rangeIndex) => {
          const range = priceRanges[rangeIndex]
          return product.price >= range.min && product.price < range.max
        }),
      )
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        // Featured - keep original order
        break
    }

    return result
  }, [searchQuery, selectedCategories, selectedPriceRanges, sortBy])

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 md:pt-28">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div
            ref={headerRef}
            className={cn(
              "text-center mb-8 md:mb-12 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">Shop All Posters</h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-balance">
              Explore our complete collection of premium wall art. Find the perfect piece to transform your space.
            </p>
          </div>

          {/* Custom Poster Banner */}
          <div className="mb-8 md:mb-12">
            <CustomPosterBanner />
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8 pb-20">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
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
                  totalResults={filteredProducts.length}
                />
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1">
              {/* Mobile/Tablet Filters */}
              <div className="lg:hidden mb-6">
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
                  totalResults={filteredProducts.length}
                />
              </div>

              {/* Products */}
              <ProductGrid products={filteredProducts} viewMode={viewMode} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
