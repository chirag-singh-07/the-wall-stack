"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import {
  getCustomPosterById,
  updateCustomPosterStatus,
} from "@/actions/user/custom-poster-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Printer,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function CustomOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    const res = await getCustomPosterById(id as string);
    if (res.success) {
      setOrder(res.data);
    } else {
      toast.error(res.error || "Order not found");
      router.push("/admin/custom-orders");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    // Cast strict status types if needed or update action to accept string
    const validStatus = status as "pending" | "in-progress" | "completed";
    setIsUpdating(true);
    const res = await updateCustomPosterStatus(id as string, validStatus);
    if (res.success) {
      setOrder({ ...order, status });
      toast.success(`Order marked as ${status}`);
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setIsUpdating(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Truck className="h-5 w-5 text-blue-500" />;
      default:
        return <Package className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            Pending
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) return null;

  // Use linked order if available, otherwise fallback to user info
  const customerName =
    order.linkedOrder?.name || order.user?.name || "Anonymous";
  const customerEmail =
    order.linkedOrder?.email || order.user?.email || "No Email";
  const customerPhone =
    order.linkedOrder?.phone || order.user?.phone || "No Phone";

  return (
    <div className="min-h-screen pb-20 ">
      <AdminHeader
        title={`Custom Order #${order.id.slice(-6).toUpperCase()}`}
      />

      <div className="container mx-auto px-4 md:px-6 mt-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/custom-orders/${id}/label`)}
              className="flex items-center gap-2 border-primary/20 hover:border-primary/50"
            >
              <Printer className="h-4 w-4" />
              Packing Label
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Package className="h-4 w-4" />
                  )}
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusUpdate("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("in-progress")}
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("completed")}
                >
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-none bg-card/60 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/30 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">Custom Design</CardTitle>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase tracking-tighter h-5"
                    >
                      1 Design Item
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Custom configuration details
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 pb-6 last:pb-0 last:border-0 border-b border-muted/20">
                    <div className="relative h-40 w-32 overflow-hidden rounded-md bg-muted border border-black/10">
                      {order.design.image ? (
                        <Image
                          src={order.design.image}
                          alt="Custom Design"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-center text-xs p-2">
                          Text Only: {order.design.text}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-lg leading-tight">
                        Custom Art Request
                      </h4>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground max-w-md">
                        <span className="flex items-center justify-between border-b pb-1">
                          <span className="font-medium text-foreground">
                            Size:
                          </span>
                          {order.design.size}
                        </span>
                        <span className="flex items-center justify-between border-b pb-1">
                          <span className="font-medium text-foreground">
                            Frame:
                          </span>
                          {order.design.frame}
                        </span>
                        <span className="flex items-center justify-between border-b pb-1">
                          <span className="font-medium text-foreground">
                            Ratio:
                          </span>
                          {order.design.ratio || "N/A"}
                        </span>
                        <span className="flex items-center justify-between border-b pb-1">
                          <span className="font-medium text-foreground">
                            Filter:
                          </span>
                          {order.design.filter || "None"}
                        </span>
                      </div>
                      {order.design.text && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono">
                          "{order.design.text}"
                        </div>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs h-7"
                          >
                            <Eye className="w-3 h-3 mr-1" /> Full Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl flex items-center justify-center bg-transparent border-none shadow-none">
                          {order.design.image && (
                            <img
                              src={order.design.image}
                              className="max-h-[80vh] rounded shadow-2xl"
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ₹{order.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3 rounded-2xl bg-muted/30 p-8 border border-muted/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Item Total
                    </span>
                    <span className="font-semibold">
                      ₹{order.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-muted/50 pt-5 text-lg font-black">
                    <span className="uppercase tracking-tighter">
                      Total Value
                    </span>
                    <span className="text-primary text-2xl font-black">
                      ₹{order.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-8 pl-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted">
                  <div className="relative">
                    <span className="absolute -left-[23px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                      <div className="h-2 w-2 rounded-full bg-background" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-medium">Request Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {order.status !== "pending" && (
                    <div className="relative">
                      <span className="absolute -left-[23px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 ring-4 ring-background">
                        <div className="h-2 w-2 rounded-full bg-background" />
                      </span>
                      <div className="space-y-1">
                        <p className="font-medium">
                          Status Updated to{" "}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.updatedAt).toLocaleDateString()} at{" "}
                          {new Date(order.updatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.linkedOrder && (
                    <div className="relative">
                      <span className="absolute -left-[23px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 ring-4 ring-background">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </span>
                      <div className="space-y-1">
                        <p className="font-medium">
                          Linked to Order #
                          {order.linkedOrder.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          This item was purchased in a verified order.
                        </p>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs"
                          onClick={() =>
                            router.push(`/admin/orders/${order.linkedOrder.id}`)
                          }
                        >
                          View Linked Order -&gt;
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer & Info Sidebar */}
          <div className="space-y-6">
            <Card className="border-none bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {order.userId || "Guest"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customerPhone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed">
                {order.linkedOrder ? (
                  <>
                    <p>{order.linkedOrder.address}</p>
                    <p>
                      {order.linkedOrder.city}, {order.linkedOrder.postalCode}
                    </p>
                    <p>{order.linkedOrder.country}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground italic">
                    No shipping address available yet. This custom poster has
                    not been linked to a confirmed order.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-none bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created On</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Poster ID</span>
                  <span className="font-mono text-xs">{order.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
