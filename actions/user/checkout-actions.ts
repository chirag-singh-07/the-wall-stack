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
          create: await Promise.all(
            data.items.map(async (item) => {
              // Check if it's a valid Poster in DB to avoid foreign key violation
              const posterExists = await prisma.poster.findUnique({
                where: { id: item.productId },
                select: { id: true },
              });

              return {
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                productId: item.productId, // Always store the plain ID
                posterId: posterExists ? item.productId : null, // Only link if exists
                customPosterId: item.productId.startsWith("cus_")
                  ? item.productId
                  : null,
              };
            })
          ),
        },
      },
    });

    return {
      success: true,
      data: { id: order.id }, // Return just the ID or necessary data
    };
  } catch (error: any) {
    console.error("Failed to create order:", error);
    return {
      success: false,
      error: error?.message || "Failed to create order. Please try again.",
    };
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
