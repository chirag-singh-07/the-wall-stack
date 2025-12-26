"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileHeader } from "@/components/profile/profile-header";
import { WishlistCard } from "@/components/profile/wishlist-card";
import { useUserStore } from "@/lib/user-store";
import { Navbar } from "@/components/navbar";

export default function WishlistPage() {
  const { getWishlistProducts } = useUserStore();
  const wishlistProducts = getWishlistProducts();

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />

          <div className="flex-1">
            <ProfileHeader
              title="My Wishlist"
              subtitle={`${wishlistProducts.length} items saved for later`}
              breadcrumbs={[{ label: "Wishlist" }]}
            />

            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {wishlistProducts.map((product) => (
                  <WishlistCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border">
                <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-muted-foreground mb-6">
                  Save items you love by clicking the heart icon on any product
                </p>
                <Button asChild>
                  <a href="/shop">Explore Products</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
