"use server";

import { db } from "@/lib/prisma";

/**
 * Get user's saved address
 */
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
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Error fetching user address:", error);
    return { success: false, error: "Failed to fetch address" };
  }
}

/**
 * Save or update user's address
 */
export async function saveUserAddress(
  userId: string,
  addressData: {
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        address: addressData.address,
        apartment: addressData.apartment || null,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving user address:", error);
    return { success: false, error: "Failed to save address" };
  }
}
