"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import {
  getOrderById,
  updateOrderStatus,
  updateOrderPaymentInfo,
} from "@/actions/user/checkout-actions";
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
  CreditCard,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    const res = await getOrderById(id as string);
    if (res.success) {
      setOrder(res.data);
    } else {
      toast.error(res.error || "Order not found");
      router.push("/admin/orders");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    setIsUpdating(true);
    const res = await updateOrderStatus(id as string, status);
    if (res.success) {
      setOrder({ ...order, status });
      toast.success(`Order marked as ${status}`);
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setIsUpdating(false);
  };

  const handlePaymentUpdate = async (data: {
    paymentMethod?: string;
    paymentStatus?: string;
  }) => {
    setIsUpdating(true);
    const res = await updateOrderPaymentInfo(id as string, data);
    if (res.success) {
      setOrder({
        ...order,
        paymentMethod: data.paymentMethod ?? order.paymentMethod,
        paymentStatus: data.paymentStatus ?? order.paymentStatus,
      });
      toast.success("Payment information updated");
    } else {
      toast.error(res.error || "Failed to update payment info");
    }
    setIsUpdating(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
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
      case "processing":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            Processing
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            Cancelled
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

  return (
    <div className="min-h-screen pb-20 ">
      <AdminHeader
        title={`Order #${order.id.slice(-6).toUpperCase()}`}
        // description="View and manage order details"
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
              onClick={() => router.push(`/admin/orders/${id}/label`)}
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
                  onClick={() => handleStatusUpdate("processing")}
                >
                  Processing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("completed")}
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("cancelled")}
                >
                  Cancelled
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
                    <CardTitle className="text-xl">Order Items</CardTitle>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase tracking-tighter h-5"
                    >
                      {order.items.length} Product
                      {order.items.length > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Detailed breakdown of the customer's selection
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 pb-6 last:pb-0 last:border-0 border-b border-muted/20"
                    >
                      <div className="relative h-20 w-16 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={item.poster?.image || "/placeholder.svg"}
                          alt={item.poster?.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-lg leading-tight">
                          {item.poster?.title ||
                            (item.customPosterId
                              ? "Custom Design"
                              : "Unknown Item")}
                        </h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-foreground">
                              Size:
                            </span>{" "}
                            {item.size}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-foreground">
                              Qty:
                            </span>{" "}
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-3 rounded-2xl bg-muted/30 p-8 border border-muted/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Subtotal
                    </span>
                    <span className="font-semibold">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Shipping & Handling
                    </span>
                    <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest">
                      Calculated Free
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-muted/50 pt-5 text-lg font-black">
                    <span className="uppercase tracking-tighter">
                      Grand Total
                    </span>
                    <span className="text-primary text-2xl font-black">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-8 pl-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted">
                  <div className="relative">
                    <span className="absolute -left-[23px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                      <div className="h-2 w-2 rounded-full bg-background" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-medium">Order Placed</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {order.status !== "pending" && (
                    <div className="relative">
                      <span
                        className={`absolute -left-[23px] top-1 flex h-4 w-4 items-center justify-center rounded-full ${
                          order.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-primary"
                        } ring-4 ring-background`}
                      >
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

                  {order.status === "completed" && (
                    <div className="relative">
                      <span className="absolute -left-[23px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 ring-4 ring-background">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </span>
                      <div className="space-y-1">
                        <p className="font-medium">
                          Order Delivered Successfully
                        </p>
                        <p className="text-xs text-muted-foreground">
                          The customer has received the package.
                        </p>
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
                    {order.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{order.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {order.userId || "Guest"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{order.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.phone}</span>
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
                <p>{order.address}</p>
                <p>
                  {order.city}, {order.postalCode}
                </p>
                <p>{order.country}</p>
              </CardContent>
            </Card>

            <Card className="border-none bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 font-mono text-[10px] border border-muted/50"
                      >
                        {order.paymentMethod}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handlePaymentUpdate({ paymentMethod: "COD" })
                        }
                      >
                        COD
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handlePaymentUpdate({ paymentMethod: "PREPAID" })
                        }
                      >
                        PREPAID
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handlePaymentUpdate({ paymentMethod: "UPI" })
                        }
                      >
                        UPI
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handlePaymentUpdate({ paymentMethod: "CARD" })
                        }
                      >
                        CARD
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-2 font-bold text-[10px] uppercase border ${
                          order.paymentStatus === "paid"
                            ? "border-green-500/50 text-green-500 hover:bg-green-500/10"
                            : "border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                        }`}
                      >
                        {order.paymentStatus}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handlePaymentUpdate({ paymentStatus: "unpaid" })
                        }
                      >
                        Mark Unpaid
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handlePaymentUpdate({ paymentStatus: "paid" })
                        }
                      >
                        Mark Paid
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placed On</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
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
