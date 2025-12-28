"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAllCustomPosters,
  updateCustomPosterStatus,
  deleteCustomPoster,
} from "@/actions/user/custom-poster-actions";
import { toast } from "sonner";
import { Loader2, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    const result = await getAllCustomPosters();
    if (result.success && result.data) {
      setOrders(result.data);
    } else {
      toast.error("Failed to fetch custom orders");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (
    id: string,
    status: "pending" | "in-progress" | "completed"
  ) => {
    const result = await updateCustomPosterStatus(id, status);
    if (result.success) {
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this custom order?")) return;

    const result = await deleteCustomPoster(id);
    if (result.success) {
      toast.success("Order deleted");
      fetchOrders();
    } else {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Custom Poster Orders" />

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Custom Design Requests</h2>
          <p className="text-sm text-muted-foreground">
            Manage user-created custom poster orders
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Design</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Size & Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No custom orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold uppercase tracking-tighter text-sm">
                            {order.user?.name || "Anonymous"}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black">
                            {order.user?.email || "No Email"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-black uppercase text-[10px] tracking-widest h-9"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="mr-2 h-3.5 w-3.5" />
                              Inspect
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl bg-white border-black/10">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                                Artifact Analysis
                              </DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                <div className="flex justify-center p-8 bg-zinc-50 rounded-3xl border border-black/5">
                                  <div
                                    className="relative shadow-2xl transition-all duration-500 overflow-hidden"
                                    style={{
                                      width: "280px",
                                      aspectRatio:
                                        selectedOrder.design.ratio || "2/3",
                                      border:
                                        selectedOrder.design.frame ===
                                        "thin-black"
                                          ? "2px solid #000"
                                          : selectedOrder.design.frame ===
                                            "thick-black"
                                          ? "8px solid #000"
                                          : selectedOrder.design.frame ===
                                            "double"
                                          ? "4px double #000"
                                          : "none",
                                      padding:
                                        selectedOrder.design.frame !== "none"
                                          ? "10px"
                                          : "0",
                                    }}
                                  >
                                    {selectedOrder.design.image ? (
                                      <div className="w-full h-full relative overflow-hidden">
                                        <img
                                          src={selectedOrder.design.image}
                                          alt="Custom Preview"
                                          className="w-full h-full object-cover"
                                          style={{
                                            filter:
                                              selectedOrder.design.filter ===
                                              "grayscale"
                                                ? "grayscale(100%)"
                                                : selectedOrder.design
                                                    .filter === "sepia"
                                                ? "sepia(100%)"
                                                : selectedOrder.design
                                                    .filter === "noir"
                                                ? "grayscale(100%) contrast(200%)"
                                                : "none",
                                          }}
                                        />
                                        {selectedOrder.design.text && (
                                          <div
                                            className={cn(
                                              "absolute left-0 right-0 p-2 bg-black/80 text-white text-[8px] font-black uppercase tracking-widest text-center",
                                              selectedOrder.design
                                                .textPosition === "top"
                                                ? "top-0"
                                                : "bottom-0"
                                            )}
                                          >
                                            {selectedOrder.design.text}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                        <div
                                          style={{
                                            fontFamily:
                                              selectedOrder.design.font,
                                            fontSize: `${
                                              selectedOrder.design.fontSize / 2
                                            }px`,
                                            color:
                                              selectedOrder.design.textColor,
                                          }}
                                        >
                                          {selectedOrder.design.text}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 bg-zinc-50 rounded-2xl border border-black/5">
                                    <span className="text-[8px] font-black uppercase text-black/40 block mb-1">
                                      Dimensions
                                    </span>
                                    <span className="text-xs font-black uppercase tracking-widest">
                                      {selectedOrder.design.size}
                                    </span>
                                  </div>
                                  <div className="p-4 bg-zinc-50 rounded-2xl border border-black/5">
                                    <span className="text-[8px] font-black uppercase text-black/40 block mb-1">
                                      Frame Style
                                    </span>
                                    <span className="text-xs font-black uppercase tracking-widest">
                                      {selectedOrder.design.frame}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate font-black uppercase text-[10px] tracking-widest text-black/60">
                          {order.design.text || "None"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.design.size}</div>
                        <div className="text-sm">₹{order.price}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order.id, "pending")
                              }
                            >
                              Mark Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order.id, "in-progress")
                              }
                            >
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order.id, "completed")
                              }
                            >
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(order.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

const SIZES = [
  { name: "A4", width: 210, height: 297 },
  { name: "A3", width: 297, height: 420 },
  { name: "A2", width: 420, height: 594 },
  { name: "A1", width: 594, height: 841 },
];
