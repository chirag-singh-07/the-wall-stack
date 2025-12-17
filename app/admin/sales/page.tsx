"use client"

import type React from "react"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { useAdminStore } from "@/lib/admin-store"
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

export default function AdminSalesPage() {
  const { salesData, orders, products, customers } = useAdminStore()
  const [timeRange, setTimeRange] = useState("14d")

  // Calculate metrics
  const totalRevenue = salesData.reduce((acc, day) => acc + day.revenue, 0)
  const totalOrders = salesData.reduce((acc, day) => acc + day.orders, 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  // Calculate growth (mock)
  const revenueGrowth = 12.5
  const orderGrowth = 8.2

  // Category distribution
  const categoryData = [
    { name: "Minimal", value: 35, color: "#171717" },
    { name: "Abstract", value: 40, color: "#525252" },
    { name: "Typography", value: 25, color: "#a3a3a3" },
  ]

  // Top selling products
  const topProducts = products.slice(0, 5).map((p, i) => ({
    ...p,
    sales: Math.floor(Math.random() * 50) + 20,
    revenue: (Math.floor(Math.random() * 50) + 20) * p.price,
  }))

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
            value={`$${totalRevenue.toLocaleString()}`}
            change={revenueGrowth}
            icon={DollarSign}
          />
          <MetricCard title="Total Orders" value={totalOrders.toString()} change={orderGrowth} icon={ShoppingCart} />
          <MetricCard title="Avg. Order Value" value={`$${avgOrderValue}`} change={5.3} icon={TrendingUp} />
          <MetricCard title="New Customers" value={customers.length.toString()} change={15.2} icon={Users} />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Daily revenue for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#171717" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#171717" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                      tick={{ fontSize: 12 }}
                      stroke="#a3a3a3"
                    />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
                              <p className="text-sm font-medium">
                                {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-lg font-bold">${payload[0].value}</p>
                              <p className="text-xs text-muted-foreground">{payload[0].payload.orders} orders</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#171717"
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-border bg-background p-2 shadow-lg">
                              <p className="text-sm font-medium">{payload[0].payload.name}</p>
                              <p className="text-lg font-bold">{payload[0].value}%</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <span className="text-sm font-medium">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Overview</CardTitle>
            <CardDescription>Daily order count for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    tick={{ fontSize: 12 }}
                    stroke="#a3a3a3"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
                            <p className="text-sm font-medium">
                              {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-lg font-bold">{payload[0].value} orders</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="orders" fill="#171717" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing posters by sales volume</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.title}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.revenue}</p>
                    <p className="text-xs text-muted-foreground">${product.price}/unit</p>
                  </div>
                </div>
              ))}
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            <div className="mt-2 flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : ""}
                {change}%
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-foreground p-3 text-background">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
