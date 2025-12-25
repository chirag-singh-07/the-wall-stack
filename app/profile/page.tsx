"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Pencil,
  Camera,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileHeader } from "@/components/profile/profile-header";
import { authClient } from "@/lib/auth-client";
import { getUserStats, updateUserProfile } from "@/actions/user/user-actions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    memberSince: "2024",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "", // Cast as any if phone not yet in type definition
      });

      getUserStats(session.user.id).then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
        setLoading(false);
      });
    } else {
      // Redirect or wait
      setLoading(false);
    }
  }, [session]);

  const handleSave = async () => {
    if (!session?.user) return;
    setSaving(true);
    const res = await updateUserProfile(session.user.id, {
      name: formData.name,
      phone: formData.phone,
    });

    if (res.success) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } else {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  const handleCancel = () => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
      });
    }
    setIsEditing(false);
  };

  // Placeholder strategy
  const getAvatarUrl = () => {
    if (session?.user?.image) return session.user.image;
    const name = session?.user?.name || "User";
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      name
    )}&backgroundColor=000000&textColor=ffffff`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (!session)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Please sign in to view your profile.</p>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-12 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64">
            <ProfileSidebar />
          </aside>

          <div className="flex-1">
            <ProfileHeader
              title="My Profile"
              subtitle="Manage your personal information and preferences"
            />

            {/* Profile Card */}
            <div className="border border-border mt-6 rounded-lg overflow-hidden">
              {/* Avatar Section */}
              <div className="relative h-32 bg-muted">
                <div className="absolute -bottom-12 left-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-background border-4 border-background overflow-hidden relative">
                      <Image
                        src={getAvatarUrl()}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Camera icon functionality could be added here for image upload */}
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors cursor-pointer">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  {!isEditing ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCancel}
                        disabled={saving}
                        className="gap-1"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                        className="gap-1"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="pt-16 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border-foreground/20 focus:border-foreground"
                      />
                    ) : (
                      <p className="font-medium py-2 text-lg">
                        {session.user.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <p className="font-medium py-2 text-lg opacity-80">
                      {session.user.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+1 (555) 000-0000"
                        className="border-foreground/20 focus:border-foreground"
                      />
                    ) : (
                      <p className="font-medium py-2 text-lg">
                        {formData.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Total Orders", value: stats.orders.toString() },
                { label: "Wishlist Items", value: stats.wishlist.toString() },
                { label: "Saved Addresses", value: "0" }, // Address system not detailed yet
                { label: "Member Since", value: stats.memberSince },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-border p-4 text-center rounded-lg bg-card"
                >
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
