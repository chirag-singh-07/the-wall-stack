"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import {
  CheckoutForm,
  type CheckoutFormData,
} from "@/components/checkout/checkout-form";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { OrderSuccess } from "@/components/checkout/order-success";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChevronRight, ShoppingBag, Lock, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/actions/user/checkout-actions";
import {
  getUserAddress,
  saveUserAddress,
} from "@/actions/user/address-actions";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function CheckoutPage() {
  const { items, clearCart, getCartTotal } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "IN",
    shippingMethod: "standard",
    sameAsBilling: true,
  });

  const calculateTotal = () => {
    const subtotal = getCartTotal();
    let shipping = 99; // Base shipping in INR
    if (formData.shippingMethod === "free" && subtotal >= 2999) shipping = 0;
    if (formData.shippingMethod === "express") shipping = 199;
    if (formData.shippingMethod === "standard") shipping = 99;

    // Simple tax calc as per summary
    const tax = subtotal * 0.18; // 18% GST for India
    return subtotal + shipping + tax;
  };

  // Load user's saved address on mount
  useEffect(() => {
    const loadUserAddress = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user?.id) {
          const result = await getUserAddress(session.user.id);
          if (result.success && result.data) {
            const userData = result.data;
            setFormData((prev) => ({
              ...prev,
              address: userData.address || "",
              apartment: userData.apartment || "",
              city: userData.city || "",
              state: userData.state || "",
              zip: userData.postalCode || "",
              country: userData.country || "IN",
            }));
          }
        }
      } catch (error) {
        console.error("Error loading address:", error);
      }
    };

    loadUserAddress();
  }, []);

  const handlePlaceOrder = async () => {
    // Validation
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.zip) newErrors.zip = "Postal code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the errors in the form");
      return;
    }

    setErrors({});

    setIsProcessing(true);

    try {
      // Get session user id if logged in
      const { data: session } = await authClient.getSession();

      const totalPrice = calculateTotal();

      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      }));

      const res = await createOrder({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address} ${
          formData.apartment ? formData.apartment : ""
        } ${formData.city}, ${formData.state} ${formData.zip}`,
        city: formData.city,
        postalCode: formData.zip,
        country: formData.country,
        total: totalPrice,
        items: orderItems,
        userId: session?.user?.id,
      });

      if (res.success && res.data) {
        setOrderId(res.data.id);
        clearCart();
        setOrderComplete(true);
        toast.success("Order placed successfully!");

        // Save address for future use
        if (session?.user?.id) {
          await saveUserAddress(session.user.id, {
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            postalCode: formData.zip,
            country: formData.country,
          });
        }
      } else {
        toast.error(res.error || "Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <>
        <Navbar />
        <main className="pt-20">
          <OrderSuccess orderId={orderId} />
        </main>
        <Footer />
      </>
    );
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
                <p className="text-muted-foreground">
                  Add some beautiful posters to your cart before checking out.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/shop">Browse Shop</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
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
            <Link
              href="/cart"
              className="hover:text-foreground transition-colors"
            >
              Cart
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="h-5 w-5" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Secure Checkout
              </h1>
            </div>
            <p className="text-muted-foreground">
              Complete your order in just a few steps
            </p>
          </div>

          {/* Checkout Content */}
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-10">
              <CheckoutForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />

              {/* Payment Method - COD Only */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
                    {/* Previous step was 3 in form, this is conceptually 4 if billing is merged or separate.
                        In CheckoutForm component, Billing was 4. But we removed payment form. 
                        Let's just make it clear visually. */}
                    Payment
                  </div>
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                </div>

                <div className="pl-11">
                  <div className="p-4 rounded-xl border border-foreground bg-muted/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border">
                        <Banknote className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when your order arrives
                        </p>
                      </div>
                    </div>
                    <div className="h-4 w-4 rounded-full border-[5px] border-foreground" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Note: We will call you to confirm your order before
                    shipping.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <CheckoutSummary
                shippingMethod={formData.shippingMethod}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
