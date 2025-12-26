"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  userId: string;
  rating: number;
  text: string;
  productId?: string;
  collectionId?: string;
}) {
  try {
    const { userId, rating, text, productId, collectionId } = data;

    if (!productId && !collectionId) {
      return { success: false, error: "Product or Collection ID is required" };
    }

    const review = await db.review.create({
      data: {
        userId,
        rating,
        text,
        posterId: productId,
        collectionId,
        status: "pending", // Reviews default to pending moderation
      },
    });

    revalidatePath(`/shop/${productId}`); // Revalidate product page
    revalidatePath("/admin/reviews");
    return { success: true, data: review };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

export async function getReviews(
  targetId: string,
  type: "product" | "collection"
) {
  try {
    const whereClause =
      type === "product" ? { posterId: targetId } : { collectionId: targetId };

    const reviews = await db.review.findMany({
      where: {
        ...whereClause,
        status: "approved", // Only show approved reviews publicly
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: reviews };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, error: "Failed to fetch reviews" };
  }
}

// Admin Actions
export async function getAllReviews() {
  try {
    const reviews = await db.review.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        poster: {
          select: {
            title: true,
          },
        },
        collection: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: reviews };
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return { success: false, error: "Failed to fetch reviews" };
  }
}

export async function updateReviewStatus(id: string, status: string) {
  try {
    const review = await db.review.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/reviews");
    return { success: true, data: review };
  } catch (error) {
    console.error("Error updating review status:", error);
    return { success: false, error: "Failed to update review status" };
  }
}

export async function deleteReview(id: string) {
  try {
    await db.review.delete({
      where: { id },
    });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}
