"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { DataTable } from "@/components/admin/data-table"
import { useAdminStore, type Customer } from "@/lib/admin-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminUsersPage() {
  const { customers } = useAdminStore()

  const columns = [
    {
      key: "customer",
      header: "Customer",
      render: (item: Customer) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={item.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-foreground text-background text-sm">
              {item.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (item: Customer) => <span className="text-sm">{item.phone}</span>,
    },
    {
      key: "orders",
      header: "Orders",
      render: (item: Customer) => <span className="font-medium">{item.totalOrders}</span>,
    },
    {
      key: "spent",
      header: "Total Spent",
      render: (item: Customer) => <span className="font-medium">${item.totalSpent}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item: Customer) => (
        <Badge
          variant="outline"
          className={
            item.status === "active"
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-gray-100 text-gray-800 border-gray-200"
          }
        >
          {item.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (item: Customer) => (
        <span className="text-sm text-muted-foreground">{new Date(item.joinedDate).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (item: Customer) => (
        <div className="flex items-center justify-end gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Customer Details</DialogTitle>
                <DialogDescription>View customer information and order history</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={item.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-foreground text-background text-lg">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-muted-foreground">{item.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{item.totalOrders}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">${item.totalSpent}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="rounded-lg border border-border p-4 space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Phone:</span> {item.phone}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Member since:</span>{" "}
                      {new Date(item.joinedDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <AdminHeader title="Users" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{customers.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-2xl font-bold">{customers.filter((c) => c.status === "active").length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Avg. Order Value</p>
            <p className="text-2xl font-bold">
              ${Math.round(customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.length)}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <DataTable
          data={customers}
          columns={columns}
          searchPlaceholder="Search users..."
          searchKey="name"
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}
