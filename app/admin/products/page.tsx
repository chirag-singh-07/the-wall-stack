"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { DataTable } from "@/components/admin/data-table"
import { useAdminStore, type AdminProduct } from "@/lib/admin-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const statusStyles: Record<AdminProduct["status"], string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
  archived: "bg-gray-100 text-gray-800 border-gray-200",
}

export default function AdminProductsPage() {
  const { products, deleteProduct } = useAdminStore()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const columns = [
    {
      key: "product",
      header: "Product",
      render: (item: AdminProduct) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded bg-muted">
            <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
          </div>
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item: AdminProduct) => <span className="font-medium">${item.price}</span>,
    },
    {
      key: "stock",
      header: "Stock",
      render: (item: AdminProduct) => (
        <span className={item.stock < 20 ? "text-red-600 font-medium" : ""}>{item.stock}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AdminProduct) => (
        <Badge variant="outline" className={statusStyles[item.status]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      render: (item: AdminProduct) => (
        <span className="text-sm text-muted-foreground">{new Date(item.updatedAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (item: AdminProduct) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/shop/${item.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/products/${item.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteId(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <AdminHeader title="Products" />

      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Manage your poster products</p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Products Table */}
        <DataTable
          data={products}
          columns={columns}
          searchPlaceholder="Search products..."
          searchKey="title"
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "active", label: "Active" },
                { value: "draft", label: "Draft" },
                { value: "archived", label: "Archived" },
              ],
            },
            {
              key: "category",
              label: "Category",
              options: [
                { value: "minimal", label: "Minimal" },
                { value: "abstract", label: "Abstract" },
                { value: "typography", label: "Typography" },
              ],
            },
          ]}
        />
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) {
                  deleteProduct(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
