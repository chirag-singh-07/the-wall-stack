"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""; // User should change this
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""; // User should change this

export function ImageUploader({
  value,
  onChange,
  disabled,
  maxImages = 5,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);

  const onUpload = useCallback(
    async (files: File[]) => {
      try {
        setLoading(true);
        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
          );
          return response.data.secure_url;
        });

        const urls = await Promise.all(uploadPromises);
        onChange([...value, ...urls].slice(0, maxImages));
        toast.success("Images uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload images. Check Cloudinary settings.");
      } finally {
        setLoading(false);
      }
    },
    [value, onChange, maxImages]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxImages) {
        toast.error(`You can only upload up to ${maxImages} images`);
        return;
      }
      onUpload(acceptedFiles);
    },
    [onUpload, value.length, maxImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: disabled || loading || value.length >= maxImages,
    multiple: true,
  });

  const removeImage = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-4 min-h-[200px]",
          isDragActive
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          (disabled || loading) && "opacity-50 cursor-not-allowed",
          value.length >= maxImages && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Upload className="h-8 w-8" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">
            {isDragActive ? "Drop the images here" : "Drag & drop images here"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or click to browse ({value.length}/{maxImages} images)
          </p>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          JPG, PNG, WebP up to 10MB
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {value.map((url) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            >
              <Image
                fill
                src={url}
                alt="Product image"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(url);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
