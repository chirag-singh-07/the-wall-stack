"use server";

import { db } from "@/lib/prisma";

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  newCustomers: number;
  revenueGrowth: number;
  orderGrowth: number;
}

export interface DailySalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  title: string;
  price: number;
  sales: number;
  revenue: number;
  image?: string;
}

/**
 * Get sales metrics for the specified time period
 */
export async function getSalesMetrics(
  daysBack: number = 14
): Promise<SalesMetrics> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Get all orders from the database for the period
    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        items: true,
      },
    });

    // Calculate metrics
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );
    const totalOrders = orders.length;
    const avgOrderValue =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Get total unique customers
    const totalCustomers = await db.user.count();

    // Get new customers (joined in the period)
    const newCustomers = await db.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Calculate growth (compare with previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - daysBack);

    const previousOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    });

    const previousRevenue = previousOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );
    const revenueGrowth =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;
    const orderGrowth =
      previousOrders.length > 0
        ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100
        : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      newCustomers,
      revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
      orderGrowth: parseFloat(orderGrowth.toFixed(1)),
    };
  } catch (error) {
    console.error("Error fetching sales metrics:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      newCustomers: 0,
      revenueGrowth: 0,
      orderGrowth: 0,
    };
  }
}

/**
 * Get daily sales data for chart visualization
 */
export async function getDailySalesData(
  daysBack: number = 14
): Promise<DailySalesData[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    startDate.setHours(0, 0, 0, 0);

    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    // Group by day
    const dailyData: { [key: string]: { revenue: number; orders: number } } =
      {};

    // Initialize all days in range with 0
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      dailyData[dateStr] = { revenue: 0, orders: 0 };
    }

    // Aggregate orders by day
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      if (dailyData[date]) {
        dailyData[date].revenue += order.total || 0;
        dailyData[date].orders += 1;
      }
    });

    // Convert to array format for charts
    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        revenue: Math.round(data.revenue),
        orders: data.orders,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
    return [];
  }
}

/**
 * Get top selling products
 */
export async function getTopSellingProducts(
  limit: number = 5
): Promise<TopProduct[]> {
  try {
    const orderItems = await db.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
        price: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    const topProducts: TopProduct[] = [];

    for (const item of orderItems) {
      if (!item.productId) continue;

      const product = await db.poster.findUnique({
        where: {
          id: Number(item.productId),
        },
        select: {
          id: true,
          title: true,
          price: true,
          image: true,
        },
      });

      if (product) {
        topProducts.push({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
        });
      }
    }

    return topProducts;
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    return [];
  }
}

/**
 * Get category distribution
 */
export async function getCategoryDistribution() {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        posters: {
          select: {
            id: true,
          },
        },
      },
    });

    const categoryData = categories
      .map((cat) => ({
        name: cat.name,
        value: cat.posters.length,
        color: generateColorForCategory(cat.name),
      }))
      // 🔥 sort by poster count (descending)
      .sort((a, b) => b.value - a.value)
      // 🔥 take top 4
      .slice(0, 4);

    return categoryData;
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    return [];
  }
}

/**
 * Get all orders with customer details
 */
export async function getAllOrders(limit?: number) {
  try {
    const orders = await db.order.findMany({
      include: {
        items: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

/**
 * Helper function to generate colors for categories
 */
function generateColorForCategory(categoryName: string): string {
  const colors: { [key: string]: string } = {
    minimal: "#171717",
    abstract: "#525252",
    typography: "#a3a3a3",
    landscape: "#1f2937",
    portrait: "#3b82f6",
    modern: "#ec4899",
  };

  return colors[categoryName.toLowerCase()] || "#6b7280";
}
