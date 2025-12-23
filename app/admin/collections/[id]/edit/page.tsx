"use client";

import type React from "react";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import {
  getCollectionById,
  updateCollection,
} from "@/actions/admin/poster-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    status: "draft" as "active" | "draft",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const res = await getCollectionById(id);
      if (res.success && res.data) {
        setFormData({
          title: res?.data?.title || "",
          description: res?.data?.description || "",
          image: res?.data?.image || "",
          status: res?.data?.status as any,
        });
      } else {
        toast.error(res.error || "Collection not found");
        router.push("/admin/collections");
      }
      setIsFetching(false);
    };
    fetchData();
  }, [id, router]);

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await updateCollection(id, formData);

    if (res.success) {
      toast.success("Collection updated");
      router.push("/admin/collections");
    } else {
      toast.error(res.error || "Failed to update collection");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Edit Collection" />

      <div className="p-6">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/admin/collections">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Link>
        </Button>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Collection Cover Image</Label>
            <div className="flex items-start gap-4">
              <div className="relative h-40 w-64 overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
                {formData.image ? (
                  <>
                    <Image
                      src={formData.image || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => setFormData({ ...formData, image: "" })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                    <Upload className="mb-2 h-8 w-8" />
                    <span className="text-xs">Upload Image</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="Or paste image URL..."
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
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

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
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
