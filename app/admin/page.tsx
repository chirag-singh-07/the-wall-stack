"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { StatCard } from "@/components/admin/stat-card"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { SalesChart } from "@/components/admin/sales-chart"
import { TopProducts } from "@/components/admin/top-products"
import { useAdminStore } from "@/lib/admin-store"
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"

export default function AdminDashboard() {
  const { orders, customers, products, salesData } = useAdminStore()

  const totalRevenue = salesData.reduce((acc, day) => acc + day.revenue, 0)
  const totalOrders = salesData.reduce((acc, day) => acc + day.orders, 0)

  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change={12.5} icon={DollarSign} />
          <StatCard title="Total Orders" value={totalOrders} change={8.2} icon={ShoppingCart} />
          <StatCard title="Total Customers" value={customers.length} change={15.3} icon={Users} />
          <StatCard title="Total Products" value={products.length} change={3.1} icon={Package} />
        </div>

        {/* Charts and Tables */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div>
            <TopProducts />
          </div>
        </div>

        {/* Recent Orders */}
        <RecentOrdersTable />
      </div>
    </div>
  )
}
