"use server";

import { db } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getNewArrivals() {
  return unstable_cache(
    async () => {
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
    },
    ["new-arrivals"],
    { tags: ["posters"] }
  )();
}

export async function getLimitedEditions() {
  return unstable_cache(
    async () => {
      try {
        const products = await db.poster.findMany({
          where: {
            status: "active",
            isLimitedEdition: true,
          },
          take: 3,
          include: {
            category: true,
          },
        });
        return { success: true, data: products };
      } catch (error) {
        console.error("Error fetching limited editions:", error);
        return { success: false, error: "Failed to fetch limited editions" };
      }
    },
    ["limited-editions"],
    { tags: ["posters"] }
  )();
}

export async function getBestSellers() {
  return unstable_cache(
    async () => {
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
    },
    ["best-sellers"],
    { tags: ["posters"] }
  )();
}

export async function getFeaturedProducts() {
  return unstable_cache(
    async () => {
      try {
        const products = await db.poster.findMany({
          where: {
            status: "active",
            isFeatured: true,
          },
          take: 8,
          include: {
            category: true,
          },
        });
        return { success: true, data: products };
      } catch (error) {
        return { success: false, error: "Failed to fetch featured products" };
      }
    },
    ["featured-products"],
    { tags: ["posters"] }
  )();
}

export async function getFeaturedCollections() {
  return unstable_cache(
    async () => {
      try {
        const collections = await db.collection.findMany({
          where: {
            status: "active",
            isFeatured: true,
          },
          take: 3,
          include: {
            posters: {
              take: 4,
              select: { image: true },
            },
            _count: {
              select: { posters: true },
            },
          },
        });
        return { success: true, data: collections };
      } catch (error) {
        return {
          success: false,
          error: "Failed to fetch featured collections",
        };
      }
    },
    ["featured-collections"],
    { tags: ["collections"] }
  )();
}

/**
 * Get poster by ID for cart display
 */
export async function getPosterById(id: string) {
  try {
    const poster = await db.poster.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!poster) {
      return { success: false, error: "Poster not found" };
    }

    return { success: true, data: poster };
  } catch (error) {
    console.error("Error fetching poster:", error);
    return { success: false, error: "Failed to fetch poster" };
  }
}

/**
 * Get recommended posters for cart page
 * Excludes posters already in cart
 */
export async function getRecommendedPosters(excludeIds: string[] = []) {
  try {
    const posters = await db.poster.findMany({
      where: {
        status: "active",
        id: {
          notIn: excludeIds,
        },
      },
      include: {
        category: true,
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: posters };
  } catch (error) {
    console.error("Error fetching recommended posters:", error);
    return { success: false, error: "Failed to fetch recommendations" };
  }
}
