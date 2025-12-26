"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Home,
  Truck,
  Zap,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shippingMethod: string;
  sameAsBilling: boolean;
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
  errors?: Partial<Record<keyof CheckoutFormData, string>>;
}

export function CheckoutForm({
  formData,
  setFormData,
  errors = {},
}: CheckoutFormProps) {
  const handleChange = (field: keyof CheckoutFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
            1
          </div>
          <h2 className="text-lg font-semibold">Contact Information</h2>
        </div>

        <div className="pl-11 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="flex items-center gap-2 text-sm"
              >
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                className={cn(
                  "bg-background",
                  errors.firstName && "border-destructive"
                )}
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="bg-background"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className={cn(
                "bg-background",
                errors.email && "border-destructive"
              )}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="bg-background"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
            2
          </div>
          <h2 className="text-lg font-semibold">Shipping Address</h2>
        </div>

        <div className="pl-11 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="flex items-center gap-2 text-sm"
            >
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              Street Address
            </Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              className={cn(
                "bg-background",
                errors.address && "border-destructive"
              )}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            {errors.address && (
              <p className="text-xs text-destructive mt-1">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="apartment"
              className="flex items-center gap-2 text-sm"
            >
              <Building className="h-3.5 w-3.5 text-muted-foreground" />
              Apartment, suite, etc. (optional)
            </Label>
            <Input
              id="apartment"
              placeholder="Apt 4B"
              className="bg-background"
              value={formData.apartment}
              onChange={(e) => handleChange("apartment", e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm">
                City
              </Label>
              <Input
                id="city"
                placeholder="New York"
                className="bg-background"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm">
                State
              </Label>
              <Select
                onValueChange={(val) => handleChange("state", val)}
                value={formData.state}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip" className="text-sm">
                ZIP Code
              </Label>
              <Input
                id="zip"
                placeholder="10001"
                className="bg-background"
                value={formData.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="country"
              className="flex items-center gap-2 text-sm"
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Country
            </Label>
            <Select
              onValueChange={(val) => handleChange("country", val)}
              value={formData.country}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
            3
          </div>
          <h2 className="text-lg font-semibold">Shipping Method</h2>
        </div>

        <div className="pl-11">
          <RadioGroup
            value={formData.shippingMethod}
            onValueChange={(val) => handleChange("shippingMethod", val)}
            className="space-y-3"
          >
            <label
              htmlFor="standard"
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                formData.shippingMethod === "standard"
                  ? "border-foreground bg-muted/50"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem value="standard" id="standard" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      5-7 business days
                    </p>
                  </div>
                </div>
              </div>
              <span className="font-medium">{formatPrice(9.99)}</span>
            </label>

            <label
              htmlFor="express"
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                formData.shippingMethod === "express"
                  ? "border-foreground bg-muted/50"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem value="express" id="express" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      2-3 business days
                    </p>
                  </div>
                </div>
              </div>
              <span className="font-medium">{formatPrice(19.99)}</span>
            </label>

            <label
              htmlFor="free"
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                formData.shippingMethod === "free"
                  ? "border-foreground bg-muted/50"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem value="free" id="free" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      7-10 business days (orders $75+)
                    </p>
                  </div>
                </div>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">
                FREE
              </span>
            </label>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
