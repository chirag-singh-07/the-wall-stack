"use client";

import { useState } from "react";
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
import { saveCustomPoster } from "@/actions/user/custom-poster-actions";
import { toast } from "sonner";
import { Loader2, Download, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const SIZES = [
  { name: "A4", width: 210, height: 297, price: 499 },
  { name: "A3", width: 297, height: 420, price: 799 },
  { name: "A2", width: 420, height: 594, price: 1299 },
  { name: "A1", width: 594, height: 841, price: 1999 },
];

const FONTS = [
  "Inter",
  "Playfair Display",
  "Montserrat",
  "Roboto",
  "Bebas Neue",
  "Oswald",
];

export function CustomPosterMaker() {
  const { data: session } = authClient.useSession();

  const [design, setDesign] = useState({
    text: "YOUR TEXT HERE",
    subtext: "",
    font: "Inter",
    fontSize: 48,
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
    size: "A4",
  });

  const [isSaving, setIsSaving] = useState(false);

  const selectedSize = SIZES.find((s) => s.name === design.size) || SIZES[0];

  const handleSave = async () => {
    if (!design.text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveCustomPoster({
        userId: session?.user?.id,
        design: design,
        price: selectedSize.price,
      });

      if (result.success) {
        toast.success("Custom poster saved! You can now add it to your cart.");
      } else {
        toast.error(result.error || "Failed to save custom poster");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Controls */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold">Customize Your Poster</h2>

          {/* Main Text */}
          <div className="space-y-2">
            <Label htmlFor="text">Main Text</Label>
            <Textarea
              id="text"
              value={design.text}
              onChange={(e) => setDesign({ ...design, text: e.target.value })}
              placeholder="Enter your main text"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Subtext */}
          <div className="space-y-2">
            <Label htmlFor="subtext">Subtext (Optional)</Label>
            <Input
              id="subtext"
              value={design.subtext}
              onChange={(e) =>
                setDesign({ ...design, subtext: e.target.value })
              }
              placeholder="Enter subtext"
            />
          </div>

          {/* Font Selection */}
          <div className="space-y-2">
            <Label htmlFor="font">Font</Label>
            <Select
              value={design.font}
              onValueChange={(value) => setDesign({ ...design, font: value })}
            >
              <SelectTrigger id="font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((font) => (
                  <SelectItem
                    key={font}
                    value={font}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size: {design.fontSize}px</Label>
            <input
              id="fontSize"
              type="range"
              min="24"
              max="120"
              value={design.fontSize}
              onChange={(e) =>
                setDesign({ ...design, fontSize: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <input
                  id="textColor"
                  type="color"
                  value={design.textColor}
                  onChange={(e) =>
                    setDesign({ ...design, textColor: e.target.value })
                  }
                  className="h-10 w-20 rounded border border-border cursor-pointer"
                />
                <Input
                  value={design.textColor}
                  onChange={(e) =>
                    setDesign({ ...design, textColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <input
                  id="bgColor"
                  type="color"
                  value={design.backgroundColor}
                  onChange={(e) =>
                    setDesign({ ...design, backgroundColor: e.target.value })
                  }
                  className="h-10 w-20 rounded border border-border cursor-pointer"
                />
                <Input
                  value={design.backgroundColor}
                  onChange={(e) =>
                    setDesign({ ...design, backgroundColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <Label>Poster Size</Label>
            <div className="grid grid-cols-2 gap-3">
              {SIZES.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setDesign({ ...design, size: size.name })}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all text-left",
                    design.size === size.name
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground/50"
                  )}
                >
                  <div className="font-bold">{size.name}</div>
                  <div className="text-sm opacity-80">
                    {size.width} × {size.height}mm
                  </div>
                  <div className="text-sm font-semibold mt-1">
                    ₹{size.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Save & Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="bg-muted rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div
            className="relative mx-auto shadow-2xl"
            style={{
              aspectRatio: `${selectedSize.width} / ${selectedSize.height}`,
              maxHeight: "70vh",
              backgroundColor: design.backgroundColor,
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div
                style={{
                  fontFamily: design.font,
                  fontSize: `${design.fontSize}px`,
                  color: design.textColor,
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {design.text}
              </div>
              {design.subtext && (
                <div
                  className="mt-4"
                  style={{
                    fontFamily: design.font,
                    fontSize: `${design.fontSize * 0.4}px`,
                    color: design.textColor,
                    opacity: 0.7,
                  }}
                >
                  {design.subtext}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Size: {selectedSize.name} ({selectedSize.width} ×{" "}
            {selectedSize.height}mm)
          </div>
        </div>
      </div>
    </div>
  );
}
