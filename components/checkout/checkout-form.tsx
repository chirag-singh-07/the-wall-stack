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
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  <SelectItem value="AN">
                    Andaman and Nicobar Islands
                  </SelectItem>
                  <SelectItem value="AP">Andhra Pradesh</SelectItem>
                  <SelectItem value="AR">Arunachal Pradesh</SelectItem>
                  <SelectItem value="AS">Assam</SelectItem>
                  <SelectItem value="BR">Bihar</SelectItem>
                  <SelectItem value="CH">Chandigarh</SelectItem>
                  <SelectItem value="CT">Chhattisgarh</SelectItem>
                  <SelectItem value="DN">
                    Dadra and Nagar Haveli and Daman and Diu
                  </SelectItem>
                  <SelectItem value="DL">Delhi</SelectItem>
                  <SelectItem value="GA">Goa</SelectItem>
                  <SelectItem value="GJ">Gujarat</SelectItem>
                  <SelectItem value="HR">Haryana</SelectItem>
                  <SelectItem value="HP">Himachal Pradesh</SelectItem>
                  <SelectItem value="JK">Jammu and Kashmir</SelectItem>
                  <SelectItem value="JH">Jharkhand</SelectItem>
                  <SelectItem value="KA">Karnataka</SelectItem>
                  <SelectItem value="KL">Kerala</SelectItem>
                  <SelectItem value="LA">Ladakh</SelectItem>
                  <SelectItem value="LD">Lakshadweep</SelectItem>
                  <SelectItem value="MP">Madhya Pradesh</SelectItem>
                  <SelectItem value="MH">Maharashtra</SelectItem>
                  <SelectItem value="MN">Manipur</SelectItem>
                  <SelectItem value="ML">Meghalaya</SelectItem>
                  <SelectItem value="MZ">Mizoram</SelectItem>
                  <SelectItem value="NL">Nagaland</SelectItem>
                  <SelectItem value="OR">Odisha</SelectItem>
                  <SelectItem value="PY">Puducherry</SelectItem>
                  <SelectItem value="PB">Punjab</SelectItem>
                  <SelectItem value="RJ">Rajasthan</SelectItem>
                  <SelectItem value="SK">Sikkim</SelectItem>
                  <SelectItem value="TN">Tamil Nadu</SelectItem>
                  <SelectItem value="TG">Telangana</SelectItem>
                  <SelectItem value="TR">Tripura</SelectItem>
                  <SelectItem value="UP">Uttar Pradesh</SelectItem>
                  <SelectItem value="UT">Uttarakhand</SelectItem>
                  <SelectItem value="WB">West Bengal</SelectItem>
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
                <SelectItem value="IN">India</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="AE">United Arab Emirates</SelectItem>
                <SelectItem value="SG">Singapore</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="JP">Japan</SelectItem>
                <SelectItem value="CN">China</SelectItem>
                <SelectItem value="BR">Brazil</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
                <SelectItem value="ES">Spain</SelectItem>
                <SelectItem value="NL">Netherlands</SelectItem>
                <SelectItem value="SE">Sweden</SelectItem>
                <SelectItem value="NO">Norway</SelectItem>
                <SelectItem value="DK">Denmark</SelectItem>
                <SelectItem value="FI">Finland</SelectItem>
                <SelectItem value="CH">Switzerland</SelectItem>
                <SelectItem value="AT">Austria</SelectItem>
                <SelectItem value="BE">Belgium</SelectItem>
                <SelectItem value="PL">Poland</SelectItem>
                <SelectItem value="PT">Portugal</SelectItem>
                <SelectItem value="GR">Greece</SelectItem>
                <SelectItem value="CZ">Czech Republic</SelectItem>
                <SelectItem value="HU">Hungary</SelectItem>
                <SelectItem value="RO">Romania</SelectItem>
                <SelectItem value="NZ">New Zealand</SelectItem>
                <SelectItem value="ZA">South Africa</SelectItem>
                <SelectItem value="KR">South Korea</SelectItem>
                <SelectItem value="TH">Thailand</SelectItem>
                <SelectItem value="MY">Malaysia</SelectItem>
                <SelectItem value="ID">Indonesia</SelectItem>
                <SelectItem value="PH">Philippines</SelectItem>
                <SelectItem value="VN">Vietnam</SelectItem>
                <SelectItem value="SA">Saudi Arabia</SelectItem>
                <SelectItem value="QA">Qatar</SelectItem>
                <SelectItem value="KW">Kuwait</SelectItem>
                <SelectItem value="OM">Oman</SelectItem>
                <SelectItem value="BH">Bahrain</SelectItem>
                <SelectItem value="IL">Israel</SelectItem>
                <SelectItem value="TR">Turkey</SelectItem>
                <SelectItem value="EG">Egypt</SelectItem>
                <SelectItem value="NG">Nigeria</SelectItem>
                <SelectItem value="KE">Kenya</SelectItem>
                <SelectItem value="AR">Argentina</SelectItem>
                <SelectItem value="CL">Chile</SelectItem>
                <SelectItem value="CO">Colombia</SelectItem>
                <SelectItem value="PE">Peru</SelectItem>
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
