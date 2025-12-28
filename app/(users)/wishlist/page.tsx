"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getUserWishlist,
  toggleWishlist,
} from "@/actions/user/wishlist-actions";
import { authClient } from "@/lib/auth-client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Loader2,
  Heart,
  ShoppingBag,
  X,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (session?.user?.id) {
        const res = await getUserWishlist(session.user.id);
        if (res.success) {
          setWishlistItems(res.data || []);
        }
      }
      setIsLoading(false);
    };

    if (session) {
      fetchWishlist();
    } else if (session === null) {
      setIsLoading(false);
    }
  }, [session]);

  const handleRemove = async (productId: string) => {
    if (!session?.user?.id) return;

    // Optimistic remove
    const prevItems = [...wishlistItems];
    setWishlistItems((prev) =>
      prev.filter((item) => item.poster.id !== productId)
    );
    toast.success("Removed from wishlist");

    const res = await toggleWishlist(session.user.id, productId);
    if (!res.success) {
      setWishlistItems(prevItems);
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = (item: any) => {
    const defaultSize = "A3 (30×42cm)";
    const price =
      typeof item.poster.price === "number"
        ? item.poster.price
        : parseFloat(item.poster.price);
    addItem(item.poster.id, defaultSize, price, 1);
    toast.success(`Added ${item.poster.title} to cart`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-black/20" />
      </div>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col bg-zinc-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
          <div className="relative">
            <Heart className="h-24 w-24 text-zinc-200 stroke-[1]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
          </div>
          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Private Collection
            </h1>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest leading-relaxed">
              Curate your sanctuary. Sign in to save objects of desire.
            </p>
          </div>
          <Link href="/sign-in">
            <Button
              size="lg"
              className="rounded-full px-10 h-14 bg-black text-white hover:bg-zinc-800 font-black uppercase tracking-widest text-[10px]"
            >
              Access Account
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-16 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-black/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                Your Selection
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
                Wishlist
              </h1>
              <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                <span className="text-black/40">
                  {wishlistItems.length} Artifacts
                </span>
              </div>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-32 flex flex-col items-center justify-center border border-dashed border-black/10 rounded-3xl bg-white/50"
            >
              <Heart className="h-16 w-16 text-zinc-200 mb-6 stroke-[1]" />
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                Empty Sanctuary
              </h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-sm text-center mb-8">
                Your collection awaits. Explore our catalogue to define your
                space.
              </p>
              <Link href="/shop">
                <Button className="rounded-full px-10 h-14 bg-black text-white hover:bg-zinc-800 font-black uppercase tracking-widest text-[10px]">
                  Explore Catalogue
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              <AnimatePresence mode="popLayout">
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="relative aspect-3/4 mb-6 overflow-hidden bg-zinc-100">
                      {/* Image */}
                      <Link
                        href={`/shop/${item.poster.slug || item.poster.id}`}
                      >
                        <Image
                          src={item.poster.image || "/placeholder.svg"}
                          alt={item.poster.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>

                      {/* Overlays */}
                      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full w-10 h-10 bg-white/90 hover:bg-red-50 text-black hover:text-red-500 shadow-xl"
                          onClick={() => handleRemove(item.poster.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {item.poster.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <Link
                          href={`/shop/${item.poster.slug || item.poster.id}`}
                          className="block space-y-1 flex-1"
                        >
                          <h3 className="text-xl font-bold leading-none tracking-tight group-hover:text-zinc-600 transition-colors">
                            {item.poster.title}
                          </h3>
                          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                            {formatPrice(item.poster.price)}
                          </p>
                        </Link>
                      </div>

                      <Button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.poster.stock <= 0}
                        className="w-full rounded-full h-12 bg-transparent border border-black/10 hover:bg-black hover:text-white hover:border-black text-black font-bold uppercase tracking-widest text-[10px] transition-all"
                      >
                        {item.poster.stock <= 0 ? "Unavailable" : "Add to Cart"}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
