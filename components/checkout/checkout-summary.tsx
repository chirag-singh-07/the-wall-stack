"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tag, Check, Truck, Shield, RotateCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CheckoutSummaryProps {
  shippingMethod: string;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

export function CheckoutSummary({
  shippingMethod,
  onPlaceOrder,
  isProcessing,
}: CheckoutSummaryProps) {
  const { items, getCartTotal, getItemDetails } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const subtotal = getCartTotal();

  const getShippingCost = () => {
    if (shippingMethod === "free" && subtotal >= 75) return 0;
    if (shippingMethod === "express") return 19.99;
    if (shippingMethod === "standard") return 9.99;
    return subtotal >= 75 ? 0 : 9.99;
  };

  const shipping = getShippingCost();
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal + shipping - discount + tax;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "poster10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
    }
  };

  return (
    <div className="bg-muted/30 rounded-2xl p-6 space-y-6 border border-border sticky top-24">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      {/* Cart Items Preview */}
      <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
        {items.map((item) => {
          const details = getItemDetails(item);
          if (!details) return null;

          return (
            <div key={`${item.productId}-${item.size}`} className="flex gap-3">
              <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                <Image
                  src={details.image || "/placeholder.svg"}
                  alt={details.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-medium">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{details.title}</p>
                <p className="text-xs text-muted-foreground">{item.size}</p>
                <p className="text-sm font-medium mt-1">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Promo Code */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Promo Code
        </label>
        <div className="flex gap-2">
          <Input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            className="bg-background"
            disabled={promoApplied}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleApplyPromo}
            disabled={!promoCode || promoApplied}
            className="bg-transparent shrink-0"
          >
            {promoApplied ? <Check className="h-4 w-4" /> : "Apply"}
          </Button>
        </div>
        {promoError && <p className="text-xs text-destructive">{promoError}</p>}
        {promoApplied && (
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <Check className="h-3 w-3" /> 10% discount applied
          </p>
        )}
      </div>

      <Separator />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
            <span>Discount (10%)</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span
            className={cn(
              shipping === 0 && "text-green-600 dark:text-green-400"
            )}
          >
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <Separator />

        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        className="w-full h-12 text-base"
        onClick={onPlaceOrder}
        disabled={isProcessing || items.length === 0}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${formatPrice(total)}`
        )}
      </Button>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
        <div className="text-center space-y-1.5">
          <div className="w-8 h-8 mx-auto rounded-full bg-background flex items-center justify-center border border-border">
            <Truck className="h-4 w-4" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Fast Shipping
          </p>
        </div>
        <div className="text-center space-y-1.5">
          <div className="w-8 h-8 mx-auto rounded-full bg-background flex items-center justify-center border border-border">
            <Shield className="h-4 w-4" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Secure Checkout
          </p>
        </div>
        <div className="text-center space-y-1.5">
          <div className="w-8 h-8 mx-auto rounded-full bg-background flex items-center justify-center border border-border">
            <RotateCcw className="h-4 w-4" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Easy Returns
          </p>
        </div>
      </div>

      {/* Terms */}
      <p className="text-[10px] text-muted-foreground text-center">
        By placing your order, you agree to our{" "}
        <span className="underline cursor-pointer hover:text-foreground">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="underline cursor-pointer hover:text-foreground">
          Privacy Policy
        </span>
      </p>
    </div>
  );
}
