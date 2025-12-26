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
  Calendar,
  ShieldCheck,
  Zap,
  ArrowRight,
  Heart,
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
import { motion, AnimatePresence } from "framer-motion";

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
  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
      });

      getUserStats(session.user.id).then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
        setLoading(false);
      });
    } else if (!session && !loading) {
      // Only stop loading if we're sure there's no session
      setLoading(false);
    }
  }, [session, loading]);

  const handleSave = async () => {
    if (!session?.user) return;

    // Validation
    if (!formData.name.trim()) {
      setErrors({ name: "Name is required" });
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);
    setErrors({ name: "" });

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

  const getAvatarUrl = () => {
    if (session?.user?.image) return session.user.image;
    const name = session?.user?.name || "User";
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      name
    )}&backgroundColor=000000&textColor=ffffff`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-foreground" />
        </motion.div>
      </div>
    );

  if (!session)
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <ShieldCheck className="w-16 h-16 text-muted-foreground opacity-20" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">
            Please sign in to view your profile.
          </p>
          <Button
            variant="outline"
            className="mt-4 uppercase tracking-widest font-bold h-12 px-8 rounded-none border-2"
          >
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-foreground selection:text-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-12 pb-24 mt-20">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-64">
            <ProfileSidebar />
          </aside>

          <motion.div
            className="flex-1"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <ProfileHeader
              title="Identity"
              subtitle="Control your digital presence and account integrity"
            />

            {/* Profile Card */}
            <motion.div
              variants={itemVariants}
              className="border-[3px] border-foreground mt-8 relative bg-card overflow-hidden"
            >
              {/* Decorative background text */}
              <div className="absolute top-0 right-0 text-[120px] font-black text-foreground/3 leading-none select-none pointer-events-none -mr-12 -mt-8 uppercase tracking-tighter">
                PROFILE
              </div>

              {/* Avatar & Action Section */}
              <div className="relative h-40 bg-muted/30 border-b-[3px] border-foreground">
                <div className="absolute -bottom-16 left-8 z-20">
                  <div className="relative group">
                    <motion.div
                      className="w-32 h-32 bg-background border-[3px] border-foreground overflow-hidden relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                      whileHover={{ scale: 1.02, x: -2, y: -2 }}
                    >
                      <Image
                        src={getAvatarUrl()}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-foreground text-background flex items-center justify-center border-2 border-background hover:scale-110 transition-transform cursor-pointer shadow-lg">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="absolute top-6 right-6">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="h-12 px-6 rounded-none bg-foreground text-background font-black uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-0 active:translate-y-0"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Identity
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={saving}
                        className="h-12 px-6 rounded-none border-2 border-foreground font-black uppercase tracking-widest hover:bg-muted transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-12 px-6 rounded-none bg-foreground text-background font-black uppercase tracking-widest"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        Confirm Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form Content */}
              <div className="pt-24 p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Full Name */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="name"
                      className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground flex items-center gap-2"
                    >
                      <User className="w-3 h-3" />
                      Legal Name
                    </Label>
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          key="edit-name"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="space-y-2"
                        >
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                name: e.target.value,
                              });
                              if (e.target.value.trim())
                                setErrors({ name: "" });
                            }}
                            className={cn(
                              "h-14 rounded-none border-2 text-lg font-bold bg-transparent transition-colors",
                              errors.name
                                ? "border-destructive focus-visible:ring-destructive"
                                : "border-foreground/20 focus:border-foreground"
                            )}
                          />
                          {errors.name && (
                            <p className="text-xs text-destructive font-bold uppercase tracking-widest">
                              {errors.name}
                            </p>
                          )}
                        </motion.div>
                      ) : (
                        <motion.p
                          key="view-name"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-2xl font-black uppercase tracking-tighter border-b-2 border-foreground/5 pb-2"
                        >
                          {session.user.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Verified Email
                    </Label>
                    <p className="text-2xl font-black lowercase tracking-tighter truncate opacity-50 border-b-2 border-foreground/5 pb-2">
                      {session.user.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="phone"
                      className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground flex items-center gap-2"
                    >
                      <Phone className="w-3 h-3" />
                      Contact Protocol
                    </Label>
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          key="edit-phone"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                        >
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+1 (555) 000-0000"
                            className="h-14 rounded-none border-2 border-foreground/20 focus:border-foreground text-lg font-bold bg-transparent"
                          />
                        </motion.div>
                      ) : (
                        <motion.p
                          key="view-phone"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-2xl font-black uppercase tracking-tighter border-b-2 border-foreground/5 pb-2"
                        >
                          {formData.phone || "STRICTLY PRIVATE"}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Role / ID (Non-editable) */}
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      Access Level
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="bg-foreground text-background text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                        {(session.user as any).role || "USER"}
                      </span>
                      <span className="text-xs font-mono opacity-30 truncate">
                        ID: {session.user.id.substring(0, 12)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  label: "Acquisitions",
                  value: stats.orders,
                  icon: ArrowRight,
                },
                { label: "Curated Items", value: stats.wishlist, icon: Heart },
                {
                  label: "Legacy Start",
                  value: stats.memberSince,
                  icon: Calendar,
                },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -5, borderColor: "rgba(0,0,0,1)" }}
                  className="group border-2 border-foreground/10 p-6 bg-card transition-colors relative h-32 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <stat.icon className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs uppercase tracking-[0.3em] font-black group-hover:text-foreground/40 transition-colors">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-4xl font-black uppercase tracking-tighter">
                    {stat.value}
                  </p>
                  <div className="absolute right-0 bottom-0 w-8 h-8 bg-foreground/5 group-hover:bg-foreground transition-colors group-hover:scale-110" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
