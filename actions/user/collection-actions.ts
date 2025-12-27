"use server";

import { db } from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";

/**
 * Get all active collections for public view
 */
export async function getActiveCollections() {
  return unstable_cache(
    async () => {
      try {
        const collections = await db.collection.findMany({
          where: { status: "active" },
          include: {
            _count: {
              select: { posters: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return {
          success: true,
          data: collections.map((c: any) => ({
            ...c,
            posterCount: c._count.posters,
          })),
        };
      } catch (error) {
        console.error("Error fetching active collections:", error);
        return { success: false, error: "Failed to fetch collections" };
      }
    },
    ["active-collections"],
    { tags: ["collections"] }
  )();
}

/**
 * Get collection by slug with all posters
 */
export async function getCollectionBySlug(slug: string) {
  try {
    const collection = await db.collection.findUnique({
      where: { slug },
      include: {
        posters: {
          where: { status: "active" },
          include: {
            category: true,
          },
        },
      },
    });

    if (!collection) {
      return { success: false, error: "Collection not found" };
    }

    return { success: true, data: collection };
  } catch (error) {
    console.error("Error fetching collection:", error);
    return { success: false, error: "Failed to fetch collection" };
  }
}

/**
 * Search collections by title or description
 */
export async function searchCollections(query: string) {
  try {
    const collections = await db.collection.findMany({
      where: {
        AND: [
          { status: "active" },
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      include: {
        _count: {
          select: { posters: true },
        },
      },
    });

    return {
      success: true,
      data: collections.map((c: any) => ({
        ...c,
        posterCount: c._count.posters,
      })),
    };
  } catch (error) {
    console.error("Error searching collections:", error);
    return { success: false, error: "Failed to search collections" };
  }
}

/**
 * Filter collections
 */
export async function filterCollections(filters: {
  status?: string;
  search?: string;
}) {
  try {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const collections = await db.collection.findMany({
      where,
      include: {
        _count: {
          select: { posters: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: collections.map((c: any) => ({
        ...c,
        posterCount: c._count.posters,
      })),
    };
  } catch (error) {
    console.error("Error filtering collections:", error);
    return { success: false, error: "Failed to filter collections" };
  }
}
