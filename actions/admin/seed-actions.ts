"use server";

import { db } from "@/lib/prisma";

const categories = [
  { name: "Minimal", slug: "minimal", description: "Clean and simple designs" },
  {
    name: "Abstract",
    slug: "abstract",
    description: "Bold and expressive art",
  },
  {
    name: "Typography",
    slug: "typography",
    description: "Artistic text designs",
  },
  { name: "Retro", slug: "retro", description: "Vintage inspired collections" },
];

const collections = [
  {
    name: "Summer 2024",
    slug: "summer-2024",
    description: "Bright and vibrant",
  },
  {
    name: "Noir Series",
    slug: "noir-series",
    description: "Black and white elegance",
  },
];

export async function seedInitialData() {
  try {
    // Check if categories exist
    const catCount = await db.category.count();
    if (catCount === 0) {
      await db.category.createMany({
        data: categories,
      });
    }

    const colCount = await db.collection.count();
    if (colCount === 0) {
      await db.collection.createMany({
        data: collections,
      });
    }

    return { success: true, message: "Initial data seeded" };
  } catch (error) {
    console.error("Seed error:", error);
    return { success: false, error: "Failed to seed data" };
  }
}

export async function seedAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@thewallstack.com";

    const existingAdmin = await db.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      console.log(
        `Admin user ${adminEmail} not found. Ensure the user signs up first.`
      );
      return { success: false, error: "User not found. Sign up first." };
    }

    await db.user.update({
      where: { email: adminEmail },
      data: { role: "admin" },
    });

    return { success: true, message: `User ${adminEmail} is now an ADMIN.` };
  } catch (error) {
    console.error("Admin seed error:", error);
    return { success: false, error: "Failed to seed admin" };
  }
}
