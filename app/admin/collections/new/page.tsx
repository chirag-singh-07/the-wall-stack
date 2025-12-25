"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { ArrowLeft, Upload, X } from "lucide-react";
import { createCollection } from "@/actions/admin/poster-actions";
import { toast } from "sonner";

export default function NewCollectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isFeatured: false,
    status: "draft" as "active" | "draft",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await createCollection({
      ...formData,
      image: imagePreview || "/poster-art.jpg",
      coverImage: coverImagePreview || null,
    });

    if (res.success) {
      toast.success("Collection created");
      router.push("/admin/collections");
    } else {
      toast.error(res.error || "Failed to create collection");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Add Collection" />

      <div className="p-6">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/admin/collections">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Link>
        </Button>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
          {/* Cover Image Upload (New) */}
          <div className="space-y-2">
            <Label>Cover Image (For Collection Listing)</Label>
            <div className="flex items-start gap-4">
              <div className="relative h-40 w-64 overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
                {coverImagePreview ? (
                  <>
                    <Image
                      src={coverImagePreview || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => setCoverImagePreview(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                    <Upload className="mb-2 h-8 w-8" />
                    <span className="text-xs">Upload Cover</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="Paste cover image URL..."
                  onChange={(e) => setCoverImagePreview(e.target.value)}
                  className="w-64"
                />
                <p className="text-xs text-muted-foreground">
                  Landscape 4:3 Ratio Recommended
                </p>
              </div>
            </div>
          </div>

          {/* Banner Image Upload */}
          <div className="space-y-2">
            <Label>Banner Image (For Collection Detail)</Label>
            <div className="flex items-start gap-4">
              <div className="relative h-40 w-64 overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => setImagePreview(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                    <Upload className="mb-2 h-8 w-8" />
                    <span className="text-xs">Upload Banner</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="Or paste image URL..."
                  onChange={(e) => setImagePreview(e.target.value)}
                  className="w-64"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 1200x800px, JPG or PNG
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-2">
            <Label htmlFor="title">Collection Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Minimal Collection"
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
              placeholder="Describe this collection..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "draft") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, isFeatured: checked })
              }
            />
            <Label htmlFor="isFeatured">Featured Collection</Label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Collection"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/collections">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
