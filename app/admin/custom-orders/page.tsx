"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { DataTable } from "@/components/admin/data-table"
import { useAdminStore, type CustomPosterOrder } from "@/lib/admin-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageSquare, Palette } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const statusStyles: Record<CustomPosterOrder["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  review: "bg-purple-100 text-purple-800 border-purple-200",
  approved: "bg-cyan-100 text-cyan-800 border-cyan-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels: Record<CustomPosterOrder["status"], string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  review: "In Review",
  approved: "Approved",
  completed: "Completed",
  cancelled: "Cancelled",
}

export default function AdminCustomOrdersPage() {
  const { customOrders, updateCustomOrderStatus } = useAdminStore()

  const columns = [
    {
      key: "order",
      header: "Order",
      render: (item: CustomPosterOrder) => (
        <div>
          <p className="font-medium">{item.id}</p>
          <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (item: CustomPosterOrder) => (
        <div>
          <p className="font-medium">{item.customerName}</p>
          <p className="text-xs text-muted-foreground">{item.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (item: CustomPosterOrder) => (
        <p className="text-sm text-muted-foreground max-w-xs truncate">{item.description}</p>
      ),
    },
    {
      key: "size",
      header: "Size",
      render: (item: CustomPosterOrder) => <span className="text-sm">{item.size}</span>,
    },
    {
      key: "budget",
      header: "Budget",
      render: (item: CustomPosterOrder) => <span className="font-medium">${item.budget}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item: CustomPosterOrder) => (
        <Select
          value={item.status}
          onValueChange={(value: CustomPosterOrder["status"]) => updateCustomOrderStatus(item.id, value)}
        >
          <SelectTrigger className="w-32 h-8">
            <Badge variant="outline" className={statusStyles[item.status]}>
              {statusLabels[item.status]}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (item: CustomPosterOrder) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Custom Order - {item.id}</DialogTitle>
              <DialogDescription>View and manage custom poster order</DialogDescription>
            </DialogHeader>
            <CustomOrderDetails order={item} />
          </DialogContent>
        </Dialog>
      ),
    },
  ]

  // Calculate stats
  const pendingOrders = customOrders.filter((o) => o.status === "pending").length
  const inProgressOrders = customOrders.filter((o) => o.status === "in-progress").length
  const totalBudget = customOrders.reduce((acc, o) => acc + o.budget, 0)

  return (
    <div className="min-h-screen">
      <AdminHeader title="Custom Orders" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </div>
            <p className="text-2xl font-bold mt-1">{customOrders.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{inProgressOrders}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">${totalBudget}</p>
          </div>
        </div>

        {/* Custom Orders Table */}
        <DataTable
          data={customOrders}
          columns={columns}
          searchPlaceholder="Search custom orders..."
          searchKey="id"
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "pending", label: "Pending" },
                { value: "in-progress", label: "In Progress" },
                { value: "review", label: "In Review" },
                { value: "approved", label: "Approved" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}

function CustomOrderDetails({ order }: { order: CustomPosterOrder }) {
  const [designNotes, setDesignNotes] = useState(order.designNotes || "")

  return (
    <div className="space-y-6">
      {/* Status & Date */}
      <div className="flex items-center justify-between rounded-lg bg-muted p-4">
        <div className="flex items-center gap-3">
          <Palette className="h-5 w-5" />
          <div>
            <p className="font-medium">Custom Poster Request</p>
            <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
        <Badge variant="outline" className={statusStyles[order.status]}>
          {statusLabels[order.status]}
        </Badge>
      </div>

      {/* Customer & Budget */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <h4 className="font-medium mb-2">Customer</h4>
          <p className="text-sm">{order.customerName}</p>
          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <h4 className="font-medium mb-2">Project Details</h4>
          <p className="text-sm">
            <span className="text-muted-foreground">Size:</span> {order.size}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Budget:</span> ${order.budget}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-lg border border-border p-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Customer Brief
        </h4>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.description}</p>
      </div>

      {/* Design Notes */}
      <div className="space-y-2">
        <Label htmlFor="designNotes">Design Notes (Internal)</Label>
        <Textarea
          id="designNotes"
          value={designNotes}
          onChange={(e) => setDesignNotes(e.target.value)}
          placeholder="Add notes about the design process..."
          rows={4}
        />
        <Button size="sm" variant="outline">
          Save Notes
        </Button>
      </div>
    </div>
  )
}
