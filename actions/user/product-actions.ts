"use server";

import { db } from "@/lib/prisma";

export async function getNewArrivals() {
  try {
    const products = await db.poster.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        category: true,
      },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return { success: false, error: "Failed to fetch new arrivals" };
  }
}

export async function getBestSellers() {
  try {
    const products = await db.poster.findMany({
      where: {
        status: "active",
        isBestseller: true,
      },
      take: 4,
      include: {
        category: true,
      },
    });
    return { success: true, data: products };
  } catch (error) {
    return { success: false, error: "Failed to fetch best sellers" };
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await db.poster.findMany({
      where: {
        status: "active",
        isFeatured: true,
      },
      take: 8, // Usually featured section has more items (e.g. 2 rows)
      include: {
        category: true,
      },
    });
    return { success: true, data: products };
  } catch (error) {
    return { success: false, error: "Failed to fetch featured products" };
  }
}

export async function getFeaturedCollections() {
  try {
    const collections = await db.collection.findMany({
      where: {
        status: "active", // assuming status field exists on collection as 'active'/'draft'
        isFeatured: true,
      },
      take: 3,
      include: {
        posters: {
          take: 2,
          select: { image: true },
        },
        _count: {
          select: { posters: true },
        },
      },
    });
    return { success: true, data: collections };
  } catch (error) {
    return { success: false, error: "Failed to fetch featured collections" };
  }
}
