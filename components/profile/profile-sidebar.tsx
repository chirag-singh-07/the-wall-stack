"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Heart, MapPin, Settings, LogOut, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/lib/user-store"

const menuItems = [
  { href: "/profile", icon: User, label: "My Profile" },
  { href: "/profile/orders", icon: Package, label: "Orders" },
  { href: "/profile/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/profile/addresses", icon: MapPin, label: "Addresses" },
  { href: "/profile/payment", icon: CreditCard, label: "Payment Methods" },
  { href: "/profile/settings", icon: Settings, label: "Settings" },
]

export function ProfileSidebar() {
  const pathname = usePathname()
  const { profile, logout } = useUserStore()

  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* User Info */}
      <div className="bg-foreground text-background p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-background/20 flex items-center justify-center text-2xl font-bold">
            {profile?.firstName?.charAt(0)}
            {profile?.lastName?.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-sm text-background/70">{profile?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border border-border">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 transition-colors",
                isActive ? "bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </nav>
    </aside>
  )
}
