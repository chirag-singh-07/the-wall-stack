"use server";

import { db } from "@/lib/prisma";
import { hashPassword } from "better-auth/crypto";

/**
 * Update admin password using Better Auth's hashing
 */
export async function updateAdminPassword(newPassword: string) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@thewallstack.com";

    const currentAdmin = await db.user.findUnique({
      where: { email: adminEmail },
    });

    if (!currentAdmin) {
      return { success: false, error: "Admin user not found" };
    }

    // Hash the new password using Better Auth's crypto
    const hashedPassword = await hashPassword(newPassword);

    // Find and update the account (check both "email" and "credential" providers)
    let account = await db.account.findFirst({
      where: {
        userId: currentAdmin.id,
        providerId: "email",
      },
    });

    // If not found with "email", try "credential"
    if (!account) {
      account = await db.account.findFirst({
        where: {
          userId: currentAdmin.id,
          providerId: "credential",
        },
      });
    }

    if (!account) {
      return { success: false, error: "No email/password account found for admin" };
    }

    await db.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "Admin password has been updated successfully",
      email: adminEmail,
    };
  } catch (error) {
    console.error("Error updating admin password:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update admin password",
    };
  }
}

/**
 * Verify forgot password secret code for admin
 */
export async function verifyForgotPasswordCode(secretCode: string) {
  try {
    // Use environment variable for secret code
    const correctCode = process.env.ADMIN_FORGOT_PASSWORD_CODE;

    if (!correctCode) {
      return { success: false, error: "Forgot password not configured" };
    }

    if (secretCode !== correctCode) {
      return { success: false, error: "Invalid secret code" };
    }

    return { success: true, message: "Code verified successfully" };
  } catch (error) {
    console.error("Error verifying code:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to verify code",
    };
  }
}

/**
 * Reset admin password after code verification
 */
export async function resetAdminPasswordWithCode(
  secretCode: string,
  newPassword: string
) {
  try {
    // Verify the secret code first
    const verification = await verifyForgotPasswordCode(secretCode);
    if (!verification.success) {
      return verification;
    }

    // Update the password
    return await updateAdminPassword(newPassword);
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}
