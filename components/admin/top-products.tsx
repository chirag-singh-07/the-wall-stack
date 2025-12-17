"use client"

import Image from "next/image"
import { useAdminStore } from "@/lib/admin-store"

export function TopProducts() {
  const { products } = useAdminStore()
  const topProducts = products.slice(0, 5)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">Top Products</h3>
        <p className="text-sm text-muted-foreground">Best selling posters this month</p>
      </div>
      <div className="divide-y divide-border">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4 p-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">
              {index + 1}
            </span>
            <div className="relative h-12 w-12 overflow-hidden rounded bg-muted">
              <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.title}</p>
              <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
            </div>
            <p className="font-semibold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
