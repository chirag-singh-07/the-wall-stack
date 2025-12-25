"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleWishlist, checkWishostStatus } from "@/actions/user/wishlist-actions";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: string;
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({
  productId,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      checkWishostStatus(session.user.id, productId).then((res) => {
        if (res.success) {
          setIsInWishlist(res.inWishlist);
        }
      });
    }
  }, [productId, session]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please login to add to wishlist");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    // Optimistic UI
    setIsInWishlist(!isInWishlist);

    const res = await toggleWishlist(session.user.id, productId);

    if (res.success) {
      toast.success(
        res.action === "added" ? "Added to wishlist" : "Removed from wishlist"
      );
    } else {
      // Revert if failed
      setIsInWishlist(!isInWishlist);
      toast.error(res.error || "Failed to update wishlist");
    }
    setIsLoading(false);
  };

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        className={cn("w-full gap-2", className)}
        onClick={handleToggle}
        disabled={isLoading}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isInWishlist && "fill-red-500 text-red-500"
          )}
        />
        {isInWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background/90",
        className
      )}
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isInWishlist ? "fill-red-500 text-red-500" : "text-foreground"
        )}
      />
    </Button>
  );
}
