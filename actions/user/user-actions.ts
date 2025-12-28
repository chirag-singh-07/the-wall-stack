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

    // Fetch Rich Data
    const recentOrders = await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        items: {
          take: 1,
          include: {
            poster: { select: { image: true, title: true } },
          },
        },
      },
    });

    const recentWishlist = await db.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        poster: {
          select: {
            id: true,
            title: true,
            price: true,
            image: true,
            slug: true,
          },
        },
      },
    });

    return {
      success: true,
      stats: {
        orders: ordersCount,
        wishlist: wishlistCount,
        memberSince: user?.createdAt.getFullYear().toString() || "2024",
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        date: order.createdAt,
        status: order.status,
        total: order.total,
        previewItem: order.items[0]?.poster,
      })),
      recentWishlist: recentWishlist.map((item) => ({
        id: item.poster.id,
        title: item.poster.title,
        price: item.poster.price,
        image: item.poster.image,
        slug: item.poster.slug,
      })),
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch stats" };
  }
}

export async function getUserAddress(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        address: true,
        apartment: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        phone: true,
      },
    });
    return { success: true, address: user };
  } catch (error) {
    return { success: false, error: "Failed to fetch address" };
  }
}

export async function updateUserAddress(
  userId: string,
  data: {
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  }
) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        address: data.address,
        apartment: data.apartment,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        ...(data.phone ? { phone: data.phone } : {}),
      },
    });

    revalidatePath("/profile/addresses");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update address" };
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
