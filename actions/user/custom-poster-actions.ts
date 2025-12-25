"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Save a custom poster design
 */
export async function saveCustomPoster(data: {
  userId?: string;
  design: any; // Design object will be stringified
  price: number;
}) {
  try {
    const poster = await db.customPoster.create({
      data: {
        userId: data.userId,
        design: JSON.stringify(data.design),
        price: data.price,
        status: "pending",
      },
    });

    return { success: true, data: poster };
  } catch (error) {
    console.error("Error saving custom poster:", error);
    return { success: false, error: "Failed to save custom poster" };
  }
}

/**
 * Get custom poster by ID
 */
export async function getCustomPosterById(id: string) {
  try {
    const poster = await db.customPoster.findUnique({
      where: { id },
    });

    if (!poster) {
      return { success: false, error: "Custom poster not found" };
    }

    // Parse the design JSON
    const parsedPoster = {
      ...poster,
      design: JSON.parse(poster.design),
    };

    return { success: true, data: parsedPoster };
  } catch (error) {
    console.error("Error fetching custom poster:", error);
    return { success: false, error: "Failed to fetch custom poster" };
  }
}

/**
 * Get all custom posters (admin only)
 */
export async function getAllCustomPosters() {
  try {
    const posters = await db.customPoster.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Parse design JSON for each poster
    const parsedPosters = posters.map((p) => ({
      ...p,
      design: JSON.parse(p.design),
    }));

    return { success: true, data: parsedPosters };
  } catch (error) {
    console.error("Error fetching custom posters:", error);
    return { success: false, error: "Failed to fetch custom posters" };
  }
}

/**
 * Update custom poster status (admin only)
 */
export async function updateCustomPosterStatus(
  posterId: string,
  status: "pending" | "in-progress" | "completed"
) {
  try {
    const poster = await db.customPoster.update({
      where: { id: posterId },
      data: { status },
    });

    revalidatePath("/admin/custom-posters");
    return { success: true, data: poster };
  } catch (error) {
    console.error("Error updating custom poster status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Delete custom poster (admin only)
 */
export async function deleteCustomPoster(posterId: string) {
  try {
    await db.customPoster.delete({
      where: { id: posterId },
    });

    revalidatePath("/admin/custom-posters");
    return { success: true };
  } catch (error) {
    console.error("Error deleting custom poster:", error);
    return { success: false, error: "Failed to delete custom poster" };
  }
}
