"use server";

import { db } from "@/lib/prisma";

export async function subscribeToNewsletter(email: string) {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, message: "Invalid email address." };
    }

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === "active") {
        return {
          success: false,
          message: "This email is already part of the collective.",
        };
      } else {
        // Re-activate
        await db.newsletterSubscriber.update({
          where: { email },
          data: { status: "active" },
        });
        return { success: true, message: "Welcome back to the collective." };
      }
    }

    await db.newsletterSubscriber.create({
      data: { email },
    });

    return {
      success: true,
      message: "Entry granted. You are now part of the collective.",
    };
  } catch (error) {
    console.error("Newsletter Error:", error);
    return {
      success: false,
      message: "A protocol error occurred. Please try again later.",
    };
  }
}
