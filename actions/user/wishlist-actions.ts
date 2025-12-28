"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Toggle a product in the user's wishlist
 */
export async function toggleWishlist(userId: string, productId: string) {
  try {
    const existing = await db.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      // Remove
      await db.wishlist.delete({
        where: {
          id: existing.id,
        },
      });
      revalidatePath("/wishlist");
      return { success: true, action: "removed" };
    } else {
      // Add
      await db.wishlist.create({
        data: {
          userId,
          productId,
        },
      });
      revalidatePath("/wishlist");
      return { success: true, action: "added" };
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return { success: false, error: "Failed to update wishlist" };
  }
}

/**
 * Get user's wishlist
 */
export async function getUserWishlist(userId: string) {
  try {
    const wishlist = await db.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        poster: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: wishlist };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { success: false, error: "Failed to fetch wishlist" };
  }
}

/**
 * Check if a product is in the user's wishlist
 */
export async function checkWishlistStatus(userId: string, productId: string) {
  try {
    const item = await db.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return { success: true, inWishlist: !!item };
  } catch (error) {
    return { success: false, error: "Error checking status" };
  }
}
