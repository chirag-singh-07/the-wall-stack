"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/image-uploader";

export default function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isFeatured: false,
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
          isFeatured: res?.data?.isFeatured || false,
          status: res?.data?.status as any,
        });
        if (res.data.image) {
          setImages([res.data.image]);
        }
      } else {
        toast.error(res.error || "Collection not found");
        router.push("/admin/collections");
      }
      setIsFetching(false);
    };
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload a collection image");
      return;
    }

    setIsLoading(true);

    const res = await updateCollection(id, {
      ...formData,
      image: images[0],
      coverImage: images[0], // Keep them synced
    });

    if (res.success) {
      toast.success("Collection updated successfully");
      router.push("/admin/collections");
    } else {
      toast.error(res.error || "Failed to update collection");
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
      <AdminHeader title="Edit Collection" />

      <div className="p-6 max-w-5xl mx-auto">
        <Button variant="ghost" className="mb-6 hover:bg-muted" asChild>
          <Link href="/admin/collections">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Link>
        </Button>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight">
                Collection Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Collection Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-muted/30 border-muted focus-visible:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={6}
                    className="bg-muted/30 border-muted resize-none focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight">Media</h3>
              <ImageUploader
                value={images}
                onChange={(urls) => setImages(urls)}
                maxImages={1}
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Update the collection image. This will be used as both the
                banner and the cover image.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border space-y-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight">Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="isFeatured"
                    className="flex flex-col gap-1 cursor-pointer"
                  >
                    <span className="text-sm font-medium">Featured</span>
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

                <div className="space-y-2 pt-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "draft") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger
                      id="status"
                      className="bg-muted/30 border-muted"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-3">
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={isLoading}
                >
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
                  className="w-full hover:bg-muted transition-colors"
                  asChild
                >
                  <Link href="/admin/collections">Cancel</Link>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
