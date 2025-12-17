"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, SlidersHorizontal, X, Grid3X3, LayoutGrid } from "lucide-react"
import { collections, priceRanges, sortOptions } from "@/lib/products"
import { cn } from "@/lib/utils"

interface ShopFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  selectedPriceRanges: number[]
  onPriceRangeChange: (ranges: number[]) => void
  sortBy: string
  onSortChange: (value: string) => void
  viewMode: "grid" | "large"
  onViewModeChange: (mode: "grid" | "large") => void
  totalResults: number
}

export function ShopFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedPriceRanges,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
}: ShopFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const handlePriceRangeToggle = (index: number) => {
    if (selectedPriceRanges.includes(index)) {
      onPriceRangeChange(selectedPriceRanges.filter((r) => r !== index))
    } else {
      onPriceRangeChange([...selectedPriceRanges, index])
    }
  }

  const clearFilters = () => {
    onSearchChange("")
    onCategoryChange([])
    onPriceRangeChange([])
    onSortChange("featured")
  }

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedPriceRanges.length > 0

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Categories</Label>
        <div className="space-y-2">
          {collections.map((collection) => (
            <div key={collection.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${collection.id}`}
                checked={selectedCategories.includes(collection.id)}
                onCheckedChange={() => handleCategoryToggle(collection.id)}
              />
              <label
                htmlFor={`category-${collection.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {collection.title}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <div key={range.label} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${index}`}
                checked={selectedPriceRanges.includes(index)}
                onCheckedChange={() => handlePriceRangeToggle(index)}
              />
              <label
                htmlFor={`price-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full bg-transparent">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posters..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px] bg-muted/50 border-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border rounded-lg overflow-hidden bg-muted/50">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("large")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "large" ? "bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden bg-muted/50 border-0">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                    {selectedCategories.length + selectedPriceRanges.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Results Count and Active Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{totalResults}</span> posters
        </p>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs font-medium"
              >
                {collections.find((c) => c.id === category)?.title}
                <button onClick={() => handleCategoryToggle(category)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedPriceRanges.map((index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs font-medium"
              >
                {priceRanges[index].label}
                <button onClick={() => handlePriceRangeToggle(index)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sidebar Filters (visible on lg screens) */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </div>
  )
}
