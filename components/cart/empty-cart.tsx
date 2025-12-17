"use client"

import Link from "next/link"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-3">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Looks like you haven't added any posters to your cart yet. Explore our collection and find the perfect piece for
        your space.
      </p>
      <Link href="/shop">
        <Button size="lg" className="group">
          Browse Collection
          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>

      {/* Decorative elements */}
      <div className="mt-16 grid grid-cols-3 gap-4 max-w-sm opacity-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  )
}
