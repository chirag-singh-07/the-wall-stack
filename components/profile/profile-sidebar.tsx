"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  CreditCard,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/user-store";
import { motion } from "framer-motion";

const menuItems = [
  { href: "/profile", icon: User, label: "My Profile" },
  { href: "/profile/orders", icon: Package, label: "Orders" },
  { href: "/profile/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/profile/addresses", icon: MapPin, label: "Addresses" },
  { href: "/profile/payment", icon: CreditCard, label: "Payment Methods" },
  { href: "/profile/settings", icon: Settings, label: "Settings" },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const { profile, logout } = useUserStore();

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-foreground text-background p-6 rounded-none relative overflow-hidden group"
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-background/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center text-xl font-black border border-background/30">
            {profile?.firstName?.charAt(0) || "U"}
            {profile?.lastName?.charAt(0) || ""}
          </div>
          <div className="overflow-hidden">
            <h2 className="font-black text-sm uppercase tracking-wider truncate">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-[10px] text-background/60 uppercase tracking-widest truncate">
              {profile?.email}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="border border-border p-1 bg-card/50 backdrop-blur-sm">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-all duration-300 relative group",
                  isActive
                    ? "bg-foreground text-background font-bold"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-2/3 bg-background"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-4 h-4 translate-z-0",
                    isActive
                      ? "scale-110"
                      : "group-hover:scale-110 transition-transform"
                  )}
                />
                <span className="text-xs uppercase tracking-widest font-bold">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          );
        })}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * menuItems.length }}
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-all group mt-2"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-bold">
            Sign Out
          </span>
        </motion.button>
      </nav>
    </aside>
  );
}
