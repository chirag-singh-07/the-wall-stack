"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  checkWishlistStatus,
  toggleWishlist,
} from "@/actions/user/wishlist-actions";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: { product: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = authClient.useSession();
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (session?.user?.id && product?.id) {
      checkWishlistStatus(session.user.id, product.id).then((res) => {
        if (res.success) setInWishlist(res.inWishlist || false);
      });
    }
  }, [session?.user?.id, product?.id]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    const prev = inWishlist;
    setInWishlist(!prev);

    try {
      const res = await toggleWishlist(session.user.id, product.id);
      if (!res.success) {
        setInWishlist(prev);
        toast.error(res.error);
      } else {
        toast.success(
          res.action === "added" ? "Added to wishlist" : "Removed from wishlist"
        );
      }
    } catch (err) {
      setInWishlist(prev);
      toast.error("Something went wrong");
    }
  };

  // Use slug if available, otherwise fallback to id
  const identifier = product.slug || product.id;
  const displayPrice =
    typeof product.price === "number"
      ? product.price
      : parseFloat(product.price);

  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Default to A3 size for quick add
    const defaultSize = "A3 (30×42cm)";
    const price =
      typeof product.price === "number"
        ? product.price
        : parseFloat(product.price);

    addItem(product.id, defaultSize, price, 1);
    toast.success(`Added ${product.title} to cart`);
  };

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-muted rounded-lg mb-4 border border-border/50">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          )}
        />
        <div
          className={cn(
            "absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 z-10",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Button
            className="flex-1 shadow-lg"
            size="sm"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Link href={`/shop/${identifier}`}>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/90 hover:bg-background shadow-lg"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Decorative corner elements */}
        <div
          className={cn(
            "absolute top-4 left-4 w-6 h-6 border-l border-t border-background/80 transition-all duration-500",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        />
        <div
          className={cn(
            "absolute top-4 right-4 z-20 transition-all duration-300",
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 md:opacity-100 md:translate-y-0"
          )}
        >
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "h-8 w-8 rounded-full shadow-md transition-colors",
              inWishlist
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-background/80 hover:bg-background"
            )}
            onClick={handleWishlist}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          </Button>
        </div>
      </div>
      <Link href={`/shop/${identifier}`} className="block space-y-1 group">
        <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
          {product.title}
        </h3>
        <p className="text-muted-foreground font-light">
          {formatPrice(displayPrice)}
        </p>
      </Link>
    </div>
  );
}
