"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export function CollectionsSearch() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be handled by parent component
    const event = new CustomEvent("collectionsSearch", { detail: search });
    window.dispatchEvent(event);
  };

  const clearSearch = () => {
    setSearch("");
    const event = new CustomEvent("collectionsSearch", { detail: "" });
    window.dispatchEvent(event);
  };

  return (
    <div className="mb-12">
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-12 h-14 text-lg"
          />
          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
