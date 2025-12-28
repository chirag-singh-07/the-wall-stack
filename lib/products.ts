import { db } from "@/lib/prisma";

import { allProducts, Product } from "@/lib/products-shared";

export * from "@/lib/products-shared";

// Server-side functions

export async function getProductWithDetails(idOrSlug: string): Promise<
  | (Product & {
      description: string;
      sizes: { name: string; price: number }[];
      details: string[];
    })
  | null
> {
  try {
    const decodedId = decodeURIComponent(idOrSlug);

    // Try to find by ID or Slug in database
    const poster = await db.poster.findFirst({
      where: {
        OR: [{ id: decodedId }, { slug: decodedId }],
      },
      include: {
        category: true,
      },
    });

    if (poster) {
      return {
        id: poster.id,
        title: poster.title,
        price: poster.price,
        category: poster.category?.name || "Poster",
        image: poster.image,
        description: poster.description || "No description available.",
        sizes: [
          { name: "A4 (21×30cm)", price: Math.round(poster.price * 0.6) },
          { name: "A3 (30×42cm)", price: poster.price },
          { name: "A2 (42×59cm)", price: Math.round(poster.price * 1.6) },
          { name: "A1 (59×84cm)", price: Math.round(poster.price * 2.4) },
        ],
        details: [
          "Premium 250gsm matte art paper",
          "Archival quality inks",
          "Ships in protective tube",
          "Handcrafted in studio",
        ],
      };
    }

    // Fallback to static data if not found in DB (for existing hardcoded items)
    const staticProduct = allProducts.find((p) => p.id === idOrSlug);
    if (!staticProduct) return null;

    return {
      ...staticProduct,
      description:
        staticProduct.description ||
        "A stunning piece of minimalist art that brings elegance and sophistication to any space.",
      sizes: [
        { name: "A4 (21×30cm)", price: Math.round(staticProduct.price * 0.6) },
        { name: "A3 (30×42cm)", price: staticProduct.price },
        { name: "A2 (42×59cm)", price: Math.round(staticProduct.price * 1.6) },
        { name: "A1 (59×84cm)", price: Math.round(staticProduct.price * 2.4) },
      ],
      details: [
        "Premium 250gsm matte art paper",
        "Archival quality inks",
        "Ships in protective tube",
        "Handcrafted in studio",
      ],
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getRecommendedProducts(
  currentId: string,
  category: string,
  limit = 4
): Promise<Product[]> {
  try {
    const posters = await db.poster.findMany({
      where: {
        id: { not: currentId },
        status: "active",
        category: {
          name: category,
        },
      },
      take: limit,
      include: {
        category: true,
      },
    });

    if (posters.length > 0) {
      return posters.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        category: p.category?.name || "Poster",
        image: p.image,
      }));
    }

    // Fallback to static
    return allProducts.filter((p) => p.id !== currentId).slice(0, limit);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return [];
  }
}
