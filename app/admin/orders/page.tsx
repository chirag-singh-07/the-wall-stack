"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Loader2, Eye, Phone, MapPin } from "lucide-react";
import { getOrders, updateOrderStatus } from "@/actions/user/checkout-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    const res = await getOrders();
    if (res.success && res.data) {
      setOrders(res.data);
    } else {
      toast.error("Failed to fetch orders");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    const res = await updateOrderStatus(id, status);
    if (res.success) {
      toast.success("Order status updated");
      fetchOrders();
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Order Management"
        description="View and manage customer COD orders"
      />

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {order.phone}
                          </div>
                          <div
                            className="flex items-center gap-1 text-xs text-muted-foreground truncate max-w-[150px]"
                            title={order.address}
                          >
                            <MapPin className="h-3 w-3" />
                            {order.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                            >
                              {order.items.length} items
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Order Items</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {order.items.map((item: any) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-center text-sm border-b pb-2"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {item.poster?.title ||
                                        (item.customPosterId
                                          ? "Custom Design"
                                          : item.size + " Poster")}
                                    </p>
                                    <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                                      {item.size} x {item.quantity}
                                    </p>
                                  </div>
                                  <p>
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                              <div className="flex justify-between font-bold pt-2">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
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
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order.id, "pending")
                              }
                            >
                              Mark Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order.id, "processing")
                              }
                            >
                              Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order.id, "completed")
                              }
                            >
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order.id, "cancelled")
                              }
                            >
                              Mark Cancelled
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
