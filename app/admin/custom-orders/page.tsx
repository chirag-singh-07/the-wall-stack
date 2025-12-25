"use client";

import { useState, useEffect } from "react";
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
                  <TableHead>Design</TableHead>
                  <TableHead>Text</TableHead>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Design Preview</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="flex justify-center p-4 bg-muted rounded">
                                <div
                                  className="relative shadow-xl"
                                  style={{
                                    width: "300px",
                                    aspectRatio: `${
                                      SIZES.find(
                                        (s) =>
                                          s.name === selectedOrder.design.size
                                      )?.width || 210
                                    } / ${
                                      SIZES.find(
                                        (s) =>
                                          s.name === selectedOrder.design.size
                                      )?.height || 297
                                    }`,
                                    backgroundColor:
                                      selectedOrder.design.backgroundColor,
                                  }}
                                >
                                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                    <div
                                      style={{
                                        fontFamily: selectedOrder.design.font,
                                        fontSize: `${
                                          selectedOrder.design.fontSize / 2
                                        }px`, // Scaled down for preview
                                        color: selectedOrder.design.textColor,
                                        lineHeight: 1.2,
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {selectedOrder.design.text}
                                    </div>
                                    {selectedOrder.design.subtext && (
                                      <div
                                        className="mt-2"
                                        style={{
                                          fontFamily: selectedOrder.design.font,
                                          fontSize: `${
                                            (selectedOrder.design.fontSize *
                                              0.4) /
                                            2
                                          }px`,
                                          color: selectedOrder.design.textColor,
                                          opacity: 0.7,
                                        }}
                                      >
                                        {selectedOrder.design.subtext}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate font-medium">
                          {order.design.text}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.design.font}
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
