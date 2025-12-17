"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/cart-store"
import { Tag, Truck, Shield, RotateCcw, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function OrderSummary() {
  const { getCartTotal, getCartCount } = useCartStore()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState("")

  const subtotal = getCartTotal()
  const itemCount = getCartCount()
  const shippingThreshold = 75
  const freeShipping = subtotal >= shippingThreshold
  const shipping = freeShipping ? 0 : 9.99
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "poster10") {
      setPromoApplied(true)
      setPromoError("")
    } else {
      setPromoError("Invalid promo code")
      setPromoApplied(false)
    }
  }

  return (
    <div className="bg-muted/30 rounded-2xl p-6 md:p-8 space-y-6 border border-border">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      {/* Promo Code */}
      <div className="space-y-3">
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
        <p className="text-xs text-muted-foreground">Try "POSTER10" for 10% off</p>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
            <span>Discount (10%)</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className={cn(freeShipping && "text-green-600 dark:text-green-400")}>
            {freeShipping ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {!freeShipping && (
          <div className="bg-background rounded-lg p-3 border border-dashed border-border">
            <p className="text-xs text-muted-foreground">
              Add <span className="font-medium text-foreground">${(shippingThreshold - subtotal).toFixed(2)}</span> more
              to get <span className="font-medium text-foreground">free shipping</span>
            </p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between text-base font-semibold pt-3 border-t border-border">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button asChild className="w-full h-12 text-base group">
        <Link href="/checkout">
          Proceed to Checkout
          <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
        <div className="text-center space-y-1.5">
          <div className="w-8 h-8 mx-auto rounded-full bg-background flex items-center justify-center border border-border">
            <Truck className="h-4 w-4" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">Free Shipping $75+</p>
        </div>
        <div className="text-center space-y-1.5">
          <div className="w-8 h-8 mx-auto rounded-full bg-background flex items-center justify-center border border-border">
            <Shield className="h-4 w-4" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">Secure Payment</p>
        </div>
        <div className="text-center space-y-1.5">
          <div className="w-8 h-8 mx-auto rounded-full bg-background flex items-center justify-center border border-border">
            <RotateCcw className="h-4 w-4" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">30 Day Returns</p>
        </div>
      </div>
    </div>
  )
}
