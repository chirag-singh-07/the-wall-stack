"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { type AdminCollection } from "@/lib/admin-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Package, Loader2 } from "lucide-react";
import {
  getCollections,
  deleteCollection,
} from "@/actions/admin/poster-actions";
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

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchCollections = async () => {
    setIsFetching(true);
    const res = await getCollections();
    if (res.success) {
      setCollections(res.data || []);
    } else {
      toast.error(res.error || "Failed to fetch collections");
    }
    setIsFetching(false);
  };

  useState(() => {
    fetchCollections();
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    const res = await deleteCollection(deleteId);
    if (res.success) {
      toast.success("Collection deleted");
      setDeleteId(null);
      fetchCollections();
    } else {
      toast.error(res.error || "Failed to delete collection");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Collections" />

      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              Organize your posters into collections
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/collections/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Link>
          </Button>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Collections Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onEdit={() => {}}
                  onDelete={() => setDeleteId(collection.id)}
                />
              ))}
            </div>

            {collections.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No collections yet
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Create your first collection to organize your posters
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/admin/collections/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Collection
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection? Products in this
              collection will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CollectionCard({
  collection,
  onDelete,
}: {
  collection: AdminCollection;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={collection.image || "/placeholder.svg"}
          alt={collection.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={`absolute right-3 top-3 ${
            collection.status === "active"
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-yellow-100 text-yellow-800 border-yellow-200"
          }`}
        >
          {collection.status === "active" ? "Active" : "Draft"}
        </Badge>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{collection.title}</h3>
          <p className="text-sm text-white/80">
            {collection.productCount} products
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {collection.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Created {new Date(collection.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/collections/${collection.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
