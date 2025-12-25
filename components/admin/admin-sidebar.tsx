"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Tag,
  Users,
  ShoppingCart,
  Palette,
  TrendingUp,
  User,
  LogOut,
  ChevronLeft,
  Menu,
  Image,
  FileText,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/collections", label: "Collections", icon: FolderOpen },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/custom-orders", label: "Custom Orders", icon: Palette },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/cms", label: "Content", icon: FileText },
  { href: "/admin/sales", label: "Sales", icon: TrendingUp },
  { href: "/admin/profile", label: "Profile", icon: User },
];

function SidebarContent({
  collapsed,
  onCollapse,
}: {
  collapsed: boolean;
  onCollapse?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-foreground text-background">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-background/10 px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center bg-background text-foreground font-bold text-sm">
              PC
            </div>
            <span className="font-semibold tracking-tight">Admin</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center bg-background text-foreground font-bold text-sm">
            PC
          </div>
        )}
        {onCollapse && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapse}
            className="text-background/70 hover:text-background hover:bg-background/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground"
                  : "text-background/70 hover:bg-background/10 hover:text-background"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-background/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-background/70 hover:bg-background/10 hover:text-background transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 lg:hidden bg-transparent"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-foreground border-none"
        >
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen border-r border-border transition-all duration-300 lg:block",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <Menu className="h-3 w-3" />
          </Button>
        )}
      </aside>
    </>
  );
}
