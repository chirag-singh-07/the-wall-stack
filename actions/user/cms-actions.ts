"use server";

import { db } from "@/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export type SectionContent = Record<string, any>;

/**
 * Get content for a specific section
 */
export async function getSectionContent(key: string) {
  return unstable_cache(
    async () => {
      try {
        const section = await db.pageSection.findUnique({
          where: { key },
        });

        if (!section) return { success: true, data: null };

        return {
          success: true,
          data: {
            ...section,
            content: JSON.parse(section.content),
          },
        };
      } catch (error) {
        console.error(`Error fetching section ${key}:`, error);
        return { success: false, error: "Failed to fetch section content" };
      }
    },
    [`section-${key}`],
    { tags: ["cms", `section-${key}`] }
  )();
}

/**
 * Update content for a section
 */
export async function updateSectionContent(
  key: string,
  content: SectionContent
) {
  try {
    const section = await db.pageSection.upsert({
      where: { key },
      update: {
        content: JSON.stringify(content),
      },
      create: {
        key,
        content: JSON.stringify(content),
      },
    });

    revalidatePath("/");
    return { success: true, data: section };
  } catch (error) {
    console.error(`Error updating section ${key}:`, error);
    return { success: false, error: "Failed to update section content" };
  }
}

/**
 * Get all sections
 */
export async function getAllSections() {
  return unstable_cache(
    async () => {
      try {
        const sections = await db.pageSection.findMany({
          orderBy: { key: "asc" },
        });

        return {
          success: true,
          data: sections.map((s) => ({
            ...s,
            content: JSON.parse(s.content),
          })),
        };
      } catch (error) {
        return { success: false, error: "Failed to fetch sections" };
      }
    },
    ["all-sections"],
    { tags: ["cms"] }
  )();
}
