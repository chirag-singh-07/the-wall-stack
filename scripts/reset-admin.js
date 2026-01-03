#!/usr/bin/env node

/**
 * Reset Admin Password Script
 * Usage: node scripts/reset-admin.js
 *
 * This script will update the admin password to "admin123"
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function resetAdminPassword() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@thewallstack.com";
    const newPassword = "admin123";

    console.log(`🔍 Looking for admin user with email: ${adminEmail}`);

    // Step 1: Find the current admin
    const currentAdmin = await db.user.findUnique({
      where: { email: adminEmail },
    });

    if (!currentAdmin) {
      console.log("❌ Admin user not found");
      process.exit(1);
    }

    console.log(`✅ Found admin user: ${currentAdmin.name}`);

    // Step 2: Hash the new password
    console.log("🔐 Hashing new password...");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 3: Update the account password
    const account = await db.account.findFirst({
      where: {
        userId: currentAdmin.id,
        providerId: "email",
      },
    });

    if (!account) {
      console.log("❌ No email account found for this user");
      process.exit(1);
    }

    await db.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    });

    console.log(`✅ Password updated successfully!`);
    console.log("\n✨ Admin password has been reset!");
    console.log(`\nLogin Details:`);
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${newPassword}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

resetAdminPassword();
