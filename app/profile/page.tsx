"use client"

import { useState } from "react"
import { User, Mail, Phone, Pencil, Camera, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileHeader } from "@/components/profile/profile-header"
import { useUserStore } from "@/lib/user-store"

export default function ProfilePage() {
  const { profile, updateProfile } = useUserStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  })

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    })
    setIsEditing(false)
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />

          <div className="flex-1">
            <ProfileHeader title="My Profile" subtitle="Manage your personal information and preferences" />

            {/* Profile Card */}
            <div className="border border-border">
              {/* Avatar Section */}
              <div className="relative h-32 bg-foreground">
                <div className="absolute -bottom-12 left-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-background border-4 border-background flex items-center justify-center text-3xl font-bold text-foreground">
                      {profile?.firstName?.charAt(0)}
                      {profile?.lastName?.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  {!isEditing ? (
                    <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                      <Pencil className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={handleCancel} className="gap-1">
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} className="gap-1">
                        <Check className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="pt-16 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      First Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="border-foreground/20 focus:border-foreground"
                      />
                    ) : (
                      <p className="font-medium py-2">{profile?.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      Last Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="border-foreground/20 focus:border-foreground"
                      />
                    ) : (
                      <p className="font-medium py-2">{profile?.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-foreground/20 focus:border-foreground"
                      />
                    ) : (
                      <p className="font-medium py-2">{profile?.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border-foreground/20 focus:border-foreground"
                      />
                    ) : (
                      <p className="font-medium py-2">{profile?.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Total Orders", value: "12" },
                { label: "Wishlist Items", value: "3" },
                { label: "Saved Addresses", value: "2" },
                { label: "Member Since", value: "2024" },
              ].map((stat) => (
                <div key={stat.label} className="border border-border p-4 text-center">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
