"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { getSectionContent, updateSectionContent } from "@/actions/user/cms-actions";

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen">
      <AdminHeader title="Content Management" />

      <div className="p-6">
        <Tabs
          defaultValue="hero"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted p-1 rounded-xl h-auto">
            <TabsTrigger value="hero" className="py-2.5">
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="marquee" className="py-2.5">
              Marquee Banner
            </TabsTrigger>
            <TabsTrigger value="featured" className="py-2.5">
              Featured
            </TabsTrigger>
            <TabsTrigger value="process" className="py-2.5">
              Process
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <SectionEditor
              sectionKey="hero"
              defaultContent={{
                title: "THE FUTURE OF WALL ART",
                subtitle:
                  "Elevate your space with our premium collection of curated digital art and physical posters.",
                ctaText: "Shop Collection",
                ctaLink: "/shop",
                image: "/hero-bg.jpg",
              }}
              label="Hero Section"
            />
          </TabsContent>

          <TabsContent value="marquee">
            <SectionEditor
              sectionKey="marquee"
              defaultContent={{
                text: "FREE SHIPPING ON ALL ORDERS OVER $50 • NEW COLLECTION DROPPING SOON • JOIN THE WALL STACK COMMUNITY",
                speed: 20,
              }}
              label="Marquee Banner"
            />
          </TabsContent>

          <TabsContent value="featured">
            <SectionEditor
              sectionKey="featured"
              defaultContent={{
                title: "Featured Drops",
                subtitle: "Hand-picked for your space",
                showLimit: 4,
              }}
              label="Featured Section"
            />
          </TabsContent>

          <TabsContent value="process">
            <SectionEditor
              sectionKey="process"
              defaultContent={{
                title: "How It Works",
                steps: [
                  {
                    title: "Choose Your Art",
                    description: "Browse thousands of designs",
                  },
                  { title: "Customize", description: "Select size and frame" },
                  {
                    title: "Fast Delivery",
                    description: "Ready to hang in days",
                  },
                ],
              }}
              label="Process Section"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SectionEditor({
  sectionKey,
  defaultContent,
  label,
}: {
  sectionKey: string;
  defaultContent: any;
  label: string;
}) {
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      const res = await getSectionContent(sectionKey);
      if (res.success && res.data) {
        setContent({ ...defaultContent, ...res.data.content });
      }
      setIsLoading(false);
    };
    loadContent();
  }, [sectionKey]);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateSectionContent(sectionKey, content);
    if (res.success) {
      toast.success(`${label} updated successfully`);
    } else {
      toast.error("Failed to update section");
    }
    setIsSaving(false);
  };

  const handleChange = (key: string, value: any) => {
    setContent((prev: any) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-card border rounded-xl p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold">{label}</h2>
          <p className="text-sm text-muted-foreground">
            Manage content for {label}
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {Object.keys(defaultContent).map((key) => {
          const value = content[key];

          // Simple handling for array of objects (like process steps)
          if (Array.isArray(value) && typeof value[0] === "object") {
            return (
              <div key={key} className="space-y-4">
                <Label className="uppercase text-xs font-bold text-muted-foreground">
                  {key}
                </Label>
                {value.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-3">
                    {Object.keys(item).map((subKey) => (
                      <div key={subKey} className="space-y-1">
                        <Label className="text-xs">{subKey}</Label>
                        <Input
                          value={item[subKey]}
                          onChange={(e) => {
                            const newArray = [...value];
                            newArray[idx] = {
                              ...newArray[idx],
                              [subKey]: e.target.value,
                            };
                            handleChange(key, newArray);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize split-words">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </Label>
              {key === "image" ? (
                <div className="flex gap-2">
                  <Input
                    id={key}
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                  {/* Placeholder for upload trigger */}
                </div>
              ) : String(value).length > 50 ||
                key.includes("description") ||
                key.includes("subtitle") ? (
                <Textarea
                  id={key}
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
                />
              ) : (
                <Input
                  id={key}
                  type={typeof value === "number" ? "number" : "text"}
                  value={value}
                  onChange={(e) =>
                    handleChange(
                      key,
                      typeof value === "number"
                        ? Number(e.target.value)
                        : e.target.value
                    )
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
