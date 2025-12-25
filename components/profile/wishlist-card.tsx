"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useUserStore } from "@/lib/user-store";
import type { Product } from "@/lib/products";

interface WishlistCardProps {
  product: Product;
}

export function WishlistCard({ product }: WishlistCardProps) {
  const { addItem } = useCartStore();
  const { removeFromWishlist } = useUserStore();

  const handleAddToCart = () => {
    addItem(product.id, "A3 (30×42cm)", product.price, 1);
  };

  return (
    <div className="group border border-border hover:border-foreground/30 transition-all duration-300">
      {/* Image */}
      <Link
        href={`/shop/${product.id}`}
        className="block relative aspect-3/4 overflow-hidden bg-muted"
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            removeFromWishlist(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="w-full gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/shop/${product.id}`}>
              <h3 className="font-medium hover:underline">{product.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground capitalize">
              {product.category}
            </p>
          </div>
          <p className="font-semibold">${product.price}</p>
        </div>
      </div>
    </div>
  );
}
