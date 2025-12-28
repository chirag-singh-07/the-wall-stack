"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { authClient, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

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

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "Custom", href: "/custom-poster" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40 py-3 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.1)]"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl md:text-2xl font-black tracking-tighter hover:scale-105 transition-transform duration-300"
          >
            THE WALL{" "}
            <span className="text-muted-foreground font-light">STACK</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 bg-muted/30 backdrop-blur-sm rounded-full px-2 py-1 border border-border/20">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full hover:bg-background hover:shadow-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 rounded-full"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Hide cart and profile for admin users */}
            {session?.user?.role?.toUpperCase() !== "ADMIN" && (
              <>
                <Link href="/wishlist">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-muted/50 rounded-full"
                    title="Wishlist"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-muted/50 rounded-full"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <AnimatePresence>
                      {cartCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center border-2 border-background"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </Link>
              </>
            )}

            {session?.user?.role?.toUpperCase() === "ADMIN" && (
              <Link href="/admin">
                <Button size="sm" className="hidden sm:flex rounded-full px-5">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}

            {/* 🔐 Auth logic */}
            {!isPending && session ? (
              <div className="flex items-center gap-2 border-l border-border/40 pl-2">
                {/* Profile - Only show for non-admin users */}
                {session.user.role?.toUpperCase() !== "ADMIN" && (
                  <Link href="/profile" className="cursor-pointer">
                    <div className="group rounded-full overflow-hidden w-9 h-9 border border-border/40 hover:border-primary transition-colors active:scale-95">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                            session.user.name || "U"
                          )}&backgroundColor=000000&textColor=ffffff`}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </Link>
                )}

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                  className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-full"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 border-l border-border/40 pl-2">
                <Link href="/login" className="cursor-pointer">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="cursor-pointer">
                  <Button size="sm" className="rounded-full px-5">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-muted/50 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu
                className={cn(
                  "h-6 w-6 transition-transform duration-300",
                  isMobileMenuOpen && "rotate-90 scale-0"
                )}
              />
              <X
                className={cn(
                  "absolute h-6 w-6 transition-transform duration-300",
                  !isMobileMenuOpen && "-rotate-90 scale-0"
                )}
              />
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-2">
                  Navigation
                </span>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold px-2 py-1 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-6 border-t border-border/40">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-2">
                  Account
                </span>
                {!isPending && session ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium px-2 py-2 flex items-center justify-between"
                    >
                      My Profile
                      <User className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-lg font-medium px-2 py-2 text-destructive flex items-center justify-between"
                    >
                      Logout
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-xl py-6"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full rounded-xl py-6">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
