"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Pencil,
  Check,
  X,
  Loader2,
  Save,
  Building2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileHeader } from "@/components/profile/profile-header";
import { authClient } from "@/lib/auth-client";
import { getUserAddress, updateUserAddress } from "@/actions/user/user-actions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AddressesPage() {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.id) {
      getUserAddress(session.user.id).then((res) => {
        if (res.success && res.address) {
          const data = {
            address: res.address.address || "",
            apartment: res.address.apartment || "",
            city: res.address.city || "",
            state: res.address.state || "",
            postalCode: res.address.postalCode || "",
            country: res.address.country || "India",
            phone: res.address.phone || "",
          };
          setFormData(data);
          setInitialData(data);
        }
        setLoading(false);
      });
    } else if (!session && !loading) {
      setLoading(false);
    }
  }, [session, loading]);

  const handleSave = async () => {
    if (!session?.user) return;

    // Basic validation
    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      toast.error("Please fill in all required address fields");
      return;
    }

    setIsSaving(true);
    const res = await updateUserAddress(session.user.id, formData);

    if (res.success) {
      toast.success("Address updated successfully");
      setInitialData({ ...formData });
      setIsEditing(false);
    } else {
      toast.error("Failed to update address");
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({ ...initialData });
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );

  const FormField = ({
    label,
    id,
    value,
    placeholder,
    required = false,
    icon: Icon,
  }: any) => (
    <div className="space-y-3">
      <Label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground flex items-center gap-2"
      >
        {Icon && <Icon className="w-3 h-3" />}
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key={`edit-${id}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <Input
              id={id}
              value={value}
              onChange={(e) =>
                setFormData({ ...formData, [id]: e.target.value })
              }
              placeholder={placeholder}
              className="h-12 border-2 border-foreground/10 focus:border-foreground rounded-none bg-transparent font-bold"
            />
          </motion.div>
        ) : (
          <motion.div
            key={`view-${id}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="h-12 flex items-center border-b-2 border-foreground/5"
          >
            <span
              className={cn(
                "text-lg font-bold uppercase tracking-tight",
                !value && "text-muted-foreground/40 italic"
              )}
            >
              {value || "Not Set"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-foreground selection:text-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-12 pb-24 mt-20">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-64">
            <ProfileSidebar />
          </aside>

          <div className="flex-1">
            <ProfileHeader
              title="Shipping Protocol"
              subtitle="Manage your primary delivery coordinates"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 border-[3px] border-foreground bg-card relative overflow-hidden"
            >
              {/* Decorative Element */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-foreground transform rotate-12 opacity-5 pointer-events-none" />
              <div className="absolute top-0 right-0 text-[80px] font-black text-foreground/3 leading-none select-none pointer-events-none -mr-4 -mt-4 uppercase tracking-tighter">
                ZONE
              </div>

              {/* Header Action Bar */}
              <div className="flex items-center justify-between p-8 border-b-[3px] border-foreground bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center border-2 border-transparent">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-sm">
                      Primary Location
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Default Shipping Address
                    </p>
                  </div>
                </div>

                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="rounded-none bg-foreground text-background font-black uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-0 active:translate-y-0"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-2" />
                    Update Coordinates
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="rounded-none border-2 border-foreground font-black uppercase tracking-widest"
                    >
                      <X className="w-3.5 h-3.5 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-none bg-foreground text-background font-black uppercase tracking-widest"
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5 mr-2" />
                      )}
                      Save Coordinates
                    </Button>
                  </div>
                )}
              </div>

              {/* Form Content */}
              <div className="p-8 md:p-12 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    id="address"
                    label="Street Address"
                    value={formData.address}
                    placeholder="123 Main St"
                    required
                    icon={MapPin}
                  />
                  <FormField
                    id="apartment"
                    label="Apartment / Suite"
                    value={formData.apartment}
                    placeholder="Apt 4B (Optional)"
                    icon={Building2}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    id="city"
                    label="City"
                    value={formData.city}
                    placeholder="New York"
                    required
                    icon={Building2}
                  />
                  <FormField
                    id="state"
                    label="State / Province"
                    value={formData.state}
                    placeholder="NY"
                    required
                    icon={MapPin}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    id="postalCode"
                    label="Postal Code"
                    value={formData.postalCode}
                    placeholder="10001"
                    required
                    icon={MapPin}
                  />
                  <FormField
                    id="country"
                    label="Country"
                    value={formData.country}
                    placeholder="United States"
                    required
                    icon={Globe}
                  />
                </div>
              </div>

              {/* Status Bar */}
              <div className="px-8 py-4 bg-foreground/5 border-t border-foreground/10 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                <span>Verification Status</span>
                <span className="flex items-center gap-2 text-green-600">
                  <Check className="w-3 h-3" />
                  Active for Shipping
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
