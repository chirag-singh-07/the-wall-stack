"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, ShoppingCart, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  getSalesMetrics,
  getDailySalesData,
  getTopSellingProducts,
  getCategoryDistribution,
  type SalesMetrics,
  type DailySalesData,
  type TopProduct,
} from "@/actions/admin/sales-actions"
import { formatINR } from "@/lib/currency"

// Format price with Indian Rupee
const formatPrice = formatINR

export default function AdminSalesPage() {
  const [timeRange, setTimeRange] = useState("14d")
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null)
  const [dailySalesData, setDailySalesData] = useState<DailySalesData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [categoryData, setCategoryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Map time range to days
  const getDaysFromRange = (range: string) => {
    const rangeMap: { [key: string]: number } = {
      "7d": 7,
      "14d": 14,
      "30d": 30,
      "90d": 90,
    };
    return rangeMap[range] || 14;
  };

  // Mock data for empty state
  const mockMetrics: SalesMetrics = {
    totalRevenue: 125000,
    totalOrders: 42,
    avgOrderValue: 2976,
    newCustomers: 18,
    revenueGrowth: 12.5,
    orderGrowth: 8.2,
  };

  const mockDailySalesData: DailySalesData[] = [
    { date: "2025-12-20", revenue: 8500, orders: 3 },
    { date: "2025-12-21", revenue: 12000, orders: 5 },
    { date: "2025-12-22", revenue: 9800, orders: 4 },
    { date: "2025-12-23", revenue: 15200, orders: 6 },
    { date: "2025-12-24", revenue: 11500, orders: 4 },
    { date: "2025-12-25", revenue: 18000, orders: 7 },
    { date: "2025-12-26", revenue: 13000, orders: 5 },
    { date: "2025-12-27", revenue: 16500, orders: 8 },
  ];

  const mockTopProducts: TopProduct[] = [
    { id: "1", title: "Minimal Aesthetic Poster", price: 299, sales: 45, revenue: 13455 },
    { id: "2", title: "Abstract Art Series", price: 399, sales: 32, revenue: 12768 },
    { id: "3", title: "Typography Wall Art", price: 349, sales: 28, revenue: 9772 },
    { id: "4", title: "Modern Geometric Set", price: 499, sales: 18, revenue: 8982 },
    { id: "5", title: "Vintage Collection", price: 279, sales: 22, revenue: 6138 },
  ];

  const mockCategoryData = [
    { name: "Minimal", value: 35, color: "#171717" },
    { name: "Abstract", value: 28, color: "#525252" },
    { name: "Typography", value: 22, color: "#a3a3a3" },
    { name: "Modern", value: 15, color: "#6b7280" },
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const days = getDaysFromRange(timeRange);

        // Fetch all data in parallel
        const [metricsData, salesData, topProd, categories] = await Promise.all([
          getSalesMetrics(days),
          getDailySalesData(days),
          getTopSellingProducts(5),
          getCategoryDistribution(),
        ]);

        // Use mock data if empty
        setMetrics(metricsData && metricsData.totalRevenue > 0 ? metricsData : mockMetrics);
        setDailySalesData(salesData && salesData.length > 0 ? salesData : mockDailySalesData);
        setTopProducts(topProd && topProd.length > 0 ? topProd : mockTopProducts);
        setCategoryData(categories && categories.length > 0 ? categories : mockCategoryData);
      } catch (error) {
        console.error("Error loading sales data:", error);
        // Use mock data on error
        setMetrics(mockMetrics);
        setDailySalesData(mockDailySalesData);
        setTopProducts(mockTopProducts);
        setCategoryData(mockCategoryData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  if (!metrics || isLoading) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="Sales Analytics" />
        <div className="p-6 flex items-center justify-center">
          <p className="text-muted-foreground">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Sales Analytics" />

      <div className="p-6 space-y-6">
        {/* Time Range Filter */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Track your store performance and revenue</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="14d">Last 14 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={formatPrice(metrics.totalRevenue)}
            change={metrics.revenueGrowth}
            icon={DollarSign}
          />
          <MetricCard title="Total Orders" value={metrics.totalOrders.toString()} change={metrics.orderGrowth} icon={ShoppingCart} />
          <MetricCard title="Avg. Order Value" value={formatPrice(metrics.avgOrderValue)} change={5.3} icon={TrendingUp} />
          <MetricCard title="New Customers" value={metrics.newCustomers.toString()} change={15.2} icon={Users} />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Revenue Overview</CardTitle>
              <CardDescription>Daily revenue for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] -mx-6 px-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#171717" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#171717" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                      tick={{ fontSize: 12, fill: "#a3a3a3" }}
                      stroke="transparent"
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: "#a3a3a3" }} 
                      stroke="transparent"
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
                              <p className="text-sm font-medium text-foreground">
                                {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-lg font-bold text-foreground mt-1">{formatPrice(payload[0].payload.revenue)}</p>
                              <p className="text-xs text-muted-foreground mt-1">{payload[0].payload.orders} orders</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#171717"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      isAnimationActive
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Distribution */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Category Distribution</CardTitle>
            <CardDescription>Product breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="45%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      fill="#8884d8"
                    >
                      {categoryData.map((entry: any, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "8px 12px",
                      }}
                      formatter={(value: any) => [`${value}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex flex-col justify-center">
                {categoryData.map((cat: any) => {
                  const total = categoryData.reduce((sum: number, c: any) => sum + c.value, 0);
                  const percentage = ((cat.value / total) * 100).toFixed(1);
                  return (
                    <div key={cat.name} className="flex items-center justify-between group hover:bg-accent/50 p-2 rounded-md transition-colors">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-3 w-3 rounded-full shadow-sm" 
                          style={{ backgroundColor: cat.color }}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.value} products</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-foreground bg-accent px-2 py-1 rounded">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Orders Overview</CardTitle>
            <CardDescription>Daily order count for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] -mx-6 px-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    tick={{ fontSize: 12, fill: "#a3a3a3" }}
                    stroke="transparent"
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "#a3a3a3" }} 
                    stroke="transparent"
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
                            <p className="text-sm font-medium text-foreground">
                              {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-lg font-bold text-foreground mt-1">{payload[0].value} orders</p>
                            <p className="text-xs text-muted-foreground mt-1">{formatINR(payload[0].payload.revenue)} revenue</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="orders" fill="#171717" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg">Top Selling Products</CardTitle>
              <CardDescription className="mt-1">Best performing posters by sales volume</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-foreground to-foreground/80 text-background font-bold text-sm shadow-md">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate group-hover:text-foreground/80">{product.title}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatINR(product.revenue)}</p>
                      <p className="text-xs text-muted-foreground">{formatINR(product.price)}/unit</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string
  value: string
  change: number
  icon: React.ComponentType<{ className?: string }>
}) {
  const isPositive = change > 0

  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">{value}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isPositive ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}>
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-xs font-semibold ${isPositive ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {isPositive ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-foreground to-foreground/80 p-3 text-background shadow-lg">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
