"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileHeader } from "@/components/profile/profile-header";
import { AddressCard } from "@/components/profile/address-card";
import { useUserStore, type Address } from "@/lib/user-store";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

export default function AddressesPage() {
  const {
    addresses,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  } = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const resetForm = () => {
    setFormData({
      label: "",
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!formData.label.trim()) newErrors.label = "Label is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.street.trim()) newErrors.street = "Street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
    } else {
      addAddress(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetFormWithErrors = () => {
    resetForm();
    setErrors({});
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />

          <div className="flex-1">
            <ProfileHeader
              title="My Addresses"
              subtitle="Manage your shipping and billing addresses"
              breadcrumbs={[{ label: "Addresses" }]}
            />

            {/* Add Address Button */}
            <div className="mb-8">
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label className={cn(errors.label && "text-destructive")}>
                        Address Label
                      </Label>
                      <Input
                        placeholder="Home, Office, etc."
                        value={formData.label}
                        onChange={(e) => {
                          setFormData({ ...formData, label: e.target.value });
                          if (errors.label) setErrors({ ...errors, label: "" });
                        }}
                        className={cn(
                          errors.label &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.label && (
                        <p className="text-[10px] text-destructive font-bold uppercase">
                          {errors.label}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          className={cn(errors.firstName && "text-destructive")}
                        >
                          First Name
                        </Label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            });
                            if (errors.firstName)
                              setErrors({ ...errors, firstName: "" });
                          }}
                          className={cn(
                            errors.firstName &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {errors.firstName && (
                          <p className="text-[10px] text-destructive font-bold uppercase">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          className={cn(errors.lastName && "text-destructive")}
                        >
                          Last Name
                        </Label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            });
                            if (errors.lastName)
                              setErrors({ ...errors, lastName: "" });
                          }}
                          className={cn(
                            errors.lastName &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {errors.lastName && (
                          <p className="text-[10px] text-destructive font-bold uppercase">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        className={cn(errors.street && "text-destructive")}
                      >
                        Street Address
                      </Label>
                      <Input
                        value={formData.street}
                        onChange={(e) => {
                          setFormData({ ...formData, street: e.target.value });
                          if (errors.street)
                            setErrors({ ...errors, street: "" });
                        }}
                        className={cn(
                          errors.street &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.street && (
                        <p className="text-[10px] text-destructive font-bold uppercase">
                          {errors.street}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          className={cn(errors.city && "text-destructive")}
                        >
                          City
                        </Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (errors.city) setErrors({ ...errors, city: "" });
                          }}
                          className={cn(
                            errors.city &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {errors.city && (
                          <p className="text-[10px] text-destructive font-bold uppercase">
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          className={cn(errors.state && "text-destructive")}
                        >
                          State
                        </Label>
                        <Input
                          value={formData.state}
                          onChange={(e) => {
                            setFormData({ ...formData, state: e.target.value });
                            if (errors.state)
                              setErrors({ ...errors, state: "" });
                          }}
                          className={cn(
                            errors.state &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {errors.state && (
                          <p className="text-[10px] text-destructive font-bold uppercase">
                            {errors.state}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          className={cn(errors.zipCode && "text-destructive")}
                        >
                          ZIP Code
                        </Label>
                        <Input
                          value={formData.zipCode}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              zipCode: e.target.value,
                            });
                            if (errors.zipCode)
                              setErrors({ ...errors, zipCode: "" });
                          }}
                          className={cn(
                            errors.zipCode &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {errors.zipCode && (
                          <p className="text-[10px] text-destructive font-bold uppercase">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className={cn(errors.phone && "text-destructive")}>
                        Phone Number
                      </Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: "" });
                        }}
                        className={cn(
                          errors.phone &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.phone && (
                        <p className="text-[10px] text-destructive font-bold uppercase">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="isDefault"
                        checked={formData.isDefault}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            isDefault: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="isDefault" className="cursor-pointer">
                        Set as default address
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                      {editingAddress ? "Save Changes" : "Add Address"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Addresses Grid */}
            {addresses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={() => handleEdit(address)}
                    onDelete={() => removeAddress(address.id)}
                    onSetDefault={() => setDefaultAddress(address.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No addresses saved
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add an address for faster checkout
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
