"use client"

import { useState } from "react"
import { Bell, Moon, Sun, Shield, Trash2, Mail, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileHeader } from "@/components/profile/profile-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    darkMode: false,
    twoFactorAuth: false,
  })

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />

          <div className="flex-1">
            <ProfileHeader
              title="Settings"
              subtitle="Manage your account preferences"
              breadcrumbs={[{ label: "Settings" }]}
            />

            <div className="space-y-8">
              {/* Notifications Section */}
              <section className="border border-border">
                <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
                  <Bell className="w-5 h-5" />
                  <h2 className="font-semibold">Notifications</h2>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="font-medium">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                    />
                  </div>

                  <div className="border-t border-border pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Order Updates</Label>
                        <p className="text-sm text-muted-foreground">Shipping and delivery notifications</p>
                      </div>
                      <Switch
                        checked={settings.orderUpdates}
                        onCheckedChange={(checked) => setSettings({ ...settings, orderUpdates: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Promotions & Sales</Label>
                        <p className="text-sm text-muted-foreground">Exclusive deals and discounts</p>
                      </div>
                      <Switch
                        checked={settings.promotions}
                        onCheckedChange={(checked) => setSettings({ ...settings, promotions: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Newsletter</Label>
                        <p className="text-sm text-muted-foreground">Weekly curated content and new arrivals</p>
                      </div>
                      <Switch
                        checked={settings.newsletter}
                        onCheckedChange={(checked) => setSettings({ ...settings, newsletter: checked })}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Appearance Section */}
              <section className="border border-border">
                <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
                  {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <h2 className="font-semibold">Appearance</h2>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                    />
                  </div>
                </div>
              </section>

              {/* Security Section */}
              <section className="border border-border">
                <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
                  <Shield className="w-5 h-5" />
                  <h2 className="font-semibold">Security</h2>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                    />
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Change Password</Label>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Change
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>Enter your current password and a new password</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Current Password</Label>
                              <Input type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label>New Password</Label>
                              <Input type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label>Confirm New Password</Label>
                              <Input type="password" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button variant="outline">Cancel</Button>
                            <Button>Update Password</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="border border-destructive/30">
                <div className="flex items-center gap-3 p-4 border-b border-destructive/30 bg-destructive/5">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  <h2 className="font-semibold text-destructive">Danger Zone</h2>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Delete Account</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data
                            from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Type "DELETE" to confirm</Label>
                            <Input placeholder="DELETE" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive">Delete Account</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
