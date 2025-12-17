"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { authClient, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { getCartCount } = useCartStore();
  const router = useRouter();

  // ✅ Better Auth session
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = mounted ? getCartCount() : 0;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/login"); // Redirect to home after logout
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            POSTER.
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium hover:opacity-60">
              Shop
            </Link>
            <Link
              href="/#collections"
              className="text-sm font-medium hover:opacity-60"
            >
              Collections
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium hover:opacity-60"
            >
              About
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              </Button>
            </Link>

            {/* 🔐 Auth logic */}
            {!isPending && session ? (
              <>
                {/* Profile */}
                <Link href="/profile" className="cursor-pointer">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => authClient.signOut()}
                  title="Logout"
                  className="hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:block cursor-pointer">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  className="hidden md:block cursor-pointer"
                >
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 border-t pt-4 space-y-3">
            <Link href="/shop">Shop</Link>
            <Link href="/cart">Cart ({cartCount})</Link>

            {!isPending && session ? (
              <>
                <Link href="/profile">My Account</Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm text-destructive"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Sign In</Link>
                <Link href="/register">Create Account</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
