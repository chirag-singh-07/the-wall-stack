"use client"

import { useState } from "react"
import Image from "next/image"
import { AdminHeader } from "@/components/admin/admin-header"
import { DataTable } from "@/components/admin/data-table"
import { useAdminStore, type AdminOrder } from "@/lib/admin-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

const statusStyles: Record<AdminOrder["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdminStore()
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  const columns = [
    {
      key: "order",
      header: "Order",
      render: (item: AdminOrder) => (
        <div>
          <p className="font-medium">{item.id}</p>
          <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (item: AdminOrder) => (
        <div>
          <p className="font-medium">{item.customerName}</p>
          <p className="text-xs text-muted-foreground">{item.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (item: AdminOrder) => (
        <div className="flex -space-x-2">
          {item.items.slice(0, 3).map((orderItem, i) => (
            <div key={i} className="relative h-8 w-8 overflow-hidden rounded border-2 border-background">
              <Image src={orderItem.image || "/placeholder.svg"} alt={orderItem.title} fill className="object-cover" />
            </div>
          ))}
          {item.items.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-background bg-muted text-xs font-medium">
              +{item.items.length - 3}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (item: AdminOrder) => <span className="font-medium">${item.total}</span>,
    },
    {
      key: "payment",
      header: "Payment",
      render: (item: AdminOrder) => <span className="text-sm">{item.paymentMethod}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item: AdminOrder) => (
        <Select value={item.status} onValueChange={(value: AdminOrder["status"]) => updateOrderStatus(item.id, value)}>
          <SelectTrigger className="w-32 h-8">
            <Badge variant="outline" className={statusStyles[item.status]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (item: AdminOrder) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(item)}>
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details - {item.id}</DialogTitle>
              <DialogDescription>View complete order information</DialogDescription>
            </DialogHeader>
            <OrderDetails order={item} />
          </DialogContent>
        </Dialog>
      ),
    },
  ]

  // Calculate stats
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const processingOrders = orders.filter((o) => o.status === "processing").length
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)

  return (
    <div className="min-h-screen">
      <AdminHeader title="Orders" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Processing</p>
            <p className="text-2xl font-bold text-blue-600">{processingOrders}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">${totalRevenue}</p>
          </div>
        </div>

        {/* Orders Table */}
        <DataTable
          data={orders}
          columns={columns}
          searchPlaceholder="Search orders..."
          searchKey="id"
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}

function OrderDetails({ order }: { order: AdminOrder }) {
  return (
    <div className="space-y-6">
      {/* Order Status */}
      <div className="flex items-center justify-between rounded-lg bg-muted p-4">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5" />
          <div>
            <p className="font-medium">Order Status</p>
            <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
        <Badge variant="outline" className={statusStyles[order.status]}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      {/* Customer Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <h4 className="font-medium mb-2">Customer</h4>
          <p className="text-sm">{order.customerName}</p>
          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <h4 className="font-medium mb-2">Shipping Address</h4>
          <p className="text-sm">{order.shippingAddress.street}</p>
          <p className="text-sm">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p className="text-sm">{order.shippingAddress.country}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-lg border border-border">
        <div className="border-b border-border p-4">
          <h4 className="font-medium">Order Items</h4>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 overflow-hidden rounded bg-muted">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.size} × {item.quantity}
                </p>
              </div>
              <p className="font-medium">${item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-4">
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold">${order.total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
