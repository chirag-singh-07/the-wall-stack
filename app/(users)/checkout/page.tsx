"use client"

import { useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/lib/cart-store"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { OrderSuccess } from "@/components/checkout/order-success"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChevronRight, ShoppingBag, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate order ID
    const newOrderId = `POS-${Date.now().toString(36).toUpperCase()}`
    setOrderId(newOrderId)

    // Clear cart and show success
    clearCart()
    setOrderComplete(true)
    setIsProcessing(false)
  }

  if (orderComplete) {
    return (
      <>
        <Navbar />
        <main className="pt-20">
          <OrderSuccess orderId={orderId} />
        </main>
        <Footer />
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-20">
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground">Add some beautiful posters to your cart before checking out.</p>
              </div>
              <Button asChild size="lg">
                <Link href="/shop">Browse Shop</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground py-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/cart" className="hover:text-foreground transition-colors">
              Cart
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="h-5 w-5" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Secure Checkout</h1>
            </div>
            <p className="text-muted-foreground">Complete your order in just a few steps</p>
          </div>

          {/* Checkout Content */}
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-10">
              <CheckoutForm shippingMethod={shippingMethod} onShippingMethodChange={setShippingMethod} />
              <PaymentForm />
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <CheckoutSummary
                shippingMethod={shippingMethod}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
