"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, Mail, ArrowRight, Download } from "lucide-react"

interface OrderSuccessProps {
  orderId: string
}

export function OrderSuccess({ orderId }: OrderSuccessProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-foreground text-background flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-foreground/20 animate-ping" />
        </div>

        {/* Success Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-muted/30 rounded-2xl p-6 space-y-4 border border-border text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order Number</span>
            <span className="font-mono font-medium">{orderId}</span>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Confirmation Email Sent</p>
              <p className="text-xs text-muted-foreground truncate">
                Check your inbox for order details and tracking info
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Estimated Delivery</p>
              <p className="text-xs text-muted-foreground">5-7 business days</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full h-12 text-base group">
            <Link href="/shop">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button variant="outline" className="w-full h-12 text-base bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>

        {/* Support Note */}
        <p className="text-xs text-muted-foreground">
          Questions about your order?{" "}
          <span className="underline cursor-pointer hover:text-foreground">Contact Support</span>
        </p>
      </div>
    </div>
  )
}
