"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import { getPosters, deletePoster } from "@/actions/admin/poster-actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusStyles: Record<string, string> = {
  active:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  draft:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  archived:
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
};

export default function AdminProductsPage() {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosters = async () => {
    setLoading(true);
    const result = await getPosters();
    if (result.success) {
      setPosters(result.data || []);
    } else {
      toast.error("Failed to load posters");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const result = await deletePoster(deleteId);
    if (result.success) {
      toast.success("Poster deleted successfully");
      setPosters(posters.filter((p) => p.id !== deleteId));
    } else {
      toast.error("Failed to delete poster");
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const columns = [
    {
      key: "product",
      header: "Poster",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted border border-border">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {item.category?.name || "Uncategorized"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item: any) => (
        <span className="font-medium">${item.price.toFixed(2)}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (item: any) => (
        <span className={item.stock < 10 ? "text-destructive font-medium" : ""}>
          {item.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => (
        <Badge variant="outline" className={statusStyles[item.status] || ""}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: "updated",
      header: "Last Updated",
      render: (item: any) => (
        <span className="text-xs text-muted-foreground">
          {new Date(item.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (item: any) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" asChild title="View in Shop">
            <Link href={`/shop/${item.slug}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild title="Edit Poster">
            <Link href={`/admin/products/${item.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteId(item.id)}
            title="Delete Poster"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader title="Posters Management" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Posters Collection
            </h2>
            <p className="text-muted-foreground">
              Add, edit, and manage your artistic posters
            </p>
          </div>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-5 w-5" />
              Add New Poster
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="h-[400px] flex items-center justify-center bg-card rounded-xl border border-border">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Fetching posters...
              </p>
            </div>
          </div>
        ) : (
          <DataTable
            data={posters}
            columns={columns}
            searchPlaceholder="Search posters..."
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
            ]}
          />
        )}
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => !isDeleting && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the poster. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
