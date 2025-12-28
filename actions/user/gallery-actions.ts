"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Get all approved gallery posts for public display
 */
export async function getApprovedGalleryPosts() {
  try {
    const posts = await db.customerGalleryPost.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Error fetching gallery posts:", error);
    return { success: false, error: "Failed to fetch gallery posts" };
  }
}

/**
 * Submit a new gallery post (requires admin approval)
 */
export async function submitGalleryPost(data: {
  userId?: string;
  userName: string;
  userAvatar?: string;
  userLocation?: string;
  image: string;
  caption: string;
  posterName?: string;
  instagramUrl?: string;
}) {
  try {
    // Check for existing submission if userId is provided
    if (data.userId) {
      const existingPost = await db.customerGalleryPost.findFirst({
        where: { userId: data.userId },
      });

      if (existingPost) {
        return {
          success: false,
          error: "You can only upload one image to the gallery.",
        };
      }
    }

    const post = await db.customerGalleryPost.create({
      data: {
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        userLocation: data.userLocation,
        image: data.image,
        caption: data.caption,
        posterName: data.posterName,
        instagramUrl: data.instagramUrl,
        status: "pending", // Requires admin approval
      },
    });

    revalidatePath("/");
    return { success: true, data: post };
  } catch (error) {
    console.error("Error submitting gallery post:", error);
    return { success: false, error: "Failed to submit gallery post" };
  }
}

/**
 * Check if user has already submitted a post
 */
export async function checkUserSubmissionStatus(userId: string) {
  try {
    const post = await db.customerGalleryPost.findFirst({
      where: { userId },
    });
    return { success: true, hasSubmitted: !!post };
  } catch (error) {
    return { success: false, error: "Failed to check submission status" };
  }
}

/**
 * Toggle like on a gallery post
 */
export async function toggleGalleryLike(userId: string, postId: string) {
  try {
    const existingLike = await db.galleryLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await db.galleryLike.delete({
        where: { id: existingLike.id },
      });

      const post = await db.customerGalleryPost.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } },
      });

      revalidatePath("/");
      revalidatePath("/gallery");
      return { success: true, action: "unliked", likes: post.likes };
    } else {
      // Like
      await db.galleryLike.create({
        data: {
          userId,
          postId,
        },
      });

      const post = await db.customerGalleryPost.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
      });

      revalidatePath("/");
      revalidatePath("/gallery");
      return { success: true, action: "liked", likes: post.likes };
    }
  } catch (error) {
    console.error("Error toggling gallery like:", error);
    return { success: false, error: "Failed to update like" };
  }
}

/**
 * Get IDs of posts liked by user
 */
export async function getUserLikedPostIds(userId: string) {
  try {
    const likes = await db.galleryLike.findMany({
      where: { userId },
      select: { postId: true },
    });
    return { success: true, likedPostIds: likes.map((l) => l.postId) };
  } catch (error) {
    return { success: false, error: "Failed to fetch user likes" };
  }
}

/**
 * Add a comment to a gallery post
 */
export async function addGalleryComment(data: {
  postId: string;
  userId: string;
  text: string;
}) {
  try {
    const comment = await db.galleryComment.create({
      data: {
        postId: data.postId,
        userId: data.userId,
        text: data.text,
      },
    });

    // Update comment count on post
    await db.customerGalleryPost.update({
      where: { id: data.postId },
      data: {
        commentCount: { increment: 1 },
      },
    });

    revalidatePath("/");
    return { success: true, data: comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

/**
 * Get comments for a post
 */
export async function getGalleryComments(postId: string) {
  try {
    const comments = await db.galleryComment.findMany({
      where: { postId },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: comments };
  } catch (error) {
    return { success: false, error: "Failed to fetch comments" };
  }
}

/**
 * Get all gallery posts (admin only)
 */
export async function getAllGalleryPosts() {
  try {
    const posts = await db.customerGalleryPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching all gallery posts:", error);
    return { success: false, error: "Failed to fetch gallery posts" };
  }
}

/**
 * Update gallery post status (admin only)
 */
export async function updateGalleryPostStatus(
  postId: string,
  status: "pending" | "approved" | "rejected"
) {
  try {
    const post = await db.customerGalleryPost.update({
      where: { id: postId },
      data: { status },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true, data: post };
  } catch (error) {
    console.error("Error updating gallery post status:", error);
    return { success: false, error: "Failed to update post status" };
  }
}

/**
 * Delete gallery post (admin only)
 */
export async function deleteGalleryPost(postId: string) {
  try {
    await db.customerGalleryPost.delete({
      where: { id: postId },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting gallery post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}
