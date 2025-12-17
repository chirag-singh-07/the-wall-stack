"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet, Building2, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("card")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
          5
        </div>
        <h2 className="text-lg font-semibold">Payment Method</h2>
      </div>

      <div className="pl-11 space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
          <label
            htmlFor="card"
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
              paymentMethod === "card"
                ? "border-foreground bg-muted/50"
                : "border-border hover:border-muted-foreground",
            )}
          >
            <RadioGroupItem value="card" id="card" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Credit / Debit Card</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
              </div>
            </div>
          </label>

          <label
            htmlFor="paypal"
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
              paymentMethod === "paypal"
                ? "border-foreground bg-muted/50"
                : "border-border hover:border-muted-foreground",
            )}
          >
            <RadioGroupItem value="paypal" id="paypal" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-xs text-muted-foreground">Pay with your PayPal account</p>
              </div>
            </div>
          </label>

          <label
            htmlFor="bank"
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
              paymentMethod === "bank"
                ? "border-foreground bg-muted/50"
                : "border-border hover:border-muted-foreground",
            )}
          >
            <RadioGroupItem value="bank" id="bank" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Bank Transfer</p>
                <p className="text-xs text-muted-foreground">Direct bank payment</p>
              </div>
            </div>
          </label>
        </RadioGroup>

        {paymentMethod === "card" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm">
                Card Number
              </Label>
              <div className="relative">
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="bg-background pl-10" />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-sm">
                  Expiry Date
                </Label>
                <Input id="expiry" placeholder="MM / YY" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm">
                  CVV
                </Label>
                <Input id="cvv" placeholder="123" className="bg-background" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-sm">
                Name on Card
              </Label>
              <Input id="cardName" placeholder="John Doe" className="bg-background" />
            </div>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div className="p-6 rounded-xl bg-muted/30 border border-dashed border-border text-center animate-in fade-in slide-in-from-top-2 duration-300">
            <Wallet className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              You will be redirected to PayPal to complete your payment securely.
            </p>
          </div>
        )}

        {paymentMethod === "bank" && (
          <div className="p-6 rounded-xl bg-muted/30 border border-dashed border-border animate-in fade-in slide-in-from-top-2 duration-300">
            <Building2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center mb-4">
              Bank transfer details will be provided after order confirmation.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Bank:</span> Poster Art Bank
              </p>
              <p>
                <span className="font-medium">Account:</span> 1234567890
              </p>
              <p>
                <span className="font-medium">Routing:</span> 987654321
              </p>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  )
}
