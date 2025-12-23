"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  updatePoster,
  getPosterById,
  getCategories,
  getCollections,
} from "@/actions/admin/poster-actions";
import { toast } from "sonner";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    categoryId: "",
    collectionId: "",
    description: "",
    stock: "",
    status: "draft" as "active" | "draft" | "archived",
    images: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const [posterRes, catsRes, colsRes] = await Promise.all([
        getPosterById(id),
        getCategories(),
        getCollections(),
      ]);

      if (posterRes.success && posterRes.data) {
        const p = posterRes.data;
        setFormData({
          title: p.title,
          price: p.price.toString(),
          categoryId: p.categoryId || "",
          collectionId: p.collectionId || "none",
          description: p.description || "",
          stock: p.stock.toString(),
          status: p.status as any,
          images: p.images.length > 0 ? p.images : [p.image],
        });
      } else {
        toast.error("Failed to fetch poster details");
        router.push("/admin/products");
      }

      if (catsRes.success) {
        setCategories(catsRes.data || []);
      } else {
        toast.error("Failed to load categories");
      }

      if (colsRes.success) {
        setCollections(colsRes.data || []);
      } else {
        toast.error("Failed to load collections");
      }
      setIsFetching(false);
    };
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsLoading(true);
    const result = await updatePoster(id, {
      ...formData,
      image: formData.images[0],
      collectionId:
        formData.collectionId === "none" ? null : formData.collectionId,
    });

    if (result.success) {
      toast.success("Poster updated successfully");
      router.push("/admin/products");
    } else {
      toast.error(result.error || "Failed to update poster");
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader title="Edit Poster" />

      {/* Blocking Alert if no categories */}
      <AlertDialog open={categories.length === 0}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              No Categories Found
            </AlertDialogTitle>
            <AlertDialogDescription>
              You need at least one category to manage posters. Please create a
              category first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/categories">Create Category</Link>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="p-6 max-w-5xl mx-auto">
        <Button variant="ghost" className="mb-6 hover:bg-muted" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <h3 className="text-lg font-semibold">General Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Poster Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-muted/50 border-muted"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={6}
                    className="bg-muted/50 border-muted resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="bg-muted/50 border-muted"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Available Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="bg-muted/50 border-muted"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <h3 className="text-lg font-semibold">Categorization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger
                      id="category"
                      className="bg-muted/50 border-muted"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collection">Collection (Optional)</Label>
                  <Select
                    value={formData.collectionId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, collectionId: value })
                    }
                  >
                    <SelectTrigger
                      id="collection"
                      className="bg-muted/50 border-muted"
                    >
                      <SelectValue placeholder="Select collection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {collections.map((col) => (
                        <SelectItem key={col.id} value={col.id}>
                          {col.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <h3 className="text-lg font-semibold">Poster Media</h3>
              <ImageUploader
                value={formData.images}
                onChange={(urls) => setFormData({ ...formData, images: urls })}
                maxImages={4}
              />
            </div>

            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <h3 className="text-lg font-semibold">Status</h3>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-muted/50 border-muted w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <div className="pt-4 border-t border-border space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/admin/products">Cancel</Link>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
