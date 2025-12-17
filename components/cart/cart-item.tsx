"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore, type CartItem as CartItemType } from "@/lib/cart-store"
import { allProducts } from "@/lib/products"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const product = allProducts.find((p) => p.id === item.productId)

  if (!product) return null

  return (
    <div className="flex gap-4 md:gap-6 py-6 border-b border-border group">
      {/* Product Image */}
      <Link
        href={`/shop/${product.id}`}
        className="relative w-24 h-32 md:w-32 md:h-40 flex-shrink-0 bg-muted rounded-lg overflow-hidden"
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{product.category}</span>
              <Link href={`/shop/${product.id}`}>
                <h3 className="font-medium text-sm md:text-base hover:underline underline-offset-4 truncate">
                  {product.title}
                </h3>
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              onClick={() => removeItem(item.productId, item.size)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
        </div>

        <div className="flex items-end justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
              className="p-2 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 min-w-[2.5rem] text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
              className="p-2 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-medium">${item.price * item.quantity}</p>
            {item.quantity > 1 && <p className="text-xs text-muted-foreground">${item.price} each</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
