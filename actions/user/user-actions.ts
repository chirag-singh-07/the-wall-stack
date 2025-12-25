"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserStats(userId: string) {
  try {
    const ordersCount = await db.order.count({
      where: { userId },
    });

    const wishlistCount = await db.wishlist.count({
      where: { userId },
    });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    });

    return {
      success: true,
      stats: {
        orders: ordersCount,
        wishlist: wishlistCount,
        memberSince: user?.createdAt.getFullYear().toString() || "2024",
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch stats" };
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name: string; phone?: string; image?: string }
) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        ...(data.image ? { image: data.image } : {}),
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
