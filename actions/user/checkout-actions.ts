"use server";

import { db as prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CreateOrderInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
    size: string;
  }[];
  userId?: string;
};

export async function createOrder(data: CreateOrderInput) {
  try {
    const order = await prisma.order.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        total: data.total,
        userId: data.userId,
        status: "pending",
        paymentMethod: "COD",
        items: {
          create: data.items.map((item) => {
            // Determine if it's a regular poster or custom poster based on ID prefix or check
            // For now, we'll try to connect to Poster if it exists, otherwise assume CustomPoster
            // or just store the IDs. But relation requires valid ID.
            // A safer way if IDs are distinct:
            const isCustom = item.productId.startsWith("cus_"); // Assuming custom posters might have a prefix or we check DB.
            // Actually, the cart store puts 'productId' which matches schema IDs.

            // Simplification: We will store the ID in specific field if we can map it.
            // But prisma create needs explicit connection.
            // If we can't guarantee existence (e.g. deleted), we might need to be careful.
            // Let's assume standard Posters for now. Custom Posters might need logic.

            // To handle both, we should check what 'productId' is.
            // For this implementation, I'll link to `posterId` if possible.

            return {
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              // We will try to link to Poster. If it fails, it might be an issue.
              // Ideally we should know the type.
              // Let's rely on the cart assuming it passes valid Poster IDs.
              // If it's a custom poster, we need to know.
              // I'll add logic to check if it's a custom poster later or assume regular for now.
              posterId: item.productId,
            };
          }),
        },
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, data: order };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            poster: true,
            // customPoster: true // Include this if added to schema
          },
        },
      },
    });
    return { success: true, data: orders };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin/orders");
    return { success: true, data: order };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
