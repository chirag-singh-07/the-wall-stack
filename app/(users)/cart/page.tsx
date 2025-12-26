"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartItem } from "@/components/cart/cart-item";
import { OrderSummary } from "@/components/cart/order-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { CartRecommendations } from "@/components/cart/cart-recommendations";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CartPage() {
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-40 bg-muted rounded-lg" />
                  ))}
                </div>
                <div className="h-96 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Shopping Cart</span>
          </nav>

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Shopping Cart
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {items.length} {items.length === 1 ? "item" : "items"} in
                    your cart
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared");
                  }}
                >
                  Clear Cart
                </Button>
              </div>

              {/* Cart Content */}
              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="border-t border-border">
                    {items.map((item) => (
                      <CartItem
                        key={`${item.productId}-${item.size}`}
                        item={item}
                      />
                    ))}
                  </div>

                  {/* Continue Shopping */}
                  <Link href="/shop">
                    <Button variant="ghost" className="mt-6 group">
                      <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="lg:sticky lg:top-24">
                    <OrderSummary />
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <CartRecommendations />
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
