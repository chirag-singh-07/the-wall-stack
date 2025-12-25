"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
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
  createPoster,
  getCategories,
  getCollections,
} from "@/actions/admin/poster-actions";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    categoryId: "",
    collectionId: "",
    description: "",
    stock: "50",
    status: "draft" as "active" | "draft" | "archived",
    images: [] as string[],
    isBestseller: false,
    isLimitedEdition: false,
    isFeatured: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const [cats, cols] = await Promise.all([
        getCategories(),
        getCollections(),
      ]);

      if (cats.success) {
        setCategories(cats.data || []);
      } else {
        toast.error("Failed to load categories. Please refresh.");
      }

      if (cols.success) {
        setCollections(cols.data || []);
      } else {
        toast.error("Failed to load collections. Please refresh.");
      }
      setIsFetching(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsLoading(true);
    const result = await createPoster({
      ...formData,
      image: formData.images[0], // Main image
    });

    if (result.success) {
      toast.success("Poster created successfully");
      router.push("/admin/products");
    } else {
      toast.error(result.error || "Failed to create poster");
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
      <AdminHeader title="Add New Poster" />

      {/* Blocking Alert if no categories */}
      <AlertDialog open={categories.length === 0}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              No Categories Found
            </AlertDialogTitle>
            <AlertDialogDescription>
              You need at least one category to add a poster. Please create a
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
          {/* Left Column: Form Fields */}
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
                    placeholder="e.g. Minimalist Geometric Flow"
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
                    placeholder="Tell the story behind this artwork..."
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
                    placeholder="49.99"
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
                    placeholder="100"
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
                      {categories.length === 0 && (
                        <SelectItem disabled value="none">
                          No categories found
                        </SelectItem>
                      )}
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

          {/* Right Column: Media & Publish */}
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <h3 className="text-lg font-semibold">Poster Media</h3>
              <ImageUploader
                value={formData.images}
                onChange={(urls) => setFormData({ ...formData, images: urls })}
                maxImages={4}
              />
              <p className="text-xs text-muted-foreground">
                The first image will be used as the main thumbnail. High
                resolution (2:3 or 3:4 ratio) recommended.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <h3 className="text-lg font-semibold">Attributes</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="isFeatured"
                    className="flex flex-col gap-1 cursor-pointer"
                  >
                    <span>Featured Product</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Show on homepage
                    </span>
                  </Label>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFeatured: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="isBestseller"
                    className="flex flex-col gap-1 cursor-pointer"
                  >
                    <span>Bestseller</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Mark as bestseller
                    </span>
                  </Label>
                  <Switch
                    id="isBestseller"
                    checked={formData.isBestseller}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isBestseller: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="isLimitedEdition"
                    className="flex flex-col gap-1 cursor-pointer"
                  >
                    <span>Limited Edition</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Mark as limited run
                    </span>
                  </Label>
                  <Switch
                    id="isLimitedEdition"
                    checked={formData.isLimitedEdition}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isLimitedEdition: checked })
                    }
                  />
                </div>
              </div>
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
                      Creating...
                    </>
                  ) : (
                    "Create Poster"
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
