"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getUserWishlist } from "@/actions/user/wishlist-actions";
import { authClient } from "@/lib/auth-client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Loader2, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist-button";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();

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
      // Session explicitly null (loaded but no user)
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <Heart className="h-16 w-16 text-muted-foreground/30" />
          <h1 className="text-2xl font-bold">Sign in to view your wishlist</h1>
          <p className="text-muted-foreground max-w-md">
            Save your favorite posters and create your dream collection by
            logging in.
          </p>
          <Button asChild className="mt-4">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">
              {wishlistItems.length} items saved
            </p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/30">
            <Heart className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              Browse our collections and save items you love to build your
              perfect gallery.
            </p>
            <Button asChild>
              <Link href="/collections">Explore Collections</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-card rounded-lg overflow-hidden border border-border transition-all hover:shadow-lg"
              >
                <Link href={`/product/${item.poster.slug}`}>
                  <div className="relative aspect-3/4 overflow-hidden bg-muted">
                    <Image
                      src={item.poster.image || "/placeholder.svg"}
                      alt={item.poster.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.poster.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="absolute top-2 right-2 z-10">
                  <WishlistButton productId={item.poster.id} />
                </div>

                <div className="p-4">
                  <Link href={`/product/${item.poster.slug}`}>
                    <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                      {item.poster.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">₹{item.poster.price}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-8 px-2"
                    >
                      <Link href={`/product/${item.poster.slug}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
