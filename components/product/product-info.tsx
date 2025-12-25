"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface ProductInfoProps {
  productId: string;
  title: string;
  price: number;
  category: string;
  description: string;
  sizes: { name: string; price: number }[];
  details: string[];
}

export function ProductInfo({
  productId,
  title,
  price,
  category,
  description,
  sizes,
  details,
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(1); // Default to A3
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const currentPrice = sizes[selectedSize]?.price || price;
  const currentSizeName = sizes[selectedSize]?.name || "A3 (30×42cm)";

  const handleAddToCart = () => {
    addItem(productId, currentSizeName, currentPrice, quantity);
    setIsAdded(true);
    toast.success(`Added ${quantity} x ${title} to cart`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Category & Title */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
          {category} Collection
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          {title}
        </h1>
        <p className="text-2xl md:text-3xl font-light">
          {formatPrice(currentPrice)}
        </p>
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {/* Size Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Select Size</span>
          <button className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sizes.map((size, index) => (
            <button
              key={size.name}
              onClick={() => setSelectedSize(index)}
              className={cn(
                "p-4 rounded-lg border-2 text-left transition-all duration-200",
                selectedSize === index
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground/50"
              )}
            >
              <span className="block text-sm font-medium">{size.name}</span>
              <span
                className={cn(
                  "block text-sm mt-1",
                  selectedSize === index
                    ? "text-background/70"
                    : "text-muted-foreground"
                )}
              >
                {formatPrice(size.price)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 text-lg hover:bg-muted transition-colors"
            >
              −
            </button>
            <span className="px-4 py-2 min-w-12 text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 text-lg hover:bg-muted transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            Total: {formatPrice(currentPrice * quantity)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className={cn(
            "flex-1 h-14 text-base transition-all",
            isAdded && "bg-green-600 hover:bg-green-600"
          )}
          onClick={handleAddToCart}
        >
          {isAdded ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className={cn(
            "h-14 w-14 transition-colors",
            isWishlisted &&
              "bg-foreground text-background hover:bg-foreground/90"
          )}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-14 w-14 bg-transparent"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Product Details */}
      <div className="border-t pt-8 space-y-4">
        <h3 className="text-sm font-medium uppercase tracking-wider">
          Product Details
        </h3>
        <ul className="space-y-3">
          {details.map((detail, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <Check className="h-4 w-4 text-foreground" />
              {detail}
            </li>
          ))}
        </ul>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Truck className="h-5 w-5" />
          </div>
          <p className="text-xs text-muted-foreground">
            Free Shipping
            <br />
            Orders ₹2999+
          </p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <p className="text-xs text-muted-foreground">
            Quality
            <br />
            Guaranteed
          </p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-muted flex items-center justify-center">
            <RotateCcw className="h-5 w-5" />
          </div>
          <p className="text-xs text-muted-foreground">
            30 Day
            <br />
            Returns
          </p>
        </div>
      </div>
    </div>
  );
}
