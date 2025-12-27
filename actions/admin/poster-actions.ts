"use server";

import { db } from "@/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

export async function getPosters() {
  return unstable_cache(
    async () => {
      try {
        const posters = await db.poster.findMany({
          include: {
            category: true,
            collection: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        return { success: true, data: posters };
      } catch (error) {
        console.error("Error fetching posters:", error);
        return { success: false, error: "Failed to fetch posters" };
      }
    },
    ["posters-list"],
    { tags: ["posters"] }
  )();
}

export async function getPosterById(id: string) {
  return unstable_cache(
    async () => {
      try {
        const poster = await db.poster.findUnique({
          where: { id },
          include: {
            category: true,
            collection: true,
          },
        });
        return { success: true, data: poster };
      } catch (error) {
        console.error("Error fetching poster:", error);
        return { success: false, error: "Failed to fetch poster" };
      }
    },
    [`poster-${id}`],
    { tags: ["posters", `poster-${id}`] }
  )();
}

export async function createPoster(data: any) {
  try {
    const {
      title,
      description,
      price,
      stock,
      image,
      images,
      categoryId,
      collectionId,
      status,
    } = data;
    const slug = `${slugify(title)}-${Date.now()}`;

    const poster = await db.poster.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image,
        images,
        categoryId:
          categoryId === "none" || categoryId === "" ? null : categoryId,
        collectionId:
          collectionId === "none" || collectionId === "" ? null : collectionId,
        status,
        isBestseller: data.isBestseller || false,
        isLimitedEdition: data.isLimitedEdition || false,
        isFeatured: data.isFeatured || false,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidateTag("posters");
    return { success: true, data: poster };
  } catch (error) {
    console.error("Error creating poster:", error);
    return { success: false, error: "Failed to create poster" };
  }
}

export async function updatePoster(id: string, data: any) {
  try {
    const {
      title,
      description,
      price,
      stock,
      image,
      images,
      categoryId,
      collectionId,
      status,
    } = data;

    // Check if title changed to update slug if needed (optional)
    const updateData: any = {
      title,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image,
      images,
      categoryId:
        categoryId === "none" || categoryId === "" ? null : categoryId,
      collectionId:
        collectionId === "none" || collectionId === "" ? null : collectionId,
      status,
      isBestseller: data.isBestseller,
      isLimitedEdition: data.isLimitedEdition,
      isFeatured: data.isFeatured,
    };

    const poster = await db.poster.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/shop");
    revalidateTag("posters");
    revalidateTag(`poster-${id}`);
    return { success: true, data: poster };
  } catch (error) {
    console.error("Error updating poster:", error);
    return { success: false, error: "Failed to update poster" };
  }
}

export async function deletePoster(id: string) {
  try {
    await db.poster.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidateTag("posters");
    return { success: true };
  } catch (error) {
    console.error("Error deleting poster:", error);
    return { success: false, error: "Failed to delete poster" };
  }
}

export async function getCategories() {
  return unstable_cache(
    async () => {
      try {
        const categories = await db.category.findMany({
          include: {
            _count: {
              select: { posters: true },
            },
          },
        });
        return {
          success: true,
          data: categories.map((c: any) => ({
            ...c,
            productCount: c._count.posters,
          })),
        };
      } catch (error) {
        return { success: false, error: "Failed to fetch categories" };
      }
    },
    ["categories-list"],
    { tags: ["categories"] }
  )();
}

export async function createCategory(data: any) {
  try {
    const category = await db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status,
      },
    });
    revalidatePath("/admin/categories");
    revalidateTag("categories");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: any) {
  try {
    const category = await db.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status,
      },
    });
    revalidatePath("/admin/categories");
    revalidateTag("categories");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({
      where: { id },
    });
    revalidatePath("/admin/categories");
    revalidateTag("categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function getCollections() {
  return unstable_cache(
    async () => {
      try {
        const collections = await db.collection.findMany({
          include: {
            _count: {
              select: { posters: true },
            },
          },
        });
        return {
          success: true,
          data: collections.map((c: any) => ({
            ...c,
            productCount: c._count.posters,
          })),
        };
      } catch (error) {
        return { success: false, error: "Failed to fetch collections" };
      }
    },
    ["collections-list"],
    { tags: ["collections"] }
  )();
}

export async function getCollectionById(id: string) {
  try {
    const collection = await db.collection.findUnique({
      where: { id },
    });
    return { success: true, data: collection };
  } catch (error) {
    return { success: false, error: "Failed to fetch collection" };
  }
}

export async function createCollection(data: any) {
  try {
    const { title, description, image, status } = data;
    const slug = `${slugify(title)}-${Date.now()}`;

    const collection = await db.collection.create({
      data: {
        title,
        slug,
        description,
        image,
        coverImage: data.coverImage,
        isFeatured: data.isFeatured || false,
        status,
      },
    });
    revalidatePath("/admin/collections");
    return { success: true, data: collection };
  } catch (error) {
    console.error("Error creating collection:", error);
    return { success: false, error: "Failed to create collection" };
  }
}

export async function updateCollection(id: string, data: any) {
  try {
    const collection = await db.collection.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        coverImage: data.coverImage,
        isFeatured: data.isFeatured,
        status: data.status,
      },
    });
    revalidatePath("/admin/collections");
    return { success: true, data: collection };
  } catch (error) {
    console.error("Error updating collection:", error);
    return { success: false, error: "Failed to update collection" };
  }
}

export async function deleteCollection(id: string) {
  try {
    await db.collection.delete({
      where: { id },
    });
    revalidatePath("/admin/collections");
    return { success: true };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { success: false, error: "Failed to delete collection" };
  }
}

export async function getPostersForShop(filters: {
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  try {
    const { search, categories, minPrice, maxPrice, sort } = filters;

    let where: any = {
      status: "active",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categories && categories.length > 0) {
      where.category = {
        name: { in: categories },
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "name-asc") orderBy = { title: "asc" };
    else if (sort === "name-desc") orderBy = { title: "desc" };

    const posters = await db.poster.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    });

    return { success: true, data: posters };
  } catch (error) {
    console.error("Shop fetch error:", error);
    return { success: false, error: "Failed to fetch shop posters" };
  }
}
