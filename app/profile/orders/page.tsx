"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileHeader } from "@/components/profile/profile-header";
import { OrderCard } from "@/components/profile/order-card";
import { useUserStore } from "@/lib/user-store";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

const filterOptions = [
  "All",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrdersPage() {
  const { orders } = useUserStore();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "All" || order.status === activeFilter.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />

          <div className="flex-1">
            <ProfileHeader
              title="My Orders"
              subtitle="Track and manage your orders"
              breadcrumbs={[{ label: "Orders" }]}
            />

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by ID or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {filterOptions.map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "whitespace-nowrap",
                      activeFilter === filter ? "" : "bg-transparent"
                    )}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || activeFilter !== "All"
                    ? "Try adjusting your filters or search query"
                    : "You haven't placed any orders yet"}
                </p>
                <Button asChild>
                  <a href="/shop">Start Shopping</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
